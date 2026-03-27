import { Router, Request, Response } from 'express';
import rateLimit from 'express-rate-limit';
import { requireAuth } from '@clerk/express';
import { askGambit } from '../lib/claude';
import { FALLBACK_MESSAGE, FALLBACK_WRONG_MOVE_MESSAGE } from '../lib/fallbacks';

export const aiRouter = Router();

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
});

// requireAuth() returns 401 if no valid Clerk JWT is present.
aiRouter.post('/ask-gambit', requireAuth(), limiter, async (req: Request, res: Response) => {
  const { fen, opening, move, moveNumber, context, explanation } = req.body;

  if (!fen || !opening || !move || !moveNumber || !context) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }

  if (!['learn', 'quiz-wrong'].includes(context)) {
    res.status(400).json({ error: 'Invalid context' });
    return;
  }

  try {
    const text = await askGambit({ fen, opening, move, moveNumber, context, explanation });
    res.json({ explanation: text, source: 'ai' });
  } catch (err) {
    console.error('Claude API error:', err);
    const fallback = context === 'quiz-wrong' ? FALLBACK_WRONG_MOVE_MESSAGE : FALLBACK_MESSAGE;
    res.json({ explanation: explanation || fallback, source: 'fallback' });
  }
});
