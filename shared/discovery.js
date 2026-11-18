export function filterJobs(jobs, query, filters, skippedJobIds = [], showSkipped = false) {
  const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  return jobs.filter(job => {
    const searchable = `${job.company} ${job.role} ${job.location} ${job.workArrangement} ${job.type}`.toLowerCase();
    return skippedJobIds.includes(job.id) === showSkipped &&
      Object.entries(filters).every(([field, value]) => !value || job[field] === value) &&
      terms.every(term => searchable.includes(term));
  });
}
