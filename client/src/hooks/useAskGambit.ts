import { useState, useCallback, useRef } from 'react';
import { askGambit } from '../lib/api';

interface UseAskGambitOptions {
  fen: string;
  opening: string;
  move: string;
  moveNumber: number;
  context: 'learn' | 'quiz-wrong';
  staticExplanation?: string;
}

export function useAskGambit() {
  const [explanation, setExplanation] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [source, setSource] = useState<'ai' | 'fallback' | null>(null);
  // Cache to avoid re-fetching the same position
  const cache = useRef<Map<string, { explanation: string; source: 'ai' | 'fallback' }>>(new Map());

  const ask = useCallback(async (opts: UseAskGambitOptions) => {
    const cacheKey = `${opts.fen}:${opts.context}`;
    const cached = cache.current.get(cacheKey);
    if (cached) {
      setExplanation(cached.explanation);
      setSource(cached.source);
      return;
    }

    setLoading(true);
    setExplanation(null);
    try {
      const res = await askGambit({
        fen: opts.fen,
        opening: opts.opening,
        move: opts.move,
        moveNumber: opts.moveNumber,
        context: opts.context,
        explanation: opts.staticExplanation,
      });
      cache.current.set(cacheKey, res);
      setExplanation(res.explanation);
      setSource(res.source);
    } catch {
      // On network error, fall back to the static explanation
      const fallback = opts.staticExplanation ?? 'Study this position carefully.';
      setExplanation(fallback);
      setSource('fallback');
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setExplanation(null);
    setSource(null);
  }, []);

  return { explanation, loading, source, ask, reset };
}
