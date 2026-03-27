import type { ProgressStatus } from '../../data/types';

const config: Record<ProgressStatus, { label: string; icon: string; color: string }> = {
  'not-started': { label: 'Not Started', icon: '○', color: 'var(--color-text-muted)' },
  'learning': { label: 'Learning', icon: '◑', color: 'var(--color-gold)' },
  'mastered': { label: 'Mastered', icon: '●', color: '#4ade80' },
};

export function ProgressBadge({ status }: { status: ProgressStatus }) {
  const { label, icon, color } = config[status];
  return (
    <span style={{ fontSize: '12px', color, display: 'flex', alignItems: 'center', gap: '4px' }}>
      <span style={{ fontSize: '10px' }}>{icon}</span>
      {label}
    </span>
  );
}
