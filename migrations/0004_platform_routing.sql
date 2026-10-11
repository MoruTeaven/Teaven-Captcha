ALTER TABLE provider_channels ADD COLUMN supported_platforms TEXT NOT NULL DEFAULT '["web"]';

ALTER TABLE challenges ADD COLUMN platform TEXT NOT NULL DEFAULT 'web';
