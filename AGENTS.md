# Repository Guidelines

## Project Structure & Module Organization
- `color-analyzer-electron/` — Electron app (primary workspace)
  - `app/` archived web app served offline (`index.html`, `js/`, `images/`, `boutons/`)
  - `assets/` icons used for packaging
  - `main.js`, `preload.js` Electron entry points
  - `dist/` build output from `electron-builder`
- `www.geotests.net/` — reference snapshot of the original site (not used at runtime)
- `RAG/AI-IMP/` — implementation plans and design notes
- `.github/` — CI/config if present; `README.md` at root

## Build, Test, and Development Commands
Run everything from `color-analyzer-electron/`:
- `npm ci` — install dependencies from lockfile
- `npm start` — launch the Electron app locally
- `npm run build` — cross‑platform build via electron‑builder
- `npm run build:win|build:mac|build:linux` — platform‑specific artifacts into `dist/`

## Coding Style & Naming Conventions
- JavaScript: 2‑space indentation; use semicolons and single quotes
- Names: functions `camelCase`, classes `PascalCase`, constants `UPPER_SNAKE`
- Files: browser modules in `app/js/` use kebab‑case (e.g., `floating-color-picker.js`); Electron entry points are `main.js` and `preload.js`
- Keep the app fully offline: do not add remote URLs/CDNs; vendor libraries under `app/js/`
- Follow existing patterns in `app/index.html` and Three.js integration; prefer unobtrusive JS for new UI

## Testing Guidelines
- No automated tests configured; perform manual smoke tests per PR:
  - Launch app, load a local image (File → Open)
  - Verify 3D view renders and controls respond
  - Run typical analysis (change color space, sampling) without errors
  - Export PNG/SVG and open outputs
- If adding tests, co‑locate as `*.spec.js` and document how to run them in the PR

## Commit & Pull Request Guidelines
- Use Conventional Commits (e.g., `feat: add floating color picker`, `fix: correct canvas sampling scale`)
- PRs should include:
  - Clear description and rationale; link issues/RAG IDs (e.g., `AI-IMP-002`)
  - Screenshots/GIFs for UI changes and a brief manual test log (OS, steps, result)
  - Notes on offline compatibility and Electron security implications

## Security & Configuration Tips
- Keep `nodeIntegration: false` and `contextIsolation: true` (see `main.js`, `preload.js`)
- Use IPC for privileged actions; never access Node APIs from the renderer directly
- Load only local files via `file://`; package any new assets into `app/`
