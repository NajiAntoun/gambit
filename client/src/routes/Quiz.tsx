import { useNavigate, useParams } from 'react-router-dom';
import type { CSSProperties } from 'react';
import { getOpeningById } from '../data/openings';
import { useQuizEngine } from '../hooks/useQuizEngine';
import { useProgress } from '../hooks/useProgress';
import { ChessBoard } from '../components/board/ChessBoard';
import { Button } from '../components/shared/Button';
import { BOARD_COLORS } from '../lib/constants';

function formatTime(ms: number): string {
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  return m > 0 ? `${m}m ${s % 60}s` : `${s}s`;
}

export function Quiz() {
  const { openingId } = useParams<{ openingId: string }>();
  const navigate = useNavigate();
  const { recordQuizResult } = useProgress();
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

  const { state, handleMove, restart } = useQuizEngine(opening);
  const { phase, fen, lastMove, wrongSquares, correct, wrong, startTime, endTime, moveIndex } = state;

  const total = correct + wrong;
  const score = total > 0 ? Math.round((correct / total) * 100) : 100;
  const userMoves = opening.moves.filter(
    (m) => m.color === (opening.userColor === 'white' ? 'w' : 'b')
  ).length;
  const isPerfect = wrong === 0;

  // Highlight squares
  const highlightSquares: Record<string, CSSProperties> = {};
  if (phase === 'wrong' && wrongSquares) {
    highlightSquares[wrongSquares.from] = { background: BOARD_COLORS.wrongMove };
    highlightSquares[wrongSquares.to] = { background: BOARD_COLORS.wrongMove };
  }

  // Handle session complete
  if (phase === 'complete' && endTime) {
    const elapsed = endTime - startTime;
    recordQuizResult(opening.id, isPerfect, elapsed);

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
            {isPerfect ? '🏆' : score >= 70 ? '✅' : '📚'}
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--color-text)', marginBottom: '4px' }}>
            {isPerfect ? 'Perfect!' : 'Good effort!'}
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '14px', marginBottom: '24px' }}>
            {opening.name}
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
              { label: 'Correct', value: correct },
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

          {!isPerfect && (
            <p style={{ color: 'var(--color-text-muted)', fontSize: '13px', marginBottom: '20px', lineHeight: 1.5 }}>
              {wrong} move{wrong !== 1 ? 's' : ''} needed correction. Keep practicing to master this opening!
            </p>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <Button variant="primary" size="lg" onClick={restart} style={{ width: '100%' }}>
              Try Again
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
    if (phase === 'opponent') return "Opponent is moving...";
    if (phase === 'wrong') return "Not quite — showing correct move";
    if (phase === 'correct') return "Correct! ✓";
    if (moveIndex >= opening.moves.length) return "Complete!";
    const expected = opening.moves[moveIndex];
    if (!expected) return '';
    return opening.userColor === 'white' ? 'Your turn — find the best move for White' : 'Your turn — find the best move for Black';
  };

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
          <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Quiz Mode</div>
        </div>
        {/* Score */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '13px', color: '#4ade80', fontWeight: 600 }}>{correct} ✓</span>
          {wrong > 0 && <span style={{ fontSize: '13px', color: '#f87171', fontWeight: 600 }}>{wrong} ✗</span>}
        </div>
      </div>

      {/* Board area — fills remaining height */}
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
            background:
              phase === 'wrong'
                ? 'rgba(248,113,113,0.15)'
                : phase === 'correct'
                ? 'rgba(74,222,128,0.12)'
                : 'var(--color-bg-card)',
            color:
              phase === 'wrong'
                ? '#f87171'
                : phase === 'correct'
                ? '#4ade80'
                : 'var(--color-text-muted)',
            border:
              phase === 'wrong'
                ? '1px solid rgba(248,113,113,0.3)'
                : phase === 'correct'
                ? '1px solid rgba(74,222,128,0.25)'
                : '1px solid var(--color-border)',
            width: '100%',
            textAlign: 'center',
          }}
        >
          {statusMessage()}
        </div>

        {/* Board — constrained so progress + restart stay visible */}
        <div style={{ width: '100%', maxWidth: 'min(calc(100svh - 220px), calc(100vw - 2rem), 520px)' }}>
          <ChessBoard
            position={fen}
            orientation={opening.userColor}
            interactive={phase === 'waiting'}
            lastMove={lastMove}
            highlightSquares={highlightSquares}
            onMove={handleMove}
          />
        </div>

        {/* Progress bar */}
        <div style={{ width: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
            <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Progress</span>
            <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
              {Math.min(moveIndex, userMoves)} / {userMoves} moves
            </span>
          </div>
          <div style={{ height: '4px', background: 'var(--color-border)', borderRadius: '99px', overflow: 'hidden' }}>
            <div
              style={{
                height: '100%',
                width: `${(Math.min(moveIndex, userMoves) / userMoves) * 100}%`,
                background: 'var(--color-gold)',
                borderRadius: '99px',
                transition: 'width 0.3s',
              }}
            />
          </div>
        </div>

        <Button variant="ghost" size="sm" onClick={restart}>
          ↺ Restart
        </Button>
      </div>
    </div>
  );
}
