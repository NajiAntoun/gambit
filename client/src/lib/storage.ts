import type { StoredProgress, OpeningProgress } from '../data/types';

const STORAGE_KEY = 'gambit-progress';

const defaultProgress = (): OpeningProgress => ({
  status: 'not-started',
  cleanRuns: 0,
  quizAttempts: 0,
  bestTime: null,
  drillBestTime: null,
  drillBestStreak: 0,
  lastAttempted: null,
});

export function loadProgress(): StoredProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { version: 1, openings: {}, lastUpdated: new Date().toISOString() };
    const parsed = JSON.parse(raw) as StoredProgress;
    if (parsed.version !== 1) return { version: 1, openings: {}, lastUpdated: new Date().toISOString() };
    return parsed;
  } catch {
    return { version: 1, openings: {}, lastUpdated: new Date().toISOString() };
  }
}

export function saveProgress(progress: StoredProgress): void {
  try {
    progress.lastUpdated = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // localStorage unavailable — silently fail
  }
}

export function getOpeningProgress(openingId: string): OpeningProgress {
  const stored = loadProgress();
  return stored.openings[openingId] ?? defaultProgress();
}

export function updateOpeningProgress(
  openingId: string,
  update: Partial<OpeningProgress>
): void {
  const stored = loadProgress();
  const current = stored.openings[openingId] ?? defaultProgress();
  stored.openings[openingId] = { ...current, ...update, lastAttempted: new Date().toISOString() };
  saveProgress(stored);
}
