import { useNavigate, useParams } from 'react-router-dom';
import { getOpeningById } from '../data/openings';
import { useDrillEngine } from '../hooks/useDrillEngine';
import { useProgress } from '../hooks/useProgress';
import { ChessBoard } from '../components/board/ChessBoard';
import { Button } from '../components/shared/Button';
import { BOARD_COLORS } from '../lib/constants';
import type { CSSProperties } from 'react';

function formatTime(ms: number): string {
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  return m > 0 ? `${m}m ${s % 60}s` : `${s}s`;
}

export function Drill() {
  const { openingId } = useParams<{ openingId: string }>();
  const navigate = useNavigate();
  const opening = getOpeningById(openingId ?? '');

  if (!opening) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 16px', color: 'var(--color-text-muted)' }}>
        Opening not found.{' '}
        <button onClick={() => navigate('/')} style={{ color: 'var(--color-gold)', background: 'none', border: 'none', cursor: 'pointer' }}>
          Go back
        </button>
      </div>
    );
  }

  if (!opening.deviations?.length) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 16px', color: 'var(--color-text-muted)' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚡</div>
        <p style={{ fontSize: '16px', fontWeight: 600, color: 'var(--color-text)', marginBottom: '8px' }}>
          No deviations yet
        </p>
        <p style={{ marginBottom: '24px' }}>
          Deviation drills for {opening.name} are coming soon.
        </p>
        <Button variant="secondary" size="md" onClick={() => navigate(`/mode/${opening.id}`)}>
          ← Back
        </Button>
      </div>
    );
  }

  return <DrillBoard opening={opening} />;
}

