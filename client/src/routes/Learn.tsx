import { useRef, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getOpeningById } from '../data/openings';
import { useOpeningPlayer } from '../hooks/useOpeningPlayer';
import { useAskGambit } from '../hooks/useAskGambit';
import { ChessBoard } from '../components/board/ChessBoard';
import { Button } from '../components/shared/Button';
import { ForkOverlay } from '../components/learn/ForkOverlay';

export function Learn() {
  const { openingId } = useParams<{ openingId: string }>();
  const navigate = useNavigate();
  const opening = getOpeningById(openingId ?? '');
  const [showAiPanel, setShowAiPanel] = useState(false);
  const activeRef = useRef<HTMLButtonElement>(null);

  const { moveIndex, fen, lastMove, currentMove, activeMoves, isAtStart, isAtEnd, pendingFork, next, prev, reset, goTo, chooseFork, dismissFork } =
    useOpeningPlayer(opening!);

  const { explanation: aiExplanation, loading: aiLoading, source: aiSource, ask, reset: resetAi } =
    useAskGambit();

  useEffect(() => {
    activeRef.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }, [moveIndex]);

  useEffect(() => {
    setShowAiPanel(false);
    resetAi();
  }, [moveIndex]); // eslint-disable-line react-hooks/exhaustive-deps

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

  const handleAskGambit = async () => {
    if (!currentMove) return;
    setShowAiPanel(true);
    await ask({
      fen,
      opening: opening.name,
      move: currentMove.san,
      moveNumber: moveIndex + 1,
      context: 'learn',
      staticExplanation: currentMove.explanation,
    });
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--color-bg-dark)', overflow: 'hidden' }}>
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
          style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer', fontSize: '18px', padding: '4px', lineHeight: 1, minHeight: '36px', minWidth: '36px' }}
        >
          ←
        </button>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: '15px', color: 'var(--color-text)' }}>{opening.name}</div>
          <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Learn Mode</div>
        </div>
        <div style={{ fontSize: '13px', color: 'var(--color-text-muted)', fontVariantNumeric: 'tabular-nums' }}>
          {moveIndex + 1} / {activeMoves.length}
        </div>
      </div>

      {/* Two-column body */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'row',
          overflow: 'hidden',
          minHeight: 0,
        }}
      >
        {/* Left: board + controls */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
            gap: '12px',
            flexShrink: 0,
            // Board column: give the board more room (60% of viewport, up to 600px)
            width: 'min(calc(100svh - 120px), 60vw, 600px)',
          }}
        >
          <div style={{ width: '100%' }}>
            <ChessBoard
              position={fen}
              orientation={opening.userColor}
              lastMove={lastMove}
              interactive={false}
            />
          </div>

          {/* Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Button variant="secondary" size="sm" onClick={reset} disabled={isAtStart}>
              ⟪ Reset
            </Button>
            <Button variant="secondary" size="md" onClick={prev} disabled={isAtStart}>
              ← Prev
            </Button>
            {(() => {
              const hasFork = opening.forks?.some(f => f.afterMoveIndex === moveIndex);
              const disableNext = isAtEnd && !hasFork;
              return (
                <Button variant={disableNext ? 'ghost' : 'primary'} size="md" onClick={next} disabled={disableNext}>
                  {hasFork ? '⑂ Choose line' : 'Next →'}
                </Button>
              );
            })()}
          </div>

          {isAtEnd && (
            <Button variant="primary" size="md" onClick={() => navigate(`/quiz/${opening.id}`)}>
              Try the Quiz →
            </Button>
          )}
        </div>

        {/* Right: move list + explanation */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            padding: '16px 16px 16px 0',
            gap: '12px',
            overflowY: 'auto',
            minWidth: 0,
            // Hide on very small screens (handled by media-equivalent check)
          }}
        >
          {/* Move list */}
          <div
            style={{
              background: 'var(--color-bg-card)',
              border: '1px solid var(--color-border)',
              borderRadius: '10px',
              padding: '10px 12px',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '2px 4px',
              flexShrink: 0,
            }}
          >
            <div style={{ width: '100%', fontSize: '11px', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: '6px' }}>
              Moves
            </div>
            {activeMoves.map((move, i) => {
              const isUserMove = move.color === (opening.userColor === 'white' ? 'w' : 'b');
              const isActive = i === moveIndex;
              const moveNum = Math.floor(i / 2) + 1;
              const showNumber = i % 2 === 0;
              return (
                <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: '1px' }}>
                  {showNumber && (
                    <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', minWidth: '18px' }}>
                      {moveNum}.
                    </span>
                  )}
                  <button
                    ref={isActive ? activeRef : undefined}
                    onClick={() => goTo(i)}
                    style={{
                      background: isActive ? 'var(--color-gold)' : 'transparent',
                      color: isActive ? '#0f1a0f' : isUserMove ? 'var(--color-text)' : 'var(--color-text-muted)',
                      border: 'none',
                      borderRadius: '4px',
                      padding: '2px 5px',
                      fontSize: '13px',
                      fontWeight: isActive ? 700 : 400,
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                      minHeight: '28px',
                    }}
                  >
                    {move.san}
                  </button>
                </span>
              );
            })}
          </div>

          {/* Explanation panel */}
          {currentMove ? (
            <div
              style={{
                background: 'var(--color-bg-card)',
                border: '1px solid var(--color-border)',
                borderRadius: '10px',
                padding: '16px',
                flex: 1,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', marginBottom: '10px' }}>
                <div>
                  <span style={{ fontSize: '20px', fontWeight: 700, color: 'var(--color-gold)', marginRight: '8px' }}>
                    {currentMove.san}
                  </span>
                  <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                    {currentMove.color === (opening.userColor === 'white' ? 'w' : 'b') ? 'Your move' : "Opponent's move"}
                  </span>
                </div>
                {!showAiPanel && (
                  <button
                    onClick={handleAskGambit}
                    style={{
                      background: 'rgba(201,168,76,0.1)',
                      border: '1px solid rgba(201,168,76,0.3)',
                      borderRadius: '8px',
                      padding: '6px 12px',
                      color: 'var(--color-gold)',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      flexShrink: 0,
                      whiteSpace: 'nowrap',
                      minHeight: '36px',
                    }}
                  >
                    Ask Gambit ✨
                  </button>
                )}
              </div>
              <p style={{ color: 'var(--color-text)', fontSize: '14px', lineHeight: 1.65, margin: 0 }}>
                {currentMove.explanation}
              </p>

              {showAiPanel && (
                <div
                  style={{
                    marginTop: '14px',
                    padding: '12px',
                    background: 'rgba(201,168,76,0.06)',
                    border: '1px solid rgba(201,168,76,0.2)',
                    borderRadius: '8px',
                  }}
                >
                  <div style={{ fontSize: '12px', color: 'var(--color-gold)', fontWeight: 600, marginBottom: '6px' }}>
                    {aiLoading ? '⏳ Gambit is thinking...' : aiSource === 'ai' ? '✨ Gambit says:' : '📖 Gambit says:'}
                  </div>
                  {aiLoading ? (
                    <div style={{ color: 'var(--color-text-muted)', fontSize: '14px' }}>…</div>
                  ) : (
                    <p style={{ color: 'var(--color-text)', fontSize: '14px', lineHeight: 1.65, margin: 0 }}>
                      {aiExplanation}
                    </p>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div
              style={{
                background: 'var(--color-bg-card)',
                border: '1px solid var(--color-border)',
                borderRadius: '10px',
                padding: '24px 16px',
                textAlign: 'center',
                color: 'var(--color-text-muted)',
                fontSize: '14px',
                lineHeight: 1.6,
                flex: 1,
              }}
            >
              Press <strong style={{ color: 'var(--color-gold)' }}>Next →</strong> to start learning {opening.name}.
            </div>
          )}
        </div>
      </div>

      {/* Fork overlay — fires when the user presses Next at a branching point */}
      {pendingFork && (
        <ForkOverlay
          fork={pendingFork}
          onChoose={chooseFork}
          onDismiss={dismissFork}
        />
      )}
    </div>
  );
}
