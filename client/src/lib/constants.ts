export const COLORS = {
  bgDark: '#0f1a0f',
  bgCard: '#1a2e1a',
  brown: '#4a3728',
  gold: '#c9a84c',
  goldLight: '#e4c46e',
  boardDark: '#4a7c59',
  boardLight: '#f0d9b5',
  text: '#e8dcc8',
  textMuted: '#9a8a6a',
  border: '#2d4a2d',
} as const;

export const BOARD_COLORS = {
  darkSquare: COLORS.boardDark,
  lightSquare: COLORS.boardLight,
  lastMoveDark: 'rgba(201, 168, 76, 0.5)',
  lastMoveLight: 'rgba(201, 168, 76, 0.4)',
  selectedSquare: 'rgba(201, 168, 76, 0.7)',
  wrongMove: 'rgba(220, 50, 50, 0.6)',
  correctMove: 'rgba(50, 200, 80, 0.6)',
} as const;

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const MASTERY_CLEAN_RUNS = 3;
