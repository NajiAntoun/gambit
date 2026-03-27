import { useNavigate } from 'react-router-dom';
import type { Opening } from '../../data/types';
import { useProgress } from '../../hooks/useProgress';
import { DifficultyBadge } from './DifficultyBadge';
import { ProgressBadge } from './ProgressBadge';

interface OpeningCardProps {
  opening: Opening;
}

export function OpeningCard({ opening }: OpeningCardProps) {
  const navigate = useNavigate();
  const { getProgress } = useProgress();
  const progress = getProgress(opening.id);

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
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--color-gold)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--color-border)';
      }}
    >
      <div className="flex items-start justify-between gap-2 mb-1">
        <span
          style={{ fontWeight: 600, fontSize: '15px', color: 'var(--color-text)', lineHeight: 1.3 }}
        >
          {opening.name}
        </span>
        <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', flexShrink: 0 }}>
          {opening.eco}
        </span>
      </div>
      <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', margin: '0 0 10px', lineHeight: 1.5 }}>
        {opening.description}
      </p>
      <div className="flex items-center gap-3">
        <DifficultyBadge difficulty={opening.difficulty} />
        <ProgressBadge status={progress.status} />
      </div>
    </button>
  );
}
