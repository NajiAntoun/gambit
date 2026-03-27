import { Link } from 'react-router-dom';

/**
 * Gambit wordmark — king shatters under the pawn's weight.
 *
 * The king is rendered as 4 clipped quadrant shards assembled into one.
 * The pawn slams down. On impact each shard spins outward and fades.
 *
 * Timeline:
 *   0.0s          King visible (assembled shards)
 *   0.0 → 0.7s   Pawn falls fast from above
 *   0.7s          IMPACT — shards fly, pawn squishes then bounces
 *   0.7 → 1.25s  Shards spin outward and fade
 *   1.1 → 1.5s   "Gambit" wordmark slides in
 */
export function GambitLogo({ linkTo = '/' }: { linkTo?: string }) {
  return (
    <>
      <style>{`
        /* ── Pawn slam ── */
        @keyframes gambit-pawn-slam {
          0%   { transform: translateY(-260%) scale(0.8);   opacity: 0; }
          65%  { transform: translateY(6%)    scale(1);     opacity: 1; }
          72%  { transform: translateY(6%)    scaleY(0.88); opacity: 1; }
          82%  { transform: translateY(-4%)   scale(1.03);  opacity: 1; }
          92%  { transform: translateY(2%);                 opacity: 1; }
          100% { transform: translateY(0)     scale(1);     opacity: 1; }
        }

        /* ── King shards — each flies to its own corner ── */
        @keyframes shard-tl {
          0%   { transform: translate(0, 0) rotate(0deg)    scale(1);   opacity: 1; }
          100% { transform: translate(-140%, -120%) rotate(-65deg) scale(0.25); opacity: 0; }
        }
        @keyframes shard-tr {
          0%   { transform: translate(0, 0) rotate(0deg)   scale(1);   opacity: 1; }
          100% { transform: translate(140%, -100%) rotate(70deg)  scale(0.25); opacity: 0; }
        }
        @keyframes shard-bl {
          0%   { transform: translate(0, 0) rotate(0deg)    scale(1);   opacity: 1; }
          100% { transform: translate(-110%, 130%) rotate(-50deg) scale(0.2);  opacity: 0; }
        }
        @keyframes shard-br {
          0%   { transform: translate(0, 0) rotate(0deg)   scale(1);   opacity: 1; }
          100% { transform: translate(110%, 120%)  rotate(55deg)  scale(0.2);  opacity: 0; }
        }

        /* ── Wordmark ── */
        @keyframes gambit-text-in {
          0%   { transform: translateX(-8px); opacity: 0; }
          100% { transform: translateX(0);    opacity: 1; }
        }
        @keyframes gambit-crown-in {
          0%   { transform: translateX(-50%) translateY(-6px) scale(0.6); opacity: 0; }
          100% { transform: translateX(-62%) translateY(0)    scale(1);   opacity: 1; }
        }

        .gambit-pawn {
          display: block;
          position: absolute;
          top: 0; left: 0;
          transform-origin: center bottom;
          animation: gambit-pawn-slam 0.7s cubic-bezier(0.4, 0, 0.6, 1) 0s both;
        }
        .gambit-shard-tl { animation: shard-tl 0.55s cubic-bezier(0.2, 0, 0.6, 1) 0.65s both; }
        .gambit-shard-tr { animation: shard-tr 0.55s cubic-bezier(0.2, 0, 0.6, 1) 0.67s both; }
        .gambit-shard-bl { animation: shard-bl 0.55s cubic-bezier(0.2, 0, 0.6, 1) 0.66s both; }
        .gambit-shard-br { animation: shard-br 0.55s cubic-bezier(0.2, 0, 0.6, 1) 0.68s both; }

        .gambit-logo-text {
          display: inline-block;
          font-family: 'Cinzel', 'Georgia', serif;
          animation: gambit-text-in 0.4s ease-out 1.1s both;
        }
        .gambit-logo-crown {
          position: absolute;
          top: -11px;
          left: 50%;
          transform: translateX(-62%);
          display: block;
          overflow: visible;
          animation: gambit-crown-in 0.35s ease-out 1.3s both;
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
        {/* Piece stack */}
        <span
          style={{
            position: 'relative',
            display: 'inline-block',
            width: '2.8rem',
            height: '2.8rem',
            flexShrink: 0,
          }}
        >
          {/* King — rendered as 4 assembled shards that fly apart on impact */}
          {[
            { cls: 'gambit-shard-tl', clip: 'polygon(0% 0%, 58% 0%, 58% 54%, 0% 54%)' },
            { cls: 'gambit-shard-tr', clip: 'polygon(42% 0%, 100% 0%, 100% 54%, 42% 54%)' },
            { cls: 'gambit-shard-bl', clip: 'polygon(0% 46%, 58% 46%, 58% 100%, 0% 100%)' },
            { cls: 'gambit-shard-br', clip: 'polygon(42% 46%, 100% 46%, 100% 100%, 42% 100%)' },
          ].map(({ cls, clip }) => (
            <span
              key={cls}
              className={cls}
              style={{
                display: 'block',
                position: 'absolute',
                top: 0,
                left: 0,
                fontSize: '3.4rem',
                lineHeight: 1,
                color: 'rgba(201,168,76,0.85)',
                clipPath: clip,
              }}
              aria-hidden
            >
              ♚
            </span>
          ))}

          {/* Pawn — slams down from above */}
          <span
            className="gambit-pawn"
            style={{ fontSize: '2.8rem', lineHeight: 1, color: 'var(--color-gold)' }}
            aria-hidden
          >
            ♟
          </span>
        </span>

        {/* Wordmark — Cinzel with crowned G */}
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
          <span style={{ position: 'relative', display: 'inline-block' }}>
            G
            <svg
              className="gambit-logo-crown"
              viewBox="0 0 30 13"
              width="22"
              height="10"
              aria-hidden
            >
              <path d="M0,13 L0,7 L6,11 L10,2 L15,6.5 L20,2 L24,11 L30,7 L30,13 Z" fill="#c9a84c" />
              <circle cx="10" cy="2"   r="1.8" fill="#e8c96a" />
              <circle cx="15" cy="6.5" r="1.4" fill="#e8c96a" />
              <circle cx="20" cy="2"   r="1.8" fill="#e8c96a" />
            </svg>
          </span>
          ambit
        </span>
      </Link>
    </>
  );
}
