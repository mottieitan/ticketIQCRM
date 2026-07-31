-- Phase 7: Security & Compliance
CREATE TABLE IF NOT EXISTS two_factor_auth (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID UNIQUE REFERENCES team_members(user_id),
  secret_key TEXT,
  backup_codes JSONB,
  is_enabled BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS api_keys (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES team_members(user_id),
  key_hash TEXT UNIQUE,
  key_name TEXT,
  last_used TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS rate_limits (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES team_members(user_id),
  endpoint TEXT,
  request_count INTEGER,
  reset_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, endpoint)
);

CREATE TABLE IF NOT EXISTS backup_logs (
  id BIGSERIAL PRIMARY KEY,
  backup_name TEXT,
  backup_size_mb NUMERIC,
  backup_location TEXT,
  backup_type TEXT,
  status TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS encryption_keys (
  id BIGSERIAL PRIMARY KEY,
  key_version INTEGER,
  public_key TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS compliance_audit (
  id BIGSERIAL PRIMARY KEY,
  compliance_type TEXT,
  entity_type TEXT,
  entity_id BIGINT,
  status TEXT,
  verified_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
