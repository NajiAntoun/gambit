import { useState, useRef, useCallback } from 'react';
import { Chess, type Move } from 'chess.js';

export interface LastMove {
  from: string;
  to: string;
  san: string;
}

export function useChessGame(initialFen?: string) {
  const gameRef = useRef<Chess>(new Chess(initialFen));
  const [fen, setFen] = useState<string>(gameRef.current.fen());
  const [history, setHistory] = useState<string[]>([]);
  const [lastMove, setLastMove] = useState<LastMove | null>(null);

  const sync = useCallback(() => {
    const game = gameRef.current;
    setFen(game.fen());
    const hist = game.history({ verbose: true });
    setHistory(hist.map((m) => m.san));
    const last = hist[hist.length - 1];
    setLastMove(last ? { from: last.from, to: last.to, san: last.san } : null);
  }, []);

  const makeMove = useCallback(
    (move: string | { from: string; to: string; promotion?: string }): Move | null => {
      try {
        const result = gameRef.current.move(move);
        if (result) sync();
        return result;
      } catch {
        return null;
      }
    },
    [sync]
  );

  const undoMove = useCallback(() => {
    gameRef.current.undo();
    sync();
  }, [sync]);

  const reset = useCallback((fen?: string) => {
    gameRef.current = new Chess(fen);
    sync();
  }, [sync]);

  const loadFen = useCallback((newFen: string) => {
    gameRef.current = new Chess(newFen);
    sync();
  }, [sync]);

  const isLegalMove = useCallback(
    (from: string, to: string): boolean => {
      const moves = gameRef.current.moves({ verbose: true });
      return moves.some((m) => m.from === from && m.to === to);
    },
    []
  );

  return {
    fen,
    history,
    lastMove,
    turn: gameRef.current.turn() as 'w' | 'b',
    isGameOver: gameRef.current.isGameOver(),
    makeMove,
    undoMove,
    reset,
    loadFen,
    isLegalMove,
    game: gameRef.current,
  };
}
