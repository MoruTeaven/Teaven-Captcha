CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  name TEXT,
  role TEXT NOT NULL DEFAULT 'user',
  status TEXT NOT NULL DEFAULT 'active',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  token_hash TEXT NOT NULL UNIQUE,
  ip_hash TEXT,
  user_agent TEXT,
  expires_at TEXT NOT NULL,
  created_at TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE apps (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  site_key TEXT NOT NULL UNIQUE,
  secret_key_hash TEXT NOT NULL UNIQUE,
  secret_key_hint TEXT NOT NULL,
  allowed_domains TEXT NOT NULL DEFAULT '[]',
  status TEXT NOT NULL DEFAULT 'active',
  route_strategy TEXT NOT NULL DEFAULT 'geo_country',
  provider_channel_id TEXT,
  daily_quota INTEGER,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE provider_channels (
  id TEXT PRIMARY KEY,
  provider TEXT NOT NULL,
  name TEXT NOT NULL,
  public_key TEXT NOT NULL,
  secret_config TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  weight INTEGER NOT NULL DEFAULT 100,
  priority INTEGER NOT NULL DEFAULT 100,
  timeout_ms INTEGER NOT NULL DEFAULT 5000,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE challenges (
  id TEXT PRIMARY KEY,
  app_id TEXT NOT NULL,
  provider_channel_id TEXT NOT NULL,
  provider TEXT NOT NULL,
  action TEXT,
  hostname TEXT,
  remote_ip_hash TEXT,
  country TEXT,
  status TEXT NOT NULL DEFAULT 'created',
  expires_at TEXT NOT NULL,
  verified_at TEXT,
  created_at TEXT NOT NULL,
  FOREIGN KEY (app_id) REFERENCES apps(id),
  FOREIGN KEY (provider_channel_id) REFERENCES provider_channels(id)
);

CREATE TABLE verification_logs (
  id TEXT PRIMARY KEY,
  app_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  challenge_id TEXT,
  provider_channel_id TEXT,
  provider TEXT,
  success INTEGER NOT NULL,
  error_code TEXT,
  action TEXT,
  hostname TEXT,
  remote_ip_hash TEXT,
  country TEXT,
  latency_ms INTEGER,
  created_at TEXT NOT NULL,
  FOREIGN KEY (app_id) REFERENCES apps(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE INDEX idx_sessions_token_hash ON sessions(token_hash);
CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_apps_user_id ON apps(user_id);
CREATE INDEX idx_apps_site_key ON apps(site_key);
CREATE INDEX idx_apps_secret_key_hash ON apps(secret_key_hash);
CREATE INDEX idx_channels_provider_status ON provider_channels(provider, status);
CREATE INDEX idx_challenges_app_id ON challenges(app_id);
CREATE INDEX idx_challenges_status ON challenges(status);
CREATE INDEX idx_logs_app_created ON verification_logs(app_id, created_at);
CREATE INDEX idx_logs_user_created ON verification_logs(user_id, created_at);
