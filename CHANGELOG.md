# Changelog

All notable changes to this project are documented here.
The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the project uses [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Added

- Docker image: multi-stage `Dockerfile` (Node build + unprivileged nginx), `nginx.conf` with the `/api` proxy to
  `bifrost-app`, SPA fallback and long-lived caching of fingerprinted assets, and a `.dockerignore`.
- Cover URL field in the game form (`coverUrl`, requires Bifröst with cover support), with a live preview. Clearing it removes the cover.
- Covers now try the game's own `coverUrl` first, then the Steam cover, then the platform placeholder. Portrait box art is shown whole over a blurred background.

### Fixed

- Nintendo Switch 2 now has its own logo instead of the Switch 1 one (from Wikimedia Commons, public domain).
- A form field's validation error now disappears as soon as the field is edited.

## [0.1.0] - 2026-11-15

### Added

- Vite + React 19 project with Tailwind CSS 4, shadcn/ui and TanStack Query 5.
- Dev proxy: the app calls `/api/...` and Vite forwards it to Bifröst without the prefix (the backend has no CORS).
- Game collection loaded once and filtered in the browser: search by name (accent-insensitive), filters by platform, digital/physical, completed, multiplayer and type, and sorting.
- Card view with Steam covers (with a colourful fallback) and a sortable table view.
- Counters for games, completed, platinum and hours played, following the active filters.
- Game detail side panel.
- Create and edit form with validation; edits send only the changed fields (`PATCH`).
- Delete with confirmation, and success/error toasts showing the API message.
- Platform and digital store management, with per-item game counts and a clear `409` message.
- Steam sync button: always runs a dry run first and asks for confirmation.
- Dark "gamer" theme by default, with a light mode toggle that is remembered.
- Platinum filter.
- Platform and store logos (matched by name) in the catalog tables, game cards, table, detail panel and platform filter.
- Cover placeholder for games without a Steam cover, using the platform's brand colour and logo.
- Digital PC games show their store logo (for example Steam) instead of the Windows logo.
