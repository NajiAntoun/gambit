import { Outlet, Link, useLocation, Navigate } from 'react-router-dom';
import { useAuth, UserButton } from '@clerk/clerk-react';
import { useProgress } from '../../hooks/useProgress';

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

export function AppShell() {
  const location = useLocation();
  const { isLoaded, isSignedIn } = useAuth();
  const { isLoading: isProgressLoading } = useProgress();
  const isBoard = /^\/(learn|quiz|drill)\//.test(location.pathname);

  if (!isLoaded || isProgressLoading) return <LoadingScreen />;
  if (!isSignedIn) return <Navigate to="/sign-in" replace />;

  return (
    <div className="flex flex-col min-h-svh" style={{ background: 'var(--color-bg-dark)' }}>
      {!isBoard && (
        <header
          className="flex items-center justify-between px-4 py-3 border-b"
          style={{ borderColor: 'var(--color-border)', background: 'var(--color-bg-card)' }}
        >
          <Link to="/" className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-tight" style={{ color: 'var(--color-gold)' }}>
              ♟ Gambit
            </span>
          </Link>
          <nav className="flex items-center gap-4">
            <Link
              to="/dashboard"
              className="text-sm font-medium transition-colors"
              style={{ color: 'var(--color-text-muted)' }}
            >
              Progress
            </Link>
            <UserButton
              appearance={{
                elements: { avatarBox: { width: '2rem', height: '2rem' } },
              }}
            />
          </nav>
        </header>
      )}
      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>
    </div>
  );
}
