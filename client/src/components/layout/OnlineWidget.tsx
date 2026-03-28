import { useState, useRef, useEffect } from 'react';
import { usePresence } from '../../hooks/usePresence';
import { countryToFlag } from '../../lib/countryFlags';
import type { OnlineUser } from '../../data/types';

// ─── Level icons ─────────────────────────────────────────────────────────────

const LEVEL_ICON: Record<string, string> = {
  beginner:     '🌱',
  intermediate: '⚡',
  advanced:     '🔥',
};

// ─── Gender icons ─────────────────────────────────────────────────────────────

const GENDER_ICON: Record<string, string> = {
  male:              '♂',
  female:            '♀',
  nonbinary:         '⚧',
  prefer_not_to_say: '',
};

// ─── Avatar colour derived from display name ─────────────────────────────────

const AVATAR_PALETTE = ['#c9a84c', '#4a7c59', '#2d6a9f', '#8b4c8b', '#c05a3a', '#3a8fa0'];

function avatarColor(name: string): string {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) % AVATAR_PALETTE.length;
  return AVATAR_PALETTE[Math.abs(h) % AVATAR_PALETTE.length];
}

// ─── Single user row ─────────────────────────────────────────────────────────

function UserRow({ user }: { user: OnlineUser }) {
  const name   = user.displayName ?? 'Anonymous';
  const flag   = countryToFlag(user.country);
  const level  = user.chessLevel ? LEVEL_ICON[user.chessLevel] ?? '' : '';
  const gender = user.gender ? GENDER_ICON[user.gender] ?? '' : '';
  const initial = name[0].toUpperCase();
  const color   = avatarColor(name);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '8px 16px',
        borderRadius: '6px',
        transition: 'background 0.1s',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(201,168,76,0.07)')}
      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
    >
      {/* Avatar — profile photo if available, else colored initial */}
      {user.imageUrl ? (
        <img
          src={user.imageUrl}
          alt={name}
          style={{
            width: '30px', height: '30px',
            borderRadius: '50%',
            objectFit: 'cover',
            flexShrink: 0,
          }}
        />
      ) : (
        <div
          style={{
            width: '30px', height: '30px',
            borderRadius: '50%',
            background: color,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 700, fontSize: '13px', color: '#fff',
            flexShrink: 0,
          }}
        >
          {initial}
        </div>
      )}

      {/* Name */}
      <span style={{ flex: 1, fontSize: '14px', color: 'var(--color-text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {name}
      </span>

      {/* Badges */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
        {gender && (
          <span style={{ fontSize: '13px', color: 'var(--color-text-muted)', lineHeight: 1 }} title={user.gender ?? ''}>
            {gender}
          </span>
        )}
        {flag && (
          <span style={{ fontSize: '16px', lineHeight: 1 }} title={user.country ?? ''}>
            {flag}
          </span>
        )}
        {level && (
          <span style={{ fontSize: '14px', lineHeight: 1 }} title={user.chessLevel ?? ''}>
            {level}
          </span>
        )}
        {user.rating !== null && (
          <span
            style={{
              fontSize: '12px',
              fontWeight: 700,
              color: 'var(--color-gold)',
              background: 'rgba(201,168,76,0.1)',
              padding: '1px 5px',
              borderRadius: '4px',
              lineHeight: 1.5,
            }}
          >
            {user.rating}
          </span>
        )}
      </div>
    </div>
  );
}

// ─── Online widget ────────────────────────────────────────────────────────────

export function OnlineWidget({ compact = false }: { compact?: boolean }) {
  const { count, users } = usePresence();
  const [open, setOpen]  = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!open) return;
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, [open]);

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      {/* Trigger button */}
      <button
        onClick={() => setOpen((o) => !o)}
        title="Who's online"
        style={{
          display: 'flex', alignItems: 'center', gap: compact ? '4px' : '6px',
          background: 'none', border: 'none', cursor: 'pointer',
          padding: compact ? '2px 5px' : '4px 8px', borderRadius: '8px',
          color: 'var(--color-text-muted)',
          transition: 'background 0.15s',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(201,168,76,0.08)')}
        onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
      >
        {/* Pulsing dot */}
        <span
          className="presence-dot"
          style={{
            display: 'inline-block',
            width: compact ? '6px' : '8px', height: compact ? '6px' : '8px',
            borderRadius: '50%',
            background: '#4caf7d',
            flexShrink: 0,
          }}
        />
        <span style={{ fontSize: compact ? '11px' : '13px', fontWeight: 600, minWidth: '12px' }}>
          {count}
        </span>
      </button>

      {/* Dropdown */}
      {open && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            right: 0,
            width: '280px',
            background: 'var(--color-bg-card)',
            border: '1px solid var(--color-border)',
            borderRadius: '12px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.45)',
            zIndex: 100,
            overflow: 'hidden',
          }}
        >
          {/* Header */}
          <div style={{
            padding: '12px 16px 8px',
            borderBottom: '1px solid var(--color-border)',
            display: 'flex', alignItems: 'center', gap: '8px',
          }}>
            <span className="presence-dot" style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#4caf7d' }} />
            <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-text)' }}>
              {count === 1 ? '1 player online' : `${count} players online`}
            </span>
          </div>

          {/* User list */}
          <div style={{ maxHeight: '360px', overflowY: 'auto', padding: '6px 0' }}>
            {users.length === 0 ? (
              <p style={{ color: 'var(--color-text-muted)', fontSize: '13px', textAlign: 'center', padding: '16px' }}>
                No players found
              </p>
            ) : (
              users.map((u, i) => <UserRow key={i} user={u} />)
            )}
          </div>
        </div>
      )}
    </div>
  );
}
