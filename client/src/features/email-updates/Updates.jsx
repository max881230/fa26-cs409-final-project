import React, { useRef, useState } from 'react';
import { pendingUpdates } from '@shared/workspace.js';
import UpdateReview from './UpdateReview.jsx';

export default function Updates({ state, onConfirm, onIgnore, onView, onDetails }) {
  const [selectedId, setSelectedId] = useState(() => pendingUpdates(state)[0]?.id || state.updates[0]?.id);
  const [onlyPending, setOnlyPending] = useState(false);
  const inboxRef = useRef(null);
  const reviewRef = useRef(null);
  const pending = pendingUpdates(state);
  const selected = state.updates.find(update => update.id === selectedId) || state.updates[0];
  const visible = onlyPending ? pending : state.updates;
  const nextPending = pending.find(update => update.id !== selected?.id);
  const select = id => {
    setSelectedId(id);
    if (window.matchMedia('(max-width: 850px)').matches) reviewRef.current?.scrollIntoView({ block: 'start' });
  };

  return <>
    <div className="jh-updates-layout">
      <section ref={inboxRef} className="jh-inbox" aria-labelledby="inbox-title">
        <div className="jh-inbox-heading"><h2 id="inbox-title">Inbox</h2></div>
        <div className="jh-inbox-filters" aria-label="Filter notifications"><button aria-pressed={!onlyPending} onClick={() => setOnlyPending(false)}>All updates <span>{state.updates.length}</span></button><button aria-pressed={onlyPending} onClick={() => setOnlyPending(true)}>Needs review <span>{pending.length}</span></button></div>
        <div className="jh-notification-list">{visible.map(update => {
          const app = state.apps.find(item => item.id === update.appId);
          return <button key={update.id} className={'jh-notification' + (selected?.id === update.id ? ' is-selected' : '')} aria-current={selected?.id === update.id ? 'true' : undefined} aria-controls="update-review-panel" onClick={() => select(update.id)}>
            <span className="jh-notification-heading"><strong>{app.company}</strong><span className={'jh-notification-status is-' + update.status}>{update.status === 'pending' ? 'Needs review' : update.status === 'accepted' ? 'Confirmed' : 'Ignored'}</span></span>
            <span className="jh-notification-title">{update.title}</span><span className="jh-notification-time">{update.received}</span>
          </button>;
        })}{!visible.length && <p className="jh-empty">No updates to review.</p>}</div>
      </section>
      <section ref={reviewRef} id="update-review-panel" aria-label="Selected notification">
        <button className="jh-link jh-back-to-inbox" onClick={() => inboxRef.current?.scrollIntoView({ block: 'start' })}>← Back to inbox</button>
        {selected ? <UpdateReview key={selected.id + ':' + selected.status} update={selected} app={state.apps.find(app => app.id === selected.appId)} onConfirm={onConfirm} onIgnore={onIgnore} onView={onView} onDetails={onDetails} hasNext={Boolean(nextPending)} onNext={() => select(nextPending.id)} /> : <p className="jh-empty">No notifications yet.</p>}
      </section>
    </div>
  </>;
}
