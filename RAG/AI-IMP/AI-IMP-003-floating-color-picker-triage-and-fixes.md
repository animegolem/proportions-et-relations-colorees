---
node_id: AI-IMP-003
tags:
  - IMP-LIST
  - Implementation
  - floating-color-picker
  - electron-app
  - bugfix
kanban_status: planned
depends_on:
  - AI-IMP-002-floating-color-picker
  - AI-IMP-001-color-analyzer-preservation
confidence_score: 0.8
created_date: 2025-09-19
close_date:
---

# AI-IMP-003-floating-color-picker-triage-and-fixes

## Summary of Issue #1
Current issue: the floating color picker UI doesn’t show its gradient widget, the eyedropper returns white for most clicks (image and 3D view), and the overall style feels non-native to the existing page. Scope: fix sampling on both the 2D image and Three.js WebGL canvas, restore the JSColor gradient UI, and lightly restyle for compactness. Intended remediation: adjust sampling to use the correct canvas sources (offscreen `imgCanvas` and WebGL `readPixels`), add missing JSColor assets and initialization, and refine CSS. Measurable outcome: clicking anywhere on the image or 3D canvas returns correct pixel colors; the JSColor gradient is visible and interactive; UI appears compact and consistent with panels; manual tests pass; app builds successfully.

### Out of Scope 
- Rewriting the color analyzer algorithms or Three.js scenes
- Replacing JSColor with a new library
- System-wide screen sampling outside the app window
- Large visual redesign of legacy UI

### Design/Approach  
- Sampling fixes:
  - Image area: sample from global offscreen `window.imgCanvas` using `#myImg`/`#myImgCanvas` bounding rect scaling; ignore transparent overlay buffer.
  - Three.js area: detect WebGL canvas (`renderer.domElement`) and read pixels via `gl.readPixels` with proper Y inversion; `preserveDrawingBuffer: true` is already enabled.
  - Fallback: computed background color for non-canvas elements. Add DPR-aware coordinate math.
- JSColor gradient:
  - Add required assets (`hs.png`, `hv.png`, `cross.gif`, `arrow.gif`) to `app/js/jscolor/` and ensure `jscolor.dir = 'js/jscolor/'` before binding; bind after panel is visible.
- Styling: reduce panel width, tighten paddings, reuse existing fonts/colors from `frequs_nt.css`, and provide a “compact” variant.

### Files to Touch
`color-analyzer-electron/app/js/floating-color-picker.js`: add WebGL sampling; map clicks to `window.imgCanvas`; improve coordinate scaling and fallbacks.
`color-analyzer-electron/app/index.html`: set `jscolor.dir` early; optional compact toggle class on the panel.
`color-analyzer-electron/app/frequs_nt.css`: compact styles for panel/FAB to better match existing panels; minor spacing/size tweaks.
`color-analyzer-electron/app/js/jscolor/hs.png` `hv.png` `cross.gif` `arrow.gif`: add missing assets required by JSColor 1.4.2.

### Implementation Checklist

<CRITICAL_RULE>
Before marking an item complete on the checklist MUST **stop** and **think**. Have you validated all aspects are **implemented** and **tested**? 
</CRITICAL_RULE> 

- [ ] Add `sampleWebGLCanvasColor(canvas, clientX, clientY)` using `gl.readPixels` (RGBA, UNSIGNED_BYTE) with Y inversion.
- [ ] Update `getColorAtPosition()` to:
  - [ ] If target is `canvas#myImgCanvas`, sample from `window.imgCanvas` using the overlay’s bounding rect.
  - [ ] If target is a WebGL canvas, call `sampleWebGLCanvasColor`.
  - [ ] If target is `img#myImg`, sample from `window.imgCanvas` using the image’s bounding rect.
  - [ ] Else, fall back to computed background color parsing.
- [ ] Make coordinate scaling robust: use rect-to-internal scaling with `devicePixelRatio` considered; clamp to bounds.
- [ ] Ensure eyedropper click handler ignores picker UI and FAB; verify ESC cancels eyedropper cleanly.
- [ ] Add JSColor assets (`hs.png`, `hv.png`, `cross.gif`, `arrow.gif`) under `app/js/jscolor/`.
- [ ] In `index.html` (before binding), set `window.jscolor && (jscolor.dir = 'js/jscolor/');`.
- [ ] Delay `jscolor.bind()` until panel is visible; rebind if `colorInput.color` is undefined.
- [ ] Verify the gradient and slider images load (no 404s) and widget is visible.
- [ ] Style: reduce picker width to ~320px; trim paddings/margins; align font with `frequs_nt.css`; slightly shrink FAB.
- [ ] Manual tests: image sampling on multiple images at different zoom/thumb states; verify hex/rgb/hsl/cmyk outputs update.
- [ ] Manual tests: 3D canvas sampling on colored spheres and background; verify non-white values when expected.
- [ ] Manual tests: clipboard copy feedback; history adds entries; persistence via localStorage.
- [ ] Electron smoke: `npm start` launches; `npm run build` produces artifacts without asset path errors.

### Acceptance Criteria
**Scenario 1: Image sampling correctness**
GIVEN the app shows the dual gradient image AND eyedropper is active WHEN the user clicks various pixels across the image THEN the preview updates to the clicked pixel color AND hex/rgb/hsl/cmyk values reflect that color within ±1 channel.

**Scenario 2: Three.js sampling correctness**
GIVEN the 3D view is rendered WHEN the user clicks a visible colored sphere THEN the sampled color is non-white and approximates the rendered color AND clicking the white background yields near-white.

**Scenario 3: JSColor gradient visibility**
GIVEN the picker panel is opened WHEN the user focuses the color input THEN the JSColor gradient pad and slider are visible and interactive AND dragging updates preview and formats in real time.

**Scenario 4: UI compactness and behavior**
GIVEN the updated styles WHEN opening and closing the picker THEN the panel presents at ~320px width with reduced spacing matching page aesthetics AND ESC cancels eyedropper and closes panel as documented.

### Issues Encountered 
To be filled during implementation and testing. Document any sampling edge cases (e.g., HiDPI scaling), asset path issues, or WebGL context read limitations encountered and their resolutions.

