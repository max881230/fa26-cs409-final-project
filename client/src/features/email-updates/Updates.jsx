import React, { useRef, useState } from 'react';
import { STAGES } from '@shared/workspace.js';

export default function Updates({ state, onConfirm, onIgnore, onView, onDetails }) {
  const [stage, setStage] = useState('Interviewing');
  const [dateTime, setDateTime] = useState('2026-11-12T14:00');
  const dateInput = useRef(null);
  if (state.review !== 'pending') return <section className="jh-review"><span className="jh-badge">{state.review === 'accepted' ? 'Confirmed' : 'Ignored'}</span><h2>You’re all caught up.</h2><p className="jh-subtitle">{state.review === 'accepted' ? 'Figma’s status and interview event have been updated together.' : 'The suggestion was dismissed. Your application and calendar were kept as they were.'}</p><div className="jh-review-actions"><button className="jh-btn jh-btn-main" onClick={() => onView('calendar')}>Open calendar</button><button className="jh-btn" onClick={() => onDetails('figma')}>View Figma details</button></div></section>;
  return <section className="jh-review">
    <div className="jh-companyline"><h2>Figma · Interview invitation</h2><span className="jh-badge">Needs your review</span></div><p className="jh-subtitle">Matched application: Software Engineer Intern</p>
    <div className="jh-email"><div className="jh-small"><strong>From</strong> recruiting@example.com <span className="jh-muted">· Sample email</span></div><blockquote>We’d like to invite you to a technical interview on November 12 at 2:00 PM Central Time.</blockquote></div>
    <div className="jh-small jh-muted">Current stage: {state.apps.find(app => app.id === 'figma')?.stage} → Suggested stage: Interviewing</div>
    <div className="jh-review-fields"><label className="jh-field">Confirm the stage<select value={stage} onChange={event => setStage(event.target.value)}>{STAGES.map(value => <option key={value}>{value}</option>)}</select></label><label className="jh-field">Technical interview · America/Chicago<input ref={dateInput} type="datetime-local" required value={dateTime} onChange={event => setDateTime(event.target.value)} /></label></div>
    <p className="jh-subtitle">This suggestion has not changed your application or calendar.</p><div className="jh-review-actions"><button type="button" className="jh-btn jh-btn-main" onClick={() => { if (dateInput.current.reportValidity()) onConfirm(stage, dateTime); }}>Confirm update</button><button type="button" className="jh-btn jh-btn-quiet" onClick={onIgnore}>Ignore</button></div>
  </section>;
}
