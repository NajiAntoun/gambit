import { SignIn } from '@clerk/clerk-react';
import { clerkAppearance } from '../lib/clerkTheme';

export function SignInPage() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100svh',
        background: 'var(--color-bg-dark)',
        padding: '1rem',
      }}
    >
      <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '0.25rem' }}>♟</div>
        <div
          style={{
            fontSize: '1.75rem',
            fontWeight: 700,
            letterSpacing: '-0.02em',
            color: 'var(--color-gold)',
          }}
        >
          Gambit
        </div>
        <div
          style={{
            fontSize: '0.875rem',
            color: 'var(--color-text-muted)',
            marginTop: '0.25rem',
          }}
        >
          Master chess openings
        </div>
      </div>
      <SignIn
        routing="path"
        path="/sign-in"
        signUpUrl="/sign-up"
        fallbackRedirectUrl="/"
        appearance={clerkAppearance}
      />
    </div>
  );
}
