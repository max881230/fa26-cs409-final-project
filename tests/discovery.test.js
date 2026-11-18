import test from 'node:test';
import assert from 'node:assert/strict';
import { filterJobs } from '../shared/discovery.js';
import { setJobSkipped } from '../shared/workspace.js';
import { paginate } from '../shared/pagination.js';
import { createInitialWorkspace, jobs } from '../client/src/mocks/fixtures.js';

test('each relevant role field can narrow Discover independently', () => {
  assert.deepEqual(filterJobs(jobs, '', { company: 'Datadog' }).map(job => job.id), ['demo-job-2', 'demo-job-8', 'demo-job-14', 'demo-job-20']);
  assert.deepEqual(filterJobs(jobs, '', { role: 'Backend Engineer Intern' }).map(job => job.id), ['demo-job-8']);
  assert.equal(filterJobs(jobs, '', { location: 'New York, NY' }).length, 8);
  assert.deepEqual(filterJobs(jobs, '', { workArrangement: 'Remote' }).map(job => job.id), ['linear', 'demo-job-9', 'demo-job-15', 'demo-job-21']);
  assert.equal(filterJobs(jobs, '', { type: 'New Grad' }).length, 13);
});

test('field filters and search combine, including words across different fields', () => {
  const filters = { company: 'Datadog', role: 'Backend Engineer Intern', location: 'New York, NY', workArrangement: 'In person', type: 'Intern' };
  assert.deepEqual(filterJobs(jobs, '  DATADOG new york in PERSON intern  ', filters).map(job => job.id), ['demo-job-8']);
  assert.deepEqual(filterJobs(jobs, 'Remote intern', {}).map(job => job.id), ['demo-job-9']);
  assert.equal(filterJobs(jobs, '', { location: 'San Francisco, CA', workArrangement: 'Remote' }).length, 0);
  assert.equal(filterJobs(jobs, 'no-such-role', {}).length, 0);
  assert.equal(filterJobs(jobs, '', {}).length, 24);
});

test('skipped roles leave Browse, remain filterable, and return when restored', () => {
  const initial = createInitialWorkspace();
  const skipped = setJobSkipped(initial, 'figma', true);
  assert.deepEqual(initial.skippedJobIds, []);
  assert.equal(skipped.apps, initial.apps);
  assert.equal(skipped.events, initial.events);
  assert.equal(skipped.updates, initial.updates);
  assert.equal(filterJobs(jobs, '', {}, skipped.skippedJobIds).length, 23);
  assert.deepEqual(filterJobs(jobs, 'figma intern', { company: 'Figma' }, skipped.skippedJobIds, true).map(job => job.id), ['figma']);
  assert.deepEqual(filterJobs(jobs, '', { company: 'Notion' }, skipped.skippedJobIds, true), []);
  assert.equal(setJobSkipped(skipped, 'figma', true), skipped);
  const restored = setJobSkipped(skipped, 'figma', false);
  assert.equal(filterJobs(jobs, '', {}, restored.skippedJobIds).length, 24);
  assert.deepEqual(filterJobs(jobs, '', {}, restored.skippedJobIds, true), []);
  assert.equal(setJobSkipped(restored, 'figma', false), restored);
});

test('skipping the last page clamps pagination to a nonempty previous page', () => {
  const skippedJobIds = jobs.slice(20).map(job => job.id);
  const result = paginate(filterJobs(jobs, '', {}, skippedJobIds), 3);
  assert.equal(result.page, 2);
  assert.equal(result.items.length, 10);
  const allSkipped = jobs.map(job => job.id);
  assert.equal(paginate(filterJobs(jobs, '', {}, allSkipped), 1).total, 0);
  assert.equal(filterJobs(jobs, '', {}, allSkipped, true).length, 24);
});
