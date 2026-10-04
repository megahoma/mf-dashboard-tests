# AGENTS.md

This repository is a fixture for testing [mf-dashboard](https://github.com/megahoma/mf-dashboard).

A shell, a menu, three widgets, and one shared remote. React 19, TypeScript, Rsbuild, Module Federation 2. Remotes load from `mf-manifest.json`. Screens use static copy or props. Do not add external API calls.

`README.md` is English. `README.ru.md` is the same text in Russian. Update both together.

## Map

| Directory | Package | Container | Port | Remotes |
|---|---|---|---|---|
| `apps/shell` | `@mfe/shell` | `shell` | 3000 | `menu`, `shared`, `widget1`, `widget2`, `widget3` |
| `apps/widget-1` | `@mfe/widget-1` | `widget1` | 3001 | `shared`, `widget3` |
| `apps/widget-2` | `@mfe/widget-2` | `widget2` | 3002 | `shared` |
| `apps/widget-3` | `@mfe/widget-3` | `widget3` | 3003 | `shared` |
| `apps/menu` | `@mfe/menu` | `menu` | 3004 | `shared` |
| `apps/shared` | `@mfe/shared` | `shared` | 3005 | none |

The container name has no hyphen. A hyphen belongs only in the directory and the package name. Apps stay separate. Do not add a shared config generator.

## Widget contract

`src/Widget.tsx` exports a default component. Props are optional and serializable.

| App | Props |
|---|---|
| `shared` | `className?`, `label?` |
| `menu` | `className?`, `items?` |
| `widget-1`, `widget-2`, `widget-3` | `className?`, `title?` |

`items` is one comma-separated string. Menu splits it on commas. An empty value falls back to `Overview`, `Catalog`, `Reports`. The shell passes `Overview,Widgets,Settings`.

Each widget renders `<pre className="widget-props">` with its prop shape as static text. Leave that block in place.

There is one expose: `./Widget` → `./src/Widget.tsx`. Imports are string literals, for example `import('shared/Widget')` and `import('widget3/Widget')`. Template strings and concatenation are not allowed: the plugin will not see them.

## Federation

`remotes` point only at the manifest:

```ts
shared: 'shared@http://127.0.0.1:3005/mf-manifest.json'
```

Do not put `remoteEntry.js` in `remotes`. The producer's `filename: 'remoteEntry.js'` is the file the manifest points at. Do not remove it.

Every app sets `server.host: '::'` and `server.strictPort: true`.

Producers (`menu`, `widget1`, `widget2`, `widget3`, `shared`) also set:

- `manifest: true`
- `dev.assetPrefix` and `output.assetPrefix`: `http://127.0.0.1:<port>/`
- CORS `origin`: `/^https?:\/\/(?:(?:[^:]+\.)?localhost|127\.0\.0\.1|\[::1\])(?::\d+)?$/`

The shell is a host only. It has no `exposes`, no `filename`, no `manifest`, and no `assetPrefix`.

`dts.displayErrorInTerminal` is `true` in every app.

- `shared` generates types with `tsConfigPath: './tsconfig.json'` and does not consume them.
- `menu`, `widget1`, `widget2`, and `widget3` set both `generateTypes` (same `tsConfigPath`) and `consumeTypes: true`.
- The shell sets `generateTypes: false` and `consumeTypes: true`.

`react` and `react-dom` in all six apps: `singleton: true`, `eager: true`, `requiredVersion: '19.3.0'`.

Each remote render is wrapped in its own `RemoteBoundary` and `Suspense`. The fallback text is `Loading…`. The boundary text is `Failed to load the microfrontend`. A failure in one remote does not take down the others.

## Commands

Requires Node.js `>=20.19.0` and pnpm `10.34.5`.

```bash
pnpm install
pnpm dev
pnpm typecheck
pnpm build
```

`pnpm dev` starts all six servers. The ports are fixed. Root scripts only call package scripts:

```json
"dev": "pnpm --parallel --filter \"./apps/*\" dev",
"build": "pnpm --filter \"./apps/*\" build",
"typecheck": "pnpm --filter \"./apps/*\" typecheck"
```

Shell page check: the page shows Menu, Shared from shell, Widget 1 from shell, Widget 2 from shell, and Widget 3 from shell. Widget 1 also shows Widget 3 from widget 1 and Shared from widget 1. Menu shows Shared from menu. Widget 2 shows Shared from widget 2. Both Widget 3 renders show Shared from widget 3. `curl` of the shell HTML will not show those texts: they arrive at runtime.

## Dashboard settings

`.vscode/settings.json` is part of the fixture. `mf-dashboard.apps` lists six entries. The key is the container name, `path` is the app directory, `manifestPath` is `/mf-manifest.json`, and `scripts.start` is `dev`.

Do not replace `mf-dashboard.apps` with `{}`. An empty object turns off startup discovery. Leave `mf-dashboard.commands.rebuildTypes` and `mf-dashboard.commands.refetchTypes` empty so the extension uses its built-in type commands.

`@mf-types` and `@mf-types.zip` are generated. They stay gitignored.

## App scripts

The repository directory contains `:`. Because of that, pnpm does not put `node_modules/.bin` on `PATH`.

- A bare `rsbuild` or `tsc` in scripts fails with `command not found`.
- `pnpm exec` inside this workspace fails with `ERR_PNPM_BAD_PATH_DIR`.

Write app scripts like this:

```json
"dev": "pnpm --ignore-workspace exec rsbuild dev",
"build": "pnpm --ignore-workspace exec rsbuild build",
"preview": "pnpm --ignore-workspace exec rsbuild preview",
"typecheck": "pnpm --ignore-workspace exec tsc --noEmit"
```

The root `dev`, `build`, and `typecheck` only call package scripts. Do not rename the directory to remove the colon.

## Versions

Pin exact versions, with no ranges: `react` and `react-dom` `19.3.0`, `@types/react` and `@types/react-dom` `19.3.0`, `typescript` `5.9.3`, `@rsbuild/core` `2.2.9`, `@rsbuild/plugin-react` `2.1.0`, `@module-federation/rsbuild-plugin` and `@module-federation/enhanced` `2.9.1`.

## Do not add unless asked

Automated tests and runners: Vitest, Testing Library, Jest, Playwright, Rstest. A shared types package, routing, state shared between widgets, CI, publishing. Do not set `"type": "module"` in app package.json files: the current configs work without it. Do not call external APIs from widgets.
