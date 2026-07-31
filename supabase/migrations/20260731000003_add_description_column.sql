-- Add description column to tickets if it doesn't exist
ALTER TABLE tickets
ADD COLUMN IF NOT EXISTS description TEXT DEFAULT '';

-- Ensure description has a default for consistency
ALTER TABLE tickets
ALTER COLUMN description SET DEFAULT '';

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_tickets_description_length ON tickets(LENGTH(description));
