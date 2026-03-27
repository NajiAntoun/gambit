export type Color = 'white' | 'black';
export type ChessLevel = 'beginner' | 'intermediate' | 'advanced';
export type PreferredColor = 'white' | 'black' | 'both';
export type Goal = 'casual' | 'tournament' | 'rating';
export type Gender = 'male' | 'female' | 'nonbinary' | 'prefer_not_to_say';
export type ChessTitle = 'GM' | 'IM' | 'FM' | 'CM' | 'NM' | 'WGM' | 'WIM' | 'WFM' | 'WCM';

export interface Account {
  displayName:      string | null;
  chessLevel:       ChessLevel | null;
  preferredColor:   PreferredColor | null;
  goal:             Goal | null;
  birthYear:        number | null;
  country:          string | null;
  gender:           Gender | null;
  chessTitle:       ChessTitle | null;
  fideId:           string | null;
  fideRating:       number | null;
  chessComUsername: string | null;
  chessComRapid:    number | null;
  chessComBlitz:    number | null;
  chessComBullet:   number | null;
  lichessUsername:  string | null;
  lichessRapid:     number | null;
  lichessBlitz:     number | null;
  lichessBullet:    number | null;
}

export interface OnlineUser {
  displayName: string | null;
  country:     string | null;
  gender:      string | null;
  chessLevel:  string | null;
  /** Best available rating: FIDE → platform rapid → platform blitz → null */
  rating:      number | null;
}
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
  category: 'White Openings' | "Black vs King's Pawn (e4)" | "Black vs Queen's Pawn (d4)";
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
