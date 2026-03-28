import { useState, useCallback, useEffect, useRef } from 'react';
import { Chess } from 'chess.js';
import type { Opening, Deviation } from '../data/types';

export type DrillPhase =
  | 'playing'        // Auto-playing the main line
  | 'deviated'       // Opponent just deviated — user's turn
  | 'correct'        // User found the right response
  | 'wrong'          // User played the wrong response
  | 'showCorrect'    // Showing the correct response after wrong
  | 'complete';      // All scenarios done

export interface DrillScenario {
  deviation: Deviation;
  userResult: 'correct' | 'wrong' | null;
}

export interface DrillState {
  phase: DrillPhase;
  fen: string;
  lastMove: { from: string; to: string } | null;
  currentScenario: number;      // Index in shuffled scenarios
  scenarios: DrillScenario[];
  streak: number;               // Consecutive correct responses
  bestStreak: number;
  startTime: number;
  endTime: number | null;
  /** The deviation being shown (for explanation display) */
  activeDeviation: Deviation | null;
  /** Whether user's last response was correct (for showing explanation) */
  lastWasCorrect: boolean | null;
}

function buildPosition(moves: string[]): { fen: string; lastMove: { from: string; to: string } | null } {
  const game = new Chess();
  let lastMove: { from: string; to: string } | null = null;
  for (const san of moves) {
    const result = game.move(san);
    if (!result) break;
    lastMove = { from: result.from, to: result.to };
  }
  return { fen: game.fen(), lastMove };
}

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function useDrillEngine(opening: Opening) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const playingRef = useRef(false);

  const makeInitialState = useCallback((): DrillState => {
    const deviations = opening.deviations ?? [];
    const scenarios: DrillScenario[] = shuffleArray(deviations).map((d) => ({
      deviation: d,
      userResult: null,
    }));
    return {
      phase: scenarios.length > 0 ? 'playing' : 'complete',
      fen: 'start',
      lastMove: null,
      currentScenario: 0,
      scenarios,
      streak: 0,
      bestStreak: 0,
      startTime: Date.now(),
      endTime: null,
      activeDeviation: null,
      lastWasCorrect: null,
    };
  }, [opening]);

  const [state, setState] = useState<DrillState>(makeInitialState);

  // Keep a ref to scenarios so async callbacks always read the latest
  const scenariosRef = useRef(state.scenarios);
  scenariosRef.current = state.scenarios;

  // Reset when opening changes
  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    playingRef.current = false;
    setState(makeInitialState());
  }, [opening.id]); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-play the main line up to the deviation point
  const playToDeviation = useCallback(
    (scenarioIndex: number) => {
      // Read from ref to avoid stale closure after restart
      const scenario = scenariosRef.current[scenarioIndex];
      if (!scenario) return;

      const dev = scenario.deviation;
      const mainMoveSans = opening.moves.slice(0, dev.atMoveIndex).map((m) => m.san);

      playingRef.current = true;
      let moveIdx = 0;

      const playNext = () => {
        if (!playingRef.current) return;

        if (moveIdx < mainMoveSans.length) {
          const movesPlayed = mainMoveSans.slice(0, moveIdx + 1);
          const { fen, lastMove } = buildPosition(movesPlayed);
          setState((prev) => ({ ...prev, fen, lastMove, phase: 'playing' }));
          moveIdx++;
          timerRef.current = setTimeout(playNext, 400);
        } else {
          // Play the deviation move
          const allMovesBeforeDev = mainMoveSans;
          const { fen: preFen } = buildPosition(allMovesBeforeDev);
          const game = new Chess(preFen);
          const devResult = game.move(dev.move);

          if (devResult) {
            timerRef.current = setTimeout(() => {
              setState((prev) => ({
                ...prev,
                fen: game.fen(),
                lastMove: { from: devResult.from, to: devResult.to },
                phase: 'deviated',
                activeDeviation: dev,
                lastWasCorrect: null,
              }));
              playingRef.current = false;
            }, 600);
          }
        }
      };

      // Start from the beginning with a brief delay
      if (mainMoveSans.length === 0) {
        // Deviation is at the very start — just play the deviation move
        const game = new Chess();
        const devResult = game.move(dev.move);
        if (devResult) {
          setState((prev) => ({
            ...prev,
            fen: game.fen(),
            lastMove: { from: devResult.from, to: devResult.to },
            phase: 'deviated',
            activeDeviation: dev,
            lastWasCorrect: null,
          }));
        }
      } else {
        timerRef.current = setTimeout(playNext, 300);
      }
    },
    [opening.moves]
  );

  // Start playing when we enter a new scenario
  useEffect(() => {
    if (state.phase === 'playing' && !playingRef.current && state.scenarios.length > 0) {
      playToDeviation(state.currentScenario);
    }
  }, [state.phase, state.currentScenario]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleMove = useCallback(
    (from: string, to: string): boolean => {
      if (state.phase !== 'deviated') return false;

      const scenario = state.scenarios[state.currentScenario];
      if (!scenario) return false;

      const dev = scenario.deviation;

      // Build position: main line up to deviation, then deviation move
      const mainMoveSans = opening.moves.slice(0, dev.atMoveIndex).map((m) => m.san);
      const { fen: preFen } = buildPosition(mainMoveSans);
      const setupGame = new Chess(preFen);
      setupGame.move(dev.move);

      // Now try the user's move
      const game = new Chess(setupGame.fen());
      const result = game.move({ from, to, promotion: 'q' });
      if (!result) return false;

      const isCorrect = result.san === dev.correctResponse;

      if (isCorrect) {
        const newStreak = state.streak + 1;
        const newBest = Math.max(state.bestStreak, newStreak);
        const updatedScenarios = [...state.scenarios];
        updatedScenarios[state.currentScenario] = { ...scenario, userResult: 'correct' };

        setState((prev) => ({
          ...prev,
          phase: 'correct',
          fen: game.fen(),
          lastMove: { from, to },
          streak: newStreak,
          bestStreak: newBest,
          scenarios: updatedScenarios,
          lastWasCorrect: true,
        }));
        return true;
      } else {
        const updatedScenarios = [...state.scenarios];
        updatedScenarios[state.currentScenario] = { ...scenario, userResult: 'wrong' };

        // Show the wrong move briefly
        setState((prev) => ({
          ...prev,
          phase: 'wrong',
          fen: game.fen(),
          lastMove: { from, to },
          streak: 0,
          scenarios: updatedScenarios,
          lastWasCorrect: false,
        }));

        // After delay, show the correct move
        timerRef.current = setTimeout(() => {
          const correctGame = new Chess(setupGame.fen());
          const correctResult = correctGame.move(dev.correctResponse);
          if (correctResult) {
            setState((prev) => ({
              ...prev,
              phase: 'showCorrect',
              fen: correctGame.fen(),
              lastMove: { from: correctResult.from, to: correctResult.to },
            }));
          }
        }, 800);

        return false;
      }
    },
    [state, opening.moves]
  );

  const nextScenario = useCallback(() => {
    const next = state.currentScenario + 1;
    if (next >= state.scenarios.length) {
      setState((prev) => ({
        ...prev,
        phase: 'complete',
        endTime: Date.now(),
        activeDeviation: null,
      }));
    } else {
      playingRef.current = false;
      setState((prev) => ({
        ...prev,
        phase: 'playing',
        currentScenario: next,
        fen: 'start',
        lastMove: null,
        activeDeviation: null,
        lastWasCorrect: null,
      }));
    }
  }, [state.currentScenario, state.scenarios.length]);

  const restart = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    playingRef.current = false;
    setState(makeInitialState());
  }, [makeInitialState]);

  return { state, handleMove, nextScenario, restart };
}
