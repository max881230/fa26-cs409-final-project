import { STAGES } from '@shared/workspace.js';
import { createInitialWorkspace } from '../mocks/fixtures.js';

const KEY = 'cs409-job-helper:v1';
export function loadWorkspace() {
  try {
    const value = JSON.parse(localStorage.getItem(KEY));
    if (value?.version === 1 && ['pending', 'accepted', 'ignored'].includes(value.review) && Array.isArray(value.apps) && Array.isArray(value.events) && value.apps.some(app => app.id === 'figma') && value.apps.every(app => typeof app.id === 'string' && STAGES.includes(app.stage) && Array.isArray(app.history))) return value;
  } catch { /* Start with demo data if storage is unavailable or incompatible. */ }
  return createInitialWorkspace();
}
export function persistWorkspace(state) {
  try { localStorage.setItem(KEY, JSON.stringify(state)); return true; } catch { return false; }
}
