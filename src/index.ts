import { CLIENT_SCRIPT } from './client-script';
import {
  ApiError,
  assertString,
  assertStringArray,
  errorResponse,
  jsonResponse,
  noContentResponse,
  notFound,
  okResponse,
  optionalString,
  readJsonBody,
} from './http';
import {
  addSecondsIso,
  base64UrlDecodeString,
  createId,
  createSecret,
  hashIp,
  hashPassword,
  hashSecret,
  nowIso,
  sealJson,
  verifyPassword,
} from './crypto';
import { getClientConfig, isSupportedPublicProvider, verifyProvider } from './providers';
import type { AppRow, AuthContext, CaptchaProvider, ChallengeRow, Env, ProviderChannelRow, PublicUser, UserRow } from './types';

const SESSION_TTL_SECONDS = 60 * 60 * 24 * 14;
const CHALLENGE_TTL_SECONDS = 300;

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method === 'OPTIONS') {
      return noContentResponse(env, request);
    }

    try {
      return await routeRequest(request, env);
    } catch (error) {
      if (error instanceof ApiError) {
        return errorResponse(env, request, error);
      }
      console.error(error);
      return errorResponse(env, request, new ApiError(500, 'internal_error', 'Internal server error.'));
    }
  },
};

async function routeRequest(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  const pathname = normalizePath(url.pathname);

  if (request.method === 'GET' && pathname === '/health') {
    return okResponse(env, request, { service: 'teaven-captcha' });
  }

  if (request.method === 'GET' && pathname === '/client.js') {
    return new Response(CLIENT_SCRIPT, {
      headers: {
        'content-type': 'application/javascript; charset=utf-8',
        'cache-control': 'public, max-age=300',
      },
    });
  }

  if (request.method === 'POST' && pathname === '/auth/register') {
    return handleRegister(request, env);
  }
  if (request.method === 'POST' && pathname === '/auth/login') {
    return handleLogin(request, env);
  }
  if (request.method === 'POST' && pathname === '/auth/logout') {
    return handleLogout(request, env);
  }
  if (request.method === 'GET' && pathname === '/me') {
    return handleMe(request, env);
  }

  if (request.method === 'GET' && pathname === '/apps') {
    return handleListApps(request, env);
  }
  if (request.method === 'POST' && pathname === '/apps') {
    return handleCreateApp(request, env);
  }

  const appResetMatch = pathname.match(/^\/apps\/([^/]+)\/reset-secret$/);
  if (request.method === 'POST' && appResetMatch) {
    return handleResetAppSecret(request, env, appResetMatch[1]);
  }

  const appLogsMatch = pathname.match(/^\/apps\/([^/]+)\/logs$/);
  if (request.method === 'GET' && appLogsMatch) {
    return handleAppLogs(request, env, appLogsMatch[1]);
  }

  const appStatsMatch = pathname.match(/^\/apps\/([^/]+)\/stats$/);
  if (request.method === 'GET' && appStatsMatch) {
    return handleAppStats(request, env, appStatsMatch[1]);
  }

  const appMatch = pathname.match(/^\/apps\/([^/]+)$/);
  if (request.method === 'PATCH' && appMatch) {
    return handleUpdateApp(request, env, appMatch[1]);
  }

  if (request.method === 'GET' && pathname === '/admin/provider-channels') {
    return handleListProviderChannels(request, env);
  }
  if (request.method === 'POST' && pathname === '/admin/provider-channels') {
    return handleCreateProviderChannel(request, env);
  }

  const adminChannelTestMatch = pathname.match(/^\/admin\/provider-channels\/([^/]+)\/test$/);
  if (request.method === 'POST' && adminChannelTestMatch) {
    return handleTestProviderChannel(request, env, adminChannelTestMatch[1]);
  }

  const adminChannelMatch = pathname.match(/^\/admin\/provider-channels\/([^/]+)$/);
  if (request.method === 'PATCH' && adminChannelMatch) {
    return handleUpdateProviderChannel(request, env, adminChannelMatch[1]);
  }

  if (request.method === 'GET' && pathname === '/admin/users') {
    return handleAdminUsers(request, env);
  }
  if (request.method === 'GET' && pathname === '/admin/apps') {
    return handleAdminApps(request, env);
  }
  if (request.method === 'GET' && pathname === '/admin/stats') {
    return handleAdminStats(request, env);
  }

  if (request.method === 'POST' && pathname === '/v1/challenges') {
    return handleCreateChallenge(request, env);
  }
  if (request.method === 'POST' && pathname === '/v1/verify') {
    return handleVerify(request, env);
  }

  return notFound();
}

