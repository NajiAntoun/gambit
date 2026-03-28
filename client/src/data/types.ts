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
  /** Clerk profile picture URL (from Google / social login) */
  imageUrl:    string | null;
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

export interface ForkOption {
  /** First move SAN of this line (e.g. "dxc4" or "e6") */
  san: string;
  /** Short label shown on the card (e.g. "Accepted" / "Declined") */
  label: string;
  /** Flavour badge (e.g. "Pawn grab!" / "Solid & classical") */
  badge: string;
  /** One-sentence strategic preview */
  description: string;
  /** Full continuation starting from this move */
  moves: OpeningMove[];
}

export interface OpeningFork {
  /** Index in opening.moves after which this fork occurs.
   *  The fork overlay fires when the user would advance past this index. */
  afterMoveIndex: number;
  /** Heading shown in the overlay (e.g. "Accept or decline the gambit?") */
  prompt: string;
  options: ForkOption[];
}

/** 1 = niche/rare, 2 = uncommon, 3 = common, 4 = popular, 5 = elite (top-level staple) */
export type Popularity = 1 | 2 | 3 | 4 | 5;

/**
 * A known opponent deviation from the book line.
 * The drill engine plays the deviation and the user must find the punishment.
 */
export interface Deviation {
  /** Index in opening.moves of the opponent move that gets replaced */
  atMoveIndex: number;
  /** The off-book move the opponent plays instead */
  move: string;
  /** Short label for the deviation (e.g. "Early Bg5?!") */
  label: string;
  /** Why this deviation is inaccurate or bad */
  deviationExplanation: string;
  /** The best user response (SAN) */
  correctResponse: string;
  /** Why this response punishes the deviation */
  responseExplanation: string;
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
  /** Approximate year the opening was first played or popularized */
  yearPopularized: number;
  /** How frequently it appears in top-level tournament play */
  popularity: Popularity;
  moves: OpeningMove[];
  /** Optional branching points — accept/decline gambit decisions etc. */
  forks?: OpeningFork[];
  /** Known opponent deviations for Drill mode */
  deviations?: Deviation[];
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
