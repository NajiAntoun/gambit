import { useState, useCallback, useEffect, useRef } from 'react';
import { Chess } from 'chess.js';
import type { Opening, OpeningMove, OpeningFork, ForkOption } from '../data/types';

const STARTING_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

export function useOpeningPlayer(opening: Opening) {
  const [moveIndex, setMoveIndex] = useState(-1);
  const [fen, setFen] = useState(STARTING_FEN);
  const [lastMove, setLastMove] = useState<{ from: string; to: string } | null>(null);
  const [pendingFork, setPendingFork] = useState<OpeningFork | null>(null);

  // activeMoves may diverge from opening.moves once a fork is chosen
  const [activeMoves, setActiveMoves] = useState<OpeningMove[]>(opening.moves);
  const activeMovesRef = useRef<OpeningMove[]>(opening.moves);

  const rebuildPosition = useCallback((targetIndex: number, moves: OpeningMove[]) => {
    const game = new Chess();
    let lm: { from: string; to: string } | null = null;
    for (let i = 0; i <= targetIndex && i < moves.length; i++) {
      const result = game.move(moves[i].san);
      if (result) lm = { from: result.from, to: result.to };
    }
    setFen(game.fen());
    setLastMove(lm);
    setMoveIndex(targetIndex);
  }, []);

  // Reset everything when the opening changes
  useEffect(() => {
    const moves = opening.moves;
    setActiveMoves(moves);
    activeMovesRef.current = moves;
    setPendingFork(null);
    rebuildPosition(-1, moves);
  }, [opening.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const goTo = useCallback(
    (index: number) => {
      const moves = activeMovesRef.current;
      const clamped = Math.max(-1, Math.min(index, moves.length - 1));
      rebuildPosition(clamped, moves);
    },
    [rebuildPosition]
  );

  const next = useCallback(() => {
    const nextIndex = moveIndex + 1;
    if (nextIndex >= activeMovesRef.current.length) return;

    // Check for a fork at the current position before advancing
    const fork = opening.forks?.find(f => f.afterMoveIndex === moveIndex);
    if (fork) {
      setPendingFork(fork);
      return; // Show overlay — don't advance yet
    }

    goTo(nextIndex);
  }, [goTo, moveIndex, opening.forks]);

  const prev = useCallback(() => goTo(moveIndex - 1), [goTo, moveIndex]);

  const reset = useCallback(() => {
    const moves = opening.moves;
    setActiveMoves(moves);
    activeMovesRef.current = moves;
    setPendingFork(null);
    rebuildPosition(-1, moves);
  }, [opening.moves, rebuildPosition]);

  const dismissFork = useCallback(() => setPendingFork(null), []);

  const chooseFork = useCallback(
    (option: ForkOption) => {
      const currentMoves = activeMovesRef.current;
      const newMoves: OpeningMove[] = [
        ...currentMoves.slice(0, moveIndex + 1),
        ...option.moves,
      ];
      setActiveMoves(newMoves);
      activeMovesRef.current = newMoves;
      setPendingFork(null);
      rebuildPosition(moveIndex + 1, newMoves);
    },
    [moveIndex, rebuildPosition]
  );

  const currentMove = moveIndex >= 0 ? activeMoves[moveIndex] : null;
  const isAtStart = moveIndex === -1;
  const isAtEnd = moveIndex === activeMoves.length - 1;

  return {
    moveIndex,
    fen,
    lastMove,
    currentMove,
    activeMoves,
    isAtStart,
    isAtEnd,
    pendingFork,
    next,
    prev,
    reset,
    goTo,
    chooseFork,
    dismissFork,
  };
}
