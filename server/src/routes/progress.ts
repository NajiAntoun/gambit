import { Router, Request, Response } from 'express';
import { requireAuth, getAuth } from '@clerk/express';
import { pool } from '../lib/db';

export const progressRouter = Router();

// GET /api/progress — fetch the signed-in user's progress
progressRouter.get('/', requireAuth(), async (req: Request, res: Response) => {
  const { userId } = getAuth(req);
  try {
    const result = await pool.query(
      'SELECT data FROM progress WHERE user_id = $1',
      [userId],
    );
    const openings = result.rows[0]?.data ?? {};
    res.json({ openings });
  } catch (err) {
    console.error('DB error (get progress):', err);
    res.status(500).json({ error: 'Failed to load progress' });
  }
});

// POST /api/progress — upsert the signed-in user's full progress
progressRouter.post('/', requireAuth(), async (req: Request, res: Response) => {
  const { userId } = getAuth(req);
  const { openings } = req.body;

  if (!openings || typeof openings !== 'object') {
    res.status(400).json({ error: 'Invalid payload' });
    return;
  }

  try {
    await pool.query(
      `INSERT INTO progress (user_id, data, updated_at)
       VALUES ($1, $2, NOW())
       ON CONFLICT (user_id) DO UPDATE
         SET data = $2, updated_at = NOW()`,
      [userId, JSON.stringify(openings)],
    );
    res.json({ ok: true });
  } catch (err) {
    console.error('DB error (save progress):', err);
    res.status(500).json({ error: 'Failed to save progress' });
  }
});
