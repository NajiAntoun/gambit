import { Router, Request, Response } from 'express';
import { requireAuth, getAuth } from '@clerk/express';
import { pool } from '../lib/db';

export const accountRouter = Router();

// ─── helpers ─────────────────────────────────────────────────────────────────

/** Map snake_case DB row → camelCase Account object */
function rowToAccount(row: Record<string, unknown>) {
  return {
    displayName:      row.display_name      as string | null,
    chessLevel:       row.chess_level       as string | null,
    preferredColor:   row.preferred_color   as string | null,
    goal:             row.goal              as string | null,
    birthYear:        row.birth_year        as number | null,
    country:          row.country           as string | null,
    gender:           row.gender            as string | null,
    chessTitle:       row.chess_title       as string | null,
    fideId:           row.fide_id           as string | null,
    fideRating:       row.fide_rating       as number | null,
    chessComUsername: row.chess_com_username as string | null,
    chessComRapid:    row.chess_com_rapid    as number | null,
    chessComBlitz:    row.chess_com_blitz    as number | null,
    chessComBullet:   row.chess_com_bullet   as number | null,
    lichessUsername:  row.lichess_username   as string | null,
    lichessRapid:     row.lichess_rapid      as number | null,
    lichessBlitz:     row.lichess_blitz      as number | null,
    lichessBullet:    row.lichess_bullet     as number | null,
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
  const {
    displayName, chessLevel, preferredColor, goal, birthYear, country, gender,
    chessTitle, fideId, fideRating,
    chessComUsername, chessComRapid, chessComBlitz, chessComBullet,
    lichessUsername, lichessRapid, lichessBlitz, lichessBullet,
  } = req.body;

  // Validate enum fields when provided
  const validChessLevels  = ['beginner', 'intermediate', 'advanced'];
  const validColors       = ['white', 'black', 'both'];
  const validGoals        = ['casual', 'tournament', 'rating'];
  const validGenders      = ['male', 'female', 'nonbinary', 'prefer_not_to_say'];
  const validTitles       = ['GM','IM','FM','CM','NM','WGM','WIM','WFM','WCM'];

  if (chessLevel     && !validChessLevels.includes(chessLevel))  { res.status(400).json({ error: 'Invalid chess_level' });      return; }
  if (preferredColor && !validColors.includes(preferredColor))   { res.status(400).json({ error: 'Invalid preferred_color' }); return; }
  if (goal           && !validGoals.includes(goal))              { res.status(400).json({ error: 'Invalid goal' });             return; }
  if (gender         && !validGenders.includes(gender))          { res.status(400).json({ error: 'Invalid gender' });          return; }
  if (chessTitle     && !validTitles.includes(chessTitle))       { res.status(400).json({ error: 'Invalid chess_title' });     return; }
  if (birthYear      && (birthYear < 1900 || birthYear > 2100)) { res.status(400).json({ error: 'Invalid birth_year' });       return; }
  if (fideRating     && (fideRating < 0   || fideRating > 4000)){ res.status(400).json({ error: 'Invalid fide_rating' });     return; }

  try {
    const result = await pool.query(
      `INSERT INTO accounts
         (user_id, display_name, chess_level, preferred_color, goal, birth_year, country, gender,
          chess_title, fide_id, fide_rating,
          chess_com_username, chess_com_rapid, chess_com_blitz, chess_com_bullet,
          lichess_username, lichess_rapid, lichess_blitz, lichess_bullet)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19)
       ON CONFLICT (user_id) DO UPDATE SET
         display_name       = COALESCE($2,  accounts.display_name),
         chess_level        = COALESCE($3,  accounts.chess_level),
         preferred_color    = COALESCE($4,  accounts.preferred_color),
         goal               = COALESCE($5,  accounts.goal),
         birth_year         = COALESCE($6,  accounts.birth_year),
         country            = COALESCE($7,  accounts.country),
         gender             = COALESCE($8,  accounts.gender),
         chess_title        = COALESCE($9,  accounts.chess_title),
         fide_id            = COALESCE($10, accounts.fide_id),
         fide_rating        = COALESCE($11, accounts.fide_rating),
         chess_com_username = COALESCE($12, accounts.chess_com_username),
         chess_com_rapid    = COALESCE($13, accounts.chess_com_rapid),
         chess_com_blitz    = COALESCE($14, accounts.chess_com_blitz),
         chess_com_bullet   = COALESCE($15, accounts.chess_com_bullet),
         lichess_username   = COALESCE($16, accounts.lichess_username),
         lichess_rapid      = COALESCE($17, accounts.lichess_rapid),
         lichess_blitz      = COALESCE($18, accounts.lichess_blitz),
         lichess_bullet     = COALESCE($19, accounts.lichess_bullet),
         updated_at         = NOW()
       RETURNING *`,
      [
        userId,
        displayName      ?? null,
        chessLevel       ?? null,
        preferredColor   ?? null,
        goal             ?? null,
        birthYear        ?? null,
        country          ?? null,
        gender           ?? null,
        chessTitle       ?? null,
        fideId           ?? null,
        fideRating       ?? null,
        chessComUsername ?? null,
        chessComRapid    ?? null,
        chessComBlitz    ?? null,
        chessComBullet   ?? null,
        lichessUsername  ?? null,
        lichessRapid     ?? null,
        lichessBlitz     ?? null,
        lichessBullet    ?? null,
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
    displayName:      'display_name',
    chessLevel:       'chess_level',
    preferredColor:   'preferred_color',
    goal:             'goal',
    birthYear:        'birth_year',
    country:          'country',
    gender:           'gender',
    chessTitle:       'chess_title',
    fideId:           'fide_id',
    fideRating:       'fide_rating',
    chessComUsername: 'chess_com_username',
    chessComRapid:    'chess_com_rapid',
    chessComBlitz:    'chess_com_blitz',
    chessComBullet:   'chess_com_bullet',
    lichessUsername:  'lichess_username',
    lichessRapid:     'lichess_rapid',
    lichessBlitz:     'lichess_blitz',
    lichessBullet:    'lichess_bullet',
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
