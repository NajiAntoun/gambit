import { useNavigate, useParams } from 'react-router-dom';
import { getOpeningById } from '../data/openings';
import { useProgress } from '../hooks/useProgress';
import { Button } from '../components/shared/Button';
import { DifficultyBadge } from '../components/home/DifficultyBadge';
import { ProgressBadge } from '../components/home/ProgressBadge';

export function ModeSelect() {
  const { openingId } = useParams<{ openingId: string }>();
  const navigate = useNavigate();
  const { getProgress } = useProgress();
  const opening = getOpeningById(openingId ?? '');

  if (!opening) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 16px', color: 'var(--color-text-muted)' }}>
        Opening not found.{' '}
        <button onClick={() => navigate('/')} style={{ color: 'var(--color-gold)', background: 'none', border: 'none', cursor: 'pointer' }}>
          Go back
        </button>
      </div>
    );
  }

  const progress = getProgress(opening.id);

  return (
    <div style={{ maxWidth: '480px', margin: '0 auto', width: '100%', padding: '32px 16px' }}>
      <button
        onClick={() => navigate('/')}
        style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer', fontSize: '13px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '4px' }}
      >
        ← Back
      </button>

      <div
        style={{
          background: 'var(--color-bg-card)',
          border: '1px solid var(--color-border)',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '24px',
        }}
      >
        <div className="flex items-center justify-between mb-2">
          <h1 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--color-text)', margin: 0 }}>
            {opening.name}
          </h1>
          <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>{opening.eco}</span>
        </div>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '13px', margin: '0 0 12px', lineHeight: 1.5 }}>
          {opening.description}
        </p>
        <div className="flex items-center gap-3">
          <DifficultyBadge difficulty={opening.difficulty} />
          <ProgressBadge status={progress.status} />
          <span style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginLeft: 'auto' }}>
            {opening.moves.length} moves
          </span>
        </div>
      </div>

      <h2 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '12px' }}>
        Choose a mode
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {/* Learn */}
        <button
          onClick={() => navigate(`/learn/${opening.id}`)}
          style={{
            background: 'var(--color-bg-card)',
            border: '1px solid var(--color-border)',
            borderRadius: '10px',
            padding: '16px',
            textAlign: 'left',
            cursor: 'pointer',
            transition: 'border-color 0.15s',
          }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--color-gold)')}
          onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--color-border)')}
        >
          <div style={{ fontWeight: 700, color: 'var(--color-gold)', fontSize: '16px', marginBottom: '4px' }}>
            📖 Learn
          </div>
          <div style={{ color: 'var(--color-text-muted)', fontSize: '13px' }}>
            Step through the opening move by move with strategic explanations.
          </div>
        </button>

        {/* Quiz */}
        <button
          onClick={() => navigate(`/quiz/${opening.id}`)}
          style={{
            background: 'var(--color-bg-card)',
            border: '1px solid var(--color-border)',
            borderRadius: '10px',
            padding: '16px',
            textAlign: 'left',
            cursor: 'pointer',
            transition: 'border-color 0.15s',
          }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--color-gold)')}
          onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--color-border)')}
        >
          <div style={{ fontWeight: 700, color: '#4ade80', fontSize: '16px', marginBottom: '4px' }}>
            🎯 Quiz
          </div>
          <div style={{ color: 'var(--color-text-muted)', fontSize: '13px' }}>
            Find the correct move. Instant feedback on every move.
          </div>
        </button>

        {/* Drill */}
        <button
          onClick={() => navigate(`/drill/${opening.id}`)}
          style={{
            background: 'var(--color-bg-card)',
            border: '1px solid var(--color-border)',
            borderRadius: '10px',
            padding: '16px',
            textAlign: 'left',
            cursor: 'pointer',
            transition: 'border-color 0.15s',
          }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--color-gold)')}
          onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--color-border)')}
        >
          <div style={{ fontWeight: 700, color: '#fbbf24', fontSize: '16px', marginBottom: '4px' }}>
            ⚡ Drill
          </div>
          <div style={{ color: 'var(--color-text-muted)', fontSize: '13px' }}>
            Your opponent deviates — find the best punishment.
          </div>
        </button>
      </div>

      <div style={{ marginTop: '16px', textAlign: 'center' }}>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/dashboard')}
        >
          View progress dashboard
        </Button>
      </div>
    </div>
  );
}
