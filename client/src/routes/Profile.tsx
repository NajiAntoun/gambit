import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import { useAccount } from '../hooks/useAccount';
import { fetchChessCom, fetchLichess } from '../lib/api';
import type { ChessLevel, PreferredColor, Goal, Gender, ChessTitle } from '../data/types';

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

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
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
        {hint && (
          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', opacity: 0.6 }}>
            {hint}
          </span>
        )}
      </div>
      {children}
    </div>
  );
}

// ─── Section divider ──────────────────────────────────────────────────────────

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        margin: '0.5rem 0',
      }}
    >
      <div style={{ flex: 1, height: '1px', background: 'var(--color-border)' }} />
      <span
        style={{
          fontSize: '0.7rem',
          fontWeight: 700,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: 'var(--color-text-muted)',
          opacity: 0.7,
          whiteSpace: 'nowrap',
        }}
      >
        {children}
      </span>
      <div style={{ flex: 1, height: '1px', background: 'var(--color-border)' }} />
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

const chessTitleOptions: SegOption<ChessTitle>[] = [
  { value: 'GM',  label: 'GM'  },
  { value: 'IM',  label: 'IM'  },
  { value: 'FM',  label: 'FM'  },
  { value: 'CM',  label: 'CM'  },
  { value: 'NM',  label: 'NM'  },
  { value: 'WGM', label: 'WGM' },
  { value: 'WIM', label: 'WIM' },
  { value: 'WFM', label: 'WFM' },
  { value: 'WCM', label: 'WCM' },
];

// ─── Platform connector component ─────────────────────────────────────────────

type PlatformId = 'chessCom' | 'lichess';

interface PlatformRatings {
  rapid:  number | null;
  blitz:  number | null;
  bullet: number | null;
}

interface PlatformConnectorProps {
  platform: PlatformId;
  savedUsername: string | null;
  savedRatings: PlatformRatings;
  onImport: (username: string, ratings: PlatformRatings) => void;
}

const PLATFORM_META: Record<PlatformId, { label: string; icon: string; placeholder: string; profileUrl: (u: string) => string }> = {
  chessCom: {
    label:      'Chess.com',
    icon:       '♞',
    placeholder: 'your Chess.com username',
    profileUrl: (u) => `https://www.chess.com/member/${u}`,
  },
  lichess: {
    label:      'Lichess',
    icon:       '♜',
    placeholder: 'your Lichess username',
    profileUrl: (u) => `https://lichess.org/@/${u}`,
  },
};

