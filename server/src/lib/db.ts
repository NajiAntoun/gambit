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
      gender          TEXT CHECK (gender IN ('male', 'female', 'nonbinary', 'prefer_not_to_say')),
      created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);

  // Idempotent migrations — add columns introduced after initial schema

  await pool.query(`
    ALTER TABLE accounts
    ADD COLUMN IF NOT EXISTS gender TEXT
      CHECK (gender IN ('male', 'female', 'nonbinary', 'prefer_not_to_say'))
  `);

  await pool.query(`
    ALTER TABLE accounts
    ADD COLUMN IF NOT EXISTS chess_title TEXT
      CHECK (chess_title IN ('GM','IM','FM','CM','NM','WGM','WIM','WFM','WCM'))
  `);

  await pool.query(`ALTER TABLE accounts ADD COLUMN IF NOT EXISTS fide_id TEXT`);

  await pool.query(`
    ALTER TABLE accounts
    ADD COLUMN IF NOT EXISTS fide_rating SMALLINT
      CHECK (fide_rating >= 0 AND fide_rating <= 4000)
  `);

  await pool.query(`ALTER TABLE accounts ADD COLUMN IF NOT EXISTS chess_com_username TEXT`);
  await pool.query(`ALTER TABLE accounts ADD COLUMN IF NOT EXISTS chess_com_rapid   SMALLINT`);
  await pool.query(`ALTER TABLE accounts ADD COLUMN IF NOT EXISTS chess_com_blitz   SMALLINT`);
  await pool.query(`ALTER TABLE accounts ADD COLUMN IF NOT EXISTS chess_com_bullet  SMALLINT`);
  await pool.query(`ALTER TABLE accounts ADD COLUMN IF NOT EXISTS lichess_username  TEXT`);
  await pool.query(`ALTER TABLE accounts ADD COLUMN IF NOT EXISTS lichess_rapid     SMALLINT`);
  await pool.query(`ALTER TABLE accounts ADD COLUMN IF NOT EXISTS lichess_blitz     SMALLINT`);
  await pool.query(`ALTER TABLE accounts ADD COLUMN IF NOT EXISTS lichess_bullet    SMALLINT`);
}
