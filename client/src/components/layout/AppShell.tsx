import { Outlet, useLocation, Navigate, useNavigate } from 'react-router-dom';
import { useAuth, UserButton } from '@clerk/clerk-react';
import { useProgress } from '../../hooks/useProgress';
import { useAccount } from '../../hooks/useAccount';
import { OnlineWidget } from './OnlineWidget';
import { GambitLogo } from './GambitLogo';
import { Link } from 'react-router-dom';

function LoadingScreen() {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100svh',
        background: 'var(--color-bg-dark)',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
        <span style={{ fontSize: '2rem' }}>♟</span>
        <span style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Loading…</span>
      </div>
    </div>
  );
}

/** Compact logo — just the knight badge, no wordmark */
function CompactLogo() {
  return (
    <Link
      to="/"
      style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}
    >
      <span
        style={{
          width: '2rem',
          height: '2rem',
          borderRadius: '0.5rem',
          background: 'linear-gradient(145deg, #d4b35a, #a8892e)',
          flexShrink: 0,
          boxShadow: '0 2px 8px rgba(0,0,0,0.3), 0 0 12px rgba(201,168,76,0.1)',
          overflow: 'hidden',
          position: 'relative',
          display: 'block',
        }}
      >
        <span
          style={{
            fontSize: '1.65rem',
            color: '#141f14',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-52%, -48%)',
            lineHeight: 1,
          }}
        >
          ♞
        </span>
      </span>
    </Link>
  );
}

export function AppShell() {
  const location  = useLocation();
  const navigate  = useNavigate();
  const { isLoaded, isSignedIn } = useAuth();
  const { isLoading: isProgressLoading } = useProgress();
  const { isLoading: isAccountLoading, isNewUser } = useAccount();
  const isBoard = /^\/(learn|quiz|drill)\//.test(location.pathname);

  if (!isLoaded || isProgressLoading || isAccountLoading) return <LoadingScreen />;
  if (!isSignedIn) return <Navigate to="/sign-in" replace />;
  if (isNewUser && location.pathname !== '/profile') {
    return <Navigate to="/profile?welcome=true" replace />;
  }

  return (
    <div className="flex flex-col min-h-svh" style={{ background: 'var(--color-bg-dark)' }}>
      {isBoard ? (
        /* ── Compact header for board pages ─────────────────────── */
        <header
          className="flex items-center justify-end gap-3 px-3 py-1.5 border-b"
          style={{
            borderColor: 'var(--color-border)',
            background: 'var(--color-bg-card)',
            position: 'relative',
            zIndex: 10,
            minHeight: '36px',
          }}
        >
          <div className="mr-auto">
            <CompactLogo />
          </div>
          <OnlineWidget compact />
          <UserButton>
            <UserButton.MenuItems>
              <UserButton.Action
                label="My Profile"
                labelIcon={<span style={{ fontSize: '14px' }}>♟</span>}
                onClick={() => navigate('/profile')}
              />
              <UserButton.Action
                label="Progress"
                labelIcon={<span style={{ fontSize: '14px' }}>📊</span>}
                onClick={() => navigate('/dashboard')}
              />
            </UserButton.MenuItems>
          </UserButton>
        </header>
      ) : (
        /* ── Full header for non-board pages ─────────────────────── */
        <header
          className="flex items-center justify-between px-4 py-3 border-b"
          style={{ borderColor: 'var(--color-border)', background: 'var(--color-bg-card)', overflow: 'visible', position: 'relative', zIndex: 10 }}
        >
          <GambitLogo />

          <nav className="flex items-center gap-3">
            <OnlineWidget />
            <UserButton>
              <UserButton.MenuItems>
                <UserButton.Action
                  label="My Profile"
                  labelIcon={<span style={{ fontSize: '14px' }}>♟</span>}
                  onClick={() => navigate('/profile')}
                />
                <UserButton.Action
                  label="Progress"
                  labelIcon={<span style={{ fontSize: '14px' }}>📊</span>}
                  onClick={() => navigate('/dashboard')}
                />
              </UserButton.MenuItems>
            </UserButton>
          </nav>
        </header>
      )}
      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>
    </div>
  );
}
