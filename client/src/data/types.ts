export type Color = 'white' | 'black';
export type Difficulty = 'beginner' | 'intermediate' | 'advanced';
export type ProgressStatus = 'not-started' | 'learning' | 'mastered';

export interface OpeningMove {
  /** Move in SAN notation, e.g. "e4", "Nf3", "Bb5" */
  san: string;
  /** Which side plays this move */
  color: 'w' | 'b';
  /**
   * Strategic explanation for Learn mode.
   * Every move should have an explanation — opponent moves get shorter ones.
   */
  explanation: string;
}

export interface Opening {
  id: string;
  name: string;
  eco: string;
  category: 'White' | 'Black vs e4' | 'Black vs d4';
  /** Which color the user plays when studying this opening */
  userColor: Color;
  difficulty: Difficulty;
  /** Brief description shown on the opening card */
  description: string;
  moves: OpeningMove[];
}

export interface OpeningProgress {
  status: ProgressStatus;
  cleanRuns: number;       // consecutive perfect quiz completions
  quizAttempts: number;
  bestTime: number | null; // ms
  drillBestTime: number | null;
  drillBestStreak: number;
  lastAttempted: string | null; // ISO date
}

export interface StoredProgress {
  version: 1;
  openings: Record<string, OpeningProgress>;
  lastUpdated: string;
}
