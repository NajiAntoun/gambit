import { useMemo } from 'react';
import { Chess } from 'chess.js';
import type { OpeningMove } from '../../data/types';

interface MiniBoardProps {
  moves: OpeningMove[];
  /** How many moves to play to reach the characteristic position (default: all) */
  depth?: number;
  /** SVG size in px (default: 80) */
  size?: number;
}

/**
 * Renders a tiny, abstract chess position as faint green lines and dots.
 * Designed to sit behind card text as a subtle watermark.
 */
export function MiniBoard({ moves, depth, size = 80 }: MiniBoardProps) {
  const board = useMemo(() => {
    try {
      const game = new Chess();
      const n = depth ?? moves.length;
      for (let i = 0; i < n && i < moves.length; i++) {
        if (!game.move(moves[i].san)) break;
      }
      return game.board(); // 8x8 array of { type, color } | null
    } catch {
      return new Chess().board(); // fallback to starting position
    }
  }, [moves, depth]);

  const cell = size / 8;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{ display: 'block' }}
      aria-hidden
    >
      {/* Grid lines */}
      {Array.from({ length: 9 }, (_, i) => (
        <g key={i}>
          <line
            x1={i * cell} y1={0} x2={i * cell} y2={size}
            stroke="currentColor" strokeWidth={0.5} opacity={0.15}
          />
          <line
            x1={0} y1={i * cell} x2={size} y2={i * cell}
            stroke="currentColor" strokeWidth={0.5} opacity={0.15}
          />
        </g>
      ))}

      {/* Pieces */}
      {board.flatMap((row, r) =>
        row.map((sq, c) => {
          if (!sq) return null;
          const cx = c * cell + cell / 2;
          const cy = r * cell + cell / 2;
          const isWhite = sq.color === 'w';
          const isPawn = sq.type === 'p';

          return (
            <circle
              key={`${r}-${c}`}
              cx={cx}
              cy={cy}
              r={isPawn ? cell * 0.22 : cell * 0.32}
              fill="none"
              stroke="currentColor"
              strokeWidth={isPawn ? 0.8 : 1.2}
              opacity={isWhite ? 0.35 : 0.2}
            />
          );
        })
      )}
    </svg>
  );
}
