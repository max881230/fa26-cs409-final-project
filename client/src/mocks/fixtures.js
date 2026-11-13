const companies = [
  ['Canva', 'https://www.lifeatcanva.com/en/', 'San Francisco · Hybrid'],
  ['Datadog', 'https://careers.datadoghq.com/all-jobs/', 'New York · On-site'],
  ['Linear', 'https://linear.app/careers', 'Remote · United States'],
  ['Figma', 'https://www.figma.com/careers/', 'San Francisco · Hybrid'],
  ['Notion', 'https://www.notion.com/careers', 'San Francisco · Hybrid'],
  ['Stripe', 'https://stripe.com/careers/search', 'New York · Hybrid'],
];

// Fictional opportunities for prototype testing, not a feed of live openings.
export const jobs = Array.from({ length: 24 }, (_, index) => {
  const [company, applyUrl, location] = companies[index % companies.length];
  const role = index === 7 ? 'Backend Engineer Intern' : index === 14 ? 'Full Stack Engineer' : index < 3 ? ['Frontend Engineer Intern', 'Software Engineer Intern', 'Product Engineer'][index] : ['Frontend Engineer Intern', 'Software Engineer Intern', 'Product Engineer', 'Software Engineer, New Grad'][Math.floor(index / companies.length)];
  const coreIds = { 2: 'linear', 4: 'notion', 9: 'figma', 23: 'stripe' };
  return { id: coreIds[index] || `demo-job-${index + 1}`, company, role, applyUrl, location, type: index < 12 && index !== 2 ? 'Intern' : 'New Grad' };
});

const makeApplication = (job, stage, date = 'Nov 09') => ({ ...job, stage, notes: '', history: [{ label: stage === 'Saved' ? 'Saved for later' : 'Application submitted', source: `${date} · Demo record` }] });

export function createInitialWorkspace() {
  return {
    version: 1,
    review: 'pending',
    apps: [
      { ...makeApplication({ id: 'figma', company: 'Figma', role: 'Software Engineer Intern', applyUrl: companies[3][1] }, 'Applied', 'Nov 06'), notes: 'Review portfolio project and prepare questions for the team.' },
      { ...makeApplication({ id: 'notion', company: 'Notion', role: 'Frontend Engineer Intern', applyUrl: companies[4][1] }, 'Interviewing', 'Nov 03'), notes: 'Practice explaining the tradeoffs in our CS409 project.', history: [{ label: 'Recruiter screen confirmed', source: 'Nov 08 · Email update confirmed' }, { label: 'Application submitted', source: 'Nov 03 · Demo record' }] },
      { ...makeApplication({ id: 'stripe', company: 'Stripe', role: 'Software Engineer, New Grad', applyUrl: companies[5][1] }, 'Applied', 'Nov 04'), notes: 'Practice timed coding questions.' },
      makeApplication(jobs[2], 'Saved'),
      ...jobs.slice(3).filter(job => !['figma', 'notion', 'stripe', 'linear'].includes(job.id)).slice(0, 8).map((job, index) => makeApplication(job, index % 3 === 0 ? 'Saved' : 'Applied')),
    ],
    events: [
      { id: 'notion-screen', app: 'notion', date: '2026-11-11', time: '10:00', kind: 'Interview', title: 'Recruiter screen' },
      { id: 'stripe-oa', app: 'stripe', date: '2026-11-13', time: '18:00', kind: 'Deadline', title: 'OA due' },
      { id: 'linear-deadline', app: 'linear', date: '2026-11-16', time: '', kind: 'Deadline', title: 'Application due' },
    ],
  };
}
