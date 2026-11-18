import React from 'react';
import { sortedEvents, eventTime, DEMO_TODAY } from '../../lib/dates.js';
import Details from '../applications/Details.jsx';
import EventLink from '../../components/ui/EventLink.jsx';

export default function Calendar({ state, selected, onSelect, onStage, onNotes }) {
  const appFor = id => state.apps.find(app => app.id === id);
  const app = appFor(selected);
  const days = Array.from({ length: 42 }, (_, index) => {
    const date = new Date(Date.UTC(2026, 9, 26 + index));
    const iso = date.toISOString().slice(0, 10);
    return <div key={iso} className={`jh-day${date.getUTCMonth() !== 10 ? ' is-outside' : ''}${iso === DEMO_TODAY ? ' is-demo-today' : ''}`}><span>{date.getUTCDate()}</span>{state.events.filter(event => event.date === iso).map(event => <button key={event.id} className="jh-event" data-kind={event.kind} onClick={() => onSelect(event.app)} aria-label={`${appFor(event.app)?.company} ${event.title} ${eventTime(event)}`}>{appFor(event.app)?.company}<br />{event.title}{event.time && <small className="jh-event-time">{event.time} CT</small>}</button>)}</div>;
  });
  return <div className={`jh-layout${app ? ' jh-has-detail' : ''}`}>
    <section id="jh-content" aria-label="Recruiting calendar"><div className="jh-calendar-layout">
      <div className="jh-calendar"><div className="jh-cal-head"><h2>November 2026</h2><span className="jh-small jh-muted">Interview · Deadline</span></div><div className="jh-weekdays">{['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => <span key={day}>{day}</span>)}</div><div className="jh-month">{days}</div></div>
      <div className="jh-agenda"><h3>Schedule · America/Chicago</h3>{sortedEvents(state.events).map(event => <article key={event.id} className="jh-agenda-entry"><div><strong>{appFor(event.app)?.company} · {event.title}</strong><small>{eventTime(event)}</small><EventLink event={event} /></div><button className="jh-btn jh-btn-quiet" onClick={() => onSelect(event.app)} aria-label={`Open ${appFor(event.app)?.company} ${event.title}`}>View</button></article>)}</div>
    </div></section>
    {app && <Details key={`${app.id}:${app.stage}`} app={app} events={state.events} onClose={() => onSelect(null)} onStage={onStage} onNotes={onNotes} />}
  </div>;
}
