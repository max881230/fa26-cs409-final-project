import React from 'react';
import { useAuth } from './AuthProvider.jsx';

export default function UserMenu() {
  const { user, signOut } = useAuth();
  return <div className="jh-user-menu">
    <span className="jh-avatar" aria-hidden="true">D</span>
    <span className="jh-user-name">{user.name}<small>Demo account</small></span>
    <button className="jh-btn jh-btn-quiet" onClick={signOut}>Sign out</button>
  </div>;
}
