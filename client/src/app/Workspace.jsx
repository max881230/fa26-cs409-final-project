import React, { useEffect, useState } from 'react';
import Brand from '../components/ui/Brand.jsx';
import ThemeControl from '../features/theme/ThemeControl.jsx';
import UserMenu from '../features/auth/UserMenu.jsx';
import { useAuth } from '../features/auth/AuthProvider.jsx';
import { trackJob, acceptUpdate, ignoreUpdate as dismissUpdate, pendingUpdates, setJobSkipped } from '@shared/workspace.js';
import { loadWorkspace, persistWorkspace } from '../lib/storage.js';
import Discover from '../features/jobs/Discover.jsx';
import ApplyDialog from '../features/jobs/ApplyDialog.jsx';
import Applications from '../features/applications/Applications.jsx';
import Calendar from '../features/calendar/Calendar.jsx';
import Updates from '../features/email-updates/Updates.jsx';

const headings = {
  applications: ['Applications', 'Demo workspace · Sample applications saved in this browser.'],
  discover: ['Discover', 'Demo listings · Apply opens company careers pages, not live listings.'],
  calendar: ['Calendar', 'Demo calendar · November 2026 · America/Chicago.'],
  updates: ['Updates', 'Demo inbox · Sample emails and event links; Gmail is not connected.'],
};

export default function Workspace() {
  const { user, sessionPersisted } = useAuth();
  const [state, setState] = useState(() => loadWorkspace(user.id));
  const [view, setView] = useState('applications');
  const [selected, setSelected] = useState(null);
  const [pendingApply, setPendingApply] = useState(null);
  const [notice, setNotice] = useState('');
  const [undo, setUndo] = useState(null);
  const [storageAvailable, setStorageAvailable] = useState(true);
  useEffect(() => { setStorageAvailable(persistWorkspace(user.id, state)); }, [state, user.id]);
  const navigate = next => { setView(next); setSelected(null); setNotice(''); setUndo(null); };
  const openDetails = id => { setView('applications'); setSelected(id); };
  const changeStage = (id, stage) => {
    setState(current => ({ ...current, apps: current.apps.map(app => app.id === id && app.stage !== stage ? { ...app, stage, history: [{ label: `Stage changed to ${stage}`, source: 'Just now · Manually updated' }, ...app.history] } : app) }));
    setUndo(null); setNotice('Application stage saved.');
  };
  const saveNotes = (id, notes) => { setState(current => ({ ...current, apps: current.apps.map(app => app.id === id ? { ...app, notes } : app) })); setUndo(null); setNotice('Preparation notes saved.'); };
  const beginApply = (_event, job) => setPendingApply(job);
  const confirmUpdate = (id, stage, dateTime) => {
    const next = acceptUpdate(state, id, stage, dateTime);
    if (next === state) return;
    const update = state.updates.find(item => item.id === id);
    const company = state.apps.find(app => app.id === update.appId)?.company;
    setUndo(state); setState(next);
    setNotice(company + ' update confirmed.');
  };
  const ignoreUpdate = id => { const next = dismissUpdate(state, id); if (next === state) return; setUndo(state); setState(next); setNotice('Update ignored.'); };
  const [title, demoNotice] = headings[view];
  return <div id="cs409-job-ui" aria-label="Job Application Helper">
    <header className="jh-top"><Brand /><nav className="jh-nav" aria-label="Main navigation">{Object.keys(headings).sort((a, b) => ['discover', 'applications', 'calendar', 'updates'].indexOf(a) - ['discover', 'applications', 'calendar', 'updates'].indexOf(b)).map(key => <button key={key} aria-current={view === key ? 'page' : undefined} onClick={() => navigate(key)}>{key[0].toUpperCase() + key.slice(1)}{key === 'updates' && <> <span id="jh-update-count">{pendingUpdates(state).length}</span></>}</button>)}</nav><div className="jh-header-controls"><ThemeControl /><UserMenu /></div></header>
    <main className="jh-workspace"><div className="jh-pagehead"><div><h1>{title}</h1><p className="jh-subtitle">{demoNotice}</p></div></div>
      {notice && <div id="jh-notice" role="status" aria-live="polite"><span>{notice}</span>{undo && <button className="jh-link" onClick={() => { setState(undo); setUndo(null); setNotice('Update undone.'); }}>Undo</button>}</div>}
      {!storageAvailable && <p role="status">Browser storage is unavailable. Changes are kept for this visit only.</p>}
      {!sessionPersisted && <p role="status" className="jh-demo-caption">Session storage is unavailable. Your demo sign-in lasts for this visit only.</p>}
      <div hidden={view !== 'discover'}><Discover apps={state.apps} skippedJobIds={state.skippedJobIds} onSkip={(job, skipped) => { setState(current => setJobSkipped(current, job.id, skipped)); setUndo(null); setNotice(`${job.company} role ${skipped ? 'skipped' : 'restored'}.`); }} onSave={job => { setState(current => trackJob(current, job)); setUndo(null); setNotice(`${job.company} saved to Applications.`); }} onDetails={openDetails} onApply={beginApply} /></div>
      <div hidden={view !== 'applications'}><Applications state={state} selected={view === 'applications' ? selected : null} onSelect={setSelected} onView={navigate} onStage={changeStage} onNotes={saveNotes} /></div>
      {view === 'calendar' && <Calendar state={state} selected={selected} onSelect={setSelected} onStage={changeStage} onNotes={saveNotes} />}
      {view === 'updates' && <Updates state={state} onConfirm={confirmUpdate} onIgnore={ignoreUpdate} onView={navigate} onDetails={openDetails} />}
    </main>
    {pendingApply && <ApplyDialog job={pendingApply} onDismiss={() => setPendingApply(null)} onConfirm={() => { setState(current => trackJob(current, pendingApply, 'Applied')); setUndo(null); setNotice(`${pendingApply.company} is tracked in Applications.`); setPendingApply(null); }} />}
  </div>;
}
