# Backend (planned)

The current project is a browser-local React prototype. No server, authentication,
Gmail processing, API, or database is implemented here yet.

Future Express implementation: organize `src/modules/` by applications, events,
jobs, and email updates; put Gmail code in `src/integrations/gmail/` and PostgreSQL
migrations in `src/db/`. Keep OAuth secrets and tokens on the server.

The frontend currently uses `client/src/mocks/fixtures.js` and the pure state
transitions in `shared/workspace.js`. Replace this local data boundary with API
requests when the backend is implemented.
