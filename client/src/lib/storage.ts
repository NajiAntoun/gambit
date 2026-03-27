import type { StoredProgress, OpeningProgress } from '../data/types';

/** Each user gets their own isolated storage key. */
function storageKey(userId: string): string {
  return userId ? `gambit-progress-${userId}` : 'gambit-progress';
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

export function loadProgress(userId: string): StoredProgress {
  try {
    const raw = localStorage.getItem(storageKey(userId));
    if (!raw) return { version: 1, openings: {}, lastUpdated: new Date().toISOString() };
    const parsed = JSON.parse(raw) as StoredProgress;
    if (parsed.version !== 1) return { version: 1, openings: {}, lastUpdated: new Date().toISOString() };
    return parsed;
  } catch {
    return { version: 1, openings: {}, lastUpdated: new Date().toISOString() };
  }
}

export function saveProgress(progress: StoredProgress, userId: string): void {
  try {
    progress.lastUpdated = new Date().toISOString();
    localStorage.setItem(storageKey(userId), JSON.stringify(progress));
  } catch {
    // localStorage unavailable — silently fail
  }
}

export function getOpeningProgress(openingId: string, userId: string): OpeningProgress {
  const stored = loadProgress(userId);
  return stored.openings[openingId] ?? defaultProgress();
}

export function updateOpeningProgress(
  openingId: string,
  update: Partial<OpeningProgress>,
  userId: string,
): void {
  const stored = loadProgress(userId);
  const current = stored.openings[openingId] ?? defaultProgress();
  stored.openings[openingId] = { ...current, ...update, lastAttempted: new Date().toISOString() };
  saveProgress(stored, userId);
}
