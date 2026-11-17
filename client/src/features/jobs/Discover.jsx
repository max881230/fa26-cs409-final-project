import React, { useState } from 'react';
import { paginate } from '@shared/pagination.js';
import { filterJobs } from '@shared/discovery.js';
import { jobs } from '../../mocks/fixtures.js';
import Pagination from '../../components/ui/Pagination.jsx';

const fields = [['company', 'Company'], ['role', 'Role'], ['location', 'Location'], ['workArrangement', 'Work arrangement'], ['type', 'Job type']];
const emptyFilters = { company: '', role: '', location: '', workArrangement: '', type: '' };

export default function Discover({ apps, skippedJobIds = [], onSkip, onSave, onDetails, onApply }) {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState(emptyFilters);
  const [showSkipped, setShowSkipped] = useState(false);
  const [page, setPage] = useState(1);
  const activeFilters = Object.values(filters).filter(Boolean).length;
  const filtered = filterJobs(jobs, query, filters, skippedJobIds, showSkipped);
  const result = paginate(filtered, page);
  return <section aria-label="Discover opportunities">
    <div className="jh-searchbar"><label className="jh-field">Search roles<input type="search" value={query} placeholder="e.g. Remote intern" onChange={e => { setQuery(e.target.value); setPage(1); }} /></label>{(query || activeFilters > 0) && <button className="jh-btn jh-btn-quiet" onClick={() => { setQuery(''); setFilters(emptyFilters); setPage(1); }}>Clear filters</button>}</div>
    <details className="jh-discover-filters"><summary>Filters{activeFilters > 0 && ` (${activeFilters})`}</summary><div className="jh-discover-filter-fields">{fields.map(([field, label]) => <label key={field} className="jh-field">{label}<select value={filters[field]} onChange={event => { setFilters(current => ({ ...current, [field]: event.target.value })); setPage(1); }}><option value="">All</option>{[...new Set(jobs.map(job => job[field]))].sort().map(value => <option key={value} value={value}>{value}</option>)}</select></label>)}</div></details>
    <div className="jh-filterbar" aria-label="Discover views"><button aria-pressed={!showSkipped} onClick={() => { setShowSkipped(false); setPage(1); }}>Browse</button><button aria-pressed={showSkipped} onClick={() => { setShowSkipped(true); setPage(1); }}>Skipped ({skippedJobIds.length})</button></div>
    <div className="jh-column-head jh-discover-columns" aria-hidden="true"><span>Position</span><span>Location & work arrangement</span><span>Actions</span></div>
    <div className="jh-position-list">{result.items.map(job => {
      const saved = apps.find(app => app.id === job.id);
      return <article key={job.id} className="jh-position-row jh-discover-columns" aria-label={`${job.company} ${job.role}`}>
        <div className="jh-position-cell"><strong>{job.company}</strong><span>{job.role}</span></div>
        <div className="jh-info-cell"><span><strong>Location:</strong> {job.location}</span><span><strong>Work arrangement:</strong> {job.workArrangement}</span><span className="jh-muted">{job.type}</span></div>
        <div className="jh-position-actions">{showSkipped ? <button className="jh-btn" onClick={() => onSkip(job, false)} aria-label={`Restore ${job.company} ${job.role}`}>Restore</button> : <><button className="jh-btn jh-btn-quiet" onClick={() => saved ? onDetails(job.id) : onSave(job)}>{saved ? 'View tracked' : 'Save to tracker'}</button><a className="jh-btn jh-btn-main" href={job.applyUrl} target="_blank" rel="noopener noreferrer" onClick={event => onApply(event, job)} aria-label={`Apply to ${job.company} ${job.role}`}>Apply ↗</a><button className="jh-btn jh-btn-quiet" onClick={() => onSkip(job, true)} aria-label={`Skip ${job.company} ${job.role}`}>Skip</button></>}</div>
      </article>;
    })}{!result.total && <p className="jh-empty">{showSkipped ? skippedJobIds.length ? 'No matching skipped roles.' : 'No skipped roles.' : 'No matching roles.'}</p>}</div>
    <Pagination label="Discover" result={result} onPage={setPage} />
  </section>;
}
