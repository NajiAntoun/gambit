import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAccount } from '../hooks/useAccount';
import type { ChessLevel, PreferredColor, Goal, Gender } from '../data/types';

// ─── Segmented control ────────────────────────────────────────────────────────

interface SegOption<T> { value: T; label: string }

function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
}: {
  options: SegOption<T>[];
  value: T | null;
  onChange: (v: T) => void;
}) {
  return (
    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
      {options.map((opt) => {
        const selected = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              border: selected
                ? '2px solid var(--color-gold)'
                : '2px solid rgba(201,168,76,0.2)',
              background: selected ? 'rgba(201,168,76,0.12)' : 'transparent',
              color: selected ? 'var(--color-gold)' : 'var(--color-text-muted)',
              fontWeight: selected ? 600 : 400,
              fontSize: '0.875rem',
              cursor: 'pointer',
              transition: 'all 0.15s',
              lineHeight: 1.4,
              textAlign: 'center',
            }}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

// ─── Field wrapper ────────────────────────────────────────────────────────────

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <label
        style={{
          fontSize: '0.8rem',
          fontWeight: 600,
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
          color: 'var(--color-text-muted)',
        }}
      >
        {label}
      </label>
      {children}
    </div>
  );
}

// ─── Input style ─────────────────────────────────────────────────────────────

const inputStyle: React.CSSProperties = {
  padding: '0.625rem 0.875rem',
  borderRadius: '6px',
  border: '1.5px solid rgba(201,168,76,0.2)',
  background: 'var(--color-bg-dark)',
  color: 'var(--color-text)',
  fontSize: '0.9375rem',
  outline: 'none',
  width: '100%',
  boxSizing: 'border-box',
  transition: 'border-color 0.15s',
};

// ─── Current year for age calc ────────────────────────────────────────────────

const CURRENT_YEAR = new Date().getFullYear();

function inferredAge(birthYear: number | null): number | null {
  if (!birthYear || birthYear < 1900 || birthYear > CURRENT_YEAR) return null;
  return CURRENT_YEAR - birthYear;
}

// ─── Options ──────────────────────────────────────────────────────────────────

const chessLevelOptions: SegOption<ChessLevel>[] = [
  { value: 'beginner',     label: '🌱 Beginner'     },
  { value: 'intermediate', label: '⚡ Intermediate'  },
  { value: 'advanced',     label: '🔥 Advanced'      },
];

const colorOptions: SegOption<PreferredColor>[] = [
  { value: 'white', label: '♙ White' },
  { value: 'both',  label: '♟♙ Both' },
  { value: 'black', label: '♟ Black' },
];

const goalOptions: SegOption<Goal>[] = [
  { value: 'casual',      label: '🎯 Casual fun'        },
  { value: 'tournament',  label: '🏆 Tournament prep'   },
  { value: 'rating',      label: '📈 Improve rating'    },
];

const genderOptions: SegOption<Gender>[] = [
  { value: 'male',              label: '♂ Male'              },
  { value: 'female',            label: '♀ Female'            },
  { value: 'nonbinary',         label: '⚧ Non-binary'        },
  { value: 'prefer_not_to_say', label: '— Prefer not to say' },
];

// ─── Profile page ─────────────────────────────────────────────────────────────

export function Profile() {
  const { account, isLoading, saveAccount } = useAccount();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isOnboarding = searchParams.get('welcome') === 'true';

  const [displayName,    setDisplayName]    = useState('');
  const [birthYear,      setBirthYear]      = useState('');
  const [country,        setCountry]        = useState('');
  const [chessLevel,     setChessLevel]     = useState<ChessLevel | null>(null);
  const [preferredColor, setPreferredColor] = useState<PreferredColor | null>(null);
  const [goal,           setGoal]           = useState<Goal | null>(null);
  const [gender,         setGender]         = useState<Gender | null>(null);
  const [saving,         setSaving]         = useState(false);
  const [saved,          setSaved]          = useState(false);

  // Pre-fill form from existing account data
  useEffect(() => {
    if (!account) return;
    setDisplayName(account.displayName    ?? '');
    setBirthYear(  account.birthYear?.toString() ?? '');
    setCountry(    account.country        ?? '');
    setChessLevel( account.chessLevel     ?? null);
    setPreferredColor(account.preferredColor ?? null);
    setGoal(       account.goal           ?? null);
    setGender(     account.gender         ?? null);
  }, [account]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await saveAccount({
        displayName:    displayName.trim() || null,
        birthYear:      birthYear ? parseInt(birthYear, 10) : null,
        country:        country.trim()     || null,
        chessLevel,
        preferredColor,
        goal,
        gender,
      });
      if (isOnboarding) {
        navigate('/', { replace: true });
      } else {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }
    } catch (err) {
      console.error('Failed to save profile:', err);
    } finally {
      setSaving(false);
    }
  }

  async function handleSkip() {
    // Create the row with empty data so onboarding doesn't repeat
    await saveAccount({});
    navigate('/', { replace: true });
  }

  const age = inferredAge(birthYear ? parseInt(birthYear, 10) : null);

  if (isLoading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100svh', background: 'var(--color-bg-dark)' }}>
        <span style={{ color: 'var(--color-text-muted)' }}>Loading…</span>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: '100svh',
        background: 'var(--color-bg-dark)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '2rem 1rem 4rem',
      }}
    >
      {/* Top bar */}
      <div
        style={{
          width: '100%',
          maxWidth: '480px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '2rem',
        }}
      >
        {isOnboarding ? (
          <span style={{ color: 'var(--color-gold)', fontWeight: 700, fontSize: '1.1rem' }}>
            ♟ Gambit
          </span>
        ) : (
          <Link
            to="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              color: 'var(--color-text-muted)',
              fontSize: '0.875rem',
              textDecoration: 'none',
            }}
          >
            ← Back
          </Link>
        )}
        {isOnboarding && (
          <button
            type="button"
            onClick={handleSkip}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--color-text-muted)',
              fontSize: '0.875rem',
              cursor: 'pointer',
              padding: '0.25rem 0',
            }}
          >
            Skip for now →
          </button>
        )}
      </div>

      {/* Card */}
      <div
        style={{
          width: '100%',
          maxWidth: '480px',
          background: 'var(--color-bg-card)',
          borderRadius: '12px',
          border: '1px solid var(--color-border)',
          padding: '2rem',
          boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1
            style={{
              fontSize: '1.5rem',
              fontWeight: 700,
              color: 'var(--color-text)',
              marginBottom: '0.375rem',
            }}
          >
            {isOnboarding ? 'Welcome to Gambit 👋' : 'Your Profile'}
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
            {isOnboarding
              ? 'Tell us a bit about yourself to personalise your experience.'
              : 'Update your details anytime.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

          {/* Display name */}
          <Field label="Display name">
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Your chess handle"
              maxLength={32}
              style={inputStyle}
            />
          </Field>

          {/* Birth year */}
          <Field label="Birth year">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <input
                type="number"
                value={birthYear}
                onChange={(e) => setBirthYear(e.target.value)}
                placeholder="e.g. 1990"
                min={1900}
                max={CURRENT_YEAR}
                style={{ ...inputStyle, width: '140px' }}
              />
              {age !== null && (
                <span style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                  ({age} years old)
                </span>
              )}
            </div>
          </Field>

          {/* Country */}
          <Field label="Country">
            <input
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              placeholder="e.g. France"
              maxLength={64}
              style={inputStyle}
            />
          </Field>

          {/* Gender */}
          <Field label="Gender">
            <SegmentedControl
              options={genderOptions}
              value={gender}
              onChange={setGender}
            />
          </Field>

          {/* Chess level */}
          <Field label="Chess level">
            <SegmentedControl
              options={chessLevelOptions}
              value={chessLevel}
              onChange={setChessLevel}
            />
          </Field>

          {/* Preferred color */}
          <Field label="Preferred color">
            <SegmentedControl
              options={colorOptions}
              value={preferredColor}
              onChange={setPreferredColor}
            />
          </Field>

          {/* Goal */}
          <Field label="My goal">
            <SegmentedControl
              options={goalOptions}
              value={goal}
              onChange={setGoal}
            />
          </Field>

          {/* Submit */}
          <button
            type="submit"
            disabled={saving}
            style={{
              marginTop: '0.5rem',
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              border: 'none',
              background: saved ? '#4a7c59' : 'var(--color-gold)',
              color: saved ? '#fff' : '#0f1a0f',
              fontWeight: 700,
              fontSize: '1rem',
              cursor: saving ? 'not-allowed' : 'pointer',
              opacity: saving ? 0.7 : 1,
              transition: 'all 0.2s',
              width: '100%',
            }}
          >
            {saving ? 'Saving…' : saved ? '✓ Saved!' : isOnboarding ? "Let's play →" : 'Save changes'}
          </button>
        </form>
      </div>
    </div>
  );
}
