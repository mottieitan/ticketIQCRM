-- Fix priority constraint issue
-- Remove problematic check constraint if it exists
ALTER TABLE tickets
DROP CONSTRAINT IF EXISTS tickets_priority_check CASCADE;

-- Ensure priority has valid default
ALTER TABLE tickets
ALTER COLUMN priority SET DEFAULT 'medium';
