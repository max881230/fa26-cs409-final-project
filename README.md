# Job Application Helper — CS409

React + Vite frontend for discovering sample jobs, tracking applications,
reviewing email suggestions, and preparing for interviews with a recruiting calendar.

## Run locally

Requires Node.js 22.12+ (or a compatible newer release) and npm.

```sh
npm ci
npm run dev
```

Open the Local URL printed by Vite. Run commands from this repository's root.

Sign in with **username: demo / password: demo**, or use **Fill demo credentials**
on the sign-in page. Sign-in is simulated; do not enter a real password.

The Theme control offers **Light**, **Dark**, and **System** on both the sign-in
page and workspace. System is the default. The preference survives reloads and
sign-out on the same browser origin.

```sh
npm test          # pagination and workspace state transitions
npm run build    # generate the production frontend in client/dist
npm run preview  # preview the built client
```

`client/index.html` is the development entry point; editable components live in
`client/src/`. `client/dist/` contains generated HTML, JavaScript, and CSS for a
production build. It can be deleted and recreated with `npm run build`; do not
edit or commit its contents. Development with `npm run dev` does not require it.

## Structure

```text
client/
  src/
    app/                 Providers, sign-in gate, and workspace state
    components/ui/       Brand, pagination, and badges
    features/
      auth/              Demo sign-in, session, and sign-out
      theme/             Light, Dark, and System preferences
      jobs/              Discover and Apply confirmation dialog
      applications/      Tracker and shared details panel
      calendar/          Month calendar and agenda
      email-updates/     Six-message inbox, review, confirm, ignore
    lib/                 Dates and browser state persistence
    mocks/               Explicitly fictional demo data
    styles/              Original design and responsive list styles
  public/theme-init.js    Apply saved appearance before the first paint
  index.html             Vite source entry point
  dist/                  Generated build output; ignored by Git
server/                  Backend plan; no server implementation yet
shared/                  Pagination and workspace state transitions
tests/                   Meaningful data/state regression checks
docs/                    Accepted English designs and evaluation tasks
.openai/local/design/    Local discussions and plans; ignored by Git
```

## Prototype behavior

- Discover and Applications show at most 10 positions per page.
- Discover shows each demo role's location and work arrangement (Remote, In person,
  or Hybrid); both are included in search.
- Searching/filtering resets pagination; empty and final pages are handled.
- Save creates a Saved application. Apply opens a new tab, then asks whether the
  application was completed. Only **Yes, I applied** adds/updates Applied.
- **Not yet**, Escape, and closing the dialog do not change the tracker.
- Repeated save/apply actions do not create duplicates or reset interview/offer stages.
- Updates has the original Figma invitation plus five new sample messages for
  Notion, Stripe, Linear, Canva, and Datadog. Confirm or ignore each independently,
  with Undo.
- Event suggestions update the tracker and calendar together. Deadline extensions
  replace their existing event; status-only messages do not create events.
- Relevant links in sample email suggestions are saved with confirmed calendar
  events and shown in the agenda and next-step details. Sample event links use
  `example.com` placeholders. The month overview shows scheduled times in CT;
  events without a time show their title without a time label.
- Demo sessions use sessionStorage without storing a password. Sign-out clears
  selected details, unsaved drafts, pending dialogs, and Undo.
- User-specific localStorage retains saved applications, notes, and notification
  decisions. Legacy anonymous data migrates only to the fixed demo identity.
- Theme preferences are stored separately and survive sign-out.

All roles and application records are fictional demo data. Apply links go to
verified company careers pages, not verified live listings for these demo roles.
The calendar is a November 2026 fixture anchored to November 17. Its schedule
includes historical events; application next steps skip dates before the demo date.
There is no real Gmail connection, server authentication, API, database, or reminder
delivery yet. The client-only sign-in gate does not secure private resources.

## Documentation and demos

See the [dependency advisory record](docs/dependency-advisories.md) for the current
tooling advisory and the decision to defer remediation until an upstream patch.

Use local npm commands for demos. Builds generate only `client/dist/`.
External publishing workspaces and artifacts are managed outside this repository.
`npm run preview` requires a preceding `npm run build` and is a local build
preview, not a backend or production hosting service.

Write shared documentation, code comments, and UI text in English. Keep Chinese
discussion notes and tentative development plans only in `.openai/local/design/`.
The entire `.openai/local/` directory is excluded from Git. Only accepted English
design documents belong in `docs/design/`, without reference-site comparisons.

See [demo authentication and appearance](docs/design/authentication-and-appearance.md),
[the UI and repository design](docs/design/ui-and-repository-design.md) and
[the prototype evaluation tasks](docs/heuristic-evaluation/tasks.md).
