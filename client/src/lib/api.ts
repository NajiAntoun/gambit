import { API_URL } from './constants';
import type { OpeningProgress, Account, OnlineUser } from '../data/types';

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

// ─── Account ──────────────────────────────────────────────────────────────────

export async function fetchAccount(token: string): Promise<Account | null> {
  const res = await fetch(`${API_URL}/api/account`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  const data = await res.json() as { account: Account | null };
  return data.account;
}

/** Upsert — fields absent from the payload are left unchanged (COALESCE in DB). */
export async function upsertAccount(
  fields: Partial<Account>,
  token: string,
): Promise<Account> {
  const res = await fetch(`${API_URL}/api/account`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(fields),
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  const data = await res.json() as { account: Account };
  return data.account;
}

/** Patch — explicitly sets fields, including clearing them to null. */
export async function patchAccount(
  fields: Partial<Account>,
  token: string,
): Promise<Account> {
  const res = await fetch(`${API_URL}/api/account`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(fields),
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  const data = await res.json() as { account: Account };
  return data.account;
}

// ─── Presence ─────────────────────────────────────────────────────────────────

export async function sendHeartbeat(
  user: Pick<OnlineUser, 'displayName' | 'country' | 'gender' | 'chessLevel'>,
  token: string,
): Promise<void> {
  await fetch(`${API_URL}/api/presence`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(user),
  });
}

export async function fetchOnlineUsers(
  token: string,
): Promise<{ count: number; users: OnlineUser[] }> {
  const res = await fetch(`${API_URL}/api/presence`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json() as Promise<{ count: number; users: OnlineUser[] }>;
}

export async function sendSignOff(token: string): Promise<void> {
  await fetch(`${API_URL}/api/presence`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
}
