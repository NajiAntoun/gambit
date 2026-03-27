import { Link } from 'react-router-dom';

/**
 * Gambit wordmark with a one-time entrance animation.
 *
 * Phase 1 (0 → 1.0s)  : King slowly tilts, then dramatically falls and fades
 * Phase 2 (0.8 → 1.4s): Our pawn drops in with a confident spring
 * Phase 3 (1.3 → 1.7s): "Gambit" wordmark slides in
 *
 * Total: ~1.7s. Plays once per mount.
 */
export function GambitLogo({ linkTo = '/' }: { linkTo?: string }) {
  return (
    <>
      <style>{`
        @keyframes gambit-king-fall {
          0%   { transform: rotate(0deg);                          opacity: 1;   }
          20%  { transform: rotate(-8deg);                         opacity: 1;   }
          45%  { transform: rotate(-30deg);                        opacity: 0.9; }
          70%  { transform: rotate(-72deg) translateX(-4px);       opacity: 0.5; }
          100% { transform: rotate(-90deg) translateX(-6px) scaleY(0.65); opacity: 0; }
        }
        @keyframes gambit-pawn-drop {
          0%   { transform: translateY(-18px) scale(0.8);  opacity: 0; }
          50%  { transform: translateY(3px)   scale(1.08); opacity: 1; }
          72%  { transform: translateY(-2px)  scale(0.97); opacity: 1; }
          88%  { transform: translateY(1px)   scale(1.01); opacity: 1; }
          100% { transform: translateY(0)     scale(1);    opacity: 1; }
        }
        @keyframes gambit-text-in {
          0%   { transform: translateX(-6px); opacity: 0; }
          100% { transform: translateX(0);    opacity: 1; }
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
          animation: gambit-text-in 0.4s ease-out 1.3s both;
        }
      `}</style>

      <Link
        to={linkTo}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.25rem',
          textDecoration: 'none',
          userSelect: 'none',
        }}
      >
        {/* King topples — */}
        <span
          className="gambit-logo-king"
          style={{ fontSize: '1.5rem', lineHeight: 1, color: 'rgba(201,168,76,0.4)' }}
          aria-hidden
        >
          ♚
        </span>

        {/* — our pawn crushes it */}
        <span
          className="gambit-logo-pawn"
          style={{ fontSize: '1.75rem', lineHeight: 1, color: 'var(--color-gold)', marginLeft: '-0.7rem' }}
          aria-hidden
        >
          ♟
        </span>

        {/* Wordmark arrives once the dust settles */}
        <span
          className="gambit-logo-text"
          style={{
            fontSize: '1.25rem',
            fontWeight: 800,
            letterSpacing: '-0.01em',
            color: 'var(--color-gold)',
            marginLeft: '0.2rem',
          }}
        >
          Gambit
        </span>
      </Link>
    </>
  );
}
