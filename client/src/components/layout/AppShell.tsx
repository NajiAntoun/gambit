import { Outlet, Link, useLocation } from 'react-router-dom';

export function AppShell() {
  const location = useLocation();
  const isBoard = /^\/(learn|quiz|drill)\//.test(location.pathname);

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
          </nav>
        </header>
      )}
      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>
    </div>
  );
}
