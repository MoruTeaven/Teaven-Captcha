export interface Env {
  DB: D1Database;
  APP_ENV?: string;
  API_BASE_URL?: string;
  CORS_ORIGIN?: string;
  SECRET_ENCRYPTION_KEY?: string;
  SESSION_SECRET?: string;
}

export interface UserRow {
  id: string;
  email: string;
  password_hash: string;
  name: string | null;
  role: 'admin' | 'user';
  status: 'active' | 'disabled';
  created_at: string;
  updated_at: string;
}

export interface PublicUser {
  id: string;
  email: string;
  name: string | null;
  role: 'admin' | 'user';
  status: 'active' | 'disabled';
  created_at: string;
}

export interface AppRow {
  id: string;
  user_id: string;
  name: string;
  site_key: string;
  secret_key_hash: string;
  secret_key_hint: string;
  allowed_domains: string;
  status: 'active' | 'disabled';
  route_strategy: 'geo_country' | 'fixed' | 'weighted';
  provider_channel_id: string | null;
  daily_quota: number | null;
  created_at: string;
  updated_at: string;
}

export interface ProviderChannelRow {
  id: string;
  provider: CaptchaProvider;
  name: string;
  public_key: string;
  secret_config: string;
  status: 'active' | 'disabled';
  weight: number;
  priority: number;
  timeout_ms: number;
  created_at: string;
  updated_at: string;
}

export interface ChallengeRow {
  id: string;
  app_id: string;
  provider_channel_id: string;
  provider: CaptchaProvider;
  action: string | null;
  hostname: string | null;
  remote_ip_hash: string | null;
  country: string | null;
  status: 'created' | 'verifying' | 'verified' | 'failed' | 'expired';
  expires_at: string;
  verified_at: string | null;
  created_at: string;
}

export type CaptchaProvider = 'turnstile' | 'geetest' | 'recaptcha' | 'hcaptcha';

export interface AuthContext {
  user: UserRow;
  tokenHash: string;
}

export interface CaptchaClientConfig {
  challenge_id: string;
  provider: CaptchaProvider;
  public_key: string;
  script_url: string;
  options: Record<string, unknown>;
  expires_in: number;
}

export interface CaptchaVerifyResult {
  success: boolean;
  provider: CaptchaProvider;
  score?: number | null;
  action?: string | null;
  hostname?: string | null;
  error_codes?: string[];
  raw?: unknown;
}
