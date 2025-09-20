---
node_id: AI-LOG-2025-09-20
tags:
  - AI-log
  - development-summary
  - picker
  - drag-and-drop
  - export
  - build-ci
  - i18n
  - licensing
closed_tickets:
  - AI-IMP-003-floating-color-picker-triage-and-fixes
created_date: 2025-09-20
related_files:
  - color-analyzer-electron/app/js/frequs_nt_2024.js
  - color-analyzer-electron/app/index.html
  - color-analyzer-electron/app/frequs_nt.css
  - color-analyzer-electron/preload.js
  - color-analyzer-electron/main.js
  - color-analyzer-electron/package.json
  - .github/workflows/build.yml
  - README.md
  - LICENSE
  - RAG/AI-IMP/AI-IMP-003-floating-color-picker-triage-and-fixes.md
confidence_score: 0.92
---

# 2025-09-20-LOG-AI-desktop-app-polish-and-release

## Work Completed
Delivered a shippable Electron build and UX polish pass for the color analysis app. Stabilized and compacted the floating color picker (AI-IMP-003), added Create PNG/Analysis exports with Electron Save dialogs and browser fallbacks, and implemented crisp 2D (SVG) and 3D (WebGL) rendering in exports with proportional, centered palette. Added a full‑window drag‑and‑drop workflow backed by a hidden native file input for near‑perfect reliability; overlay is localized (EN/FR). CI was hardened: Node pinned (18.20.8), artifact paths fixed, publish disabled in CI, and Release permissions granted. Added split licensing (MIT for new code, CC BY 3.0 for upstream), dynamic export filenames ({basename}-graph.svg|png, {basename}-analysis.png, {basename}-palette.csv), i18n fixes, and README updates. Windows artifacts now upload as clearly named Setup/Portable variants.

## Session Commits
- 03172f5 feat(export names): dynamic filenames using user source base; track name from sample select and local files
- 667a13f ux(drag-drop): enlarge overlay, EN/FR copy; robust dragenter/leave for rapid drops
- 5b3f10b feat(export analysis PNG): compose image + circle (SVG via canvg) + palette; scaling and Electron Save As
- 419bb1c feat(export PNG): Electron Save As + fallback; IPC to save data URL
- a09a7b6 ci(win): split artifacts (windows-installer, windows-portable) and artifact names
- 06f56d3 ci(release): grant contents: write for action‑gh‑release
- 55dd2d3 license: split model (MIT for new code, CC BY 3.0 upstream); add LICENSE; package.json SEE LICENSE
- 0034854/98e6623/5d556b9/ad6cdce: CI stability (Node pin, cache path, artifact paths, skip publish)
- e2f4c0e: image expand toggle on click (vs click‑hold)
- 91f65e4: AGENTS.md + AI‑IMP‑003 plan + picker fixes and security

## Issues Encountered
- Drag‑and‑drop intermittency on Linux/Wayland with large images (DataTransfer invalidation; empty MIME types). Resolved by prioritizing dt.files and finally by routing drops through a hidden full‑window file input shown only during drag. Throttled duplicate drop events and ensured overlay is non‑blocking.
- 2D export blur/clipping: initial upscaling introduced softness; solved by SVG rendering at target (and 2× supersampling) then 1:1 blit; added internal padding where needed; ensured palette and circle are proportionally sized and vertically centered.
- Electron‑builder publish errors in CI: removed invalid publish: "never", set ELECTRON_BUILDER_SKIP_PUBLISH and --publish=never, and added permissions: contents: write for Release job.
- Missing sample assets: kept menu intact and removed auto‑prune; relies on packaged images.

## Tests Added
- No automated test harness in repo. Per‑feature manual checks recorded: drag‑and‑drop stability (large/small images across platforms), PNG/SVG/Analysis export correctness, 2D/3D parity, palette centering/limits, dynamic filenames, FR/EN localization for overlay and labels, CI artifact naming on Windows.

## Next Steps
- Optional: add a small “Loading image…” indicator during large image decode to improve feedback.
- Optional: high‑res offscreen render for 3D export (supersampling) behind a toggle.
- Optional: bundle a curated offline sample set or add a “Samples folder” picker to auto‑populate the selector.
- Optional: add a minimal Playwright smoke to open the app and confirm export buttons exist.
- Release hygiene: tag v1.0.x as needed; keep package.json version aligned with tags.
