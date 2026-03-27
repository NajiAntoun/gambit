import { Router, Request, Response } from 'express';
import { requireAuth, getAuth } from '@clerk/express';

export const presenceRouter = Router();

// ─── In-memory presence store ─────────────────────────────────────────────────

interface OnlineEntry {
  displayName: string | null;
  country:     string | null;
  gender:      string | null;
  chessLevel:  string | null;
  rating:      number | null; // headline rating sent by client
  lastSeen:    number; // epoch ms
}

const store = new Map<string, OnlineEntry>();
const TTL_MS = 90_000; // 90 seconds without heartbeat → offline

// Prune stale entries every minute
setInterval(() => {
  const cutoff = Date.now() - TTL_MS;
  for (const [id, entry] of store) {
    if (entry.lastSeen < cutoff) store.delete(id);
  }
}, 60_000);

// ─── POST /api/presence — heartbeat ──────────────────────────────────────────

presenceRouter.post('/', requireAuth(), (req: Request, res: Response) => {
  const { userId } = getAuth(req);
  if (!userId) { res.status(401).json({ error: 'Unauthorized' }); return; }

  const { displayName, country, gender, chessLevel, rating } = req.body as Partial<OnlineEntry>;

  store.set(userId, {
    displayName: displayName ?? null,
    country:     country     ?? null,
    gender:      gender      ?? null,
    chessLevel:  chessLevel  ?? null,
    rating:      typeof rating === 'number' ? rating : null,
    lastSeen:    Date.now(),
  });

  res.json({ ok: true });
});

// ─── DELETE /api/presence — explicit sign-off ─────────────────────────────────

presenceRouter.delete('/', requireAuth(), (req: Request, res: Response) => {
  const { userId } = getAuth(req);
  if (userId) store.delete(userId);
  res.json({ ok: true });
});

// ─── GET /api/presence — list of online users ────────────────────────────────

presenceRouter.get('/', requireAuth(), (_req: Request, res: Response) => {
  const cutoff = Date.now() - TTL_MS;
  const users: Omit<OnlineEntry, 'lastSeen'>[] = [];

  for (const entry of store.values()) {
    if (entry.lastSeen >= cutoff) {
      users.push({
        displayName: entry.displayName,
        country:     entry.country,
        gender:      entry.gender,
        chessLevel:  entry.chessLevel,
        rating:      entry.rating,
      });
    }
  }

  // Sort alphabetically by display name for consistent ordering
  users.sort((a, b) =>
    (a.displayName ?? '').localeCompare(b.displayName ?? ''),
  );

  res.json({ count: users.length, users });
});
