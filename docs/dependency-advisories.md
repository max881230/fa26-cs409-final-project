# Dependency advisory record

Last reviewed: November 17, 2026.

## Deferred: picomatch repeated-extglob denial of service

Status: open; remediation deferred until a patched upstream release is available.
The dependency has not been fixed or removed.

[GHSA-fc5q-39xc-vjpf](https://github.com/advisories/GHSA-fc5q-39xc-vjpf)
reports a regular expression denial of service in picomatch versions through
4.0.7. At review time, the advisory lists no patched version, and the npm registry
lists 4.0.7 as the latest release.

The current lockfile contains this development-tool dependency tree:

```text
vite@8.3.8
├── picomatch@4.0.7
└── tinyglobby@0.2.17
    ├── picomatch@4.0.7 (deduplicated)
    └── fdir@6.5.0
        └── picomatch@4.0.7 (deduplicated)
```

`npm audit --json` reports four high-severity package entries: picomatch and its
dependents fdir, tinyglobby, and Vite. These entries trace to the same advisory,
rather than four independent vulnerabilities. A successful install, test run,
or build does not resolve the advisory.

## Exposure and evidence

The reported failure requires crafted glob patterns and strings to reach
picomatch's Node.js matcher. In bounded subprocess checks against the installed
4.0.7, both `+(*a)` and `+(*)b` against 32 `a` characters followed by `!` exceeded
a 1.5-second timeout. An ordinary `**/*.jsx` glob matched
`client/src/app/App.jsx` successfully. These checks confirm the dependency's
problem; they do not establish an exploitable application route.

Repository inspection found no application imports of picomatch or tinyglobby,
no `import.meta.glob` use, and no application input forwarded to a Node.js glob
matcher. The prototype has no backend. Development and preview commands bind
to `127.0.0.1`. Remote exploitation through this application's UI has not been
demonstrated; this is not a claim that every tooling path is safe.

## Decision and follow-up

Keep Vite 8.3.8 and the existing lockfile. Do not suppress the audit report or
introduce a local dependency patch for this deferral.

`npm audit fix --dry-run` did not offer a compatible fix. Its forced dry run
proposed downgrading Vite to 6.2.7. That release still uses picomatch and tinyglobby
as bundled build dependencies, as shown in its
[published source manifest](https://github.com/vitejs/vite/blob/v6.2.7/packages/vite/package.json).
Removing their separate lockfile entries is not sufficient evidence that the
vulnerable matching code has been removed. The downgrade was not applied.

When revisiting this advisory:

1. Check the upstream advisory and published package versions for a patched
   release; inspect every resolved copy with `npm ls vite tinyglobby fdir picomatch`.
2. Update the relevant dependency and lockfile on a feature branch.
3. Run `npm ci`, `npm audit --json`, `npm test`, and `npm run build`. Confirm the
   advisory is resolved and normal development and preview behavior still work.
4. Open a pull request targeting `master`, recording any remaining advisories.

At review time, `npm ci` completed, all 21 existing tests passed, and the production
build passed. The four audit entries remain open. No security regression test or
dependency override was added because this change records a deferral, not a fix.
