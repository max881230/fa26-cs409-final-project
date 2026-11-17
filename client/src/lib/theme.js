export const THEME_KEY = 'cs409-job-helper:theme:v1';
export const THEME_OPTIONS = ['light', 'dark', 'system'];

export function normalizeTheme(value) {
  return THEME_OPTIONS.includes(value) ? value : 'system';
}

export function resolveTheme(preference, prefersDark) {
  const theme = normalizeTheme(preference);
  return theme === 'system' ? (prefersDark ? 'dark' : 'light') : theme;
}

function browserLocalStorage() {
  try { return globalThis.localStorage; } catch { return undefined; }
}

export function readTheme(storage = browserLocalStorage()) {
  try { return normalizeTheme(storage?.getItem(THEME_KEY)); } catch { return 'system'; }
}

export function saveTheme(value, storage = browserLocalStorage()) {
  try { storage?.setItem(THEME_KEY, normalizeTheme(value)); return Boolean(storage); } catch { return false; }
}
