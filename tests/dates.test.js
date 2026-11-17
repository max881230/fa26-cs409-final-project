import test from 'node:test';
import assert from 'node:assert/strict';
import { nextEvent } from '../client/src/lib/dates.js';
import { acceptUpdate } from '../shared/workspace.js';
import { createInitialWorkspace } from '../client/src/mocks/fixtures.js';

test('next steps show the new interview rather than an earlier completed screen', () => {
  const initial = createInitialWorkspace();
  assert.equal(nextEvent(initial.events, 'notion'), undefined);
  const updated = acceptUpdate(initial, 'notion-final-interview', 'Interviewing', '2026-11-20T11:00');
  assert.equal(nextEvent(updated.events, 'notion').id, 'notion-final');
  assert.equal(updated.events.find(event => event.id === 'notion-screen').date, '2026-11-11');
});
