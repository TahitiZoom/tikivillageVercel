import { createClient } from '@libsql/client';

const dbUrl = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

if (!dbUrl || !authToken) {
  console.error('Missing TURSO_DATABASE_URL or TURSO_AUTH_TOKEN');
  process.exit(1);
}

const client = createClient({ url: dbUrl, authToken });

async function resetDatabase() {
  try {
    console.log('🔄 Connecting to Turso database...');
    
    // Disable foreign key constraints temporarily
    await client.execute('PRAGMA foreign_keys = OFF');
    console.log('⚙️  Disabled foreign key constraints');
    
    // Get list of all tables
    console.log('📋 Fetching table list...');
    const result = await client.execute(
      "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'"
    );
    
    const tables = result.rows.map(row => row.name);
    console.log(`Found ${tables.length} tables to drop\n`);
    
    if (tables.length === 0) {
      console.log('✅ Database is already clean (no tables found)');
    } else {
      console.log('🗑️  Dropping tables...');
      for (const table of tables) {
        try {
          const dropQuery = `DROP TABLE IF EXISTS "${table}"`;
          await client.execute(dropQuery);
          console.log(`  ✓ ${table}`);
        } catch (e) {
          console.log(`  ⚠️  ${table} (skipped: ${e.message})`);
        }
      }
      console.log('\n✅ Database reset complete!');
    }
    
    // Re-enable foreign key constraints
    await client.execute('PRAGMA foreign_keys = ON');
    
    await client.close();
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

resetDatabase();
