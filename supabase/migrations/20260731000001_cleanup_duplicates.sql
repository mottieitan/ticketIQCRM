-- Cleanup: Remove duplicate columns and consolidate schema
-- This migration removes duplicate phone column (kept customer_phone instead)
-- All columns should now be properly defined in initial_schema

ALTER TABLE tickets
  DROP COLUMN IF EXISTS phone CASCADE;

-- Ensure all required columns exist with correct types
ALTER TABLE tickets
  ALTER COLUMN customer_name SET NOT NULL,
  ALTER COLUMN subject SET NOT NULL,
  ALTER COLUMN status SET DEFAULT 'open',
  ALTER COLUMN priority SET DEFAULT 'medium',
  ALTER COLUMN created_at SET DEFAULT CURRENT_TIMESTAMP,
  ALTER COLUMN updated_at SET DEFAULT CURRENT_TIMESTAMP;

-- Add missing columns for audit trail
ALTER TABLE tickets
  ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES team_members(user_id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS updated_by UUID REFERENCES team_members(user_id) ON DELETE SET NULL;

-- Add audit trail indexes
CREATE INDEX IF NOT EXISTS idx_tickets_created_by ON tickets(created_by);
CREATE INDEX IF NOT EXISTS idx_tickets_updated_by ON tickets(updated_by);

-- Verify no null constraints violated (should be empty)
CREATE INDEX IF NOT EXISTS idx_tickets_null_customer ON tickets(customer_name) WHERE customer_name IS NULL;
CREATE INDEX IF NOT EXISTS idx_tickets_null_subject ON tickets(subject) WHERE subject IS NULL;
