export const sortedEvents = events => [...events].sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
export const dateLabel = date => new Date(`${date}T12:00:00Z`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' });
export const eventTime = event => event.time ? `${dateLabel(event.date)} · ${event.time} CT` : `${dateLabel(event.date)} · date-only deadline`;
export const nextEvent = (events, id) => sortedEvents(events).find(event => event.app === id);