function PlatformConnector({ platform, savedUsername, savedRatings, onImport }: PlatformConnectorProps) {
  const meta = PLATFORM_META[platform];
  const [username, setUsername] = useState(savedUsername ?? '');
  const [fetching, setFetching] = useState(false);
  const [preview, setPreview] = useState<PlatformRatings | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Keep local username in sync if parent account loads
  useEffect(() => {
    setUsername(savedUsername ?? '');
    setPreview(null);
    setError(null);
  }, [savedUsername]);

  async function handleFetch() {
    if (!username.trim()) return;
    setFetching(true);
    setError(null);
    setPreview(null);
    try {
      const ratings = platform === 'chessCom'
        ? await fetchChessCom(username.trim())
        : await fetchLichess(username.trim());
      setPreview(ratings);
    } catch {
      setError('User not found — check the username and try again.');
    } finally {
      setFetching(false);
    }
  }

  function handleImport() {
    if (!preview) return;
    onImport(username.trim(), preview);
    setPreview(null);
  }

  const isConnected = !!savedUsername;
  const headline = savedRatings.rapid ?? savedRatings.blitz ?? savedRatings.bullet;

  return (
    <div
      style={{
        borderRadius: '8px',
        border: isConnected
          ? '1.5px solid rgba(201,168,76,0.35)'
          : '1.5px solid rgba(201,168,76,0.12)',
        background: isConnected ? 'rgba(201,168,76,0.05)' : 'transparent',
        padding: '1rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
        transition: 'all 0.2s',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '1.1rem' }}>{meta.icon}</span>
          <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-text)' }}>
            {meta.label}
          </span>
          {isConnected && (
            <span
              style={{
                fontSize: '0.7rem',
                fontWeight: 700,
                color: '#4caf7d',
                background: 'rgba(76,175,125,0.12)',
                padding: '0.15rem 0.5rem',
                borderRadius: '99px',
                letterSpacing: '0.05em',
              }}
            >
              Connected
            </span>
          )}
        </div>
        {isConnected && headline !== null && (
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-gold)' }}>
            {headline}
          </span>
        )}
      </div>

      {/* Connected state: show ratings + profile link */}
      {isConnected && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <a
            href={meta.profileUrl(savedUsername!)}
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontSize: '0.8rem', color: 'var(--color-gold)', textDecoration: 'none', opacity: 0.85 }}
          >
            @{savedUsername} ↗
          </a>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {(['rapid', 'blitz', 'bullet'] as const).map((tc) =>
              savedRatings[tc] !== null ? (
                <span
                  key={tc}
                  style={{
                    fontSize: '0.75rem',
                    color: 'var(--color-text-muted)',
                    background: 'rgba(255,255,255,0.04)',
                    padding: '0.2rem 0.5rem',
                    borderRadius: '4px',
                  }}
                >
                  {tc.charAt(0).toUpperCase() + tc.slice(1)} {savedRatings[tc]}
                </span>
              ) : null,
            )}
          </div>
        </div>
      )}

      {/* Input row */}
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <input
          type="text"
          value={username}
          onChange={(e) => { setUsername(e.target.value); setPreview(null); setError(null); }}
          onKeyDown={(e) => e.key === 'Enter' && void handleFetch()}
          placeholder={meta.placeholder}
          style={{ ...inputStyle, flex: 1, fontSize: '0.875rem', padding: '0.5rem 0.75rem' }}
        />
        <button
          type="button"
          onClick={() => void handleFetch()}
          disabled={fetching || !username.trim()}
          style={{
            padding: '0.5rem 1rem',
            borderRadius: '6px',
            border: '1.5px solid rgba(201,168,76,0.3)',
            background: 'rgba(201,168,76,0.08)',
            color: 'var(--color-gold)',
            fontWeight: 600,
            fontSize: '0.8rem',
            cursor: fetching || !username.trim() ? 'not-allowed' : 'pointer',
            opacity: fetching || !username.trim() ? 0.5 : 1,
            whiteSpace: 'nowrap',
            transition: 'all 0.15s',
          }}
        >
          {fetching ? '…' : 'Fetch'}
        </button>
      </div>

      {/* Error */}
      {error && (
        <p style={{ fontSize: '0.8rem', color: '#e07070', margin: 0 }}>{error}</p>
      )}

      {/* Preview card */}
      {preview && (
        <div
          style={{
            borderRadius: '6px',
            border: '1.5px solid rgba(201,168,76,0.25)',
            background: 'rgba(201,168,76,0.06)',
            padding: '0.75rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.75rem',
            flexWrap: 'wrap',
          }}
        >
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {(['rapid', 'blitz', 'bullet'] as const).map((tc) =>
              preview[tc] !== null ? (
                <span
                  key={tc}
                  style={{
                    fontSize: '0.8rem',
                    color: 'var(--color-text)',
                    background: 'rgba(255,255,255,0.06)',
                    padding: '0.25rem 0.6rem',
                    borderRadius: '4px',
                  }}
                >
                  <span style={{ color: 'var(--color-text-muted)', fontSize: '0.7rem' }}>
                    {tc.charAt(0).toUpperCase() + tc.slice(1)}{' '}
                  </span>
                  <strong>{preview[tc]}</strong>
                </span>
              ) : null,
            )}
            {preview.rapid === null && preview.blitz === null && preview.bullet === null && (
              <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                No rated games found
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={handleImport}
            style={{
              padding: '0.35rem 0.9rem',
              borderRadius: '6px',
              border: 'none',
              background: 'var(--color-gold)',
              color: '#0f1a0f',
              fontWeight: 700,
              fontSize: '0.8rem',
              cursor: 'pointer',
            }}
          >
            Import
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Profile page ─────────────────────────────────────────────────────────────

export function Profile() {
  const { account, isLoading, saveAccount } = useAccount();
  const { userId } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isOnboarding = searchParams.get('welcome') === 'true';

  // ── Personal info
  const [displayName,    setDisplayName]    = useState('');
  const [birthYear,      setBirthYear]      = useState('');
  const [country,        setCountry]        = useState('');
  const [gender,         setGender]         = useState<Gender | null>(null);

  // ── Chess background
  const [chessLevel,     setChessLevel]     = useState<ChessLevel | null>(null);
  const [preferredColor, setPreferredColor] = useState<PreferredColor | null>(null);
  const [goal,           setGoal]           = useState<Goal | null>(null);

  // ── Official rating
  const [chessTitle,     setChessTitle]     = useState<ChessTitle | null>(null);
  const [fideId,         setFideId]         = useState('');
  const [fideRating,     setFideRating]     = useState('');

  // ── Platform connections (stored as imported values, not form inputs)
  const [chessComUsername, setChessComUsername] = useState<string | null>(null);
  const [chessComRapid,    setChessComRapid]    = useState<number | null>(null);
  const [chessComBlitz,    setChessComBlitz]    = useState<number | null>(null);
  const [chessComBullet,   setChessComBullet]   = useState<number | null>(null);
  const [lichessUsername,  setLichessUsername]  = useState<string | null>(null);
  const [lichessRapid,     setLichessRapid]     = useState<number | null>(null);
  const [lichessBlitz,     setLichessBlitz]     = useState<number | null>(null);
  const [lichessBullet,    setLichessBullet]    = useState<number | null>(null);

  const [saving,  setSaving]  = useState(false);
  const [saved,   setSaved]   = useState(false);
  const [copied,  setCopied]  = useState(false);

  // Pre-fill from existing account data
  useEffect(() => {
    if (!account) return;
    setDisplayName(   account.displayName    ?? '');
    setBirthYear(     account.birthYear?.toString() ?? '');
    setCountry(       account.country        ?? '');
    setGender(        account.gender         ?? null);
    setChessLevel(    account.chessLevel     ?? null);
    setPreferredColor(account.preferredColor ?? null);
    setGoal(          account.goal           ?? null);
    setChessTitle(    account.chessTitle     ?? null);
    setFideId(        account.fideId         ?? '');
    setFideRating(    account.fideRating?.toString() ?? '');
    setChessComUsername(account.chessComUsername ?? null);
    setChessComRapid(   account.chessComRapid   ?? null);
    setChessComBlitz(   account.chessComBlitz   ?? null);
    setChessComBullet(  account.chessComBullet  ?? null);
    setLichessUsername( account.lichessUsername ?? null);
    setLichessRapid(    account.lichessRapid    ?? null);
    setLichessBlitz(    account.lichessBlitz    ?? null);
    setLichessBullet(   account.lichessBullet   ?? null);
  }, [account]);

  const handleChessComImport = useCallback((username: string, ratings: { rapid: number | null; blitz: number | null; bullet: number | null }) => {
    setChessComUsername(username);
    setChessComRapid(ratings.rapid);
    setChessComBlitz(ratings.blitz);
    setChessComBullet(ratings.bullet);
  }, []);

  const handleLichessImport = useCallback((username: string, ratings: { rapid: number | null; blitz: number | null; bullet: number | null }) => {
    setLichessUsername(username);
    setLichessRapid(ratings.rapid);
    setLichessBlitz(ratings.blitz);
    setLichessBullet(ratings.bullet);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await saveAccount({
        displayName:      displayName.trim() || null,
        birthYear:        birthYear ? parseInt(birthYear, 10) : null,
        country:          country.trim()     || null,
        gender,
        chessLevel,
        preferredColor,
        goal,
        chessTitle,
        fideId:           fideId.trim()      || null,
        fideRating:       fideRating ? parseInt(fideRating, 10) : null,
        chessComUsername,
        chessComRapid,
        chessComBlitz,
        chessComBullet,
        lichessUsername,
        lichessRapid,
        lichessBlitz,
        lichessBullet,
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
    await saveAccount({});
    navigate('/', { replace: true });
  }

  function handleCopyId() {
    if (!userId) return;
    void navigator.clipboard.writeText(userId).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
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
          maxWidth: '520px',
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
          maxWidth: '520px',
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

          {/* ── Personal info ─────────────────────────────────────── */}
          <SectionHeading>Personal info</SectionHeading>

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

          <Field label="Gender">
            <SegmentedControl
              options={genderOptions}
              value={gender}
              onChange={setGender}
            />
          </Field>

          {/* ── Chess background ──────────────────────────────────── */}
          <SectionHeading>Chess background</SectionHeading>

          <Field label="Chess level">
            <SegmentedControl
              options={chessLevelOptions}
              value={chessLevel}
              onChange={setChessLevel}
            />
          </Field>

          <Field label="Preferred color">
            <SegmentedControl
              options={colorOptions}
              value={preferredColor}
              onChange={setPreferredColor}
            />
          </Field>

          <Field label="My goal">
            <SegmentedControl
              options={goalOptions}
              value={goal}
              onChange={setGoal}
            />
          </Field>

          {/* ── Official rating ───────────────────────────────────── */}
          <SectionHeading>Official rating</SectionHeading>

          <Field label="Chess title" hint="(if you hold one)">
            <SegmentedControl
              options={chessTitleOptions}
              value={chessTitle}
              onChange={setChessTitle}
            />
          </Field>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <Field label="FIDE ID" hint="optional">
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <input
                  type="text"
                  value={fideId}
                  onChange={(e) => setFideId(e.target.value)}
                  placeholder="e.g. 1503014"
                  maxLength={20}
                  style={{ ...inputStyle, flex: 1 }}
                />
                {fideId.trim() && (
                  <a
                    href={`https://ratings.fide.com/profile/${fideId.trim()}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: 'var(--color-gold)', fontSize: '0.8rem', whiteSpace: 'nowrap', textDecoration: 'none' }}
                  >
                    ↗ FIDE
                  </a>
                )}
              </div>
            </Field>

            <Field label="FIDE Rating" hint="manual">
              <input
                type="number"
                value={fideRating}
                onChange={(e) => setFideRating(e.target.value)}
                placeholder="e.g. 1850"
                min={0}
                max={4000}
                style={inputStyle}
              />
            </Field>
          </div>

          {/* ── Platform connections ──────────────────────────────── */}
          <SectionHeading>Platform connections</SectionHeading>

          <PlatformConnector
            platform="chessCom"
            savedUsername={chessComUsername}
            savedRatings={{ rapid: chessComRapid, blitz: chessComBlitz, bullet: chessComBullet }}
            onImport={handleChessComImport}
          />

          <PlatformConnector
            platform="lichess"
            savedUsername={lichessUsername}
            savedRatings={{ rapid: lichessRapid, blitz: lichessBlitz, bullet: lichessBullet }}
            onImport={handleLichessImport}
          />

          {/* ── Submit ────────────────────────────────────────────── */}
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

        {/* ── Your account footer ───────────────────────────────── */}
        {userId && (
          <div
            style={{
              marginTop: '2rem',
              paddingTop: '1.5rem',
              borderTop: '1px solid var(--color-border)',
            }}
          >
            <p
              style={{
                fontSize: '0.7rem',
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'var(--color-text-muted)',
                marginBottom: '0.5rem',
                opacity: 0.6,
              }}
            >
              Your account
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <code
                style={{
                  fontSize: '0.75rem',
                  color: 'var(--color-text-muted)',
                  background: 'rgba(255,255,255,0.04)',
                  padding: '0.35rem 0.65rem',
                  borderRadius: '4px',
                  fontFamily: 'monospace',
                  wordBreak: 'break-all',
                  flex: 1,
                }}
              >
                {userId}
              </code>
              <button
                type="button"
                onClick={handleCopyId}
                title="Copy user ID"
                style={{
                  background: 'none',
                  border: '1.5px solid rgba(201,168,76,0.2)',
                  borderRadius: '6px',
                  color: copied ? '#4caf7d' : 'var(--color-text-muted)',
                  fontSize: '0.75rem',
                  padding: '0.35rem 0.65rem',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'color 0.2s',
                }}
              >
                {copied ? '✓ Copied' : 'Copy'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
