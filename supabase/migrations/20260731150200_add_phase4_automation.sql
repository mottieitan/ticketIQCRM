-- Phase 4: Automation & AI Features
CREATE TABLE IF NOT EXISTS automation_rules (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  trigger_type TEXT,
  conditions JSONB,
  actions JSONB,
  is_active BOOLEAN DEFAULT TRUE,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ai_suggestions (
  id BIGSERIAL PRIMARY KEY,
  ticket_id BIGINT REFERENCES tickets(id) ON DELETE CASCADE,
  suggestion_type TEXT,
  suggested_category TEXT,
  suggested_priority TEXT,
  confidence_score NUMERIC,
  ai_model TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS duplicate_detection (
  id BIGSERIAL PRIMARY KEY,
  ticket_id_1 BIGINT REFERENCES tickets(id),
  ticket_id_2 BIGINT REFERENCES tickets(id),
  similarity_score NUMERIC,
  detected_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ticket_templates (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT,
  content TEXT,
  tags JSONB,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS workflow_automation (
  id BIGSERIAL PRIMARY KEY,
  workflow_name TEXT UNIQUE NOT NULL,
  steps JSONB,
  trigger_events JSONB,
  is_enabled BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
