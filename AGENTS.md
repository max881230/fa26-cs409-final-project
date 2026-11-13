# Repository conventions

## Documentation

- Write repository documentation, code comments, and product UI text in English.
- Chinese is allowed only in `.openai/local/design/` for local discussions,
  development plans, and draft documents.
- Keep `.openai/local/` ignored by Git. Do not copy local planning notes into
  shared documentation without preparing an approved English version.
- Use `docs/design/` only for accepted English design documents. Keep speculative
  plans, unresolved alternatives, and discussion history in `.openai/local/design/`.
- Do not include competitor/reference-site comparisons in `docs/design/`.

## Development and demos

- Run commands from the repository root: `npm ci`, `npm run dev`, `npm test`,
  `npm run build`, and `npm run preview`.
- Source files live in `client/src/`; `client/index.html` is Vite's source entry.
- `npm run build` generates only `client/dist/`. Build output is disposable and
  must not be committed.
- This project currently uses local npm demos. Do not publish to Sites, recreate
  hosting configuration, or synchronize a remote Sites workspace unless the user
  explicitly requests it.
- `server/` describes planned work; no backend has been implemented.
