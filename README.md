# Proportions et relations colorées — Electron App

Cross‑platform desktop packaging of the scientific color analysis tool (Three.js visualization, image analysis, SVG/PNG export). The app is bundled under `color-analyzer-electron/` and runs fully offline.

## Quick Start
- Requirements: Node.js 18.20.8
- Dev run:
  - `cd color-analyzer-electron`
  - `npm ci`
  - `npm start`

## Build Binaries
- Linux: `npm run build:linux`
- Windows: `npm run build:win`
- macOS: `npm run build:mac`
- Output: `color-analyzer-electron/dist/`

CI builds are configured in `.github/workflows/build.yml` and run per‑OS with Node 18.20.8. Artifacts are uploaded on each job.

## Using the App
- Language toggle: click “Version française” (or `?l=fr`) to switch FR/EN in place.
- Eyedropper: use the floating dropper button. Click on the image, 2D circle, or 3D view to sample, then adjust in the panel. Copy values via the Copy buttons.
- Image zoom: click the image to toggle full/thumbnail.
- Export: PNG/SVG under section 5.

## Release
- Tag to trigger the Release workflow (it expects `v*`):
  - `git tag -a v1.0.0 -m "Color Analyzer v1.0.0"`
  - `git push origin v1.0.0`
Artifacts from `dist/` are attached to the GitHub Release.
