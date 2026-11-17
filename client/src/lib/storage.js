import { STAGES, validDateTime } from '../../../shared/workspace.js';
import { createInitialWorkspace } from '../mocks/fixtures.js';
import { createDemoUpdates } from '../mocks/updates.js';
import { DEMO_USER } from '../mocks/auth.js';

export const LEGACY_KEY = 'cs409-job-helper:v1';
export const workspaceKey = userId => 'cs409-job-helper:workspace:v2:' + encodeURIComponent(userId);

function browserLocalStorage() {
  try { return globalThis.localStorage; } catch { return undefined; }
}

const text = value => typeof value === 'string';
const unique = items => new Set(items.map(item => item.id)).size === items.length;
const validEvent = event => event && text(event.id) && text(event.title) && ['Interview', 'Deadline'].includes(event.kind) && validDateTime(event.date + 'T' + (event.time || '00:00'));

export function validWorkspace(value, version = 2) {
  if (!value || value.version !== version || !Array.isArray(value.apps) || !Array.isArray(value.events)) return false;
  if (!value.apps.length || !value.apps.every(app => app && text(app.id) && text(app.company) && text(app.role) && text(app.notes) && STAGES.includes(app.stage) && Array.isArray(app.history) && app.history.every(item => item && text(item.label) && text(item.source))) || !unique(value.apps)) return false;
  const hasApp = id => value.apps.some(app => app.id === id);
  if (!value.events.every(event => validEvent(event) && hasApp(event.app)) || !unique(value.events)) return false;
  if (version === 1) return ['pending', 'accepted', 'ignored'].includes(value.review);
  return Array.isArray(value.updates) && value.updates.every(update => update && text(update.id) && hasApp(update.appId) && text(update.title) && text(update.from) && text(update.received) && text(update.excerpt) && STAGES.includes(update.suggestedStage) && ['pending', 'accepted', 'ignored'].includes(update.status) && (!update.event || validEvent(update.event))) && unique(value.updates);
}

export function migrateLegacyWorkspace(value) {
  if (!validWorkspace(value, 1)) return null;
  return {
    version: 2, apps: value.apps, events: value.events,
    updates: createDemoUpdates().filter(update => value.apps.some(app => app.id === update.appId)).map(update => update.appId === 'figma' ? { ...update, status: value.review } : update),
  };
}

export function loadWorkspace(userId, storage = browserLocalStorage()) {
  try {
    const current = storage?.getItem(workspaceKey(userId));
    if (current !== null && current !== undefined) {
      const value = JSON.parse(current);
      return validWorkspace(value) ? value : createInitialWorkspace();
    }
    // Only the fixed demo identity may inherit the old anonymous workspace.
    if (userId === DEMO_USER.id) {
      const migrated = migrateLegacyWorkspace(JSON.parse(storage?.getItem(LEGACY_KEY) ?? 'null'));
      if (migrated) return migrated;
    }
  } catch { /* Use demo data when storage is unavailable or invalid. */ }
  return createInitialWorkspace();
}

export function persistWorkspace(userId, state, storage = browserLocalStorage()) {
  try { storage?.setItem(workspaceKey(userId), JSON.stringify(state)); return Boolean(storage); } catch { return false; }
}
