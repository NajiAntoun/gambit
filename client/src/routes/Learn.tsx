import { useRef, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getOpeningById } from '../data/openings';
import { useOpeningPlayer } from '../hooks/useOpeningPlayer';
import { useAskGambit } from '../hooks/useAskGambit';
import { ChessBoard } from '../components/board/ChessBoard';
import { Button } from '../components/shared/Button';

export function Learn() {
  const { openingId } = useParams<{ openingId: string }>();
  const navigate = useNavigate();
  const opening = getOpeningById(openingId ?? '');
  const [showAiPanel, setShowAiPanel] = useState(false);
  const moveListRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLButtonElement>(null);

  const { moveIndex, fen, lastMove, currentMove, isAtStart, isAtEnd, next, prev, reset, goTo } =
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
    <div style={{ minHeight: '100svh', display: 'flex', flexDirection: 'column', background: 'var(--color-bg-dark)' }}>
      {/* Top bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '12px 16px',
          borderBottom: '1px solid var(--color-border)',
          background: 'var(--color-bg-card)',
        }}
      >
        <button
          onClick={() => navigate(`/mode/${opening.id}`)}
          style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer', fontSize: '18px', padding: 0, lineHeight: 1 }}
        >
          ←
        </button>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: '15px', color: 'var(--color-text)' }}>{opening.name}</div>
          <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Learn Mode</div>
        </div>
        <div style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>
          {moveIndex + 1} / {opening.moves.length}
        </div>
      </div>

      {/* Main layout: board + side panel */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '16px',
          gap: '16px',
          maxWidth: '1000px',
          margin: '0 auto',
          width: '100%',
        }}
      >
        {/* Board */}
        <div className="flex justify-center w-full">
          <ChessBoard
            position={fen}
            orientation={opening.userColor}
            lastMove={lastMove}
            interactive={false}
          />
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3 justify-center flex-wrap">
          <Button variant="secondary" size="sm" onClick={reset} disabled={isAtStart}>
            ⟪ Reset
          </Button>
          <Button variant="secondary" size="md" onClick={prev} disabled={isAtStart}>
            ← Prev
          </Button>
          <Button variant={isAtEnd ? 'ghost' : 'primary'} size="md" onClick={next} disabled={isAtEnd}>
            Next →
          </Button>
        </div>

        {/* Move list */}
        <div
          ref={moveListRef}
          style={{
            width: '100%',
            background: 'var(--color-bg-card)',
            border: '1px solid var(--color-border)',
            borderRadius: '10px',
            padding: '12px',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '4px',
            maxHeight: '120px',
            overflowY: 'auto',
          }}
        >
          {opening.moves.map((move, i) => {
            const isUserMove = move.color === (opening.userColor === 'white' ? 'w' : 'b');
            const isActive = i === moveIndex;
            const moveNum = Math.floor(i / 2) + 1;
            const showNumber = i % 2 === 0;
            return (
              <span key={i} style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                {showNumber && (
                  <span style={{ fontSize: '12px', color: 'var(--color-text-muted)', minWidth: '20px' }}>
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
                    padding: '2px 6px',
                    fontSize: '13px',
                    fontWeight: isActive ? 700 : 400,
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                  }}
                >
                  {move.san}
                </button>
              </span>
            );
          })}
        </div>

        {/* Explanation panel */}
        {currentMove && (
          <div
            style={{
              width: '100%',
              background: 'var(--color-bg-card)',
              border: '1px solid var(--color-border)',
              borderRadius: '10px',
              padding: '16px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', marginBottom: '8px' }}>
              <div>
                <span
                  style={{
                    fontSize: '18px',
                    fontWeight: 700,
                    color: 'var(--color-gold)',
                    marginRight: '8px',
                  }}
                >
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
                  }}
                >
                  Ask Gambit ✨
                </button>
              )}
            </div>
            <p style={{ color: 'var(--color-text)', fontSize: '14px', lineHeight: 1.6, margin: 0 }}>
              {currentMove.explanation}
            </p>

            {showAiPanel && (
              <div
                style={{
                  marginTop: '12px',
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
                  <p style={{ color: 'var(--color-text)', fontSize: '14px', lineHeight: 1.6, margin: 0 }}>
                    {aiExplanation}
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {isAtStart && (
          <div
            style={{
              width: '100%',
              background: 'var(--color-bg-card)',
              border: '1px solid var(--color-border)',
              borderRadius: '10px',
              padding: '16px',
              textAlign: 'center',
              color: 'var(--color-text-muted)',
              fontSize: '14px',
            }}
          >
            Press <strong style={{ color: 'var(--color-gold)' }}>Next →</strong> to start learning{' '}
            {opening.name}.
          </div>
        )}

        {isAtEnd && (
          <Button variant="primary" size="lg" onClick={() => navigate(`/quiz/${opening.id}`)}>
            Try the Quiz →
          </Button>
        )}
      </div>
    </div>
  );
}
