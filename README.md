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
    app/                 App shell and shared state
    components/ui/       Pagination and badges
    features/
      jobs/              Discover and Apply confirmation dialog
      applications/      Tracker and shared details panel
      calendar/          Month calendar and agenda
      email-updates/     Review, confirm, ignore
    lib/                 Dates and browser state persistence
    mocks/               Explicitly fictional demo data
    styles/              Original design and responsive list styles
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
- Searching/filtering resets pagination; empty and final pages are handled.
- Save creates a Saved application. Apply opens a new tab, then asks whether the
  application was completed. Only **Yes, I applied** adds/updates Applied.
- **Not yet**, Escape, and closing the dialog do not change the tracker.
- Repeated save/apply actions do not create duplicates or reset interview/offer stages.
- Calendar and Updates share application/event state; confirmed suggestions update
  the tracker and calendar together. Preparation notes persist locally.
- State uses browser localStorage and persists between visits on the same origin.

All roles and application records are fictional demo data. Apply links go to
verified company careers pages, not verified live listings for these demo roles.
The calendar is a November 2026 evaluation fixture. There is no real Gmail
connection, authentication, API, database, or reminder delivery yet.

## Documentation and demos

Use local npm commands for demos. Builds generate only `client/dist/`.
External publishing workspaces and artifacts are managed outside this repository.
`npm run preview` requires a preceding `npm run build` and is a local build
preview, not a backend or production hosting service.

Write shared documentation, code comments, and UI text in English. Keep Chinese
discussion notes and tentative development plans only in `.openai/local/design/`.
The entire `.openai/local/` directory is excluded from Git. Only accepted English
design documents belong in `docs/design/`, without reference-site comparisons.

See [the UI and repository design](docs/design/ui-and-repository-design.md) and
[the prototype evaluation tasks](docs/heuristic-evaluation/tasks.md).
