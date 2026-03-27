import { useState, useCallback, useEffect } from 'react';
import { Chess } from 'chess.js';
import type { Opening } from '../data/types';

export function useOpeningPlayer(opening: Opening) {
  const [moveIndex, setMoveIndex] = useState(-1); // -1 = starting position
  const [fen, setFen] = useState('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
  const [lastMove, setLastMove] = useState<{ from: string; to: string } | null>(null);

  const rebuildPosition = useCallback(
    (targetIndex: number) => {
      const game = new Chess();
      let lm: { from: string; to: string } | null = null;
      for (let i = 0; i <= targetIndex && i < opening.moves.length; i++) {
        const result = game.move(opening.moves[i].san);
        if (result) lm = { from: result.from, to: result.to };
      }
      setFen(game.fen());
      setLastMove(lm);
      setMoveIndex(targetIndex);
    },
    [opening.moves]
  );

  // Reset when opening changes
  useEffect(() => {
    rebuildPosition(-1);
  }, [opening.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const goTo = useCallback(
    (index: number) => {
      const clamped = Math.max(-1, Math.min(index, opening.moves.length - 1));
      rebuildPosition(clamped);
    },
    [opening.moves.length, rebuildPosition]
  );

  const next = useCallback(() => goTo(moveIndex + 1), [goTo, moveIndex]);
  const prev = useCallback(() => goTo(moveIndex - 1), [goTo, moveIndex]);
  const reset = useCallback(() => goTo(-1), [goTo]);

  const currentMove = moveIndex >= 0 ? opening.moves[moveIndex] : null;
  const isAtStart = moveIndex === -1;
  const isAtEnd = moveIndex === opening.moves.length - 1;

  return {
    moveIndex,
    fen,
    lastMove,
    currentMove,
    isAtStart,
    isAtEnd,
    next,
    prev,
    reset,
    goTo,
  };
}
