import { Router, Request, Response } from 'express';
import { requireAuth, getAuth } from '@clerk/express';
import { pool } from '../lib/db';

export const accountRouter = Router();

// ─── helpers ─────────────────────────────────────────────────────────────────

/** Map snake_case DB row → camelCase Account object */
function rowToAccount(row: Record<string, unknown>) {
  return {
    displayName:    row.display_name    as string | null,
    chessLevel:     row.chess_level     as string | null,
    preferredColor: row.preferred_color as string | null,
    goal:           row.goal            as string | null,
    birthYear:      row.birth_year      as number | null,
    country:        row.country         as string | null,
    gender:         row.gender          as string | null,
  };
}

// ─── GET /api/account ────────────────────────────────────────────────────────

accountRouter.get('/', requireAuth(), async (req: Request, res: Response) => {
  const { userId } = getAuth(req);
  try {
    const result = await pool.query(
      'SELECT * FROM accounts WHERE user_id = $1',
      [userId],
    );
    const account = result.rows[0] ? rowToAccount(result.rows[0]) : null;
    res.json({ account });
  } catch (err) {
    console.error('DB error (get account):', err);
    res.status(500).json({ error: 'Failed to load account' });
  }
});

// ─── POST /api/account ───────────────────────────────────────────────────────

accountRouter.post('/', requireAuth(), async (req: Request, res: Response) => {
  const { userId } = getAuth(req);
  const { displayName, chessLevel, preferredColor, goal, birthYear, country, gender } = req.body;

  // Validate enum fields when provided
  const validChessLevels   = ['beginner', 'intermediate', 'advanced'];
  const validColors        = ['white', 'black', 'both'];
  const validGoals         = ['casual', 'tournament', 'rating'];
  const validGenders       = ['male', 'female', 'nonbinary', 'prefer_not_to_say'];

  if (chessLevel     && !validChessLevels.includes(chessLevel))   { res.status(400).json({ error: 'Invalid chess_level' });      return; }
  if (preferredColor && !validColors.includes(preferredColor))     { res.status(400).json({ error: 'Invalid preferred_color' }); return; }
  if (goal           && !validGoals.includes(goal))                { res.status(400).json({ error: 'Invalid goal' });             return; }
  if (gender         && !validGenders.includes(gender))            { res.status(400).json({ error: 'Invalid gender' });          return; }
  if (birthYear      && (birthYear < 1900 || birthYear > 2100))   { res.status(400).json({ error: 'Invalid birth_year' });       return; }

  try {
    const result = await pool.query(
      `INSERT INTO accounts
         (user_id, display_name, chess_level, preferred_color, goal, birth_year, country, gender)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       ON CONFLICT (user_id) DO UPDATE SET
         display_name    = COALESCE($2, accounts.display_name),
         chess_level     = COALESCE($3, accounts.chess_level),
         preferred_color = COALESCE($4, accounts.preferred_color),
         goal            = COALESCE($5, accounts.goal),
         birth_year      = COALESCE($6, accounts.birth_year),
         country         = COALESCE($7, accounts.country),
         gender          = COALESCE($8, accounts.gender),
         updated_at      = NOW()
       RETURNING *`,
      [
        userId,
        displayName    ?? null,
        chessLevel     ?? null,
        preferredColor ?? null,
        goal           ?? null,
        birthYear      ?? null,
        country        ?? null,
        gender         ?? null,
      ],
    );
    res.json({ account: rowToAccount(result.rows[0]) });
  } catch (err) {
    console.error('DB error (save account):', err);
    res.status(500).json({ error: 'Failed to save account' });
  }
});

// ─── PATCH /api/account ──────────────────────────────────────────────────────
// Explicit clear: allows setting a field back to null (e.g. remove birth year)

accountRouter.patch('/', requireAuth(), async (req: Request, res: Response) => {
  const { userId } = getAuth(req);

  // Only update fields that are explicitly present in the body
  const fields: string[] = [];
  const values: unknown[] = [userId];
  let idx = 2;

  const allowed: Record<string, string> = {
    displayName:    'display_name',
    chessLevel:     'chess_level',
    preferredColor: 'preferred_color',
    goal:           'goal',
    birthYear:      'birth_year',
    country:        'country',
    gender:         'gender',
  };

  for (const [key, col] of Object.entries(allowed)) {
    if (key in req.body) {
      fields.push(`${col} = $${idx++}`);
      values.push(req.body[key] ?? null);
    }
  }

  if (fields.length === 0) {
    res.status(400).json({ error: 'No fields to update' });
    return;
  }

  fields.push(`updated_at = NOW()`);

  try {
    const result = await pool.query(
      `UPDATE accounts SET ${fields.join(', ')} WHERE user_id = $1 RETURNING *`,
      values,
    );
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Account not found' });
      return;
    }
    res.json({ account: rowToAccount(result.rows[0]) });
  } catch (err) {
    console.error('DB error (patch account):', err);
    res.status(500).json({ error: 'Failed to update account' });
  }
});
