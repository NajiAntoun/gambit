import { useState, useCallback } from 'react';

export type PieceTheme = 'spatial' | 'staunty' | 'maestro' | 'governor';

export const PIECE_THEMES: { id: PieceTheme; label: string; description: string }[] = [
  { id: 'spatial',   label: 'Spatial',   description: 'Stylish 3D perspective' },
  { id: 'staunty',   label: 'Staunty',   description: '3D shading, ivory & detailed' },
  { id: 'maestro',   label: 'Maestro',   description: 'Elegant, finely detailed' },
  { id: 'governor',  label: 'Governor',  description: 'Thin, minimalist & clean' },
];

const STORAGE_KEY = 'gambit-piece-theme';
const DEFAULT_THEME: PieceTheme = 'spatial';

function readTheme(): PieceTheme {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && PIECE_THEMES.some((t) => t.id === stored)) return stored as PieceTheme;
  } catch {
    // localStorage unavailable
  }
  return DEFAULT_THEME;
}

export function usePieceTheme() {
  const [theme, setThemeState] = useState<PieceTheme>(readTheme);

  const setTheme = useCallback((t: PieceTheme) => {
    setThemeState(t);
    try {
      localStorage.setItem(STORAGE_KEY, t);
    } catch {
      // ignore
    }
  }, []);

  return { theme, setTheme };
}

/** Read theme without a hook (for contexts that just need the value) */
export function getPieceTheme(): PieceTheme {
  return readTheme();
}
