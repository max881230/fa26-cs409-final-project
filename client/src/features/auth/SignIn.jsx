import React, { useEffect, useRef, useState } from 'react';
import Brand from '../../components/ui/Brand.jsx';
import ThemeControl from '../theme/ThemeControl.jsx';
import { DEMO_CREDENTIALS } from '../../mocks/auth.js';
import { useAuth } from './AuthProvider.jsx';

export default function SignIn() {
  const { signIn, status, error, clearError } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const usernameRef = useRef(null);
  const passwordRef = useRef(null);
  const errorRef = useRef(null);
  const busy = status === 'signingIn';

  useEffect(() => { if (error) errorRef.current?.focus(); }, [error]);

  const submit = async event => {
    event.preventDefault();
    if (busy) return;
    const nextErrors = {};
    if (!username.trim()) nextErrors.username = 'Enter your username.';
    if (!password) nextErrors.password = 'Enter your password.';
    setErrors(nextErrors);
    clearError();
    if (nextErrors.username) return usernameRef.current.focus();
    if (nextErrors.password) return passwordRef.current.focus();
    await signIn(username, password);
  };

  return <div id="cs409-job-ui" className="jh-auth-shell">
    <header className="jh-top jh-auth-top"><Brand /><ThemeControl /></header>
    <main className="jh-auth-main">
      <section className="jh-auth-card" aria-labelledby="sign-in-title">
        <h1 id="sign-in-title">Sign in</h1>
        <p className="jh-subtitle">Demo sign-in · Use the sample credentials below, not a real password.</p>
        <form onSubmit={submit} noValidate aria-labelledby="sign-in-title" aria-busy={busy}>
          {error && <div ref={errorRef} tabIndex={-1} role="alert" className="jh-auth-error">{error}</div>}
          <fieldset disabled={busy}>
            <label className="jh-field" htmlFor="sign-in-username">Username
              <input id="sign-in-username" ref={usernameRef} name="username" autoComplete="username" autoCapitalize="none" spellCheck={false} required value={username} aria-invalid={Boolean(errors.username)} aria-describedby={errors.username ? 'username-error' : undefined} onChange={event => { setUsername(event.target.value); setErrors(current => ({ ...current, username: '' })); clearError(); }} />
            </label>
            {errors.username && <p id="username-error" className="jh-field-error">{errors.username}</p>}
            <label className="jh-field jh-password-label" htmlFor="sign-in-password">Password</label>
            <div className="jh-password-input">
              <input id="sign-in-password" ref={passwordRef} name="password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" required value={password} aria-invalid={Boolean(errors.password)} aria-describedby={errors.password ? 'password-error' : undefined} onChange={event => { setPassword(event.target.value); setErrors(current => ({ ...current, password: '' })); clearError(); }} />
              <button type="button" aria-label={showPassword ? 'Hide password' : 'Show password'} aria-pressed={showPassword} onClick={() => setShowPassword(current => !current)}>{showPassword ? 'Hide' : 'Show'}</button>
            </div>
            {errors.password && <p id="password-error" className="jh-field-error">{errors.password}</p>}
            <button type="submit" className="jh-btn jh-btn-main jh-sign-in-button">{busy ? 'Signing in…' : 'Sign in →'}</button>
            <div className="jh-demo-credentials">
              <dl><div><dt>Username</dt><dd><code>demo</code></dd></div><div><dt>Password</dt><dd><code>demo</code></dd></div></dl>
              <button type="button" className="jh-link" onClick={() => { setUsername(DEMO_CREDENTIALS.username); setPassword(DEMO_CREDENTIALS.password); setErrors({}); clearError(); usernameRef.current.focus(); }}>Fill demo credentials</button>
            </div>
          </fieldset>
        </form>
      </section>
    </main>
  </div>;
}
