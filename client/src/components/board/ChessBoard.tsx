import { Chessboard } from 'react-chessboard';
import type { CSSProperties } from 'react';
import { BOARD_COLORS } from '../../lib/constants';

interface ChessBoardProps {
  position: string;
  orientation?: 'white' | 'black';
  interactive?: boolean;
  lastMove?: { from: string; to: string } | null;
  highlightSquares?: Record<string, CSSProperties>;
  onMove?: (from: string, to: string, piece: string) => boolean;
  animationDuration?: number;
}

export function ChessBoard({
  position,
  orientation = 'white',
  interactive = false,
  lastMove = null,
  highlightSquares = {},
  onMove,
  animationDuration = 200,
}: ChessBoardProps) {
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
