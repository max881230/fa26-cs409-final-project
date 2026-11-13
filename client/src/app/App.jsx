import React, { useEffect, useState } from 'react';
import { trackJob, acceptUpdate } from '@shared/workspace.js';
import { loadWorkspace, persistWorkspace } from '../lib/storage.js';
import Discover from '../features/jobs/Discover.jsx';
import ApplyDialog from '../features/jobs/ApplyDialog.jsx';
import Applications from '../features/applications/Applications.jsx';
import Calendar from '../features/calendar/Calendar.jsx';
import Updates from '../features/email-updates/Updates.jsx';

const headings = {
  applications: ['MY WORKSPACE', 'Your next move, organized.', 'Every application, with a clear next step.'],
  discover: ['FIND YOUR NEXT ROLE', 'Less searching. More possibilities.', 'Save an opportunity, then track it through the whole journey.'],
  calendar: ['MAKE TIME FOR WHAT’S NEXT', 'Your recruiting calendar.', 'Interviews and deadlines · November 2026 · America/Chicago'],
  updates: ['YOU’RE IN CONTROL', 'New email. Clear next step.', 'Review suggested changes before they reach your tracker.'],
};

export default function App() {
  const [state, setState] = useState(loadWorkspace);
  const [view, setView] = useState('applications');
  const [selected, setSelected] = useState(null);
  const [pendingApply, setPendingApply] = useState(null);
  const [notice, setNotice] = useState('');
  const [undo, setUndo] = useState(null);
  const [storageAvailable, setStorageAvailable] = useState(true);
  useEffect(() => { setStorageAvailable(persistWorkspace(state)); }, [state]);
  const navigate = next => { setView(next); setSelected(null); setNotice(''); setUndo(null); };
  const openDetails = id => { setView('applications'); setSelected(id); };
  const changeStage = (id, stage) => {
    setState(current => ({ ...current, apps: current.apps.map(app => app.id === id && app.stage !== stage ? { ...app, stage, history: [{ label: `Stage changed to ${stage}`, source: 'Just now · Manually updated' }, ...app.history] } : app) }));
    setUndo(null); setNotice('Application stage saved.');
  };
  const saveNotes = (id, notes) => { setState(current => ({ ...current, apps: current.apps.map(app => app.id === id ? { ...app, notes } : app) })); setUndo(null); setNotice('Preparation notes saved.'); };
  const beginApply = (_event, job) => setPendingApply(job);
  const confirmUpdate = (stage, dateTime) => { setUndo(state); setState(current => acceptUpdate(current, stage, dateTime)); setNotice('Update confirmed. Figma and your calendar are now in sync.'); };
  const ignoreUpdate = () => { setUndo(state); setState(current => ({ ...current, review: 'ignored' })); setNotice('Suggestion ignored.'); };
  const [eyebrow, title, subtitle] = headings[view];
  return <div id="cs409-job-ui" aria-label="Job Application Helper">
    <header className="jh-top"><div className="jh-brand"><span className="jh-mark" aria-hidden="true">AH</span><span>Application Helper<small>UI CONCEPT · DEMO DATA</small></span></div><nav className="jh-nav" aria-label="Main navigation">{Object.keys(headings).sort((a, b) => ['discover', 'applications', 'calendar', 'updates'].indexOf(a) - ['discover', 'applications', 'calendar', 'updates'].indexOf(b)).map(key => <button key={key} aria-current={view === key ? 'page' : undefined} onClick={() => navigate(key)}>{key[0].toUpperCase() + key.slice(1)}{key === 'updates' && <> <span id="jh-update-count">{state.review === 'pending' ? 1 : 0}</span></>}</button>)}</nav></header>
    <main className="jh-workspace"><div className="jh-pagehead"><div><div className="jh-eyebrow">{eyebrow}</div><h1>{title}</h1><p className="jh-subtitle">{subtitle}</p></div>{view === 'applications' && <button className="jh-btn jh-btn-main" onClick={() => navigate('discover')}>+ Find a job</button>}</div>
      {notice && <div id="jh-notice" role="status" aria-live="polite"><span>{notice}</span>{undo && <button className="jh-link" onClick={() => { setState(undo); setUndo(null); setNotice('Update undone. The suggestion is ready to review again.'); }}>Undo</button>}</div>}
      {!storageAvailable && <p role="status">Browser storage is unavailable. Changes are kept for this visit only.</p>}
      <div hidden={view !== 'discover'}><Discover apps={state.apps} onSave={job => { setState(current => trackJob(current, job)); setUndo(null); setNotice(`${job.company} saved to Applications.`); }} onDetails={openDetails} onApply={beginApply} /></div>
      <div hidden={view !== 'applications'}><Applications state={state} selected={view === 'applications' ? selected : null} onSelect={setSelected} onView={navigate} onStage={changeStage} onNotes={saveNotes} /></div>
      {view === 'calendar' && <Calendar state={state} selected={selected} onSelect={setSelected} onStage={changeStage} onNotes={saveNotes} />}
      {view === 'updates' && <Updates state={state} onConfirm={confirmUpdate} onIgnore={ignoreUpdate} onView={navigate} onDetails={openDetails} />}
    </main>
    <footer className="jh-footer"><span>Discover → Track → Review → Prepare</span><span>Gmail: demo connection · America/Chicago</span></footer>
    {pendingApply && <ApplyDialog job={pendingApply} onDismiss={() => setPendingApply(null)} onConfirm={() => { setState(current => trackJob(current, pendingApply, 'Applied')); setUndo(null); setNotice(`${pendingApply.company} is tracked in Applications.`); setPendingApply(null); }} />}
  </div>;
}
