import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { authClient } from './authClient.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState('checking');
  const [error, setError] = useState('');
  const [sessionPersisted, setSessionPersisted] = useState(true);
  const inFlight = useRef(false);

  useEffect(() => {
    let active = true;
    authClient.getSession().then(sessionUser => {
      if (active) { setUser(sessionUser); setStatus(sessionUser ? 'signedIn' : 'signedOut'); }
    }).catch(() => { if (active) setStatus('signedOut'); });
    return () => { active = false; };
  }, []);

  const signIn = async (username, password) => {
    if (inFlight.current) return false;
    inFlight.current = true;
    setError('');
    setStatus('signingIn');
    try {
      const result = await authClient.signIn(username, password);
      setUser(result.user);
      setSessionPersisted(result.persisted);
      setStatus('signedIn');
      return true;
    } catch (failure) {
      setError(failure.message || 'Unable to sign in. Please try again.');
      setStatus('signedOut');
      return false;
    } finally {
      inFlight.current = false;
    }
  };

  const signOut = async () => {
    await authClient.signOut();
    setUser(null);
    setError('');
    setStatus('signedOut');
  };

  return <AuthContext.Provider value={{ user, status, error, sessionPersisted, signIn, signOut, clearError: () => setError('') }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error('useAuth requires AuthProvider');
  return value;
}
