import test from 'node:test';
import assert from 'node:assert/strict';
import { paginate } from '../shared/pagination.js';
import { trackJob, acceptUpdate } from '../shared/workspace.js';
import { createInitialWorkspace, jobs } from '../client/src/mocks/fixtures.js';

test('demo fixtures link existing applications to unique discovery positions', () => {
  const state = createInitialWorkspace();
  assert.equal(new Set(jobs.map(job => job.id)).size, jobs.length);
  assert.equal(new Set(jobs.map(job => `${job.company}|${job.role}`)).size, jobs.length);
  assert.equal(new Set(state.apps.map(app => app.id)).size, state.apps.length);
  assert.equal(new Set(state.apps.map(app => `${app.company}|${app.role}`)).size, state.apps.length);
  for (const id of ['figma', 'notion', 'stripe', 'linear']) assert.equal(jobs.find(job => job.id === id).role, state.apps.find(app => app.id === id).role);
});

test('pagination splits 24 positions into 10, 10 and 4 without losing records', () => {
  const pages = [1, 2, 3].map(page => paginate(jobs, page));
  assert.deepEqual(pages.map(page => page.items.length), [10, 10, 4]);
  assert.deepEqual(pages.flatMap(page => page.items.map(job => job.id)), jobs.map(job => job.id));
  assert.equal(paginate(jobs, 99).page, 3);
  assert.equal(paginate([], 3).start, 0);
  assert.equal(paginate(jobs.slice(0, 2), 3).page, 1);
});

test('saving and later confirming an application creates one record and preserves notes', () => {
  const initial = createInitialWorkspace();
  const saved = trackJob(initial, jobs[0]);
  saved.apps.at(-1).notes = 'Prepare portfolio';
  const applied = trackJob(saved, jobs[0], 'Applied');
  assert.equal(initial.apps.length, 12);
  assert.equal(applied.apps.length, 13);
  assert.equal(applied.apps.at(-1).stage, 'Applied');
  assert.equal(applied.apps.at(-1).notes, 'Prepare portfolio');
  assert.equal(trackJob(applied, jobs[0], 'Applied'), applied);
  assert.equal(trackJob(applied, jobs[0], 'Saved'), applied);
});

test('a second apply confirmation cannot reset an interview', () => {
  const state = createInitialWorkspace();
  assert.equal(trackJob(state, state.apps.find(app => app.id === 'notion'), 'Applied'), state);
});

test('review acceptance updates stage and calendar atomically and is idempotent', () => {
  const state = createInitialWorkspace();
  const updated = acceptUpdate(state, 'Interviewing', '2026-11-12T15:00');
  assert.equal(state.review, 'pending');
  assert.equal(state.events.length, 3);
  assert.equal(updated.apps.find(app => app.id === 'figma').stage, 'Interviewing');
  assert.equal(updated.events.find(event => event.id === 'figma-interview').time, '15:00');
  assert.equal(acceptUpdate(updated, 'Interviewing', '2026-11-12T15:00'), updated);
  assert.equal(acceptUpdate(state, 'Interviewing', ''), state);
});
