import React, { useEffect, useRef } from 'react';

export default function ApplyDialog({ job, onConfirm, onDismiss }) {
  const ref = useRef(null);
  useEffect(() => { ref.current.showModal(); }, []);
  return <dialog ref={ref} className="jh-apply-dialog" aria-labelledby="apply-title" aria-describedby="apply-description" onCancel={onDismiss} onClick={event => { if (event.target === ref.current) onDismiss(); }}>
    <div className="jh-detail-top"><span>Application check-in</span><button className="jh-close" aria-label="Close application confirmation" onClick={onDismiss}>×</button></div>
    <h2 id="apply-title">Did you complete your application?</h2>
    <p id="apply-description">{job.company} · {job.role}</p>
    <p className="jh-subtitle">Choose “Yes” to add this role to Applications as Applied. Opening the careers page alone does not update your tracker.</p>
    <div className="jh-review-actions"><button className="jh-btn jh-btn-main" onClick={onConfirm}>Yes, I applied</button><button className="jh-btn" onClick={onDismiss}>Not yet</button></div>
  </dialog>;
}