function DrillBoard({ opening }: { opening: ReturnType<typeof getOpeningById> & {} }) {
  const navigate = useNavigate();
  const { recordDrillResult } = useProgress();
  const { state, handleMove, nextScenario, restart } = useDrillEngine(opening);
  const { phase, fen, lastMove, currentScenario, scenarios, streak, bestStreak, activeDeviation, startTime, endTime } = state;

  const correctCount = scenarios.filter((s) => s.userResult === 'correct').length;
  const wrongCount = scenarios.filter((s) => s.userResult === 'wrong').length;
  const totalScenarios = scenarios.length;

  // Highlight squares
  const highlightSquares: Record<string, CSSProperties> = {};
  if (phase === 'wrong' && lastMove) {
    highlightSquares[lastMove.from] = { background: BOARD_COLORS.wrongMove };
    highlightSquares[lastMove.to] = { background: BOARD_COLORS.wrongMove };
  }
  if (phase === 'showCorrect' && lastMove) {
    highlightSquares[lastMove.from] = { background: BOARD_COLORS.correctMove };
    highlightSquares[lastMove.to] = { background: BOARD_COLORS.correctMove };
  }

  // Completion screen
  if (phase === 'complete' && endTime) {
    const elapsed = endTime - startTime;
    const score = totalScenarios > 0 ? Math.round((correctCount / totalScenarios) * 100) : 0;
    const allCorrect = wrongCount === 0;
    recordDrillResult(opening.id, bestStreak, elapsed);

    return (
      <div
        style={{
          minHeight: '100svh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px 16px',
          background: 'var(--color-bg-dark)',
        }}
      >
        <div
          style={{
            background: 'var(--color-bg-card)',
            border: '1px solid var(--color-border)',
            borderRadius: '16px',
            padding: '32px 24px',
            maxWidth: '400px',
            width: '100%',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>
            {allCorrect ? '⚡' : score >= 50 ? '💪' : '📖'}
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--color-text)', marginBottom: '4px' }}>
            {allCorrect ? 'Flawless!' : score >= 50 ? 'Good fight!' : 'Keep studying!'}
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '14px', marginBottom: '24px' }}>
            {opening.name} — Deviation Drill
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              gap: '12px',
              marginBottom: '24px',
            }}
          >
            {[
              { label: 'Score', value: `${score}%` },
              { label: 'Streak', value: bestStreak },
              { label: 'Time', value: formatTime(elapsed) },
            ].map(({ label, value }) => (
              <div
                key={label}
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  borderRadius: '8px',
                  padding: '12px 8px',
                }}
              >
                <div style={{ fontSize: '22px', fontWeight: 700, color: 'var(--color-gold)' }}>
                  {value}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                  {label}
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <Button variant="primary" size="lg" onClick={restart} style={{ width: '100%' }}>
              Drill Again
            </Button>
            <Button
              variant="secondary"
              size="md"
              onClick={() => navigate(`/learn/${opening.id}`)}
              style={{ width: '100%' }}
            >
              Review in Learn Mode
            </Button>
            <Button
              variant="ghost"
              size="md"
              onClick={() => navigate('/')}
              style={{ width: '100%' }}
            >
              Choose Another Opening
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const statusMessage = () => {
    if (phase === 'playing') return 'Setting up the position...';
    if (phase === 'deviated') return '⚠️ Your opponent deviated! Find the best response.';
    if (phase === 'correct') return '✓ Correct!';
    if (phase === 'wrong') return '✗ Not quite...';
    if (phase === 'showCorrect') return 'The best response was:';
    return '';
  };

  const statusColor = () => {
    if (phase === 'deviated') return { bg: 'rgba(251,191,36,0.12)', border: 'rgba(251,191,36,0.3)', text: '#fbbf24' };
    if (phase === 'correct') return { bg: 'rgba(74,222,128,0.12)', border: 'rgba(74,222,128,0.25)', text: '#4ade80' };
    if (phase === 'wrong') return { bg: 'rgba(248,113,113,0.15)', border: 'rgba(248,113,113,0.3)', text: '#f87171' };
    if (phase === 'showCorrect') return { bg: 'rgba(96,165,250,0.12)', border: 'rgba(96,165,250,0.25)', text: '#60a5fa' };
    return { bg: 'var(--color-bg-card)', border: 'var(--color-border)', text: 'var(--color-text-muted)' };
  };

  const colors = statusColor();

  return (
    <div style={{ height: '100svh', display: 'flex', flexDirection: 'column', background: 'var(--color-bg-dark)', overflow: 'hidden' }}>
      {/* Top bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '10px 16px',
          borderBottom: '1px solid var(--color-border)',
          background: 'var(--color-bg-card)',
          flexShrink: 0,
        }}
      >
        <button
          onClick={() => navigate(`/mode/${opening.id}`)}
          style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer', fontSize: '18px', padding: '4px', minHeight: '36px', minWidth: '36px' }}
        >
          ←
        </button>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: '15px', color: 'var(--color-text)' }}>{opening.name}</div>
          <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Deviation Drill</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
            {currentScenario + 1} / {totalScenarios}
          </span>
          {streak > 0 && (
            <span style={{ fontSize: '13px', color: '#fbbf24', fontWeight: 600 }}>
              🔥 {streak}
            </span>
          )}
        </div>
      </div>

      {/* Board area */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '12px 16px',
          gap: '12px',
          width: '100%',
          maxWidth: '640px',
          margin: '0 auto',
          minHeight: 0,
        }}
      >
        {/* Status */}
        <div
          style={{
            padding: '8px 16px',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: 500,
            background: colors.bg,
            color: colors.text,
            border: `1px solid ${colors.border}`,
            width: '100%',
            textAlign: 'center',
          }}
        >
          {statusMessage()}
        </div>

        {/* Board */}
        <div style={{ width: '100%', maxWidth: 'min(calc(100svh - 320px), calc(100vw - 2rem), 520px)' }}>
          <ChessBoard
            position={fen === 'start' ? 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1' : fen}
            orientation={opening.userColor}
            interactive={phase === 'deviated'}
            lastMove={lastMove}
            highlightSquares={highlightSquares}
            onMove={handleMove}
          />
        </div>

        {/* Deviation info panel */}
        {activeDeviation && (phase === 'deviated' || phase === 'correct' || phase === 'wrong' || phase === 'showCorrect') && (
          <div
            style={{
              width: '100%',
              background: 'var(--color-bg-card)',
              border: '1px solid var(--color-border)',
              borderRadius: '10px',
              padding: '12px 16px',
              fontSize: '13px',
              lineHeight: 1.5,
            }}
          >
            {phase === 'deviated' && (
              <>
                <div style={{ fontWeight: 700, color: '#fbbf24', marginBottom: '4px', fontSize: '12px', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                  ⚠ {activeDeviation.label}
                </div>
                <p style={{ color: 'var(--color-text-muted)', margin: 0 }}>
                  {activeDeviation.deviationExplanation}
                </p>
              </>
            )}

            {phase === 'correct' && (
              <>
                <div style={{ fontWeight: 700, color: '#4ade80', marginBottom: '4px', fontSize: '12px', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                  ✓ Correct — {activeDeviation.correctResponse}
                </div>
                <p style={{ color: 'var(--color-text)', margin: 0 }}>
                  {activeDeviation.responseExplanation}
                </p>
              </>
            )}

            {(phase === 'wrong' || phase === 'showCorrect') && (
              <>
                <div style={{ fontWeight: 700, color: phase === 'wrong' ? '#f87171' : '#60a5fa', marginBottom: '4px', fontSize: '12px', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                  {phase === 'wrong' ? '✗ Wrong move' : `Best response: ${activeDeviation.correctResponse}`}
                </div>
                <p style={{ color: 'var(--color-text)', margin: 0 }}>
                  {activeDeviation.responseExplanation}
                </p>
              </>
            )}
          </div>
        )}

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: '8px', width: '100%' }}>
          {(phase === 'correct' || phase === 'showCorrect') && (
            <Button
              variant="primary"
              size="md"
              onClick={nextScenario}
              style={{ flex: 1 }}
            >
              {currentScenario + 1 < totalScenarios ? 'Next deviation →' : 'See results'}
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={restart}>
            ↺ Restart
          </Button>
        </div>

        {/* Progress dots */}
        <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
          {scenarios.map((s, i) => (
            <div
              key={i}
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background:
                  s.userResult === 'correct' ? '#4ade80'
                  : s.userResult === 'wrong' ? '#f87171'
                  : i === currentScenario ? 'var(--color-gold)'
                  : 'var(--color-border)',
                transition: 'background 0.2s',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
