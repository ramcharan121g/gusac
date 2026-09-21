import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';

const { Client } = pg;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const dbConfig = {
  host: process.env.DB_HOST || 'db.cyoxgistgxwllzjrfzhj.supabase.co',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'BW.#xxf?dW99BGk',
  database: process.env.DB_NAME || 'postgres',
  ssl: { rejectUnauthorized: false }
};

export async function runMigration() {
  console.log('🔄 Connecting to Supabase PostgreSQL at:', dbConfig.host);
  const client = new Client(dbConfig);

  try {
    await client.connect();
    console.log('✅ Successfully connected to Supabase!');

    // Read schema.sql
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    console.log('📜 Executing schema.sql...');
    await client.query(schemaSql);
    console.log('✅ Schema migration executed successfully!');

    // Read seed.sql
    const seedPath = path.join(__dirname, 'seed.sql');
    if (fs.existsSync(seedPath)) {
      const seedSql = fs.readFileSync(seedPath, 'utf8');
      console.log('🌱 Executing seed.sql...');
      await client.query(seedSql);
      console.log('✅ Seed data inserted successfully!');
    }

    // Verify created tables
    const tableRes = await client.query(
      "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name"
    );
    console.log('\n📊 Created Public Tables:');
    tableRes.rows.forEach((r) => console.log('  •', r.table_name));

    // Verify users count
    const usersRes = await client.query('SELECT count(*) FROM users');
    console.log(`\n👥 Users in DB: ${usersRes.rows[0].count}`);

    // Verify events count
    const eventsRes = await client.query('SELECT count(*) FROM events');
    console.log(`🎟️ Events in DB: ${eventsRes.rows[0].count}`);

    console.log('\n🎉 Supabase Database is 100% Provisioned & Ready!');
  } catch (err) {
    console.error('❌ Migration Error:', err);
    throw err;
  } finally {
    await client.end();
  }
}

// Auto-run if executed directly via node
if (process.argv[1] && process.argv[1].endsWith('migrate.js')) {
  runMigration().catch(() => process.exit(1));
}
