import { Link } from 'react-router-dom';

/**
 * Gambit wordmark — Cinzel font, crowned G, chess piece animation.
 *
 * Phase 1 (0.1s → 1.1s) : King visibly tilts, then crashes and fades out
 * Phase 2 (0.85s → 1.5s): Our pawn drops in with a confident spring bounce
 * Phase 3 (1.3s → 1.7s) : "Gambit" wordmark slides in — crowned G leads
 *
 * Total: ~1.7s. Plays once per mount.
 */
export function GambitLogo({ linkTo = '/' }: { linkTo?: string }) {
  return (
    <>
      <style>{`
        @keyframes gambit-king-fall {
          0%   { transform: rotate(0deg);                                opacity: 1;   }
          20%  { transform: rotate(-10deg);                              opacity: 1;   }
          45%  { transform: rotate(-35deg);                              opacity: 0.9; }
          70%  { transform: rotate(-75deg) translateX(-5px);             opacity: 0.6; }
          100% { transform: rotate(-90deg) translateX(-8px) scaleY(0.6); opacity: 0;   }
        }
        @keyframes gambit-pawn-drop {
          0%   { transform: translateY(-22px) scale(0.78); opacity: 0; }
          48%  { transform: translateY(4px)   scale(1.10); opacity: 1; }
          70%  { transform: translateY(-2px)  scale(0.97); opacity: 1; }
          86%  { transform: translateY(1px)   scale(1.02); opacity: 1; }
          100% { transform: translateY(0)     scale(1);    opacity: 1; }
        }
        @keyframes gambit-text-in {
          0%   { transform: translateX(-8px); opacity: 0; }
          100% { transform: translateX(0);    opacity: 1; }
        }
        @keyframes gambit-crown-in {
          0%   { transform: translateY(-4px) scale(0.7); opacity: 0; }
          100% { transform: translateY(0)    scale(1);   opacity: 1; }
        }

        .gambit-logo-king {
          display: inline-block;
          transform-origin: bottom center;
          animation: gambit-king-fall 1.0s cubic-bezier(0.4, 0, 0.8, 0.6) 0.1s both;
        }
        .gambit-logo-pawn {
          display: inline-block;
          transform-origin: bottom center;
          animation: gambit-pawn-drop 0.65s cubic-bezier(0.34, 1.4, 0.64, 1) 0.85s both;
        }
        .gambit-logo-text {
          display: inline-block;
          font-family: 'Cinzel', 'Georgia', serif;
          animation: gambit-text-in 0.4s ease-out 1.3s both;
        }
        .gambit-logo-crown {
          display: inline-block;
          animation: gambit-crown-in 0.35s ease-out 1.5s both;
        }
      `}</style>

      <Link
        to={linkTo}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.3rem',
          textDecoration: 'none',
          userSelect: 'none',
        }}
      >
        {/* Piece stack — king and pawn share the exact same position */}
        <span style={{ position: 'relative', display: 'inline-block', width: '2.8rem', height: '2.8rem', flexShrink: 0 }}>
          <span
            className="gambit-logo-king"
            style={{ position: 'absolute', top: 0, left: 0, fontSize: '2.8rem', lineHeight: 1, color: 'rgba(201,168,76,0.75)' }}
            aria-hidden
          >
            ♚
          </span>
          <span
            className="gambit-logo-pawn"
            style={{ position: 'absolute', top: 0, left: 0, fontSize: '2.8rem', lineHeight: 1, color: 'var(--color-gold)' }}
            aria-hidden
          >
            ♟
          </span>
        </span>

        {/* Wordmark — Cinzel, crowned G */}
        <span
          className="gambit-logo-text"
          style={{
            fontSize: '1.75rem',
            fontWeight: 700,
            letterSpacing: '0.04em',
            color: 'var(--color-gold)',
            marginLeft: '0.3rem',
            display: 'flex',
            alignItems: 'flex-start',
          }}
        >
          {/* G with crown perched above */}
          <span style={{ position: 'relative', display: 'inline-block' }}>
            G
            <span
              className="gambit-logo-crown"
              style={{
                position: 'absolute',
                top: '-0.6em',
                left: '50%',
                transform: 'translateX(-50%)',
                fontSize: '0.7em',
                lineHeight: 1,
                color: 'var(--color-gold)',
              }}
              aria-hidden
            >
              ♛
            </span>
          </span>
          ambit
        </span>
      </Link>
    </>
  );
}
