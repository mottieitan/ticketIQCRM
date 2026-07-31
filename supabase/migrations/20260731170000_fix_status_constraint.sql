-- Fix status constraint issue
-- Remove problematic status check constraint that prevents Hebrew status values
ALTER TABLE tickets
DROP CONSTRAINT IF EXISTS tickets_status_check CASCADE;

-- Ensure status has valid default
ALTER TABLE tickets
ALTER COLUMN status SET DEFAULT 'פתוח';
