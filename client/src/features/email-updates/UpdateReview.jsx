import React, { useRef, useState } from 'react';
import { STAGES } from '@shared/workspace.js';

export default function UpdateReview({ update, app, onConfirm, onIgnore, onView, onDetails, onNext, hasNext }) {
  const [stage, setStage] = useState(update.suggestedStage);
  const [dateTime, setDateTime] = useState(update.event ? update.event.date + 'T' + update.event.time : '');
  const dateInput = useRef(null);
  const pending = update.status === 'pending';

  return <article className="jh-review" aria-labelledby="update-title">
    <div className="jh-companyline"><span className="jh-badge" data-stage={pending ? 'Applied' : update.status === 'accepted' ? 'Offered' : undefined}>{pending ? 'Needs your review' : update.status === 'accepted' ? 'Confirmed' : 'Ignored'}</span><span className="jh-small jh-muted">{update.received}</span></div>
    <h2 id="update-title">{app.company} · {update.title}</h2>
    <p className="jh-subtitle">Matched application: {app.role}</p>
    <div className="jh-email"><div className="jh-small"><strong>From</strong> {update.from}<span className="jh-muted"> · Sample email</span></div><blockquote>{update.excerpt}</blockquote></div>
    {pending ? <form onSubmit={event => { event.preventDefault(); if (!update.event || dateInput.current.reportValidity()) onConfirm(update.id, stage, dateTime); }}>
      <p className="jh-small jh-muted">Current stage: {app.stage} → Suggested stage: {update.suggestedStage}</p>
      <div className="jh-review-fields">
        <label className="jh-field">Confirm the stage<select value={stage} onChange={event => setStage(event.target.value)}>{STAGES.map(value => <option key={value}>{value}</option>)}</select></label>
        {update.event && <label className="jh-field">{update.event.title} · America/Chicago<input ref={dateInput} type="datetime-local" required value={dateTime} onChange={event => setDateTime(event.target.value)} /></label>}
      </div>
      <p className="jh-subtitle">{update.event ? 'Confirming saves the application stage and this calendar event together.' : 'Confirming changes only the application stage. No calendar event will be added.'}</p>
      <div className="jh-review-actions"><button type="submit" className="jh-btn jh-btn-main">Confirm update</button><button type="button" className="jh-btn jh-btn-quiet" onClick={() => onIgnore(update.id)}>Ignore</button><button type="button" className="jh-link" onClick={() => onDetails(app.id)}>View application</button></div>
    </form> : <>
      <p className="jh-update-result">{update.status === 'accepted' ? 'Confirmed as ' + (update.confirmedStage || app.stage) + (update.event ? '. The application and calendar were updated together.' : '. The application was updated without adding a calendar event.') : 'This suggestion was ignored. The application and calendar were kept as they were.'}</p>
      <div className="jh-review-actions">{hasNext && <button className="jh-btn jh-btn-main" onClick={onNext}>Next pending update →</button>}<button className="jh-btn" onClick={() => onDetails(app.id)}>View application</button>{update.event && update.status === 'accepted' && <button className="jh-btn jh-btn-quiet" onClick={() => onView('calendar')}>Open calendar</button>}</div>
    </>}
  </article>;
}
