import React, { useId } from 'react';
import { useTheme } from './ThemeProvider.jsx';

export default function ThemeControl() {
  const { preference, saved, changeTheme } = useTheme();
  const id = useId();
  return <div className="jh-theme-control">
    <label htmlFor={id}>Theme</label>
    <select id={id} value={preference} onChange={event => changeTheme(event.target.value)} aria-describedby={!saved ? id + '-warning' : undefined}>
      <option value="light">Light</option><option value="dark">Dark</option><option value="system">System</option>
    </select>
    {!saved && <span id={id + '-warning'} className="jh-small" role="status">For this visit only</span>}
  </div>;
}
