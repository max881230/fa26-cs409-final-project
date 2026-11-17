# Job Application Helper — UI and Repository Design

This document records the accepted design of the current React frontend and its
repository structure. Local discussion notes and tentative development plans live
in `.openai/local/design/`, which is excluded from version control. Shared design
documents in this directory are written in English.

## Product purpose

Help applicants understand the status of each application, the next action to
take, and the date of the next recruiting event.

The core workflow is:

```text
Discover a role → Save or apply → Review an email suggestion
→ Confirm changes → Track the event → Prepare for the interview
```

The current frontend is an interactive prototype using fictional opportunities,
application records, and recruiting emails. Its data is stored in the browser.
There is no backend, server authentication, database, Gmail connection, live job feed,
Google Calendar synchronization, or delivered notification service yet.

## Information architecture

The application has four primary tabs:

| Tab | Purpose |
| --- | --- |
| Discover | Search and browse opportunities, save roles, and open careers pages |
| Applications | Review tracked positions, stages, next steps, and preparation notes |
| Calendar | View recruiting events and open their associated application details |
| Updates | Review suggested changes before applying them to the tracker and calendar |

After demo sign-in, Applications is the default tab. The current tabs use React state rather than
separate URL routes. Application details are shared by Applications and Calendar.
Demo sign-in and appearance controls are documented in
[Authentication and appearance](authentication-and-appearance.md). Real account
registration, recovery, and identity verification are outside the prototype.

## Discover

- Provide a search field for role, company, and location, plus a job-type filter.
- Use aligned Position, Info, and Actions columns on desktop.
- Show company and role in Position; location, job type, and data source in Info.
- Display at most 10 positions per page, with Previous, Next, and numbered pages.
- Reset pagination when search criteria or filters change.
- Handle empty results and partial final pages without out-of-range navigation.
- Save to tracker creates a Saved application. An already tracked role links to
  its existing details instead of creating another record.
- Apply opens an external page in a new tab and displays a confirmation dialog
  in the original application.
- Only selecting **Yes, I applied** creates an Applied application or changes an
  existing Saved record to Applied.
- Selecting **Not yet**, closing the dialog, or pressing Escape does not change
  application records.
- Preserve notes and advanced stages when a role is saved or revisited again.

The opportunities are fictional evaluation fixtures. Apply links open the
company's careers page; they do not claim that a matching live opening exists.
Opening an external page is not evidence that an application was submitted.

## Applications

- Show compact counts for tracked applications, interviews, and pending updates.
- Provide stage filters and a clear entry point to review pending suggestions.
- Use Position, Updates, and Actions columns aligned with the position rows.
- Show company, role, and stage in Position; next action, date, or latest activity
  in Updates.
- Use the same 10-item pagination behavior as Discover.
- Add a subtle lift and shadow on hover and a visible keyboard-focus treatment.
- Honor reduced-motion preferences and keep actions available without hovering.
- Align the top of the details panel with the Position/Updates column headings,
  after the summary, pending-update notice, and filters.
- Keep details tied to the same application when navigating from another tab.

The supported stages are Saved, Applied, Interviewing, Offered, Rejected, and
Withdrawn. Stages can be corrected manually. Rejected and Withdrawn are outcomes,
not mandatory steps in a linear pipeline. An online assessment is represented
as an event or next action in this prototype.

## Application details

The details panel includes:

- Company, role, and editable stage.
- The next recruiting event, with date, time, and time-zone information.
- An activity timeline distinguishing manual changes and confirmed email updates.
- Preparation notes with an explicit Save action and success feedback.

Desktop layouts place details alongside the list or calendar. Narrow layouts
show details as the primary single-column content with a visible Close action.
The shared component prevents the tracker and calendar from presenting different
versions of the same application.

## Calendar

- Show a month calendar and schedule side by side on wide screens.
- Stack them on intermediate screens and use the agenda on small screens.
- Use text labels as well as color to distinguish interviews and deadlines.
- Allow multiple events per application.
- Open the associated application details when an event is selected.
- Display the America/Chicago time zone for the current fixtures.
- Keep date-only deadlines distinct from timed interview events.

The calendar uses a fixed November 2026 dataset anchored to November 17. The
schedule includes historical events, while application next steps skip dates
before the demo date. Confirming an email suggestion adds or replaces its event
in the same shared event collection.

## Updates

The inbox contains six selectable messages: the original Figma invitation, plus
Notion's final interview, Stripe's assessment extension, Linear's application
confirmation, Canva's offer with a response deadline, and Datadog's rejection.
Each message has an independent Pending, Confirmed, or Ignored review state.
Navigation and Applications show the total pending count and matched-row badges.
All updates and Needs review filters help users revisit messages. Desktop uses
an inbox/review split; narrow screens stack both with a Back to inbox action.

