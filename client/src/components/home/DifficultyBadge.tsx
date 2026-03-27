import type { Difficulty } from '../../data/types';

const config: Record<Difficulty, { label: string; color: string; bg: string }> = {
  beginner: { label: 'Beginner', color: '#4ade80', bg: 'rgba(74,222,128,0.12)' },
  intermediate: { label: 'Intermediate', color: 'var(--color-gold)', bg: 'rgba(201,168,76,0.12)' },
  advanced: { label: 'Advanced', color: '#f87171', bg: 'rgba(248,113,113,0.12)' },
};

export function DifficultyBadge({ difficulty }: { difficulty: Difficulty }) {
  const { label, color, bg } = config[difficulty];
  return (
    <span
      style={{
        fontSize: '11px',
        fontWeight: 600,
        color,
        background: bg,
        padding: '2px 8px',
        borderRadius: '99px',
        letterSpacing: '0.02em',
      }}
    >
      {label}
    </span>
  );
}
