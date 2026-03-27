import { useState, useCallback, useEffect, useRef } from 'react';
import { Chess } from 'chess.js';
import type { Opening } from '../data/types';

export type QuizPhase = 'waiting' | 'correct' | 'wrong' | 'opponent' | 'complete';

export interface QuizState {
  phase: QuizPhase;
  moveIndex: number;         // Next expected move index
  fen: string;
  lastMove: { from: string; to: string } | null;
  correct: number;
  wrong: number;
  wrongSquares: { from: string; to: string } | null;
  startTime: number;
  endTime: number | null;
}

interface UseQuizEngineReturn {
  state: QuizState;
  handleMove: (from: string, to: string) => boolean;
  restart: () => void;
}

function buildState(index: number, moves: Opening['moves']): { fen: string; lastMove: { from: string; to: string } | null } {
  const game = new Chess();
  let lastMove: { from: string; to: string } | null = null;
  for (let i = 0; i < index && i < moves.length; i++) {
    const result = game.move(moves[i].san);
    if (result) lastMove = { from: result.from, to: result.to };
  }
  return { fen: game.fen(), lastMove };
}

export function useQuizEngine(opening: Opening): UseQuizEngineReturn {
  const opponentTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const userColor = opening.userColor === 'white' ? 'w' : 'b';

  const makeInitialState = useCallback((): QuizState => {
    // Find first user move
    const firstUserMove = opening.moves.findIndex((m) => m.color === userColor);
    const startIndex = firstUserMove >= 0 ? firstUserMove : 0;

    // If opening starts with opponent moves, play them first
    const { fen, lastMove } = buildState(startIndex, opening.moves);

    return {
      phase: 'waiting',
      moveIndex: startIndex,
      fen,
      lastMove,
      correct: 0,
      wrong: 0,
      wrongSquares: null,
      startTime: Date.now(),
      endTime: null,
    };
  }, [opening, userColor]);

  const [state, setState] = useState<QuizState>(makeInitialState);

  // Reset when opening changes
  useEffect(() => {
    if (opponentTimerRef.current) clearTimeout(opponentTimerRef.current);
    setState(makeInitialState());
  }, [opening.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const playOpponentMove = useCallback(
    (afterIndex: number) => {
      const nextMove = opening.moves[afterIndex];
      if (!nextMove || nextMove.color === userColor) return;

      setState((prev) => ({ ...prev, phase: 'opponent' }));

      opponentTimerRef.current = setTimeout(() => {
        const { fen: newFen, lastMove } = buildState(afterIndex + 1, opening.moves);
        const nextUserMoveIndex = afterIndex + 1;
        const isComplete = nextUserMoveIndex >= opening.moves.length;

        if (isComplete) {
          setState((prev) => ({
            ...prev,
            phase: 'complete',
            fen: newFen,
            lastMove,
            moveIndex: nextUserMoveIndex,
            endTime: Date.now(),
          }));
        } else {
          const nextIsFinal = nextUserMoveIndex === opening.moves.length - 1;
          const moreOpponent = opening.moves[nextUserMoveIndex]?.color !== userColor;

          if (moreOpponent) {
            // Chain: play next opponent move too
            setState((prev) => ({
              ...prev,
              fen: newFen,
              lastMove,
              moveIndex: nextUserMoveIndex,
              phase: 'waiting',
            }));
            playOpponentMove(nextUserMoveIndex);
          } else {
            setState((prev) => ({
              ...prev,
              phase: nextIsFinal && opening.moves[nextUserMoveIndex].color !== userColor ? 'complete' : 'waiting',
              fen: newFen,
              lastMove,
              moveIndex: nextUserMoveIndex,
              wrongSquares: null,
            }));
          }
        }
      }, 500);
    },
    [opening.moves, userColor]
  );

  const handleMove = useCallback(
    (from: string, to: string): boolean => {
      const { moveIndex, phase } = state;
      if (phase !== 'waiting') return false;

      const expected = opening.moves[moveIndex];
      if (!expected || expected.color !== userColor) return false;

      // Attempt the move on a fresh game to get SAN
      const { fen } = buildState(moveIndex, opening.moves);
      const game = new Chess(fen);
      const result = game.move({ from, to, promotion: 'q' });
      if (!result) return false;

      const isCorrect = result.san === expected.san;

      if (isCorrect) {
        const newFen = game.fen();
        const nextIndex = moveIndex + 1;
        const isComplete = nextIndex >= opening.moves.length;

        setState((prev) => ({
          ...prev,
          phase: isComplete ? 'complete' : 'correct',
          fen: newFen,
          lastMove: { from, to },
          correct: prev.correct + 1,
          moveIndex: nextIndex,
          wrongSquares: null,
          endTime: isComplete ? Date.now() : null,
        }));

        if (!isComplete) {
          opponentTimerRef.current = setTimeout(() => {
            playOpponentMove(nextIndex);
          }, 300);
        }

        return true;
      } else {
        // Wrong move: show it briefly then revert
        setState((prev) => ({
          ...prev,
          phase: 'wrong',
          fen: game.fen(),
          lastMove: { from, to },
          wrong: prev.wrong + 1,
          wrongSquares: { from, to },
        }));

        opponentTimerRef.current = setTimeout(() => {
          // Revert: show correct move highlighted, then wait
          const correctGame = new Chess(fen);
          const correctResult = correctGame.move(expected.san);
          const correctFen = correctGame.fen();
          const correctMove = correctResult ? { from: correctResult.from, to: correctResult.to } : null;

          setState((prev) => ({
            ...prev,
            phase: 'correct', // show correct move
            fen: correctFen,
            lastMove: correctMove,
            wrongSquares: null,
            moveIndex: moveIndex + 1,
          }));

          const nextIndex = moveIndex + 1;
          const isComplete = nextIndex >= opening.moves.length;
          if (isComplete) {
            setState((prev) => ({ ...prev, phase: 'complete', endTime: Date.now() }));
          } else {
            opponentTimerRef.current = setTimeout(() => {
              playOpponentMove(nextIndex);
            }, 600);
          }
        }, 800);

        return false;
      }
    },
    [state, opening.moves, userColor, playOpponentMove]
  );

  const restart = useCallback(() => {
    if (opponentTimerRef.current) clearTimeout(opponentTimerRef.current);
    setState(makeInitialState());
  }, [makeInitialState]);

  return { state, handleMove, restart };
}
