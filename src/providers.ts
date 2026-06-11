import { ApiError } from './http';
import { hmacSha256Hex, openJson } from './crypto';
import type { CaptchaClientConfig, CaptchaProvider, CaptchaVerifyResult, Env, ProviderChannelRow } from './types';

interface VerifyInput {
  challengeId: string;
  providerToken: unknown;
  remoteIp: string | null;
  action: string | null;
  channel: ProviderChannelRow;
  env: Env;
}

interface TurnstileSecretConfig {
  secret_key?: string;
}

interface GeetestSecretConfig {
  captcha_key?: string;
}

export function getClientConfig(channel: ProviderChannelRow, challengeId: string): CaptchaClientConfig {
  if (channel.provider === 'turnstile') {
    return {
      challenge_id: challengeId,
      provider: 'turnstile',
      public_key: channel.public_key,
      script_url: 'https://challenges.cloudflare.com/turnstile/v0/api.js',
      options: {
        theme: 'auto',
        size: 'normal',
      },
      expires_in: 300,
    };
  }

  if (channel.provider === 'geetest') {
    return {
      challenge_id: challengeId,
      provider: 'geetest',
      public_key: channel.public_key,
      script_url: 'https://static.geetest.com/v4/gt4.js',
      options: {
        product: 'float',
      },
      expires_in: 300,
    };
  }

  throw new ApiError(400, 'provider_unsupported', `Provider ${channel.provider} is not supported yet.`);
}

export async function verifyProvider(input: VerifyInput): Promise<CaptchaVerifyResult> {
  if (input.channel.provider === 'turnstile') {
    return verifyTurnstile(input);
  }

  if (input.channel.provider === 'geetest') {
    return verifyGeetest(input);
  }

  throw new ApiError(400, 'provider_unsupported', `Provider ${input.channel.provider} is not supported yet.`);
}

export function isSupportedPublicProvider(provider: string): provider is CaptchaProvider {
  return provider === 'turnstile' || provider === 'geetest' || provider === 'recaptcha' || provider === 'hcaptcha';
}

async function verifyTurnstile(input: VerifyInput): Promise<CaptchaVerifyResult> {
  const secretConfig = await openJson<TurnstileSecretConfig>(input.channel.secret_config, input.env);
  if (!secretConfig.secret_key) {
    throw new ApiError(400, 'provider_misconfigured', 'Turnstile secret_key is missing.');
  }

  if (typeof input.providerToken !== 'string' || !input.providerToken) {
    return {
      success: false,
      provider: 'turnstile',
      error_codes: ['invalid-input-response'],
    };
  }

  const form = new FormData();
  form.set('secret', secretConfig.secret_key);
  form.set('response', input.providerToken);
  form.set('idempotency_key', input.challengeId);
  if (input.remoteIp) {
    form.set('remoteip', input.remoteIp);
  }

  const response = await fetchWithTimeout(
    'https://challenges.cloudflare.com/turnstile/v0/siteverify',
    {
      method: 'POST',
      body: form,
    },
    input.channel.timeout_ms,
  );
  const data = (await response.json()) as {
    success?: boolean;
    hostname?: string;
    action?: string;
    'error-codes'?: string[];
  };

  return {
    success: data.success === true,
    provider: 'turnstile',
    action: data.action || null,
    hostname: data.hostname || null,
    score: null,
    error_codes: data['error-codes'] || [],
    raw: data,
  };
}

async function verifyGeetest(input: VerifyInput): Promise<CaptchaVerifyResult> {
  const secretConfig = await openJson<GeetestSecretConfig>(input.channel.secret_config, input.env);
  if (!secretConfig.captcha_key) {
    throw new ApiError(400, 'provider_misconfigured', 'Geetest captcha_key is missing.');
  }

  const token = input.providerToken;
  if (!isGeetestToken(token)) {
    return {
      success: false,
      provider: 'geetest',
      error_codes: ['invalid-input-response'],
    };
  }

  const signToken = await hmacSha256Hex(secretConfig.captcha_key, token.lot_number);
  const form = new URLSearchParams();
  form.set('captcha_id', input.channel.public_key);
  form.set('lot_number', token.lot_number);
  form.set('captcha_output', token.captcha_output);
  form.set('pass_token', token.pass_token);
  form.set('gen_time', token.gen_time);
  form.set('sign_token', signToken);

  const response = await fetchWithTimeout(
    'https://gcaptcha4.geetest.com/validate',
    {
      method: 'POST',
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      body: form.toString(),
    },
    input.channel.timeout_ms,
  );
  const data = (await response.json()) as {
    result?: string;
    reason?: string;
    captcha_args?: Record<string, unknown>;
  };

  return {
    success: data.result === 'success',
    provider: 'geetest',
    action: input.action,
    hostname: null,
    score: null,
    error_codes: data.result === 'success' ? [] : [data.reason || 'geetest_verify_failed'],
    raw: data,
  };
}

function isGeetestToken(value: unknown): value is {
  lot_number: string;
  captcha_output: string;
  pass_token: string;
  gen_time: string;
} {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }
  const token = value as Record<string, unknown>;
  return (
    typeof token.lot_number === 'string' &&
    typeof token.captcha_output === 'string' &&
    typeof token.pass_token === 'string' &&
    typeof token.gen_time === 'string'
  );
}

async function fetchWithTimeout(url: string, init: RequestInit, timeoutMs: number): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...init,
      signal: controller.signal,
    });
    if (!response.ok) {
      throw new ApiError(502, 'provider_unavailable', 'Captcha provider returned an error.');
    }
    return response;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(504, 'verify_timeout', 'Captcha provider request timed out.');
  } finally {
    clearTimeout(timeout);
  }
}
