import React, { useState } from 'react';
import { STAGES } from '@shared/workspace.js';
import { nextEvent, eventTime } from '../../lib/dates.js';
import EventLink from '../../components/ui/EventLink.jsx';

export default function Details({ app, events, onClose, onStage, onNotes }) {
  const [stage, setStage] = useState(app.stage);
  const [notes, setNotes] = useState(app.notes);
  const next = nextEvent(events, app.id);
  return <aside id="jh-detail" aria-label="Application details">
    <div className="jh-detail-top"><span>Application details</span><button className="jh-close" aria-label="Close application details" onClick={onClose}>×</button></div>
    <h2>{app.company}</h2><p className="jh-detail-role">{app.role}</p>
    <div className="jh-status-edit"><label className="jh-field">Stage<select value={stage} onChange={e => setStage(e.target.value)}>{STAGES.map(value => <option key={value}>{value}</option>)}</select></label><button className="jh-btn" onClick={() => onStage(app.id, stage)}>Save stage</button></div>
    <section className="jh-detail-section"><h3>Next step</h3>{next ? <div className="jh-nextbox"><strong>{next.title}</strong><small>{eventTime(next)}</small><small>America/Chicago{next.kind === 'Interview' && !next.url ? ' · Video call details to be added' : ''}</small><EventLink event={next} /></div> : <p className="jh-muted">No upcoming event yet.</p>}</section>
    <section className="jh-detail-section"><h3>Activity</h3><ol className="jh-timeline">{app.history.map((item, index) => <li key={index}>{item.label}<small>{item.source}</small></li>)}</ol></section>
    <section className="jh-detail-section"><label className="jh-field" htmlFor="preparation-notes"><strong>Notes & preparation</strong></label><textarea className="jh-notes" id="preparation-notes" value={notes} onChange={e => setNotes(e.target.value)} /><div className="jh-note-actions"><button className="jh-btn jh-btn-main" onClick={() => onNotes(app.id, notes)}>Save notes</button></div></section>
  </aside>;
}
