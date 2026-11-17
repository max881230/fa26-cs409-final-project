export const STAGES = ['Saved', 'Applied', 'Interviewing', 'Offered', 'Rejected', 'Withdrawn'];

export function trackJob(state, job, stage = 'Saved') {
  const existing = state.apps.find(app => app.id === job.id);
  if (existing) {
    // A bookmark or a second visit must never reset an existing interview/offer.
    if (stage !== 'Applied' || existing.stage !== 'Saved') return state;
    return { ...state, apps: state.apps.map(app => app.id === job.id ? { ...app, stage: 'Applied', history: [{ label: 'Application submitted', source: 'Just now · Confirmed by you' }, ...app.history] } : app) };
  }
  return { ...state, apps: [...state.apps, { ...job, stage, notes: '', history: [{ label: stage === 'Saved' ? 'Saved for later' : 'Application submitted', source: 'Just now · Confirmed by you' }] }] };
}

export function validDateTime(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value)) return false;
  const date = new Date(value + ':00Z');
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 16) === value;
}

export function pendingUpdates(state) {
  return state.updates.filter(update => update.status === 'pending');
}

export function acceptUpdate(state, updateId, stage, dateTime) {
  const update = state.updates.find(item => item.id === updateId);
  if (!update || update.status !== 'pending' || !STAGES.includes(stage) || !state.apps.some(app => app.id === update.appId) || (update.event && !validDateTime(dateTime))) return state;
  const event = update.event && { ...update.event, app: update.appId, date: dateTime.slice(0, 10), time: dateTime.slice(11) };
  return {
    ...state,
    updates: state.updates.map(item => item.id === updateId ? { ...item, status: 'accepted', confirmedStage: stage } : item),
    apps: state.apps.map(app => app.id === update.appId ? { ...app, stage, history: [{ label: update.title + ' · Stage confirmed: ' + stage, source: 'Just now · Email update confirmed' }, ...app.history] } : app),
    events: event ? [...state.events.filter(item => item.id !== event.id), event] : state.events,
  };
}

export function ignoreUpdate(state, updateId) {
  if (!state.updates.some(update => update.id === updateId && update.status === 'pending')) return state;
  return { ...state, updates: state.updates.map(update => update.id === updateId ? { ...update, status: 'ignored' } : update) };
}
