import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './App.css';
import { AppShell } from './components/layout/AppShell';
import { ProgressContext, useProgressState } from './hooks/useProgress';
import { Home } from './routes/Home';
import { ModeSelect } from './routes/ModeSelect';
import { Learn } from './routes/Learn';
import { Quiz } from './routes/Quiz';
import { Dashboard } from './routes/Dashboard';

const router = createBrowserRouter([
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

function ProgressProvider({ children }: { children: React.ReactNode }) {
  const value = useProgressState();
  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export default function App() {
  return (
    <ProgressProvider>
      <RouterProvider router={router} />
    </ProgressProvider>
  );
}
