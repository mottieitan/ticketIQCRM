-- Phase 2: Analytics & Reporting Tables
CREATE TABLE IF NOT EXISTS ticket_analytics (
  id BIGSERIAL PRIMARY KEY,
  ticket_id BIGINT REFERENCES tickets(id) ON DELETE CASCADE,
  customer_id TEXT,
  resolution_time_hours NUMERIC,
  satisfaction_score INTEGER DEFAULT 0,
  category TEXT,
  priority TEXT,
  status TEXT,
  agent_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  resolved_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS idx_analytics_date ON ticket_analytics(created_at);
CREATE INDEX IF NOT EXISTS idx_analytics_category ON ticket_analytics(category);

CREATE TABLE IF NOT EXISTS report_templates (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  report_type TEXT,
  filters JSONB,
  created_by TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS kpi_dashboard (
  id BIGSERIAL PRIMARY KEY,
  date DATE,
  total_tickets INTEGER,
  open_tickets INTEGER,
  closed_tickets INTEGER,
  avg_resolution_time NUMERIC,
  satisfaction_avg NUMERIC,
  high_priority_tickets INTEGER,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
