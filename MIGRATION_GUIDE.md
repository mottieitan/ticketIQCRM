# Database Migration: Add "בטיפול" Status Support

## Problem
The TicketIQ database currently has a CHECK constraint on the `status` column that only allows two Hebrew status values:
- **פתוח** (open)
- **סגור** (closed)

The application needs to support a third status:
- **בטיפול** (in treatment/pending)

## Solution
Update the database constraint to allow all three Hebrew status values.

---

## How to Apply the Migration

### Option 1: Using the Migration Script (Recommended)

1. **Get your Supabase Admin Key:**
   - Go to: https://supabase.com/dashboard/project/skhuhvxqmawbjvifvxnz/settings/api
   - Copy the **"Service Role"** key (⚠️ NOT the "Public" anon key!)
   - Keep this key safe and never commit it to git

2. **Set the environment variable:**
   ```powershell
   # Windows PowerShell
   $env:SUPABASE_ADMIN_KEY = "your-service-role-key"
   ```

3. **Run the migration script:**
   ```powershell
   node run-migration.js
   ```

4. **Expected output:**
   ```
   ✅ Migration completed successfully!
   
   📊 The tickets table now supports:
      • פתוח (open)
      • בטיפול (in treatment/pending)  [NEW]
      • סגור (closed)
   
   🎉 Reload your application to test the new status!
   ```

### Option 2: Using Supabase SQL Editor (Manual)

If the script doesn't work or you prefer to do it manually:

1. **Open Supabase SQL Editor:**
   - Go to: https://supabase.com/dashboard/project/skhuhvxqmawbjvifvxnz/sql

2. **Create a new query:**
   - Click "New Query"

3. **Paste this SQL:**
   ```sql
   -- Drop the old constraint (only allows פתוח and סגור)
   ALTER TABLE tickets 
   DROP CONSTRAINT IF EXISTS tickets_status_check CASCADE;
   
   -- Add new constraint (allows פתוח, בטיפול, and סגור)
   ALTER TABLE tickets 
   ADD CONSTRAINT tickets_status_check 
   CHECK (status IN ('פתוח', 'בטיפול', 'סגור'));
   ```

4. **Click "RUN"**
   - You should see: `Query executed successfully`

---

## Verifying the Migration

After applying the migration, the application should work correctly:

1. **Test creating a new ticket:**
   - The ticket should be created with status "פתוח"

2. **Test changing ticket status:**
   - Open any "פתוח" ticket
   - Click the "⚠️ בטיפול" button
   - ✅ Status should change without error

3. **Test closing a ticket:**
   - Click the "✓ סגור" button
   - ✅ Status should change to "סגור"

4. **Test reopening a ticket:**
   - On a "סגור" ticket, click "🔄 פתח מחדש"
   - ✅ Status should change back to "פתוח"

---

## Database Schema Changes

### Before Migration
```
tickets.status CHECK constraint:
  - Allows: 'פתוח', 'סגור'
  - Default: 'פתוח'
```

### After Migration
```
tickets.status CHECK constraint:
  - Allows: 'פתוח', 'בטיפול', 'סגור'  ← בטיפול is NEW!
  - Default: 'פתוח'
```

---

## Troubleshooting

### "Connection refused" or "Cannot connect to Supabase"
- Check your internet connection
- Verify the Supabase project URL is correct

### "Function exec_sql not found"
- This means Supabase doesn't expose raw SQL execution via REST API
- Use **Option 2: SQL Editor** instead

### "Permission denied" or "Unauthorized"
- Your admin key might be invalid or expired
- Get a new Service Role key from Supabase settings
- Make sure you're using the "Service Role" key, NOT the "Public" key

### Migration appears to run but status still doesn't work
- The application code needs to be reloaded
- Refresh your browser: `Ctrl+F5` or `Cmd+Shift+R`

---

## Questions or Issues?

If you encounter any issues:
1. Check the browser console for error messages (Press `F12`)
2. Verify the migration was applied in Supabase SQL Editor
3. Try clearing your browser cache and reloading

---

## Related Files

- **Application Code:** `index.html` - Contains the status update logic
- **Migration File:** `supabase/migrations/20260731170000_fix_status_constraint.sql`
- **Migration Script:** `run-migration.js` - Automated execution tool
