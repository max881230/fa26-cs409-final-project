// Fictional recruiting messages for the November 2026 demo.
export function createDemoUpdates() {
  return [
    {
      id: 'figma-interview-invite', appId: 'figma', title: 'Technical interview invitation',
      from: 'figma-recruiting@example.com', received: 'Nov 17 · 9:10 AM',
      excerpt: 'We enjoyed reviewing your application. Join our engineering team for a technical interview on November 19 at 2:00 PM Central Time. Interview link: https://example.com/demo/figma-interview',
      suggestedStage: 'Interviewing', status: 'pending',
      event: { id: 'figma-interview', title: 'Technical interview', kind: 'Interview', date: '2026-11-19', time: '14:00', url: 'https://example.com/demo/figma-interview' },
    },
    {
      id: 'notion-final-interview', appId: 'notion', title: 'Final interview invitation',
      from: 'notion-recruiting@example.com', received: 'Nov 17 · 8:45 AM',
      excerpt: 'Thank you for the recruiter conversation. Your final interview is scheduled for November 20 at 11:00 AM Central Time.',
      suggestedStage: 'Interviewing', status: 'pending',
      event: { id: 'notion-final', title: 'Final interview', kind: 'Interview', date: '2026-11-20', time: '11:00' },
    },
    {
      id: 'stripe-assessment-deadline', appId: 'stripe', title: 'Assessment deadline extended',
      from: 'stripe-recruiting@example.com', received: 'Nov 16 · 4:20 PM',
      excerpt: 'Your coding assessment deadline has been extended to November 21 at 6:00 PM Central Time. Your application remains under review. Assessment link: https://example.com/demo/stripe-assessment',
      suggestedStage: 'Applied', status: 'pending',
      event: { id: 'stripe-oa', title: 'OA due', kind: 'Deadline', date: '2026-11-21', time: '18:00', url: 'https://example.com/demo/stripe-assessment' },
    },
    {
      id: 'linear-application-received', appId: 'linear', title: 'Application received',
      from: 'linear-recruiting@example.com', received: 'Nov 16 · 2:05 PM',
      excerpt: 'We have received your Product Engineer application. Our team will review it and contact you with next steps. No action is needed today.',
      suggestedStage: 'Applied', status: 'pending',
    },
    {
      id: 'canva-offer', appId: 'demo-job-7', title: 'An offer for your next chapter',
      from: 'canva-recruiting@example.com', received: 'Nov 16 · 11:30 AM',
      excerpt: 'We are excited to offer you the Software Engineer Intern role. Please review the offer and respond by November 24 at 5:00 PM Central Time.',
      suggestedStage: 'Offered', status: 'pending',
      event: { id: 'canva-offer-deadline', title: 'Offer response due', kind: 'Deadline', date: '2026-11-24', time: '17:00' },
    },
    {
      id: 'datadog-decision', appId: 'demo-job-8', title: 'An update on your application',
      from: 'datadog-recruiting@example.com', received: 'Nov 15 · 3:15 PM',
      excerpt: 'Thank you for your interest in the Backend Engineer Intern role. We have decided to move forward with other candidates for this opening.',
      suggestedStage: 'Rejected', status: 'pending',
    },
  ];
}
