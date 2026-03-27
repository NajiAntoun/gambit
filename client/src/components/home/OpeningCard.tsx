import { useNavigate } from 'react-router-dom';
import type { Opening, Popularity } from '../../data/types';
import { useProgress } from '../../hooks/useProgress';
import { DifficultyBadge } from './DifficultyBadge';
import { ProgressBadge } from './ProgressBadge';
import { MiniBoard } from './MiniBoard';

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
        position: 'relative',
        overflow: 'hidden',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--color-gold)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--color-border)';
      }}
    >
      {/* Mini board watermark — bottom right */}
      <div
        style={{
          position: 'absolute',
          bottom: '-4px',
          right: '-4px',
          color: 'var(--color-gold)',
          opacity: 0.12,
          pointerEvents: 'none',
        }}
      >
        <MiniBoard moves={opening.moves} size={88} />
      </div>

      {/* Header: name + metadata (ECO · year · popularity) */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px', marginBottom: '4px', position: 'relative' }}>
        <span style={{ fontWeight: 600, fontSize: '15px', color: 'var(--color-text)', lineHeight: 1.3 }}>
          {opening.name}
        </span>
        <span
          style={{
            fontSize: '10px',
            color: 'var(--color-text-muted)',
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            lineHeight: 1,
            marginTop: '3px',
          }}
        >
          <span>{opening.eco}</span>
          <span style={{ opacity: 0.4 }}>·</span>
          <span style={{ opacity: 0.6 }}>c.{'\u2009'}{opening.yearPopularized}</span>
          <span
            style={{
              fontWeight: 600,
              letterSpacing: '0.04em',
              color: opening.popularity >= 4 ? 'var(--color-gold)' : undefined,
            }}
          >
            {POPULARITY_LABEL[opening.popularity]}
          </span>
        </span>
      </div>

      {/* Description */}
      <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', margin: '0 0 10px', lineHeight: 1.5, flex: 1, position: 'relative' }}>
        {opening.description}
      </p>

      {/* Bottom row: badges only — compact, always fits */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', position: 'relative' }}>
        <DifficultyBadge difficulty={opening.difficulty} />
        <ProgressBadge status={progress.status} />
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
