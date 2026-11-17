import React from 'react';
import AppProviders from './AppProviders.jsx';
import AuthGate from '../features/auth/AuthGate.jsx';
import Workspace from './Workspace.jsx';

export default function App() {
  return <AppProviders><AuthGate><Workspace /></AuthGate></AppProviders>;
}
