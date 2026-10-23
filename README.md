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

## Building

To create a production version of the app:

```sh
npm run build
```

You can preview the production build with `npm run preview`.
