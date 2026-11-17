import React from 'react';
import { useAuth } from './AuthProvider.jsx';
import SignIn from './SignIn.jsx';

export default function AuthGate({ children }) {
  const { user, status } = useAuth();
  if (status === 'checking') return <div id="cs409-job-ui" className="jh-session-loading"><p role="status">Restoring your demo session…</p></div>;
  return user ? children : <SignIn />;
}
