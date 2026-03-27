import { useNavigate } from 'react-router-dom';
import { openings, getOpeningsByCategory } from '../data/openings';
import { useProgress } from '../hooks/useProgress';
import { ProgressBadge } from '../components/home/ProgressBadge';
import { DifficultyBadge } from '../components/home/DifficultyBadge';

const CATEGORIES = ['White', 'Black vs e4', 'Black vs d4'] as const;

export function Dashboard() {
  const navigate = useNavigate();
  const { getProgress } = useProgress();
  const grouped = getOpeningsByCategory();

  const mastered = openings.filter((o) => getProgress(o.id).status === 'mastered').length;
  const learning = openings.filter((o) => getProgress(o.id).status === 'learning').length;
  const notStarted = openings.filter((o) => getProgress(o.id).status === 'not-started').length;
  const totalAttempts = openings.reduce((sum, o) => sum + getProgress(o.id).quizAttempts, 0);

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto', width: '100%', padding: '24px 16px 80px' }}>
      <h1 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--color-text)', marginBottom: '20px' }}>
        Progress Dashboard
      </h1>

      {/* Stats grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '10px',
          marginBottom: '28px',
        }}
      >
        {[
          { label: 'Mastered', value: mastered, color: '#4ade80' },
          { label: 'Learning', value: learning, color: 'var(--color-gold)' },
          { label: 'Not Started', value: notStarted, color: 'var(--color-text-muted)' },
          { label: 'Quiz Attempts', value: totalAttempts, color: 'var(--color-text)' },
        ].map(({ label, value, color }) => (
          <div
            key={label}
            style={{
              background: 'var(--color-bg-card)',
              border: '1px solid var(--color-border)',
              borderRadius: '10px',
              padding: '14px 16px',
            }}
          >
            <div style={{ fontSize: '28px', fontWeight: 700, color, lineHeight: 1 }}>{value}</div>
            <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '4px' }}>
              {label}
            </div>
          </div>
        ))}
      </div>

      {/* Opening list by category */}
      {CATEGORIES.map((cat) => {
        const items = grouped[cat] ?? [];
        return (
          <div key={cat} style={{ marginBottom: '24px' }}>
            <h2
              style={{
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'var(--color-text-muted)',
                marginBottom: '10px',
              }}
            >
              {cat}
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {items.map((o) => {
                const p = getProgress(o.id);
                return (
                  <button
                    key={o.id}
                    onClick={() => navigate(`/mode/${o.id}`)}
                    style={{
                      background: 'var(--color-bg-card)',
                      border: '1px solid var(--color-border)',
                      borderRadius: '8px',
                      padding: '12px 14px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      textAlign: 'left',
                      cursor: 'pointer',
                      transition: 'border-color 0.15s',
                      width: '100%',
                    }}
                    onMouseEnter={(e) =>
                      ((e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--color-gold)')
                    }
                    onMouseLeave={(e) =>
                      ((e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--color-border)')
                    }
                  >
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: '14px', color: 'var(--color-text)', marginBottom: '4px' }}>
                        {o.name}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <DifficultyBadge difficulty={o.difficulty} />
                        <ProgressBadge status={p.status} />
                        {p.quizAttempts > 0 && (
                          <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                            {p.quizAttempts} attempt{p.quizAttempts !== 1 ? 's' : ''}
                          </span>
                        )}
                        {p.bestTime && (
                          <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                            Best: {Math.round(p.bestTime / 1000)}s
                          </span>
                        )}
                      </div>
                    </div>
                    {p.cleanRuns > 0 && p.status !== 'mastered' && (
                      <span style={{ fontSize: '12px', color: 'var(--color-gold)', flexShrink: 0 }}>
                        {p.cleanRuns}/3 🔥
                      </span>
                    )}
                    {p.status === 'mastered' && (
                      <span style={{ fontSize: '18px', flexShrink: 0 }}>🏆</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
