import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { THEME_KEY, normalizeTheme, resolveTheme, readTheme, saveTheme } from '../client/src/lib/theme.js';
import { memoryStorage, blockedStorage } from './helpers/memory-storage.js';

test('explicit themes override the OS and system mode follows it', () => {
  assert.equal(resolveTheme('light', true), 'light');
  assert.equal(resolveTheme('dark', false), 'dark');
  assert.equal(resolveTheme('system', true), 'dark');
  assert.equal(resolveTheme('system', false), 'light');
  assert.equal(normalizeTheme('invalid'), 'system');
});

test('preferences persist and blocked or invalid storage falls back to system', () => {
  const storage = memoryStorage();
  assert.equal(readTheme(storage), 'system');
  assert.equal(saveTheme('dark', storage), true);
  assert.equal(readTheme(storage), 'dark');
  storage.setItem(THEME_KEY, 'invalid');
  assert.equal(readTheme(storage), 'system');
  assert.equal(readTheme(blockedStorage), 'system');
  assert.equal(saveTheme('light', blockedStorage), false);
});

test('the pre-paint initializer agrees with React preferences, including blocked storage', () => {
  const source = readFileSync(new URL('../client/public/theme-init.js', import.meta.url), 'utf8');
  for (const value of ['light', 'dark', 'system', 'invalid', null]) {
    const storage = memoryStorage(value ? { [THEME_KEY]: value } : {});
    const root = { dataset: {}, style: {} };
    runInNewContext(source, { document: { documentElement: root }, localStorage: storage });
    assert.equal(root.dataset.theme, readTheme(storage));
    assert.equal(root.style.colorScheme, readTheme(storage) === 'system' ? 'light dark' : readTheme(storage));
  }
  const root = { dataset: {}, style: {} };
  runInNewContext(source, { document: { documentElement: root }, localStorage: blockedStorage });
  assert.equal(root.dataset.theme, 'system');
});
