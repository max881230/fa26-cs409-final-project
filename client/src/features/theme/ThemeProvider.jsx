import React, { createContext, useContext, useEffect, useState } from 'react';
import { THEME_KEY, normalizeTheme, readTheme, resolveTheme, saveTheme } from '../../lib/theme.js';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [preference, setPreference] = useState(readTheme);
  const [prefersDark, setPrefersDark] = useState(() => window.matchMedia('(prefers-color-scheme: dark)').matches);
  const [saved, setSaved] = useState(true);
  const resolved = resolveTheme(preference, prefersDark);

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = event => setPrefersDark(event.matches);
    setPrefersDark(media.matches);
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = preference;
    document.documentElement.style.colorScheme = resolved;
  }, [preference, resolved]);

  useEffect(() => {
    const onStorage = event => { if (event.key === THEME_KEY || event.key === null) { setPreference(readTheme()); setSaved(true); } };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const changeTheme = value => {
    const theme = normalizeTheme(value);
    setPreference(theme);
    setSaved(saveTheme(theme));
  };

  return <ThemeContext.Provider value={{ preference, resolved, saved, changeTheme }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const value = useContext(ThemeContext);
  if (!value) throw new Error('useTheme requires ThemeProvider');
  return value;
}
