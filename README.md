# Proportions et relations colorées — Electron App

Cross‑platform desktop packaging of the scientific color analysis tool (Three.js visualization, image analysis, SVG/PNG export). The app is bundled under `color-analyzer-electron/` and runs fully offline.

Personal fork of a beloved tool to ensure I never lose access to it. Also added a quick inline color picker and an improved zoom function. 

https://github.com/user-attachments/assets/0af8d1e2-4356-40be-b362-73ab5ae319d3

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

Builds are also published via the release tag. 

## Using the App
- Language toggle: click “Version française” (or `?l=fr`) to switch FR/EN in place.
- Eyedropper: use the floating dropper button. Click on the image, 2D circle, or 3D view to sample, then adjust in the panel. Copy values via the Copy buttons.
- Image zoom: click the image to toggle full/thumbnail.
- Export: PNG/SVG under section 5.

## Licensing (Split)
- Upstream content (original page, algorithms, text): “Color relations and proportions of an image – linear RGB version” by L. Jégou, Université Toulouse‑2 Jean Jaurès (2024). License: Creative Commons Attribution 3.0 Unported (CC BY 3.0) — http://creativecommons.org/licenses/by/3.0/
- New code in this repo (Electron wrapper, preload bridge, UI glue, color‑picker integration, CI): MIT License.
- Third‑party libraries (Three.js, dat.gui, JSColor, Canvg, RGBColor) retain their own licenses.

Attribution to include (README/About/releases):
“Color Analyzer (original work): L. Jégou, Université Toulouse‑2 Jean Jaurès, 2024. Licensed CC BY 3.0. Modifications: Electron packaging and UI integration by golem.”

See LICENSE for the exact texts.
