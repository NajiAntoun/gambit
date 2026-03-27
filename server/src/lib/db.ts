import { Pool } from 'pg';

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Railway uses self-signed certs in production
  ssl: process.env.DATABASE_URL
    ? { rejectUnauthorized: false }
    : undefined,
});

/** Creates required tables if they don't exist. Called once on server startup. */
export async function initDb(): Promise<void> {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS progress (
      user_id    TEXT PRIMARY KEY,
      data       JSONB NOT NULL DEFAULT '{}',
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS accounts (
      user_id         TEXT PRIMARY KEY,
      display_name    TEXT,
      chess_level     TEXT CHECK (chess_level IN ('beginner', 'intermediate', 'advanced')),
      preferred_color TEXT CHECK (preferred_color IN ('white', 'black', 'both')),
      goal            TEXT CHECK (goal IN ('casual', 'tournament', 'rating')),
      birth_year      SMALLINT CHECK (birth_year >= 1900 AND birth_year <= 2100),
      country         TEXT,
      created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
}
