#!/usr/bin/env node

/**
 * Migration script to add 'בטיפול' (pending) status to tickets table
 * This requires a Supabase admin key to execute DDL operations
 *
 * Usage:
 *   set SUPABASE_ADMIN_KEY=your-admin-key
 *   node run-migration.js
 *
 * To get your admin key:
 *   1. Go to https://supabase.com/dashboard
 *   2. Select your project (ticketIQCRM)
 *   3. Go to Project Settings > API
 *   4. Copy the "Service Role" key (NOT the "Public" anon key)
 */

const fs = require('fs');
const https = require('https');

const SUPABASE_URL = 'https://skhuhvxqmawbjvifvxnz.supabase.co';
const SUPABASE_ADMIN_KEY = process.env.SUPABASE_ADMIN_KEY || '';

if (!SUPABASE_ADMIN_KEY) {
  console.error('❌ Error: SUPABASE_ADMIN_KEY environment variable not set');
  console.log('\n📋 To run this migration:');
  console.log('   1. Get your Supabase admin (Service Role) key from:');
  console.log('      https://supabase.com/dashboard/project/skhuhvxqmawbjvifvxnz/settings/api');
  console.log('   2. Set the environment variable:');
  console.log('      set SUPABASE_ADMIN_KEY=your-service-role-key');
  console.log('   3. Run this script:');
  console.log('      node run-migration.js');
  process.exit(1);
}

async function executeSql(sql) {
  return new Promise((resolve, reject) => {
    const url = new URL(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`);
    const data = JSON.stringify({ sql });

    const options = {
      method: 'POST',
      hostname: url.hostname,
      port: url.port || 443,
      path: url.pathname + url.search,
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data),
        'Authorization': `Bearer ${SUPABASE_ADMIN_KEY}`,
        'apikey': SUPABASE_ADMIN_KEY,
        'Prefer': 'return=minimal'
      }
    };

    const req = https.request(options, (res) => {
      let responseData = '';
      res.on('data', (chunk) => { responseData += chunk; });
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve({ success: true, data: responseData });
        } else {
          try {
            const error = JSON.parse(responseData);
            reject(new Error(`${error.message || responseData}`));
          } catch {
            reject(new Error(`HTTP ${res.statusCode}: ${responseData}`));
          }
        }
      });
    });

    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function runMigration() {
  try {
    console.log('🔧 Applying migration to Supabase...\n');

    // Step 1: Drop old constraint
    console.log('  ▸ Dropping old constraint...');
    try {
      await executeSql('ALTER TABLE tickets DROP CONSTRAINT IF EXISTS tickets_status_check CASCADE;');
      console.log('    ✓ Constraint dropped');
    } catch (e) {
      if (!e.message.includes('does not exist')) throw e;
      console.log('    ✓ No existing constraint to drop');
    }

    // Step 2: Add new constraint
    console.log('  ▸ Adding new constraint with Hebrew status values...');
    await executeSql("ALTER TABLE tickets ADD CONSTRAINT tickets_status_check CHECK (status IN ('פתוח', 'בטיפול', 'סגור'));");
    console.log('    ✓ Constraint added');

    console.log('\n✅ Migration completed successfully!\n');
    console.log('📊 The tickets table now supports:');
    console.log('   • פתוח (open)');
    console.log('   • בטיפול (in treatment/pending)  [NEW]');
    console.log('   • סגור (closed)');
    console.log('\n🎉 Reload your application to test the new status!');

  } catch (error) {
    console.error('\n❌ Migration failed:', error.message);
    console.log('\nℹ️  If you see an "exec_sql" function error, it means Supabase');
    console.log('   does not expose raw SQL execution through the REST API.');
    console.log('\n📝 Alternative: Run the migration directly in Supabase SQL Editor:');
    console.log('   1. Go to https://supabase.com/dashboard/project/skhuhvxqmawbjvifvxnz/sql');
    console.log('   2. Paste this SQL:');
    console.log("      ALTER TABLE tickets DROP CONSTRAINT IF EXISTS tickets_status_check CASCADE;");
    console.log("      ALTER TABLE tickets ADD CONSTRAINT tickets_status_check CHECK (status IN ('פתוח', 'בטיפול', 'סגור'));");
    console.log('   3. Click "RUN"');
    process.exit(1);
  }
}

runMigration();
