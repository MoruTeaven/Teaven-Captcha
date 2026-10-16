-- Reconstructed from production D1 schema (2026-10-16).
-- Original file was zero-filled and permanently lost. These indexes were
-- applied to production via direct SQL execution (not tracked in d1_migrations).
-- IF NOT EXISTS makes this safe to apply on databases that already have them.
CREATE INDEX IF NOT EXISTS idx_challenges_status_expires ON challenges(status, expires_at);
CREATE INDEX IF NOT EXISTS idx_logs_created_at ON verification_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_logs_provider_created ON verification_logs(provider, created_at);
