import test from 'node:test';
import assert from 'node:assert/strict';
import { createAuthClient, SESSION_KEY } from '../client/src/features/auth/authClient.js';
import { DEMO_USER } from '../client/src/mocks/auth.js';
import { memoryStorage, blockedStorage } from './helpers/memory-storage.js';

test('demo / demo signs in and restores without storing the password', async () => {
  const storage = memoryStorage();
  const client = createAuthClient({ storage, delay: 0 });
  assert.equal(await client.getSession(), null);
  const result = await client.signIn('demo', 'demo');
  assert.equal(result.user, DEMO_USER);
  assert.equal(result.persisted, true);
  assert.deepEqual(JSON.parse(storage.getItem(SESSION_KEY)), { version: 1, userId: DEMO_USER.id });
  assert.equal(await createAuthClient({ storage, delay: 0 }).getSession(), DEMO_USER);
  await client.signOut();
  assert.equal(await client.getSession(), null);
  assert.equal(await createAuthClient({ storage, delay: 0 }).getSession(), null);
});

test('incorrect credentials do not create a session', async () => {
  const storage = memoryStorage();
  const client = createAuthClient({ storage, delay: 0 });
  for (const [username, password] of [['demo', 'wrong'], ['other', 'demo'], ['', '']]) {
    await assert.rejects(client.signIn(username, password), /Incorrect username or password/);
    assert.equal(await client.getSession(), null);
  }
  assert.equal(storage.getItem(SESSION_KEY), null);
});

test('malformed and unknown stored sessions start signed out', async () => {
  for (const value of ['{broken', JSON.stringify({ version: 1, userId: 'unknown' }), JSON.stringify({ version: 99, userId: DEMO_USER.id })]) {
    const client = createAuthClient({ storage: memoryStorage({ [SESSION_KEY]: value }), delay: 0 });
    assert.equal(await client.getSession(), null);
  }
});

test('blocked storage supports an in-memory session and sign out', async () => {
  const client = createAuthClient({ storage: blockedStorage, delay: 0 });
  assert.equal(await client.getSession(), null);
  assert.equal((await client.signIn('demo', 'demo')).persisted, false);
  assert.equal(await client.getSession(), DEMO_USER);
  await client.signOut();
  assert.equal(await client.getSession(), null);
});
