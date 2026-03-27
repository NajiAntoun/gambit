import { createContext, useContext, useState, useCallback } from 'react';
import type { OpeningProgress, ProgressStatus } from '../data/types';
import { loadProgress, updateOpeningProgress } from '../lib/storage';
import { MASTERY_CLEAN_RUNS } from '../lib/constants';

interface ProgressContextValue {
  getProgress: (openingId: string) => OpeningProgress;
  recordQuizResult: (openingId: string, perfect: boolean, timeMs: number) => void;
  refresh: () => void;
}

export const ProgressContext = createContext<ProgressContextValue | null>(null);

export function useProgressState(userId: string): ProgressContextValue {
  const [, forceUpdate] = useState(0);

  const getProgress = useCallback(
    (openingId: string): OpeningProgress => {
      const stored = loadProgress(userId);
      return stored.openings[openingId] ?? {
        status: 'not-started',
        cleanRuns: 0,
        quizAttempts: 0,
        bestTime: null,
        drillBestTime: null,
        drillBestStreak: 0,
        lastAttempted: null,
      };
    },
    [userId],
  );

  const recordQuizResult = useCallback(
    (openingId: string, perfect: boolean, timeMs: number) => {
      const current = getProgress(openingId);
      const newCleanRuns = perfect ? current.cleanRuns + 1 : 0;
      const newStatus: ProgressStatus =
        newCleanRuns >= MASTERY_CLEAN_RUNS
          ? 'mastered'
          : current.status === 'not-started'
          ? 'learning'
          : current.status;
      updateOpeningProgress(
        openingId,
        {
          status: newStatus,
          cleanRuns: newStatus === 'mastered' ? current.cleanRuns : newCleanRuns,
          quizAttempts: current.quizAttempts + 1,
          bestTime:
            perfect && (current.bestTime === null || timeMs < current.bestTime)
              ? timeMs
              : current.bestTime,
        },
        userId,
      );
      forceUpdate((n) => n + 1);
    },
    [getProgress, userId],
  );

  const refresh = useCallback(() => forceUpdate((n) => n + 1), []);

  return { getProgress, recordQuizResult, refresh };
}

export function useProgress(): ProgressContextValue {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error('useProgress must be used within ProgressProvider');
  return ctx;
}
