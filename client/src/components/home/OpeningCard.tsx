import { useNavigate } from 'react-router-dom';
import type { Opening, Popularity } from '../../data/types';
import { useProgress } from '../../hooks/useProgress';
import { DifficultyBadge } from './DifficultyBadge';
import { ProgressBadge } from './ProgressBadge';

const POPULARITY_LABEL: Record<Popularity, string> = {
  1: 'Rare',
  2: 'Niche',
  3: 'Common',
  4: 'Popular',
  5: 'Elite',
};

interface OpeningCardProps {
  opening: Opening;
}

export function OpeningCard({ opening }: OpeningCardProps) {
  const navigate = useNavigate();
  const { getProgress } = useProgress();
  const progress = getProgress(opening.id);
  const forkLines = opening.forks?.reduce((n, f) => n + f.options.length, 0) ?? 0;

  return (
    <button
      onClick={() => navigate(`/mode/${opening.id}`)}
      style={{
        background: 'var(--color-bg-card)',
        border: '1px solid var(--color-border)',
        borderRadius: '10px',
        padding: '14px 16px',
        textAlign: 'left',
        cursor: 'pointer',
        width: '100%',
        transition: 'border-color 0.15s, background 0.15s',
        display: 'flex',
        flexDirection: 'column',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--color-gold)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--color-border)';
      }}
    >
      {/* Header: name + eco */}
      <div className="flex items-start justify-between gap-2 mb-1">
        <span style={{ fontWeight: 600, fontSize: '15px', color: 'var(--color-text)', lineHeight: 1.3 }}>
          {opening.name}
        </span>
        <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', flexShrink: 0 }}>
          {opening.eco}
        </span>
      </div>

      {/* Description */}
      <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', margin: '0 0 10px', lineHeight: 1.5, flex: 1 }}>
        {opening.description}
      </p>

      {/* Bottom row: badges + stats */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
        <DifficultyBadge difficulty={opening.difficulty} />
        <ProgressBadge status={progress.status} />

        {/* Spacer pushes right-side badges to the end */}
        <span style={{ flex: 1 }} />

        {/* Year */}
        <span
          style={{
            fontSize: '10px',
            color: 'var(--color-text-muted)',
            opacity: 0.7,
            whiteSpace: 'nowrap',
          }}
        >
          c.{'\u2009'}{opening.yearPopularized}
        </span>

        {/* Popularity pill */}
        <span
          style={{
            fontSize: '10px',
            fontWeight: 600,
            letterSpacing: '0.04em',
            color: opening.popularity >= 4 ? 'var(--color-gold)' : 'var(--color-text-muted)',
            background: opening.popularity >= 4 ? 'rgba(201,168,76,0.12)' : 'rgba(255,255,255,0.06)',
            border: `1px solid ${opening.popularity >= 4 ? 'rgba(201,168,76,0.25)' : 'rgba(255,255,255,0.08)'}`,
            borderRadius: '4px',
            padding: '2px 6px',
            whiteSpace: 'nowrap',
          }}
        >
          {POPULARITY_LABEL[opening.popularity]}
        </span>

        {/* Fork lines badge */}
        {forkLines > 0 && (
          <span
            style={{
              fontSize: '10px',
              fontWeight: 700,
              letterSpacing: '0.06em',
              color: 'var(--color-gold)',
              background: 'rgba(201,168,76,0.12)',
              border: '1px solid rgba(201,168,76,0.25)',
              borderRadius: '4px',
              padding: '2px 6px',
              whiteSpace: 'nowrap',
            }}
          >
            ⑂ {forkLines} lines
          </span>
        )}
      </div>
    </button>
  );
}
