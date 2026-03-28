import { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { useAuth } from '@clerk/clerk-react';
import type { OpeningProgress, ProgressStatus } from '../data/types';
import { fetchProgress, saveProgress } from '../lib/api';
import { MASTERY_CLEAN_RUNS } from '../lib/constants';

interface ProgressContextValue {
  getProgress: (openingId: string) => OpeningProgress;
  recordQuizResult: (openingId: string, perfect: boolean, timeMs: number) => void;
  recordDrillResult: (openingId: string, bestStreak: number, timeMs: number) => void;
  refresh: () => void;
  isLoading: boolean;
}

const defaultProgress = (): OpeningProgress => ({
  status: 'not-started',
  cleanRuns: 0,
  quizAttempts: 0,
  bestTime: null,
  drillBestTime: null,
  drillBestStreak: 0,
  lastAttempted: null,
});

export const ProgressContext = createContext<ProgressContextValue | null>(null);

export function useProgressState(userId: string): ProgressContextValue {
  const [openings, setOpenings] = useState<Record<string, OpeningProgress>>({});
  const [isLoading, setIsLoading] = useState(true);
  const { getToken } = useAuth();
  // Track latest openings in a ref so async save callbacks stay current
  const openingsRef = useRef(openings);
  openingsRef.current = openings;

  const loadFromServer = useCallback(async () => {
    if (!userId) { setIsLoading(false); return; }
    try {
      const token = await getToken();
      if (!token) return;
      const data = await fetchProgress(token);
      setOpenings(data);
    } catch (err) {
      console.error('Failed to load progress:', err);
    } finally {
      setIsLoading(false);
    }
  }, [userId, getToken]);

  // Fetch on mount and whenever the signed-in user changes
  useEffect(() => {
    setIsLoading(true);
    void loadFromServer();
  }, [loadFromServer]);

  const getProgress = useCallback(
    (openingId: string): OpeningProgress =>
      openingsRef.current[openingId] ?? defaultProgress(),
    [],
  );

  const recordQuizResult = useCallback(
    (openingId: string, perfect: boolean, timeMs: number) => {
      const current = openingsRef.current[openingId] ?? defaultProgress();
      const newCleanRuns = perfect ? current.cleanRuns + 1 : 0;
      const newStatus: ProgressStatus =
        newCleanRuns >= MASTERY_CLEAN_RUNS
          ? 'mastered'
          : current.status === 'not-started'
          ? 'learning'
          : current.status;

      const updated: OpeningProgress = {
        ...current,
        status: newStatus,
        cleanRuns: newStatus === 'mastered' ? current.cleanRuns : newCleanRuns,
        quizAttempts: current.quizAttempts + 1,
        bestTime:
          perfect && (current.bestTime === null || timeMs < current.bestTime)
            ? timeMs
            : current.bestTime,
        lastAttempted: new Date().toISOString(),
      };

      const newOpenings = { ...openingsRef.current, [openingId]: updated };
      setOpenings(newOpenings);

      // Persist to server in the background — fire and forget
      void getToken().then((token) => {
        if (token) saveProgress(newOpenings, token).catch(console.error);
      });
    },
    [getToken],
  );

  const recordDrillResult = useCallback(
    (openingId: string, bestStreak: number, timeMs: number) => {
      const current = openingsRef.current[openingId] ?? defaultProgress();

      const updated: OpeningProgress = {
        ...current,
        status: current.status === 'not-started' ? 'learning' : current.status,
        drillBestStreak: Math.max(current.drillBestStreak, bestStreak),
        drillBestTime:
          current.drillBestTime === null || timeMs < current.drillBestTime
            ? timeMs
            : current.drillBestTime,
        lastAttempted: new Date().toISOString(),
      };

      const newOpenings = { ...openingsRef.current, [openingId]: updated };
      setOpenings(newOpenings);

      void getToken().then((token) => {
        if (token) saveProgress(newOpenings, token).catch(console.error);
      });
    },
    [getToken],
  );

  const refresh = useCallback(() => void loadFromServer(), [loadFromServer]);

  return { getProgress, recordQuizResult, recordDrillResult, refresh, isLoading };
}

export function useProgress(): ProgressContextValue {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error('useProgress must be used within ProgressProvider');
  return ctx;
}
