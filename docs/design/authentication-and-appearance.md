# Demo Authentication and Appearance

## Scope

The application implements browser-only demo sign-in using username **demo** and
password **demo**. It has no identity provider, account database, server sessions,
registration, password recovery, or Google sign-in. The client gate controls the
prototype UI and is not a security or authorization boundary.

## Sign-in and sign-out

- A single sign-in form is centered on desktop and uses the available width on mobile.
- Required username and password fields have labels, autocomplete attributes,
  inline validation, password visibility, and Enter submission.
- Incorrect credentials produce a focused, readable error. Submitting disables
  the fields and prevents concurrent requests.
- Sample credentials and a Fill demo credentials button make evaluation explicit.
  The page asks visitors not to use a real password.
- AuthProvider restores the session before AuthGate mounts Workspace. The initial
  loading screen never displays private-looking workspace content.
- The authClient adapter exposes signIn, signOut, and getSession for later API
  integration. Its current implementation checks only the fixed demo identity.
- sessionStorage holds a versioned identity record, never an entered password.
  Invalid or unknown records start signed out. Blocked storage permits a
  memory-only session with a visible explanation.
- Sign-out removes the demo session and unmounts Workspace. Selection, unsaved
  drafts, pending Apply dialogs, notices, and Undo are discarded. Saved application
  records and the appearance preference remain.

## Workspace persistence and migration

- localStorage stores version 2 workspaces under a key scoped by userId.
- Workspaces contain applications, calendar events, and individually reviewed
  notifications. Validation rejects malformed records and broken references.
- Only the fixed demo identity inherits the earlier anonymous version 1 key.
- Migration keeps applications, notes, events, and the original Figma review
  decision, then adds the five new recruiting messages.
- An existing version 2 record takes priority. The original anonymous record is
  retained, including when storage writes fail.
- Browser storage is a local demo convenience. Real accounts require server
  authorization and ownership checks for every application and event API.

## Theme behavior

| Preference | Result |
| --- | --- |
| Light | Always use the light palette |
| Dark | Always use the dark palette |
| System | Follow operating-system appearance; default preference |

- Offer the same labeled control before and after sign-in.
- Store appearance independently in cs409-job-helper:theme:v1 localStorage.
- Explicit Light/Dark overrides system changes. System listens for operating
  system changes; preference changes in another tab are also reflected.
- Invalid or blocked storage falls back to System. A choice still applies for
  the current visit if it cannot be saved.
- The public theme-init.js script runs before styles and React paint. It sets
  document appearance from the saved preference to avoid a light/dark flash.
- ThemeProvider maintains the preference and resolved color scheme. Shared
  semantic tokens cover page surfaces, text, muted content, accents, errors,
  borders, input controls, focus, and overlays.
- A theme change preserves tab navigation, form drafts, and application state.
  Saved preferences survive sign-out.

## Verification

Node tests cover credentials, session restoration/removal, blocked storage,
identity-scoped persistence, migration, malformed records, theme precedence,
persistence, and agreement between pre-paint initialization and React preferences.

Browser checks cover form errors, keyboard submission, sign-out/reload, both
palettes, responsive layouts, draft preservation, inbox review and Undo, and
application/calendar integration. Root npm test and npm run build are required.
