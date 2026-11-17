import test from 'node:test';
import assert from 'node:assert/strict';
import { paginate } from '../shared/pagination.js';
import { trackJob, acceptUpdate, ignoreUpdate, pendingUpdates } from '../shared/workspace.js';
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

test('discovery roles carry location and work arrangement into the tracker', () => {
  for (const job of jobs) {
    assert.ok(job.location.trim());
    assert.ok(['Remote', 'In person', 'Hybrid'].includes(job.workArrangement));
  }
  assert.deepEqual(new Set(jobs.map(job => job.workArrangement)), new Set(['Remote', 'In person', 'Hybrid']));
  const state = trackJob(createInitialWorkspace(), jobs[0]);
  const saved = state.apps.find(app => app.id === jobs[0].id);
  assert.equal(saved.location, jobs[0].location);
  assert.equal(saved.workArrangement, jobs[0].workArrangement);
});

test('six demo messages match tracked applications and start pending', () => {
  const state = createInitialWorkspace();
  assert.equal(state.updates.length, 6);
  assert.equal(new Set(state.updates.map(update => update.id)).size, 6);
  assert.equal(pendingUpdates(state).length, 6);
  for (const update of state.updates) assert.ok(state.apps.some(app => app.id === update.appId));
});

test('accepting one invitation updates only its application and event, once', () => {
  const state = createInitialWorkspace();
  const before = structuredClone(state);
  const updated = acceptUpdate(state, 'figma-interview-invite', 'Interviewing', '2026-11-19T15:00');
  assert.deepEqual(state, before);
  assert.equal(pendingUpdates(updated).length, 5);
  assert.equal(updated.apps.find(app => app.id === 'figma').stage, 'Interviewing');
  assert.equal(updated.events.find(event => event.id === 'figma-interview').time, '15:00');
  assert.equal(updated.events.length, state.events.length + 1);
  assert.equal(updated.apps.find(app => app.id === 'stripe'), state.apps.find(app => app.id === 'stripe'));
  assert.equal(acceptUpdate(updated, 'figma-interview-invite', 'Applied', '2026-11-19T16:00'), updated);
  assert.equal(acceptUpdate(state, 'figma-interview-invite', 'Interviewing', ''), state);
  assert.equal(acceptUpdate(state, 'figma-interview-invite', 'Interviewing', '2026-02-30T15:00'), state);
  assert.equal(acceptUpdate(state, 'missing', 'Applied'), state);
});

test('deadline extensions replace an existing event without duplication', () => {
  const state = createInitialWorkspace();
  const updated = acceptUpdate(state, 'stripe-assessment-deadline', 'Applied', '2026-11-21T18:00');
  assert.equal(updated.events.length, state.events.length);
  assert.equal(updated.events.filter(event => event.id === 'stripe-oa').length, 1);
  assert.equal(updated.events.find(event => event.id === 'stripe-oa').date, '2026-11-21');
});

test('confirmed email links accompany interviews and replacement deadlines', () => {
  for (const [id, stage, dateTime] of [
    ['figma-interview-invite', 'Interviewing', '2026-11-19T15:00'],
    ['stripe-assessment-deadline', 'Applied', '2026-11-21T18:00'],
  ]) {
    const state = createInitialWorkspace();
    const suggestion = state.updates.find(update => update.id === id);
    assert.ok(suggestion.excerpt.includes(suggestion.event.url));
    const updated = acceptUpdate(state, id, stage, dateTime);
    const event = updated.events.find(item => item.id === suggestion.event.id);
    assert.equal(event.url, suggestion.event.url);
    assert.equal(event.time, dateTime.slice(11));
    assert.equal(updated.events.filter(item => item.id === event.id).length, 1);
    assert.equal(acceptUpdate(updated, id, stage, dateTime), updated);
    assert.equal(ignoreUpdate(state, id).events, state.events);
    assert.notEqual(state.events.find(item => item.id === event.id)?.url, event.url);
  }
});

test('email suggestions without links still confirm normally', () => {
  const state = createInitialWorkspace();
  const updated = acceptUpdate(state, 'notion-final-interview', 'Interviewing', '2026-11-20T11:00');
  assert.equal(updated.events.find(event => event.id === 'notion-final').url, undefined);
  assert.equal(updated.updates.find(update => update.id === 'notion-final-interview').status, 'accepted');
});

test('status-only notifications never create calendar events', () => {
  const state = createInitialWorkspace();
  const received = acceptUpdate(state, 'linear-application-received', 'Applied');
  const rejected = acceptUpdate(received, 'datadog-decision', 'Rejected');
  assert.equal(rejected.events, state.events);
  assert.equal(rejected.apps.find(app => app.id === 'linear').stage, 'Applied');
  assert.equal(rejected.apps.find(app => app.id === 'demo-job-8').stage, 'Rejected');
  assert.equal(pendingUpdates(rejected).length, 4);
});

test('ignoring affects one notification and leaves jobs and events unchanged', () => {
  const state = createInitialWorkspace();
  const ignored = ignoreUpdate(state, 'canva-offer');
  assert.equal(ignored.apps, state.apps);
  assert.equal(ignored.events, state.events);
  assert.equal(pendingUpdates(ignored).length, 5);
  assert.equal(ignored.updates.find(update => update.id === 'canva-offer').status, 'ignored');
  assert.equal(ignoreUpdate(ignored, 'canva-offer'), ignored);
  assert.equal(acceptUpdate(ignored, 'canva-offer', 'Offered', '2026-11-24T17:00'), ignored);
});
