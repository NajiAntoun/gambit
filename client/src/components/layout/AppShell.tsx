import { Outlet, Link, useLocation, Navigate, useNavigate } from 'react-router-dom';
import { useAuth, UserButton } from '@clerk/clerk-react';
import { useProgress } from '../../hooks/useProgress';
import { useAccount } from '../../hooks/useAccount';
import { OnlineWidget } from './OnlineWidget';

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

          <nav className="flex items-center gap-3">
            {/* Online presence widget */}
            <OnlineWidget />

            {/* Clerk UserButton with custom menu items */}
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
