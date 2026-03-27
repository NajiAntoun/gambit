import { API_URL } from './constants';

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

export async function askGambit(req: AskGambitRequest): Promise<AskGambitResponse> {
  const res = await fetch(`${API_URL}/api/ask-gambit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req),
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json() as Promise<AskGambitResponse>;
}
