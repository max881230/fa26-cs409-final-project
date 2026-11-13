import React, { useState } from 'react';
import { paginate } from '@shared/pagination.js';
import { jobs } from '../../mocks/fixtures.js';
import Pagination from '../../components/ui/Pagination.jsx';

export default function Discover({ apps, onSave, onDetails, onApply }) {
  const [query, setQuery] = useState('');
  const [type, setType] = useState('All');
  const [page, setPage] = useState(1);
  const filtered = jobs.filter(job => (type === 'All' || job.type === type) && `${job.company} ${job.role} ${job.location}`.toLowerCase().includes(query.trim().toLowerCase()));
  const result = paginate(filtered, page);
  return <section aria-label="Discover opportunities">
    <div className="jh-searchbar"><label className="jh-field">Search roles or companies<input type="search" value={query} placeholder="e.g. Frontend engineer" onChange={e => { setQuery(e.target.value); setPage(1); }} /></label><label className="jh-field">Job type<select value={type} onChange={e => { setType(e.target.value); setPage(1); }}>{['All', 'Intern', 'New Grad'].map(value => <option key={value}>{value}</option>)}</select></label></div>
    <p className="jh-demo-caption">Demo opportunities · Apply opens the company careers site.</p>
    <div className="jh-column-head jh-discover-columns" aria-hidden="true"><span>Position</span><span>Info</span><span>Actions</span></div>
    <div className="jh-position-list">{result.items.map(job => {
      const saved = apps.find(app => app.id === job.id);
      return <article key={job.id} className="jh-position-row jh-discover-columns" aria-label={`${job.company} ${job.role}`}>
        <div className="jh-position-cell"><strong>{job.company}</strong><span>{job.role}</span></div>
        <div className="jh-info-cell"><span>{job.location}</span><span className="jh-muted">{job.type} · Demo listing</span></div>
        <div className="jh-position-actions"><button className="jh-btn jh-btn-quiet" onClick={() => saved ? onDetails(job.id) : onSave(job)}>{saved ? 'View tracked' : 'Save to tracker'}</button><a className="jh-btn jh-btn-main" href={job.applyUrl} target="_blank" rel="noopener noreferrer" onClick={event => onApply(event, job)} aria-label={`Apply to ${job.company} ${job.role}`}>Apply ↗</a></div>
      </article>;
    })}{!result.total && <p className="jh-empty">No matching roles. Try another company or job type.</p>}</div>
    <Pagination label="Discover" result={result} onPage={setPage} />
  </section>;
}
