-- Fix status constraint issue
-- Modify the status check constraint to allow Hebrew status values including 'בטיפול'
ALTER TABLE tickets
DROP CONSTRAINT IF EXISTS tickets_status_check CASCADE;

-- Add updated constraint that allows all three Hebrew status values
ALTER TABLE tickets
ADD CONSTRAINT tickets_status_check
CHECK (status IN ('פתוח', 'בטיפול', 'סגור'));

-- Ensure status has valid default
ALTER TABLE tickets
ALTER COLUMN status SET DEFAULT 'פתוח';
