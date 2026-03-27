import { API_URL } from './constants';
import type { OpeningProgress } from '../data/types';

// ─── AI ──────────────────────────────────────────────────────────────────────

interface AskGambitRequest {
  fen: string;
  opening: string;
  move: string;
  moveNumber: number;
  context: 'learn' | 'quiz-wrong';
  explanation?: string;
}

interface AskGambitResponse {
  explanation: string;
  source: 'ai' | 'fallback';
}

export async function askGambit(
  req: AskGambitRequest,
  token: string,
): Promise<AskGambitResponse> {
  const res = await fetch(`${API_URL}/api/ask-gambit`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(req),
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json() as Promise<AskGambitResponse>;
}

// ─── Progress ─────────────────────────────────────────────────────────────────

export async function fetchProgress(
  token: string,
): Promise<Record<string, OpeningProgress>> {
  const res = await fetch(`${API_URL}/api/progress`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  const data = await res.json() as { openings: Record<string, OpeningProgress> };
  return data.openings;
}

export async function saveProgress(
  openings: Record<string, OpeningProgress>,
  token: string,
): Promise<void> {
  const res = await fetch(`${API_URL}/api/progress`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ openings }),
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
}
