# Color Analyzer Preservation Implementation Plan

# AI-IMP-001-color-analyzer-preservation

## Summary of Issue #1

**Current Issue:** The scientific color analysis webpage at
https://www.geotests.net/couleurs/v2/frequs_nt_2024.html needs long-term
preservation in a cross-platform, offline-capable format. The user has a
Windows-ripped version that fails on Linux due to path and dependency issues.

**Scope:** Create a fully functional Electron application that preserves the
complete interactive color analysis tool with all its features: Three.js 3D
visualization, color space analysis (YUV, HSL, CIE L*a*b\*, Linear RGB), image
processing, and export capabilities.

**Intended Remediation:** Deliver a packaged Electron app that works identically
across Windows, macOS, and Linux without internet connectivity.

**Measurable Outcome:** Successfully run the color analyzer on all three
platforms with full functionality including image loading, 3D color space
visualization, analysis tools, and PNG/SVG export capabilities.

### Out of Scope

-   Modification or enhancement of the original color analysis algorithms
-   Adding new features beyond the original webpage functionality
-   Creating mobile or web-based versions
-   Integration with external color management systems
-   Automated testing of color analysis accuracy
-   Performance optimization beyond basic Electron standards
-   Multi-language support beyond existing French/English toggle

### Design/Approach

**High-Level Approach:** Wrap the completely downloaded static webpage in an
Electron application using a three-phase approach:

1.  **Static Archive Phase:** Complete wget mirror with dependency bundling and
    path normalization
2.  **Electron Wrapper Phase:** Minimal Electron app serving the archived
    content via file:// protocol
3.  **Distribution Phase:** Cross-platform packaging with proper app icons and
    metadata

**Alternatives Considered:** - Docker container: Too technical for end users,
requires Docker knowledge - PWA conversion: Requires ongoing web server, defeats
offline purpose\
- Native rewrite: Unnecessary complexity, high risk of introducing bugs -
Browser bookmark: Doesn't solve offline/preservation requirements

**Rationale:** Electron provides the best balance of preservation fidelity,
cross-platform compatibility, and user accessibility while maintaining the exact
original functionality.

### Files to Touch

**New Structure:**

    color-analyzer-electron/
    ├── package.json: Electron app configuration and dependencies
    ├── main.js: Electron main process and window management  
    ├── preload.js: Security bridge for renderer process
    ├── app/: Complete archived website
    │   ├── index.html: Main color analyzer interface
    │   ├── js/: All JavaScript libraries (Three.js, DAT-GUI, etc.)
    │   ├── images/: Sample images and assets
    │   └── frequs_nt.css: Styling
    ├── assets/: App icons and metadata
    ├── build/: Electron-builder configuration  
    └── dist/: Generated installers

**Specific Files:** - `package.json`: Define Electron app, scripts, and build
configuration - `main.js`: Window creation, menu setup, and file protocol
handling - `preload.js`: Secure communication between main and renderer -
`app/index.html`: Remove Google Fonts dependency (already done) -
`build/icon.*`: App icons for all platforms - `electron-builder.yml`:
Cross-platform build configuration

### Implementation Checklist

`<CRITICAL_RULE>`{=html} Before marking an item complete on the checklist MUST
**stop** and **think**. Have you validated all aspects are **implemented** and
**tested**? `</CRITICAL_RULE>`{=html}

**Phase 1: Archive Preparation** - \[x\] Download complete website using wget
with all dependencies - \[x\] Verify all JavaScript libraries are present
(Three.js, DAT-GUI, JSColor, Canvg, RGBColor) - \[x\] Remove external Google
Fonts dependency from HTML - \[x\] Test local functionality with Python HTTP
server - \[ \] Rename main file to index.html for consistency - \[ \] Verify all
image assets are properly downloaded - \[ \] Test all interactive features work
offline

**Phase 2: Electron App Setup** - \[ \] Initialize npm package in electron app
directory - \[ \] Install Electron and electron-builder as dependencies - \[ \]
Create main.js with basic window configuration - \[ \] Create preload.js for
security isolation - \[ \] Copy archived website to app/ subdirectory - \[ \]
Configure file:// protocol loading in main.js - \[ \] Test basic Electron app
launches and loads website

**Phase 3: App Configuration** - \[ \] Create app icons for Windows (.ico),
macOS (.icns), and Linux (.png) - \[ \] Configure package.json with proper app
metadata - \[ \] Set up application menu with File, Edit, View, Window, Help -
\[ \] Add keyboard shortcuts for zoom, refresh, and developer tools - \[ \]
Configure window size, minimum dimensions, and resizing behavior - \[ \] Test
all UI controls and 3D interactions work in Electron

**Phase 4: Cross-Platform Building** - \[ \] Install electron-builder and
configure build scripts - \[ \] Create build configuration for Windows (NSIS
installer) - \[ \] Create build configuration for macOS (DMG and App Bundle) -
\[ \] Create build configuration for Linux (AppImage and DEB) - \[ \] Test build
process generates installers for all platforms - \[ \] Verify installer size is
reasonable (\<100MB per platform)

**Phase 5: Testing and Documentation** - \[ \] Test complete color analysis
workflow in Electron app - \[ \] Verify image loading from local files works
correctly - \[ \] Test Three.js 3D visualization performance in Electron - \[ \]
Verify PNG and SVG export functionality works - \[ \] Test color space
conversions (YUV, HSL, CIE L*a*b\*, Linear RGB) - \[ \] Create README with
installation and usage instructions - \[ \] Document known limitations and
troubleshooting steps

**Phase 6: Final Distribution** - \[ \] Test installers on clean Windows 10/11
system - \[ \] Test app bundle on macOS (latest 2 versions) - \[ \] Test
AppImage on Ubuntu/Fedora Linux distributions - \[ \] Create release package
with all platform installers - \[ \] Verify file sizes and installation
requirements - \[ \] Document system requirements for each platform

### Acceptance Criteria

**Scenario 1:** User installs and launches the color analyzer application

**GIVEN** a user has downloaded the appropriate installer for their platform
**WHEN** they install and launch the Color Analyzer Electron app **THEN** the
application opens with the same interface as the original website **AND** all UI
elements render correctly without internet connection **AND** the default sample
image (dual gradient) loads and displays properly

**Scenario 2:** User performs complete color analysis workflow

**GIVEN** the Color Analyzer app is running **WHEN** a user loads a local image
file using the file picker **THEN** the image displays in the left panel
correctly **AND** the 3D color space visualization generates in the right panel
**WHEN** the user changes color space to CIE L*a*b\* and adjusts sampling
parameters **THEN** the 3D visualization updates in real-time without errors
**AND** color analysis calculations complete within 5 seconds for typical images

**Scenario 3:** User exports analysis results

**GIVEN** a color analysis is displayed in the application **WHEN** the user
clicks "Create PNG" export button **THEN** a PNG file downloads to the user's
default download directory **AND** the PNG contains the exact visualization
shown in the app **WHEN** the user clicks "Create SVG" export button\
**THEN** an SVG file downloads with vector-based visualization **AND** the SVG
opens correctly in standard image viewers

**Scenario 4:** Cross-platform functionality verification

**GIVEN** the same Color Analyzer installers are tested on Windows, macOS, and
Linux **WHEN** identical analysis operations are performed on each platform
**THEN** results are pixel-perfect identical across all platforms **AND**
performance is comparable (within 20%) across platforms **AND** all file
operations work with platform-appropriate file dialogs

### Issues Encountered

*This section will be populated during implementation as issues arise and are
resolved.*
