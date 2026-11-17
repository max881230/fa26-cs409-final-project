import React from 'react';
import { AuthProvider } from '../features/auth/AuthProvider.jsx';
import { ThemeProvider } from '../features/theme/ThemeProvider.jsx';

export default function AppProviders({ children }) {
  return <ThemeProvider><AuthProvider>{children}</AuthProvider></ThemeProvider>;
}
