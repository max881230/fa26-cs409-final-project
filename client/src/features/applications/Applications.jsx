import React, { useEffect, useState } from 'react';
import { paginate } from '@shared/pagination.js';
import { STAGES } from '@shared/workspace.js';
import { nextEvent, eventTime } from '../../lib/dates.js';
import Badge from '../../components/ui/Badge.jsx';
import Pagination from '../../components/ui/Pagination.jsx';
import Details from './Details.jsx';

export default function Applications({ state, selected, onSelect, onView, onStage, onNotes }) {
  const [filter, setFilter] = useState('All');
  const [page, setPage] = useState(1);
  const result = paginate(state.apps.filter(app => filter === 'All' || app.stage === filter), page);
  const app = state.apps.find(item => item.id === selected);
  useEffect(() => {
    if (!selected) return;
    const filtered = state.apps.filter(item => filter === 'All' || item.stage === filter);
    const index = filtered.findIndex(item => item.id === selected);
    if (index >= 0) setPage(Math.floor(index / 10) + 1);
    else { setFilter('All'); setPage(Math.floor(state.apps.findIndex(item => item.id === selected) / 10) + 1); }
  }, [selected]);
  return <>
    <div className="jh-summary"><div><strong>{state.apps.length}</strong><span>tracked</span></div><div><strong>{state.apps.filter(item => item.stage === 'Interviewing').length}</strong><span>interviewing</span></div><div><strong>{state.review === 'pending' ? 1 : 0}</strong><span>to review</span></div></div>
    {state.review === 'pending' && <div className="jh-callout"><div><strong>Figma has an update for you.</strong><p>An interview invitation is ready to review.</p></div><button className="jh-btn" onClick={() => onView('updates')}>Review update →</button></div>}
    <div className="jh-filterbar" aria-label="Filter applications">{['All', ...STAGES].map(value => <button key={value} aria-pressed={filter === value} onClick={() => { setFilter(value); setPage(1); onSelect(null); }}>{value}</button>)}</div>
    <div className={`jh-layout${app ? ' jh-has-detail' : ''}`}>
      <section id="jh-content" aria-label="Tracked positions">
        <div className="jh-column-head jh-application-columns" aria-hidden="true"><span>Position</span><span>Updates</span><span>Actions</span></div>
        <div className="jh-position-list">{result.items.map(item => {
          const next = nextEvent(state.events, item.id);
          return <article key={item.id} className={`jh-position-row jh-application-columns${item.id === selected ? ' is-active' : ''}`} aria-label={`${item.company} ${item.role}`}>
            <div className="jh-position-cell"><div className="jh-companyline"><strong>{item.company}</strong><Badge stage={item.stage} /></div><span>{item.role}</span></div>
            <div className="jh-info-cell"><span>{next?.title || 'No upcoming event'}</span><span className="jh-muted">{next ? eventTime(next) : item.history[0]?.source}</span>{item.id === 'figma' && state.review === 'pending' && <span className="jh-badge">Update pending</span>}</div>
            <div className="jh-position-actions"><button className="jh-btn jh-btn-quiet" onClick={() => onSelect(item.id)} aria-label={`Details for ${item.company} ${item.role}`}>Details</button></div>
          </article>;
        })}{!result.total && <p className="jh-empty">No applications in this stage.</p>}</div>
        <Pagination label="Applications" result={result} onPage={value => { setPage(value); onSelect(null); }} />
      </section>
      {app && <Details key={`${app.id}:${app.stage}`} app={app} events={state.events} onClose={() => onSelect(null)} onStage={onStage} onNotes={onNotes} />}
    </div>
  </>;
}
