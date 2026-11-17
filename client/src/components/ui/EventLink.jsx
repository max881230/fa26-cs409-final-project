import React from 'react';

export default function EventLink({ event }) {
  if (typeof event.url !== 'string' || !/^https?:\/\//i.test(event.url)) return null;
  return <a className="jh-link" href={event.url} target="_blank" rel="noopener noreferrer" aria-label={`Open link for ${event.title}`}>Open event link ↗</a>;
}
