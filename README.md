# Proportions et relations colorées — Electron App

A fork of an [online cole analysis tool.](https://www.geotests.net/couleurs/v2/) The primary goals were to ensure the site was usable offline and that I could never lose access to it. Additionally I've added a few quality of life features. 

**Notable Changes**

- Moved to a cross-platform/portable electron app
- New Tool: Inline Eye Dropper and Color Picker 
- Option to export a formated "analysis" png combining the color graph + original image.
- Electon Application supports dragging images anywhere in the window for quick analysis. 
- Exported filenames are no longer generic and are based on the user provided image. e.g. "mypics-analysis.png"

https://github.com/user-attachments/assets/0af8d1e2-4356-40be-b362-73ab5ae319d3

"Analysis" export
<img width="2388" height="768" alt="test-analysis-3D" src="https://github.com/user-attachments/assets/03a15f85-4242-45d4-9252-526383a9566a" />

All credit for the base tool goes to Laurent Jégou.

## Using the App
- Language toggle: click “Version française” (or `?l=fr`) to switch FR/EN in place.
- Eyedropper: use the floating dropper button. Click on the image, 2D circle, or 3D view to sample, then adjust in the panel. Copy values via the Copy buttons.
- Image zoom: click the image to toggle full/thumbnail.
- Drag and Drop: Drag images anywhere in the application to load. 
- Export: PNG/SVG/Analysis under section 5.

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

Cross-Plaform builds are also published via the release tag. 

## Licensing (Split)
- Upstream content (original page, algorithms, text): “Color relations and proportions of an image – linear RGB version” by L. Jégou, Université Toulouse‑2 Jean Jaurès (2024). License: Creative Commons Attribution 3.0 Unported (CC BY 3.0) — http://creativecommons.org/licenses/by/3.0/
- New code in this repo (Electron wrapper, preload bridge, UI glue, color‑picker integration, CI): MIT License.
- Third‑party libraries (Three.js, dat.gui, JSColor, Canvg, RGBColor) retain their own licenses.

Attribution to include (README/About/releases):
“Color Analyzer (original work): L. Jégou, Université Toulouse‑2 Jean Jaurès, 2024. Licensed CC BY 3.0. Modifications: Electron packaging and UI integration by golem.”

See LICENSE for the exact texts.