- Show the source email excerpt, associated application, current stage, suggested
  stage, and proposed event date and time when applicable.
- Let users edit the suggestion before choosing Confirm or Ignore.
- Do not change the tracker or calendar merely because a suggestion exists.
- Confirm changes only the matched application's stage and its optional event in
  one state transition. Deadline extensions replace the matching event without
  duplication; status-only messages leave the calendar unchanged.
- Ignore dismisses the suggestion without changing application or event data.
- Offer Undo while the confirmation or dismissal feedback is available.
- Prevent a confirmed suggestion from being applied twice.

Real email matching, ambiguous dates, duplicate provider messages, and disconnected
accounts will require backend integration. They are not implemented by the demo.

## Visual and responsive design

- Let the workspace use the available desktop width with approximately 16–32px
  of internal spacing instead of a narrow fixed-width export container.
- Use a continuous page background without white gaps at the four outer corners.
- Keep the main area flexible and give the details sidebar a readable width.
- Use a cream background, dark text, mint primary actions, and restrained violet
  accents in light mode, with corresponding dark-mode colors.
- Use rounded controls and panels, thin row separators, and stronger outlines
  for navigation and primary actions.
- Keep body text around 14–16px and mobile form inputs at least 16px.
- Keep stage labels visible; color alone must not communicate status.
- Preserve native focus indicators, accessible field labels, keyboard controls,
  and usable touch targets.
- Present aligned columns on desktop and readable stacked cards on mobile.

## Repository structure

```text
client/
  index.html                     Vite source entry point
  package.json                   Frontend dependencies and commands
  vite.config.js                 Build and shared-module configuration
  src/
    app/                         Providers, sign-in gate, and workspace state
    components/ui/               Reusable pagination and badges
    features/
      auth/                      Demo sign-in, session, and sign-out
      theme/                     Appearance provider and selector
      jobs/                      Discover and Apply confirmation
      applications/              Tracker, details, notes, and activity
      calendar/                  Month calendar and upcoming agenda
      email-updates/             Suggestion review and confirmation
    lib/                         Browser persistence and date helpers
    mocks/                       Fictional evaluation fixtures
    styles/                      Shared styles and responsive layouts
server/
  README.md                      Backend scope and implementation direction
shared/
  pagination.js                  Page calculation and bounds
  workspace.js                   Shared application-state transitions
tests/
  *.test.js                      Auth, theme, storage, dates, and state checks
docs/
  design/                        Accepted English design documents
  heuristic-evaluation/          Shared evaluation tasks and findings
.openai/local/design/            Ignored local plans; Chinese is allowed here
```

Keep feature-specific components with their feature. Place only reusable UI
primitives in `components/ui`. Shared state transitions must not depend on React,
browser globals, or future database models.

## Build and demo workflow

Run all commands from the repository root:

```sh
npm ci
npm run dev
npm test
npm run build
npm run preview
```

`npm run dev` serves the editable frontend with Vite. `npm run build` generates
the production bundle in `client/dist/`; `npm run preview` serves that bundle
locally. Generated build files are not source files and are ignored by Git.

Builds produce only `client/dist/`. Local npm demos are the current delivery
workflow. External publishing workspaces and artifacts are managed outside this
repository. Publication requires a new explicit request.

## Data and future integration boundary

The frontend shares application, event, and notification collections across tabs. Browser
localStorage persists records per userId between visits on the same origin. The pure
functions in `shared/workspace.js` enforce duplicate handling and review updates.

The broader project direction remains React, a Node.js/Express REST API,
PostgreSQL, user accounts, and authorized Gmail processing. These backend features
are future work. Detailed endpoint contracts, database schemas, authentication
flows, and team assignments remain local plans until approved for shared docs.

Future integration must preserve these accepted behavior requirements:

- Distinguish external job listings from a user's own application records.
- Allow manual application records without requiring a live external listing.
- Associate multiple notes, history entries, and events with one application.
- Apply a confirmed suggestion atomically and prevent duplicate application.
- Retain user control over suggested changes and ambiguous event information.
- Enforce ownership of private resources and keep provider credentials on the server.

## Evaluation

Evaluate three end-to-end tasks:

1. Find and save an opportunity, then locate its tracked record.
2. Review an interview suggestion, confirm its content, and locate the event.
3. Open event details, check the time zone, and save preparation notes.

Also inspect pagination boundaries, filtering from later pages, Apply cancellation,
repeated confirmation, empty results, keyboard operation, responsive layout, and
notes after reload. Record the observed problem, relevant heuristic, severity,
proposed revision, before/after evidence, and validation result.

The detailed task checklist is maintained in
`docs/heuristic-evaluation/tasks.md`. Peer feedback and the resulting UI revision
must be documented by the team as part of the course deliverables.