async function handleRegister(request: Request, env: Env): Promise<Response> {
  const body = await readJsonBody(request);
  const email = normalizeEmail(assertString(body.email, 'email', { min: 5, max: 255 }));
  const password = assertString(body.password, 'password', { min: 8, max: 200 });
  const name = optionalString(body.name, 'name', 100);

  if (!isEmail(email)) {
    throw new ApiError(400, 'invalid_request', 'Invalid email address.');
  }

  const existing = await env.DB.prepare('SELECT id FROM users WHERE email = ?').bind(email).first<{ id: string }>();
  if (existing) {
    throw new ApiError(409, 'email_exists', 'Email already exists.');
  }

  const countRow = await env.DB.prepare('SELECT COUNT(*) AS total FROM users').first<{ total: number }>();
  const role = countRow && countRow.total > 0 ? 'user' : 'admin';
  const user: UserRow = {
    id: createId('usr'),
    email,
    password_hash: await hashPassword(password),
    name,
    role,
    status: 'active',
    created_at: nowIso(),
    updated_at: nowIso(),
  };

  await env.DB.prepare(
    `INSERT INTO users (id, email, password_hash, name, role, status, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
  )
    .bind(user.id, user.email, user.password_hash, user.name, user.role, user.status, user.created_at, user.updated_at)
    .run();

  const session = await createSession(env, request, user.id);
  return jsonResponse(env, request, { success: true, user: toPublicUser(user), token: session.token }, 201);
}

async function handleLogin(request: Request, env: Env): Promise<Response> {
  const body = await readJsonBody(request);
  const email = normalizeEmail(assertString(body.email, 'email', { min: 5, max: 255 }));
  const password = assertString(body.password, 'password', { min: 1, max: 200 });

  const user = await env.DB.prepare('SELECT * FROM users WHERE email = ?').bind(email).first<UserRow>();
  if (!user || !(await verifyPassword(password, user.password_hash))) {
    throw new ApiError(401, 'invalid_credentials', 'Invalid email or password.');
  }
  if (user.status !== 'active') {
    throw new ApiError(403, 'user_disabled', 'User is disabled.');
  }

  const session = await createSession(env, request, user.id);
  return jsonResponse(env, request, { success: true, user: toPublicUser(user), token: session.token });
}

async function handleLogout(request: Request, env: Env): Promise<Response> {
  const token = getSessionToken(request);
  if (token) {
    const tokenHash = await hashSecret(token, env);
    await env.DB.prepare('DELETE FROM sessions WHERE token_hash = ?').bind(tokenHash).run();
  }
  return okResponse(env, request);
}

async function handleMe(request: Request, env: Env): Promise<Response> {
  const auth = await requireUser(request, env);
  return okResponse(env, request, { user: toPublicUser(auth.user) });
}

async function handleListApps(request: Request, env: Env): Promise<Response> {
  const auth = await requireUser(request, env);
  const rows = await env.DB.prepare('SELECT * FROM apps WHERE user_id = ? ORDER BY created_at DESC').bind(auth.user.id).all<AppRow>();
  return okResponse(env, request, { apps: rows.results.map(toPublicApp) });
}

async function handleCreateApp(request: Request, env: Env): Promise<Response> {
  const auth = await requireUser(request, env);
  const body = await readJsonBody(request);
  const name = assertString(body.name, 'name', { min: 1, max: 100 });
  const allowedDomains = normalizeDomains(assertStringArray(body.allowed_domains ?? [], 'allowed_domains'));
  const routeStrategy = parseRouteStrategy(body.route_strategy, 'geo_country');

  const secretKey = createSecret('tc_secret');
  const app: AppRow = {
    id: createId('app'),
    user_id: auth.user.id,
    name,
    site_key: createSecret('tc_site'),
    secret_key_hash: await hashSecret(secretKey, env),
    secret_key_hint: secretKey.slice(-8),
    allowed_domains: JSON.stringify(allowedDomains),
    status: 'active',
    route_strategy: routeStrategy,
    provider_channel_id: null,
    daily_quota: null,
    created_at: nowIso(),
    updated_at: nowIso(),
  };

  await env.DB.prepare(
    `INSERT INTO apps (id, user_id, name, site_key, secret_key_hash, secret_key_hint, allowed_domains, status, route_strategy, provider_channel_id, daily_quota, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  )
    .bind(
      app.id,
      app.user_id,
      app.name,
      app.site_key,
      app.secret_key_hash,
      app.secret_key_hint,
      app.allowed_domains,
      app.status,
      app.route_strategy,
      app.provider_channel_id,
      app.daily_quota,
      app.created_at,
      app.updated_at,
    )
    .run();

  return jsonResponse(env, request, { success: true, app: toPublicApp(app), secret_key: secretKey }, 201);
}

async function handleUpdateApp(request: Request, env: Env, appId: string): Promise<Response> {
  const auth = await requireUser(request, env);
  const app = await getOwnedApp(env, auth, appId);
  const body = await readJsonBody(request);

  const nextName = body.name === undefined ? app.name : assertString(body.name, 'name', { min: 1, max: 100 });
  const nextAllowedDomains =
    body.allowed_domains === undefined
      ? app.allowed_domains
      : JSON.stringify(normalizeDomains(assertStringArray(body.allowed_domains, 'allowed_domains')));
  const nextStatus = body.status === undefined ? app.status : parseStatus(body.status);
  const nextRouteStrategy = body.route_strategy === undefined ? app.route_strategy : parseRouteStrategy(body.route_strategy, app.route_strategy);
  const nextProviderChannelId = body.provider_channel_id === undefined ? app.provider_channel_id : optionalString(body.provider_channel_id, 'provider_channel_id', 100);

  await env.DB.prepare(
    `UPDATE apps
     SET name = ?, allowed_domains = ?, status = ?, route_strategy = ?, provider_channel_id = ?, updated_at = ?
     WHERE id = ? AND user_id = ?`,
  )
    .bind(nextName, nextAllowedDomains, nextStatus, nextRouteStrategy, nextProviderChannelId, nowIso(), app.id, auth.user.id)
    .run();

  const updated = await getOwnedApp(env, auth, appId);
  return okResponse(env, request, { app: toPublicApp(updated) });
}

async function handleResetAppSecret(request: Request, env: Env, appId: string): Promise<Response> {
  const auth = await requireUser(request, env);
  const app = await getOwnedApp(env, auth, appId);
  const secretKey = createSecret('tc_secret');

  await env.DB.prepare('UPDATE apps SET secret_key_hash = ?, secret_key_hint = ?, updated_at = ? WHERE id = ? AND user_id = ?')
    .bind(await hashSecret(secretKey, env), secretKey.slice(-8), nowIso(), app.id, auth.user.id)
    .run();

  const updated = await getOwnedApp(env, auth, appId);
  return okResponse(env, request, { app: toPublicApp(updated), secret_key: secretKey });
}

async function handleAppLogs(request: Request, env: Env, appId: string): Promise<Response> {
  const auth = await requireUser(request, env);
  const app = await getOwnedApp(env, auth, appId);
  const rows = await env.DB.prepare(
    `SELECT id, challenge_id, provider, success, error_code, action, hostname, country, latency_ms, created_at
     FROM verification_logs
     WHERE app_id = ?
     ORDER BY created_at DESC
     LIMIT 100`,
  )
    .bind(app.id)
    .all();

  return okResponse(env, request, { logs: rows.results });
}

async function handleAppStats(request: Request, env: Env, appId: string): Promise<Response> {
  const auth = await requireUser(request, env);
  const app = await getOwnedApp(env, auth, appId);
  const row = await env.DB.prepare(
    `SELECT
       COUNT(*) AS total,
       SUM(CASE WHEN success = 1 THEN 1 ELSE 0 END) AS success_total,
       SUM(CASE WHEN success = 0 THEN 1 ELSE 0 END) AS failed_total,
       AVG(latency_ms) AS avg_latency_ms
     FROM verification_logs
     WHERE app_id = ?`,
  )
    .bind(app.id)
    .first<{ total: number; success_total: number | null; failed_total: number | null; avg_latency_ms: number | null }>();

  return okResponse(env, request, {
    stats: {
      total: row?.total || 0,
      success_total: row?.success_total || 0,
      failed_total: row?.failed_total || 0,
      avg_latency_ms: row?.avg_latency_ms || 0,
    },
  });
}

async function handleListProviderChannels(request: Request, env: Env): Promise<Response> {
  await requireAdmin(request, env);
  const rows = await env.DB.prepare('SELECT * FROM provider_channels ORDER BY priority ASC, created_at DESC').all<ProviderChannelRow>();
  return okResponse(env, request, { provider_channels: rows.results.map(toPublicProviderChannel) });
}

async function handleCreateProviderChannel(request: Request, env: Env): Promise<Response> {
  await requireAdmin(request, env);
  const body = await readJsonBody(request);
  const provider = parseProvider(body.provider);
  const name = assertString(body.name, 'name', { min: 1, max: 100 });
  const publicKey = assertString(body.public_key, 'public_key', { min: 1, max: 500 });
  const secretConfig = body.secret_config;
  if (!secretConfig || typeof secretConfig !== 'object' || Array.isArray(secretConfig)) {
    throw new ApiError(400, 'invalid_request', 'secret_config must be an object.');
  }

  const channel: ProviderChannelRow = {
    id: createId('pch'),
    provider,
    name,
    public_key: publicKey,
    secret_config: await sealJson(secretConfig, env),
    status: parseStatus(body.status ?? 'active'),
    weight: parseInteger(body.weight, 100, 1, 10000),
    priority: parseInteger(body.priority, 100, 1, 10000),
    timeout_ms: parseInteger(body.timeout_ms, 5000, 1000, 15000),
    created_at: nowIso(),
    updated_at: nowIso(),
  };

  await env.DB.prepare(
    `INSERT INTO provider_channels (id, provider, name, public_key, secret_config, status, weight, priority, timeout_ms, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  )
    .bind(
      channel.id,
      channel.provider,
      channel.name,
      channel.public_key,
      channel.secret_config,
      channel.status,
      channel.weight,
      channel.priority,
      channel.timeout_ms,
      channel.created_at,
      channel.updated_at,
    )
    .run();

  return jsonResponse(env, request, { success: true, provider_channel: toPublicProviderChannel(channel) }, 201);
}

async function handleUpdateProviderChannel(request: Request, env: Env, channelId: string): Promise<Response> {
  await requireAdmin(request, env);
  const channel = await getProviderChannel(env, channelId);
  const body = await readJsonBody(request);

  const provider = body.provider === undefined ? channel.provider : parseProvider(body.provider);
  const name = body.name === undefined ? channel.name : assertString(body.name, 'name', { min: 1, max: 100 });
  const publicKey = body.public_key === undefined ? channel.public_key : assertString(body.public_key, 'public_key', { min: 1, max: 500 });
  const secretConfig = body.secret_config === undefined ? channel.secret_config : await sealJson(body.secret_config, env);
  const status = body.status === undefined ? channel.status : parseStatus(body.status);
  const weight = body.weight === undefined ? channel.weight : parseInteger(body.weight, channel.weight, 1, 10000);
  const priority = body.priority === undefined ? channel.priority : parseInteger(body.priority, channel.priority, 1, 10000);
  const timeoutMs = body.timeout_ms === undefined ? channel.timeout_ms : parseInteger(body.timeout_ms, channel.timeout_ms, 1000, 15000);

  await env.DB.prepare(
    `UPDATE provider_channels
     SET provider = ?, name = ?, public_key = ?, secret_config = ?, status = ?, weight = ?, priority = ?, timeout_ms = ?, updated_at = ?
     WHERE id = ?`,
  )
    .bind(provider, name, publicKey, secretConfig, status, weight, priority, timeoutMs, nowIso(), channel.id)
    .run();

  const updated = await getProviderChannel(env, channelId);
  return okResponse(env, request, { provider_channel: toPublicProviderChannel(updated) });
}

async function handleTestProviderChannel(request: Request, env: Env, channelId: string): Promise<Response> {
  await requireAdmin(request, env);
  const channel = await getProviderChannel(env, channelId);
  const body = await readOptionalJsonBody(request);
  const providerToken = body?.provider_token ?? body?.token;
  if (!providerToken) {
    getClientConfig(channel, createId('ch'));
    return okResponse(env, request, { provider_channel: toPublicProviderChannel(channel), config_valid: true });
  }

  const result = await verifyProvider({
    challengeId: createId('test'),
    providerToken,
    remoteIp: getClientIp(request),
    action: optionalString(body?.action, 'action', 100),
    channel,
    env,
  });
  return okResponse(env, request, { result });
}

async function handleAdminUsers(request: Request, env: Env): Promise<Response> {
  await requireAdmin(request, env);
  const rows = await env.DB.prepare(
    'SELECT id, email, name, role, status, created_at, updated_at FROM users ORDER BY created_at DESC LIMIT 200',
  ).all();
  return okResponse(env, request, { users: rows.results });
}

async function handleAdminApps(request: Request, env: Env): Promise<Response> {
  await requireAdmin(request, env);
  const rows = await env.DB.prepare(
    `SELECT apps.id, apps.user_id, users.email AS user_email, apps.name, apps.site_key, apps.secret_key_hint,
            apps.allowed_domains, apps.status, apps.route_strategy, apps.provider_channel_id, apps.created_at, apps.updated_at
     FROM apps
     JOIN users ON users.id = apps.user_id
     ORDER BY apps.created_at DESC
     LIMIT 200`,
  ).all();
  return okResponse(env, request, { apps: rows.results });
}

async function handleAdminStats(request: Request, env: Env): Promise<Response> {
  await requireAdmin(request, env);
  const totals = await env.DB.prepare(
    `SELECT
       COUNT(*) AS total,
       SUM(CASE WHEN success = 1 THEN 1 ELSE 0 END) AS success_total,
       SUM(CASE WHEN success = 0 THEN 1 ELSE 0 END) AS failed_total,
       AVG(latency_ms) AS avg_latency_ms
     FROM verification_logs`,
  ).first();
  const byProvider = await env.DB.prepare(
    `SELECT provider, COUNT(*) AS total, SUM(CASE WHEN success = 1 THEN 1 ELSE 0 END) AS success_total
     FROM verification_logs
     GROUP BY provider
     ORDER BY total DESC`,
  ).all();
  return okResponse(env, request, { totals, by_provider: byProvider.results });
}

async function handleCreateChallenge(request: Request, env: Env): Promise<Response> {
  const body = await readJsonBody(request);
  const siteKey = assertString(body.site_key, 'site_key', { min: 1, max: 100 });
  const action = optionalString(body.action, 'action', 100);
  const originHostname = getOriginHostname(request);
  const hostname = normalizeHostname(optionalString(body.hostname, 'hostname', 255) || originHostname || '');
  const country = getCountry(request);

  const app = await env.DB.prepare('SELECT * FROM apps WHERE site_key = ?').bind(siteKey).first<AppRow>();
  if (!app) {
    throw new ApiError(404, 'invalid_site_key', 'Invalid site key.');
  }
  if (app.status !== 'active') {
    throw new ApiError(403, 'app_disabled', 'Application is disabled.');
  }
  if (!isDomainAllowed(app, hostname, env)) {
    throw new ApiError(403, 'domain_not_allowed', 'Domain is not allowed.');
  }

  const channel = await selectProviderChannel(env, app, country);
  const challengeId = createId('ch');
  const createdAt = nowIso();
  const config = getClientConfig(channel, challengeId);

  await env.DB.prepare(
    `INSERT INTO challenges (id, app_id, provider_channel_id, provider, action, hostname, remote_ip_hash, country, status, expires_at, verified_at, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  )
    .bind(
      challengeId,
      app.id,
      channel.id,
      channel.provider,
      action,
      hostname,
      await hashIp(getClientIp(request), env),
      country,
      'created',
      addSecondsIso(CHALLENGE_TTL_SECONDS),
      null,
      createdAt,
    )
    .run();

  return jsonResponse(env, request, config, 201);
}

async function handleVerify(request: Request, env: Env): Promise<Response> {
  const startedAt = Date.now();
  const body = await readJsonBody(request);
  const secretKey = assertString(body.secret_key, 'secret_key', { min: 1, max: 200 });
  const action = optionalString(body.action, 'action', 100);
  const remoteIp = optionalString(body.remote_ip, 'remote_ip', 100) || getClientIp(request);
  const country = getCountry(request);

  const app = await env.DB.prepare('SELECT * FROM apps WHERE secret_key_hash = ?')
    .bind(await hashSecret(secretKey, env))
    .first<AppRow>();
  if (!app) {
    throw new ApiError(401, 'invalid_secret_key', 'Invalid secret key.');
  }
  if (app.status !== 'active') {
    throw new ApiError(403, 'app_disabled', 'Application is disabled.');
  }

  const decoded = decodeCaptchaToken(body);
  const challenge = await env.DB.prepare('SELECT * FROM challenges WHERE id = ?').bind(decoded.challengeId).first<ChallengeRow>();
  if (!challenge || challenge.app_id !== app.id) {
    throw new ApiError(400, 'invalid_token', 'Invalid captcha token.');
  }
  if (challenge.status !== 'created') {
    throw new ApiError(400, 'challenge_consumed', 'Challenge has already been used.');
  }
  if (new Date(challenge.expires_at).getTime() < Date.now()) {
    await env.DB.prepare('UPDATE challenges SET status = ? WHERE id = ?').bind('expired', challenge.id).run();
    throw new ApiError(400, 'challenge_expired', 'Challenge expired.');
  }
  if (action && challenge.action && action !== challenge.action) {
    throw new ApiError(400, 'invalid_request', 'Action does not match challenge.');
  }

  const lockResult = await env.DB.prepare('UPDATE challenges SET status = ? WHERE id = ? AND status = ?')
    .bind('verifying', challenge.id, 'created')
    .run();
  if (lockResult.meta.changes !== 1) {
    throw new ApiError(400, 'challenge_consumed', 'Challenge has already been used.');
  }

  const channel = await getProviderChannel(env, challenge.provider_channel_id);
  let verifySuccess = false;
  let errorCode: string | null = null;
  let resultPayload: Record<string, unknown>;

  try {
    const providerResult = await verifyProvider({
      challengeId: challenge.id,
      providerToken: decoded.providerToken,
      remoteIp,
      action: action || challenge.action,
      channel,
      env,
    });

    verifySuccess = providerResult.success;
    errorCode = providerResult.success ? null : providerResult.error_codes?.[0] || 'invalid_token';
    resultPayload = {
      success: providerResult.success,
      challenge_id: challenge.id,
      provider: providerResult.provider,
      score: providerResult.score ?? null,
      action: providerResult.action ?? challenge.action,
      hostname: providerResult.hostname ?? challenge.hostname,
      error_codes: providerResult.error_codes ?? [],
    };
  } catch (error) {
    errorCode = error instanceof ApiError ? error.code : 'provider_unavailable';
    resultPayload = {
      success: false,
      challenge_id: challenge.id,
      provider: challenge.provider,
      error_code: errorCode,
      message: error instanceof Error ? error.message : 'Captcha verification failed.',
    };
  }

  await env.DB.prepare('UPDATE challenges SET status = ?, verified_at = ? WHERE id = ?')
    .bind(verifySuccess ? 'verified' : 'failed', nowIso(), challenge.id)
    .run();

  await env.DB.prepare(
    `INSERT INTO verification_logs (id, app_id, user_id, challenge_id, provider_channel_id, provider, success, error_code, action, hostname, remote_ip_hash, country, latency_ms, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  )
    .bind(
      createId('log'),
      app.id,
      app.user_id,
      challenge.id,
      channel.id,
      channel.provider,
      verifySuccess ? 1 : 0,
      errorCode,
      action || challenge.action,
      challenge.hostname,
      await hashIp(remoteIp, env),
      country,
      Date.now() - startedAt,
      nowIso(),
    )
    .run();

  return jsonResponse(env, request, resultPayload, verifySuccess ? 200 : 400);
}

async function createSession(env: Env, request: Request, userId: string): Promise<{ token: string }> {
  const token = createSecret('tc_session');
  const tokenHash = await hashSecret(token, env);
  await env.DB.prepare(
    `INSERT INTO sessions (id, user_id, token_hash, ip_hash, user_agent, expires_at, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
  )
    .bind(
      createId('ses'),
      userId,
      tokenHash,
      await hashIp(getClientIp(request), env),
      request.headers.get('user-agent'),
      addSecondsIso(SESSION_TTL_SECONDS),
      nowIso(),
    )
    .run();
  return { token };
}

async function requireUser(request: Request, env: Env): Promise<AuthContext> {
  const token = getSessionToken(request);
  if (!token) {
    throw new ApiError(401, 'unauthorized', 'Authentication required.');
  }

  const tokenHash = await hashSecret(token, env);
  const session = await env.DB.prepare('SELECT user_id, expires_at FROM sessions WHERE token_hash = ?')
    .bind(tokenHash)
    .first<{ user_id: string; expires_at: string }>();
  if (!session || new Date(session.expires_at).getTime() < Date.now()) {
    throw new ApiError(401, 'unauthorized', 'Session expired.');
  }

  const user = await env.DB.prepare('SELECT * FROM users WHERE id = ?').bind(session.user_id).first<UserRow>();
  if (!user || user.status !== 'active') {
    throw new ApiError(401, 'unauthorized', 'Authentication required.');
  }

  return { user, tokenHash };
}

async function requireAdmin(request: Request, env: Env): Promise<AuthContext> {
  const auth = await requireUser(request, env);
  if (auth.user.role !== 'admin') {
    throw new ApiError(403, 'forbidden', 'Admin permission required.');
  }
  return auth;
}

async function getOwnedApp(env: Env, auth: AuthContext, appId: string): Promise<AppRow> {
  const app = await env.DB.prepare('SELECT * FROM apps WHERE id = ? AND user_id = ?').bind(appId, auth.user.id).first<AppRow>();
  if (!app) {
    throw new ApiError(404, 'app_not_found', 'Application not found.');
  }
  return app;
}

async function getProviderChannel(env: Env, channelId: string): Promise<ProviderChannelRow> {
  const channel = await env.DB.prepare('SELECT * FROM provider_channels WHERE id = ?').bind(channelId).first<ProviderChannelRow>();
  if (!channel) {
    throw new ApiError(404, 'provider_channel_not_found', 'Provider channel not found.');
  }
  return channel;
}

async function selectProviderChannel(env: Env, app: AppRow, country: string): Promise<ProviderChannelRow> {
  if (app.route_strategy === 'fixed' && app.provider_channel_id) {
    const fixed = await getProviderChannel(env, app.provider_channel_id);
    if (fixed.status === 'active') {
      return fixed;
    }
  }

  const rows = await env.DB.prepare('SELECT * FROM provider_channels WHERE status = ? ORDER BY priority ASC, weight DESC, created_at ASC')
    .bind('active')
    .all<ProviderChannelRow>();
  const channels = rows.results;
  if (channels.length === 0) {
    throw new ApiError(503, 'provider_unavailable', 'No active captcha provider channel.');
  }

  if (app.route_strategy === 'geo_country') {
    const preferredProviders: CaptchaProvider[] = country === 'CN' ? ['geetest', 'turnstile'] : ['turnstile', 'geetest'];
    for (const provider of preferredProviders) {
      const match = channels.find((channel) => channel.provider === provider);
      if (match) {
        return match;
      }
    }
  }

  return selectWeightedChannel(channels);
}

function selectWeightedChannel(channels: ProviderChannelRow[]): ProviderChannelRow {
  const totalWeight = channels.reduce((total, channel) => total + Math.max(1, channel.weight), 0);
  let cursor = Math.floor(Math.random() * totalWeight);
  for (const channel of channels) {
    cursor -= Math.max(1, channel.weight);
    if (cursor < 0) {
      return channel;
    }
  }
  return channels[0];
}

function decodeCaptchaToken(body: Record<string, unknown>): { challengeId: string; providerToken: unknown } {
  if (typeof body.captcha_token === 'string') {
    try {
      const decoded = JSON.parse(base64UrlDecodeString(body.captcha_token)) as Record<string, unknown>;
      const challengeId = assertString(decoded.challenge_id, 'challenge_id', { min: 1, max: 100 });
      if (!('provider_token' in decoded)) {
        throw new ApiError(400, 'invalid_token', 'Invalid captcha token.');
      }
      return { challengeId, providerToken: decoded.provider_token };
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(400, 'invalid_token', 'Invalid captcha token.');
    }
  }

  const challengeId = assertString(body.challenge_id, 'challenge_id', { min: 1, max: 100 });
  if ('provider_token' in body) {
    return { challengeId, providerToken: body.provider_token };
  }
  if ('token' in body) {
    return { challengeId, providerToken: body.token };
  }
  throw new ApiError(400, 'invalid_token', 'Invalid captcha token.');
}

function getSessionToken(request: Request): string | null {
  const authHeader = request.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.slice('Bearer '.length).trim();
  }

  const cookie = request.headers.get('cookie');
  if (!cookie) {
    return null;
  }

  for (const part of cookie.split(';')) {
    const [name, value] = part.trim().split('=');
    if (name === 'session' && value) {
      return decodeURIComponent(value);
    }
  }
  return null;
}

function getClientIp(request: Request): string | null {
  return request.headers.get('cf-connecting-ip') || request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || null;
}

function getCountry(request: Request): string {
  const cf = request.cf as IncomingRequestCfProperties | undefined;
  const country = cf?.country || request.headers.get('cf-ipcountry') || 'XX';
  return country.toUpperCase();
}

function getOriginHostname(request: Request): string | null {
  const origin = request.headers.get('origin');
  if (origin) {
    return normalizeHostname(new URL(origin).hostname);
  }

  const referer = request.headers.get('referer');
  if (referer) {
    return normalizeHostname(new URL(referer).hostname);
  }

  return null;
}

function isDomainAllowed(app: AppRow, hostname: string, env: Env): boolean {
  const domains = parseAllowedDomains(app.allowed_domains);
  if (domains.length === 0) {
    return env.APP_ENV === 'development';
  }

  return domains.includes(hostname) || (env.APP_ENV === 'development' && domains.includes('*'));
}

function parseAllowedDomains(value: string): string[] {
  try {
    const parsed = JSON.parse(value) as unknown;
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed.filter((item): item is string => typeof item === 'string').map(normalizeHostname);
  } catch {
    return [];
  }
}

function normalizeDomains(domains: string[]): string[] {
  return [...new Set(domains.map(normalizeHostname).filter(Boolean))];
}

function normalizeHostname(hostname: string): string {
  return hostname.trim().toLowerCase().replace(/:\d+$/, '');
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function isEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function parseProvider(value: unknown): CaptchaProvider {
  const provider = assertString(value, 'provider', { min: 1, max: 50 });
  if (!isSupportedPublicProvider(provider)) {
    throw new ApiError(400, 'invalid_request', 'Unsupported provider.');
  }
  return provider;
}

function parseStatus(value: unknown): 'active' | 'disabled' {
  if (value !== 'active' && value !== 'disabled') {
    throw new ApiError(400, 'invalid_request', 'status must be active or disabled.');
  }
  return value;
}

function parseRouteStrategy(value: unknown, fallback: AppRow['route_strategy']): AppRow['route_strategy'] {
  if (value === undefined || value === null || value === '') {
    return fallback;
  }
  if (value === 'geo_country' || value === 'fixed' || value === 'weighted') {
    return value;
  }
  throw new ApiError(400, 'invalid_request', 'Invalid route_strategy.');
}

function parseInteger(value: unknown, fallback: number, min: number, max: number): number {
  if (value === undefined || value === null || value === '') {
    return fallback;
  }
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < min || parsed > max) {
    throw new ApiError(400, 'invalid_request', `Value must be an integer between ${min} and ${max}.`);
  }
  return parsed;
}

function toPublicUser(user: UserRow): PublicUser {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    status: user.status,
    created_at: user.created_at,
  };
}

function toPublicApp(app: AppRow): Record<string, unknown> {
  return {
    id: app.id,
    name: app.name,
    site_key: app.site_key,
    secret_key_hint: app.secret_key_hint,
    allowed_domains: parseAllowedDomains(app.allowed_domains),
    status: app.status,
    route_strategy: app.route_strategy,
    provider_channel_id: app.provider_channel_id,
    daily_quota: app.daily_quota,
    created_at: app.created_at,
    updated_at: app.updated_at,
  };
}

function toPublicProviderChannel(channel: ProviderChannelRow): Record<string, unknown> {
  return {
    id: channel.id,
    provider: channel.provider,
    name: channel.name,
    public_key: channel.public_key,
    status: channel.status,
    weight: channel.weight,
    priority: channel.priority,
    timeout_ms: channel.timeout_ms,
    created_at: channel.created_at,
    updated_at: channel.updated_at,
  };
}

async function readOptionalJsonBody(request: Request): Promise<Record<string, unknown> | null> {
  const contentType = request.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    return null;
  }
  return readJsonBody(request);
}

function normalizePath(pathname: string): string {
  if (pathname.length > 1 && pathname.endsWith('/')) {
    return pathname.slice(0, -1);
  }
  return pathname;
}
