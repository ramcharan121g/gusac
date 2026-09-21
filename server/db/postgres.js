import pg from 'pg';

const { Pool } = pg;

const poolConfig = {
  host: process.env.DB_HOST || 'db.cyoxgistgxwllzjrfzhj.supabase.co',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'BW.#xxf?dW99BGk',
  database: process.env.DB_NAME || 'postgres',
  ssl: { rejectUnauthorized: false },
  max: 20, // Max 20 connection pool limit for free tier optimization
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000
};

export const pool = new Pool(poolConfig);

pool.on('error', (err) => {
  console.error('[PostgreSQL Pool Error]: Unexpected client error', err);
});

export async function query(text, params = []) {
  const start = Date.now();
  const client = await pool.connect();
  try {
    const res = await client.query(text, params);
    const duration = Date.now() - start;
    if (process.env.NODE_ENV !== 'production' && duration > 100) {
      console.log(`[PG Query] Executed query in ${duration}ms: ${text.slice(0, 60)}...`);
    }
    return res;
  } catch (err) {
    console.error(`[PG Query Error] Failed on query: ${text.slice(0, 80)}`, err.message);
    throw err;
  } finally {
    client.release();
  }
}

export async function testDbConnection() {
  try {
    const res = await query('SELECT NOW() as now, version() as v');
    return {
      connected: true,
      timestamp: res.rows[0].now,
      version: res.rows[0].v
    };
  } catch (err) {
    return {
      connected: false,
      error: err.message
    };
  }
}
