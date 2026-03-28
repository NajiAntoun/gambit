import { Chessboard } from 'react-chessboard';
import { useMemo } from 'react';
import type { CSSProperties } from 'react';
import { BOARD_COLORS } from '../../lib/constants';
import { getPieceTheme } from '../../hooks/usePieceTheme';
import type { PieceTheme } from '../../hooks/usePieceTheme';

interface ChessBoardProps {
  position: string;
  orientation?: 'white' | 'black';
  interactive?: boolean;
  lastMove?: { from: string; to: string } | null;
  highlightSquares?: Record<string, CSSProperties>;
  onMove?: (from: string, to: string, piece: string) => boolean;
  animationDuration?: number;
  /** Override the user's stored piece theme */
  pieceTheme?: PieceTheme;
}

/** Piece keys used by react-chessboard */
const PIECE_KEYS = ['wP','wR','wN','wB','wQ','wK','bP','bR','bN','bB','bQ','bK'] as const;

function buildCustomPieces(theme: PieceTheme) {
  const pieces: Record<string, () => React.JSX.Element> = {};
  for (const key of PIECE_KEYS) {
    const src = `/pieces/${theme}/${key}.svg`;
    pieces[key] = () => (
      <img
        src={src}
        alt={key}
        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
      />
    );
  }
  return pieces;
}

export function ChessBoard({
  position,
  orientation = 'white',
  interactive = false,
  lastMove = null,
  highlightSquares = {},
  onMove,
  animationDuration = 200,
  pieceTheme,
}: ChessBoardProps) {
  const theme = pieceTheme ?? getPieceTheme();
  const customPieces = useMemo(() => buildCustomPieces(theme), [theme]);

  // Build square highlight styles
  const squareStyles: Record<string, CSSProperties> = { ...highlightSquares };

  if (lastMove) {
    squareStyles[lastMove.from] = {
      ...squareStyles[lastMove.from],
      background: BOARD_COLORS.lastMoveDark,
    };
    squareStyles[lastMove.to] = {
      ...squareStyles[lastMove.to],
      background: BOARD_COLORS.lastMoveLight,
    };
  }

  return (
    <div style={{ width: '100%', aspectRatio: '1' }}>
      <Chessboard
        options={{
          position,
          boardOrientation: orientation,
          allowDragging: interactive,
          allowDrawingArrows: false,
          animationDurationInMs: animationDuration,
          darkSquareStyle: { backgroundColor: BOARD_COLORS.darkSquare },
          lightSquareStyle: { backgroundColor: BOARD_COLORS.lightSquare },
          squareStyles,
          pieces: customPieces,
          boardStyle: {
            borderRadius: '4px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
          },
          onPieceDrop: onMove
            ? ({ piece, sourceSquare, targetSquare }) => {
                if (!targetSquare) return false;
                return onMove(sourceSquare, targetSquare, piece.pieceType);
              }
            : undefined,
        }}
      />
    </div>
  );
}
