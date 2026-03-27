import { useEffect, useState } from 'react';
import type { OpeningFork, ForkOption } from '../../data/types';

interface ForkOverlayProps {
  fork: OpeningFork;
  onChoose: (option: ForkOption) => void;
  onDismiss: () => void;
}

export function ForkOverlay({ fork, onChoose, onDismiss }: ForkOverlayProps) {
  const [visible, setVisible] = useState(false);

  // Trigger entrance animation on mount
  useEffect(() => {
    const t = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(t);
  }, []);

  const handleChoose = (option: ForkOption) => {
    setVisible(false);
    // Let exit animation play before calling onChoose
    setTimeout(() => onChoose(option), 280);
  };

  const handleDismiss = () => {
    setVisible(false);
    setTimeout(() => onDismiss(), 280);
  };

  return (
    <>
      <style>{`
        @keyframes fork-backdrop-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes fork-backdrop-out {
          from { opacity: 1; }
          to   { opacity: 0; }
        }
        @keyframes fork-card-in {
          from { opacity: 0; transform: translateY(40px) scale(0.96); }
          to   { opacity: 1; transform: translateY(0)    scale(1); }
        }
        @keyframes fork-card-out {
          from { opacity: 1; transform: translateY(0)    scale(1); }
          to   { opacity: 0; transform: translateY(30px) scale(0.97); }
        }
        @keyframes fork-pip-pulse {
          0%, 100% { transform: scale(1);   opacity: 1; }
          50%       { transform: scale(1.3); opacity: 0.7; }
        }
        .fork-card {
          cursor: pointer;
          border: 1px solid var(--color-border);
          border-radius: 16px;
          padding: 22px 20px;
          background: var(--color-bg-card);
          transition: border-color 0.18s, background 0.18s, transform 0.18s;
          text-align: left;
          position: relative;
          overflow: hidden;
        }
        .fork-card::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(201,168,76,0.07) 0%, transparent 60%);
          opacity: 0;
          transition: opacity 0.18s;
          border-radius: 16px;
        }
        .fork-card:hover {
          border-color: var(--color-gold);
          transform: translateY(-2px);
        }
        .fork-card:hover::before {
          opacity: 1;
        }
        .fork-card:active {
          transform: translateY(0) scale(0.98);
        }
      `}</style>

      {/* Backdrop */}
      <div
        onClick={handleDismiss}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 200,
          background: 'rgba(0,0,0,0.72)',
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px 16px',
          animation: `${visible ? 'fork-backdrop-in' : 'fork-backdrop-out'} 0.28s ease forwards`,
        }}
      >
        {/* Panel — stop click propagation so cards don't dismiss */}
        <div
          onClick={e => e.stopPropagation()}
          style={{
            width: '100%',
            maxWidth: '520px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '4px' }}>
            {/* Animated pip */}
            <div style={{ marginBottom: '12px', display: 'flex', justifyContent: 'center', gap: '6px' }}>
              {[0, 1, 2].map(i => (
                <span
                  key={i}
                  style={{
                    display: 'inline-block',
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: 'var(--color-gold)',
                    animation: `fork-pip-pulse 1.4s ease-in-out ${i * 0.18}s infinite`,
                  }}
                />
              ))}
            </div>
            <div
              style={{
                fontSize: '11px',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'var(--color-gold)',
                fontWeight: 700,
                marginBottom: '6px',
              }}
            >
              Branching point
            </div>
            <div
              style={{
                fontSize: '20px',
                fontWeight: 700,
                color: 'var(--color-text)',
                lineHeight: 1.25,
              }}
            >
              {fork.prompt}
            </div>
          </div>

          {/* Fork option cards */}
          {fork.options.map((option, i) => (
            <button
              key={option.san}
              className="fork-card"
              onClick={() => handleChoose(option)}
              style={{
                animation: `fork-card-in 0.32s cubic-bezier(0.34,1.56,0.64,1) ${0.08 + i * 0.1}s both`,
              }}
            >
              {/* Top row: move + badge */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                <span
                  style={{
                    fontFamily: "'Cinzel', serif",
                    fontSize: '28px',
                    fontWeight: 700,
                    color: 'var(--color-gold)',
                    lineHeight: 1,
                    letterSpacing: '-0.01em',
                  }}
                >
                  {option.san}
                </span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-text)', marginBottom: '2px' }}>
                    {option.label}
                  </div>
                  <div
                    style={{
                      display: 'inline-block',
                      fontSize: '10px',
                      fontWeight: 700,
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      background: 'rgba(201,168,76,0.15)',
                      color: 'var(--color-gold)',
                      borderRadius: '4px',
                      padding: '2px 7px',
                    }}
                  >
                    {option.badge}
                  </div>
                </div>
                <span
                  style={{
                    fontSize: '18px',
                    color: 'var(--color-text-muted)',
                    transition: 'color 0.15s, transform 0.15s',
                    flexShrink: 0,
                  }}
                >
                  →
                </span>
              </div>

              {/* Description */}
              <p
                style={{
                  margin: 0,
                  fontSize: '13px',
                  color: 'var(--color-text-muted)',
                  lineHeight: 1.55,
                }}
              >
                {option.description}
              </p>
            </button>
          ))}

          {/* Dismiss hint */}
          <button
            onClick={handleDismiss}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--color-text-muted)',
              fontSize: '12px',
              cursor: 'pointer',
              textAlign: 'center',
              padding: '4px',
              opacity: 0.7,
              animation: 'fork-card-in 0.32s ease 0.32s both',
            }}
          >
            ← Stay at current position
          </button>
        </div>
      </div>
    </>
  );
}
