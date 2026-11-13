import React from 'react';

export default function Pagination({ result, onPage, label }) {
  return <nav className="jh-pagination" aria-label={`${label} pagination`}>
    <span aria-live="polite">{result.start}–{result.end} of {result.total}</span>
    <div>
      <button className="jh-btn jh-btn-quiet" disabled={result.page === 1} onClick={() => onPage(result.page - 1)}>Previous</button>
      {Array.from({ length: result.totalPages }, (_, i) => i + 1).map(page => <button key={page} className="jh-page-number" aria-label={`${label} page ${page}`} aria-current={page === result.page ? 'page' : undefined} onClick={() => onPage(page)}>{page}</button>)}
      <button className="jh-btn jh-btn-quiet" disabled={result.page === result.totalPages} onClick={() => onPage(result.page + 1)}>Next</button>
    </div>
  </nav>;
}
