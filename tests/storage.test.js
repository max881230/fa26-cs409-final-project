import test from 'node:test';
import assert from 'node:assert/strict';
import { loadWorkspace, persistWorkspace, validWorkspace, workspaceKey, LEGACY_KEY } from '../client/src/lib/storage.js';
import { createInitialWorkspace } from '../client/src/mocks/fixtures.js';
import { DEMO_USER } from '../client/src/mocks/auth.js';
import { memoryStorage, blockedStorage } from './helpers/memory-storage.js';
import { acceptUpdate } from '../shared/workspace.js';

function legacyWorkspace(review = 'pending') {
  const { apps, events } = createInitialWorkspace();
  apps[0].notes = 'Keep my preparation notes.';
  return { version: 1, review, apps, events };
}

test('legacy migration keeps notes, events and the original review decision while adding five messages', () => {
  for (const review of ['pending', 'accepted', 'ignored']) {
    const legacy = legacyWorkspace(review);
    const storage = memoryStorage({ [LEGACY_KEY]: JSON.stringify(legacy) });
    const migrated = loadWorkspace(DEMO_USER.id, storage);
    assert.ok(validWorkspace(migrated));
    assert.deepEqual(migrated.apps, legacy.apps);
    assert.deepEqual(migrated.events, legacy.events);
    assert.equal(migrated.updates.length, 6);
    assert.equal(migrated.updates.find(update => update.appId === 'figma').status, review);
    assert.equal(migrated.updates.filter(update => update.appId !== 'figma' && update.status === 'pending').length, 5);
    assert.equal(persistWorkspace(DEMO_USER.id, migrated, storage), true);
    assert.deepEqual(loadWorkspace(DEMO_USER.id, storage), migrated);
    assert.equal(storage.getItem(LEGACY_KEY), JSON.stringify(legacy));
  }
});

test('current data is not overwritten by legacy migration', () => {
  const current = createInitialWorkspace();
  current.apps[0].notes = 'Newer notes';
  const storage = memoryStorage({ [LEGACY_KEY]: JSON.stringify(legacyWorkspace()), [workspaceKey(DEMO_USER.id)]: JSON.stringify(current) });
  assert.deepEqual(loadWorkspace(DEMO_USER.id, storage), current);
});

test('event links persist and older workspaces without the new fields remain intact', () => {
  const storage = memoryStorage();
  const linked = acceptUpdate(createInitialWorkspace(), 'figma-interview-invite', 'Interviewing', '2026-11-19T14:00');
  assert.equal(persistWorkspace(DEMO_USER.id, linked, storage), true);
  assert.deepEqual(loadWorkspace(DEMO_USER.id, storage), linked);
  assert.ok(loadWorkspace(DEMO_USER.id, storage).events.find(event => event.id === 'figma-interview').url);

  const older = createInitialWorkspace();
  older.apps[0].notes = 'Keep my existing notes.';
  older.updates[0].status = 'ignored';
  for (const app of older.apps) delete app.workArrangement;
  for (const update of older.updates) if (update.event) delete update.event.url;
  assert.ok(validWorkspace(older));
  persistWorkspace(DEMO_USER.id, older, storage);
  assert.deepEqual(loadWorkspace(DEMO_USER.id, storage), older);
});

test('workspace keys separate identities and only the demo identity inherits anonymous data', () => {
  const storage = memoryStorage({ [LEGACY_KEY]: JSON.stringify(legacyWorkspace()) });
  assert.equal(loadWorkspace('another-user', storage).apps[0].notes, createInitialWorkspace().apps[0].notes);
  const first = createInitialWorkspace();
  const second = createInitialWorkspace();
  first.apps[0].notes = 'First identity';
  second.apps[0].notes = 'Second identity';
  persistWorkspace('first', first, storage);
  persistWorkspace('second', second, storage);
  assert.equal(loadWorkspace('first', storage).apps[0].notes, 'First identity');
  assert.equal(loadWorkspace('second', storage).apps[0].notes, 'Second identity');
});

test('invalid or blocked storage falls back safely without deleting the source', () => {
  const invalid = createInitialWorkspace();
  invalid.events[0].app = 'missing';
  assert.equal(validWorkspace(invalid), false);
  invalid.events[0].app = 'notion';
  invalid.updates.push({ ...invalid.updates[0] });
  assert.equal(validWorkspace(invalid), false);
  const storage = memoryStorage({ [workspaceKey(DEMO_USER.id)]: '{broken' });
  assert.ok(validWorkspace(loadWorkspace(DEMO_USER.id, storage)));
  assert.equal(storage.getItem(workspaceKey(DEMO_USER.id)), '{broken');
  assert.ok(validWorkspace(loadWorkspace(DEMO_USER.id, blockedStorage)));
  assert.equal(persistWorkspace(DEMO_USER.id, createInitialWorkspace(), blockedStorage), false);
});
