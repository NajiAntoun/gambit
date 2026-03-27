import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ClerkProvider, useAuth } from '@clerk/clerk-react';
import './App.css';
import { AppShell } from './components/layout/AppShell';
import { ProgressContext, useProgressState } from './hooks/useProgress';
import { Home } from './routes/Home';
import { ModeSelect } from './routes/ModeSelect';
import { Learn } from './routes/Learn';
import { Quiz } from './routes/Quiz';
import { Dashboard } from './routes/Dashboard';
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
      { index: true, element: <Home /> },
      { path: 'mode/:openingId', element: <ModeSelect /> },
      { path: 'learn/:openingId', element: <Learn /> },
      { path: 'quiz/:openingId', element: <Quiz /> },
      { path: 'dashboard', element: <Dashboard /> },
    ],
  },
]);

/** Lives inside ClerkProvider so it can call useAuth(). */
function AppWithAuth() {
  const { userId } = useAuth();
  const progressValue = useProgressState(userId ?? '');
  return (
    <ProgressContext.Provider value={progressValue}>
      <RouterProvider router={router} />
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
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <AppWithAuth />
    </ClerkProvider>
  );
}
