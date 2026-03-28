import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ClerkProvider, useAuth } from '@clerk/clerk-react';
import { ErrorBoundary } from './components/ErrorBoundary';
import './App.css';
import { AppShell } from './components/layout/AppShell';
import { ProgressContext, useProgressState } from './hooks/useProgress';
import { AccountContext, useAccountState } from './hooks/useAccount';
import { Home } from './routes/Home';
import { ModeSelect } from './routes/ModeSelect';
import { Learn } from './routes/Learn';
import { Quiz } from './routes/Quiz';
import { Drill } from './routes/Drill';
import { Dashboard } from './routes/Dashboard';
import { Profile } from './routes/Profile';
import { SignInPage } from './routes/SignIn';
import { SignUpPage } from './routes/SignUp';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY as string;

const router = createBrowserRouter([
  { path: '/sign-in/*', element: <SignInPage /> },
  { path: '/sign-up/*', element: <SignUpPage /> },
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true,                  element: <Home />        },
      { path: 'mode/:openingId',      element: <ModeSelect />  },
      { path: 'learn/:openingId',     element: <Learn />       },
      { path: 'quiz/:openingId',      element: <Quiz />        },
      { path: 'drill/:openingId',     element: <Drill />       },
      { path: 'dashboard',            element: <Dashboard />   },
      { path: 'profile',              element: <Profile />     },
    ],
  },
]);

/**
 * Lives inside ClerkProvider so it can call useAuth().
 * Both contexts start fetching from the server in parallel on mount.
 */
function AppWithAuth() {
  const { userId } = useAuth();
  const progressValue = useProgressState(userId ?? '');
  const accountValue  = useAccountState();

  return (
    <ProgressContext.Provider value={progressValue}>
      <AccountContext.Provider value={accountValue}>
        <RouterProvider router={router} />
      </AccountContext.Provider>
    </ProgressContext.Provider>
  );
}

export default function App() {
  if (!PUBLISHABLE_KEY) {
    return (
      <div style={{ color: '#e8dcc8', background: '#0f1a0f', minHeight: '100svh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', textAlign: 'center' }}>
        <div>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⚠️</div>
          <p style={{ marginBottom: '0.5rem', fontWeight: 600 }}>Missing Clerk key</p>
          <p style={{ color: '#9a8a6a', fontSize: '0.875rem' }}>
            Set <code>VITE_CLERK_PUBLISHABLE_KEY</code> in your <code>.env.local</code> file.
          </p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
        <AppWithAuth />
      </ClerkProvider>
    </ErrorBoundary>
  );
}
