# BALL x PIT Evolution Chart

An interactive evolution chart for the video game BALL x PIT, showing details about balls and passives and their resulting evolutions.

## Live Site

https://ballxpit.netlify.app/

## ⚠️ Asset Notice

**Important**: This project uses game assets from BALL x PIT. These assets are NOT owned by this project's creators.

See [ASSETS.md](./ASSETS.md) for full copyright and attribution information.

## Features

- Interactive evolution grid showing starter balls and passives and evolutions
- Advanced evolution formulas with visual representations
- Detailed tooltips with ball descriptions
- Responsive design

## Credits

Original project created by [jackietieu](https://github.com/jackietieu/ball_x_pit_ui).

Upstream: https://github.com/jackietieu/ball_x_pit_ui

## Developing

Use the Node.js version pinned in `.nvmrc` (22.23.4). With nvm:

```sh
nvm install
nvm use
```

Node 24.22.1+ and 26.12.1+ are also supported within their respective major versions. Older
patch releases are rejected during installation because these minimums include the
[Node2Shell (CVE-2026-111497) security fix](https://nodejs.org/en/blog/vulnerability/october-2026-security-releases).

Cloudflare Workers Builds reads `.nvmrc`. If you have set a `NODE_VERSION` build variable in
the Cloudflare dashboard, keep it consistent with the pinned version.

Once you've installed dependencies with `npm install`, start a development server:

```sh
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

Application components and supporting modules live in `src/lib`; routes live in `src/routes`.
SvelteKit and static-adapter configuration lives in `vite.config.ts`. Internal library imports use
the `#lib/*` mapping in `package.json`.

## Testing

Install the Chromium headless browser after installing or updating Playwright, then run all tests:

```sh
npx playwright install chromium --only-shell
npm test -- --browser.headless
npm run check
npm run lint
npm run format:check
```

## Security maintenance

The deployed app consists of prerendered static assets, not a Node.js request handler. Build and
development dependencies still need regular security reviews.

Follow-ups from the November 6, 2026 review:

- `minimatch` has a [moderate denial-of-service advisory](https://github.com/advisories/GHSA-g3hv-75wg-m249).
  The current ESLint and TypeScript ESLint releases still require version 10; the latter's
  [upgrade to the fixed version 11 is pending](https://github.com/typescript-eslint/typescript-eslint/pull/13145).
  ESLint patterns come from trusted project configuration, not visitor input. This app also does
  not enable the parser's `projectService` feature that consumes this dependency.
- `deepmerge` has a [low-severity prototype-poisoning advisory](https://github.com/advisories/GHSA-gcqx-w48m-w2h4)
  with no published patch. Its Svelte Vite plugin usage merges trusted build configuration, not
  visitor-supplied input.
- Node.js has announced [security releases for November 11, 2026](https://github.com/nodejs/nodejs.org/blob/main/apps/site/pages/en/blog/vulnerability/november-2026-security-releases.md).
  Revisit the runtime pins after those patches are published.

## Building

To create a production version of the app:

```sh
npm run build
```

You can preview the production build with `npm run preview`.
