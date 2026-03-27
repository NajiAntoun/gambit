import { Link } from 'react-router-dom';

/**
 * Gambit wordmark with a one-time entrance animation.
 *
 * The pawn (our piece) lands confidently from above.
 * The king (opponent) topples and fades — crushed.
 * "Gambit" slides in after the action settles.
 *
 * Total runtime: ~900ms. Plays once per mount.
 */
export function GambitLogo({ linkTo = '/' }: { linkTo?: string }) {
  return (
    <>
      <style>{`
        @keyframes gambit-pawn-drop {
          0%   { transform: translateY(-14px) scale(0.85); opacity: 0; }
          55%  { transform: translateY(2px) scale(1.06); opacity: 1; }
          75%  { transform: translateY(-1px) scale(0.98); }
          100% { transform: translateY(0) scale(1); opacity: 1; }
        }
        @keyframes gambit-king-fall {
          0%   { transform: rotate(0deg) translateX(0); opacity: 1; }
          30%  { transform: rotate(-15deg) translateX(-1px); opacity: 1; }
          60%  { transform: rotate(-72deg) translateX(-3px); opacity: 0.6; }
          100% { transform: rotate(-90deg) translateX(-4px) scaleY(0.7); opacity: 0; }
        }
        @keyframes gambit-text-in {
          0%   { transform: translateX(-5px); opacity: 0; }
          100% { transform: translateX(0);    opacity: 1; }
        }

        .gambit-logo-pawn {
          display: inline-block;
          animation: gambit-pawn-drop 0.55s cubic-bezier(0.34, 1.36, 0.64, 1) 0.05s both;
          transform-origin: bottom center;
        }
        .gambit-logo-king {
          display: inline-block;
          animation: gambit-king-fall 0.45s ease-in 0.1s both;
          transform-origin: bottom center;
        }
        .gambit-logo-text {
          display: inline-block;
          animation: gambit-text-in 0.35s ease-out 0.55s both;
        }
      `}</style>

      <Link
        to={linkTo}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.35rem',
          textDecoration: 'none',
          userSelect: 'none',
        }}
      >
        {/* The king topples first — */}
        <span
          className="gambit-logo-king"
          style={{ fontSize: '1.05rem', lineHeight: 1, color: 'rgba(201,168,76,0.45)' }}
          aria-hidden
        >
          ♚
        </span>

        {/* — then our pawn lands on it */}
        <span
          className="gambit-logo-pawn"
          style={{ fontSize: '1.25rem', lineHeight: 1, color: 'var(--color-gold)', marginLeft: '-0.6rem' }}
          aria-hidden
        >
          ♟
        </span>

        {/* Wordmark slides in once the action settles */}
        <span
          className="gambit-logo-text"
          style={{
            fontSize: '1.15rem',
            fontWeight: 800,
            letterSpacing: '-0.01em',
            color: 'var(--color-gold)',
            marginLeft: '0.15rem',
          }}
        >
          Gambit
        </span>
      </Link>
    </>
  );
}
