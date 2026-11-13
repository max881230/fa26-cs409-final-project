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

export function acceptUpdate(state, stage, dateTime) {
  if (state.review !== 'pending' || !STAGES.includes(stage) || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(dateTime)) return state;
  return {
    ...state,
    review: 'accepted',
    apps: state.apps.map(app => app.id === 'figma' ? { ...app, stage, history: [{ label: `Stage confirmed: ${stage}`, source: 'Just now · Email update confirmed' }, ...app.history] } : app),
    events: [...state.events.filter(event => event.id !== 'figma-interview'), { id: 'figma-interview', app: 'figma', date: dateTime.slice(0, 10), time: dateTime.slice(11), kind: 'Interview', title: 'Technical interview' }],
  };
}
