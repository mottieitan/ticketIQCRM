-- Phase 6: Mobile & Performance Features
CREATE TABLE IF NOT EXISTS mobile_devices (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES team_members(user_id),
  device_id TEXT UNIQUE,
  device_name TEXT,
  device_type TEXT,
  push_token TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  last_sync TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS offline_queue (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID,
  action_type TEXT,
  payload JSONB,
  synced_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS performance_metrics (
  id BIGSERIAL PRIMARY KEY,
  page_url TEXT,
  load_time_ms NUMERIC,
  fcp NUMERIC,
  lcp NUMERIC,
  cls NUMERIC,
  user_id UUID,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_metrics_timestamp ON performance_metrics(timestamp);

CREATE TABLE IF NOT EXISTS pwa_manifests (
  id BIGSERIAL PRIMARY KEY,
  app_version TEXT,
  manifest JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
