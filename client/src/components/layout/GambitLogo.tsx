import { Link } from 'react-router-dom';

/**
 * Gambit logo — gold knight badge + crowned "Gambit" wordmark.
 *
 * The badge is intentionally oversized so it floats beyond the header
 * ribbon, giving the logo a premium, branded presence.
 *
 * Timeline:
 *   0.0 → 0.6s   Knight badge scales in with slight rotation
 *   0.25 → 0.65s  Wordmark slides in from left
 *   0.5 → 0.8s    Gold underline reveals left-to-right
 *   0.6 → 0.9s    Crown fades in above G
 */
export function GambitLogo({ linkTo = '/' }: { linkTo?: string }) {
  return (
    <>
      <style>{`
        @keyframes gambit-badge-in {
          0%   { opacity: 0; transform: scale(0.85) rotate(-10deg); }
          70%  { opacity: 1; transform: scale(1.02) rotate(1deg); }
          100% { opacity: 1; transform: scale(1) rotate(0deg); }
        }
        @keyframes gambit-text-in {
          0%   { opacity: 0; transform: translateX(-8px); }
          100% { opacity: 1; transform: translateX(0); }
        }
        @keyframes gambit-line-in {
          0%   { transform: scaleX(0); }
          100% { transform: scaleX(1); }
        }
        @keyframes gambit-crown-in {
          0%   { opacity: 0; transform: translateX(-50%) translateY(-4px) scale(0.5); }
          100% { opacity: 1; transform: translateX(-50%) translateY(0) scale(1); }
        }

        .gambit-badge {
          animation: gambit-badge-in 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 0s both;
        }
        .gambit-wordmark {
          animation: gambit-text-in 0.4s ease-out 0.25s both;
        }
        .gambit-underline {
          animation: gambit-line-in 0.4s ease-out 0.5s both;
        }
        .gambit-crown {
          animation: gambit-crown-in 0.35s ease-out 0.6s both;
        }
      `}</style>

      <Link
        to={linkTo}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          textDecoration: 'none',
          userSelect: 'none',
        }}
      >
        {/* Knight badge — oversized to float beyond the header */}
        <span
          className="gambit-badge"
          style={{
            width: '3.625rem',
            height: '3.625rem',
            borderRadius: '0.875rem',
            background: 'linear-gradient(145deg, #d4b35a, #a8892e)',
            flexShrink: 0,
            boxShadow:
              '0 6px 20px rgba(0,0,0,0.45), 0 2px 6px rgba(0,0,0,0.3), 0 0 30px rgba(201,168,76,0.15)',
            overflow: 'hidden',
            position: 'relative',
            display: 'block',
          }}
          aria-hidden
        >
          <span
            style={{
              fontSize: '3.8rem',
              color: '#141f14',
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-52%, -48%)',
              lineHeight: 1,
            }}
          >
            ♞
          </span>
        </span>

        {/* Wordmark — Cinzel with crowned G + gold underline */}
        <span
          className="gambit-wordmark"
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.2rem',
          }}
        >
          <span
            style={{
              fontFamily: "'Cinzel', 'Georgia', serif",
              fontSize: '1.7rem',
              fontWeight: 700,
              letterSpacing: '0.05em',
              color: 'var(--color-gold)',
              display: 'flex',
              alignItems: 'flex-start',
              lineHeight: 1.1,
            }}
          >
            <span style={{ position: 'relative', display: 'inline-block' }}>
              G
              {/* Crown SVG */}
              <svg
                className="gambit-crown"
                width="16"
                height="9"
                viewBox="0 0 16 10"
                style={{
                  position: 'absolute',
                  top: '-0.25rem',
                  left: '50%',
                  transform: 'translateX(-50%)',
                }}
                aria-hidden="true"
              >
                <path
                  d="M2 10 L4 4 L6 7 L8 2 L10 7 L12 4 L14 10"
                  stroke="var(--color-gold)"
                  strokeWidth="1.5"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            ambit
          </span>

          {/* Gold accent underline */}
          <span
            className="gambit-underline"
            style={{
              height: '1.5px',
              background: 'linear-gradient(90deg, var(--color-gold) 70%, transparent)',
              borderRadius: '1px',
              transformOrigin: 'left',
            }}
          />
        </span>
      </Link>
    </>
  );
}
