---
node_id: AI-IMP-002
tags:
  - IMP-LIST
  - Implementation
  - color-picker
  - ui-enhancement
  - electron-app
kanban_status: backlog
depends_on:
  - AI-IMP-001-color-analyzer-preservation
confidence_score: 0.8
created_date: 2025-09-19
close_date:
---

# AI-IMP-002-floating-color-picker

## Summary of Issue #2

**Current Issue:** The Color Analyzer Electron app lacks an accessible, standalone eyedropper tool for users to quickly sample colors directly from the canvas, visualizations, or loaded images. Users currently can only pick colors through the limited "Color replacement" section which is tied to the analysis process and doesn't provide direct pixel sampling.

**Scope:** Add a floating eyedropper tool accessible via a floating action button (FAB) that provides direct pixel color sampling from any screen element, format conversion (Hex, RGB, HSL, CMYK), clipboard functionality, and color history storage.

**Intended Remediation:** Implement a non-disruptive eyedropper interface that samples colors directly from canvas elements, Three.js visualizations, and loaded images. The tool provides an intuitive click-to-sample workflow with a fine-tuning panel for color adjustment and format conversion.

**Measurable Outcome:** Successfully deployed eyedropper tool that allows users to sample any pixel color with a single click, view it in 4+ formats (Hex, RGB, HSL, CMYK), fine-tune the sampled color, copy values to clipboard, and maintain a history of the last 10 sampled colors, all without disrupting the existing color analysis workflow.

### Out of Scope

- System-wide screen capture outside the Electron application window
- Integration with system color picker APIs
- Color palette management or saving to external files
- Modification of existing color replacement workflow
- Mobile/touch optimizations beyond basic responsiveness
- Color blindness accessibility features
- Integration with external color management systems
- Real-time color preview while hovering (before clicking)

### Design/Approach

**High-Level Approach:** Implement a floating action button (FAB) with eyedropper icon that activates color sampling mode. When clicked, the cursor changes to an eyedropper and the user can click anywhere on canvas elements or loaded images to sample pixel colors. The sampled color opens a panel with format conversion, fine-tuning capabilities using JSColor, and clipboard functionality.

**Alternatives Considered:**
- Manual color picker only: Rejected as it doesn't provide direct pixel sampling capability
- System-wide screen sampling: Rejected due to security restrictions and complexity
- Hover-to-preview colors: Rejected to avoid performance overhead and UI clutter
- Modal-based interface: Rejected in favor of contextual panel positioning
- Integration into existing section 4: Rejected to avoid workflow interference

**Rationale:** Eyedropper workflow provides intuitive color sampling directly from scientific visualizations and loaded images. Click-to-sample approach minimizes UI complexity while maximizing functionality. JSColor integration allows fine-tuning of sampled colors. Non-modal panel design maintains workflow continuity.

### Files to Touch

`app/index.html`: Add FAB button with eyedropper icon and overlay panel DOM structure
`app/frequs_nt.css`: Add CSS for floating UI elements, eyedropper cursor states, animations, and responsive behavior
`app/js/floating-color-picker.js`: New module for eyedropper functionality, pixel sampling, format conversion, and clipboard functionality
`app/js/jscolor/`: Verify JSColor configuration and fix rendering issues
`main.js`: Potential clipboard API permissions if needed for Electron context

### Implementation Checklist

<CRITICAL_RULE>
Before marking an item complete on the checklist MUST **stop** and **think**. Have you validated all aspects are **implemented** and **tested**?
</CRITICAL_RULE>

**Phase 1: Eyedropper UI and States**
- [ ] Update FAB button with eyedropper SVG icon in index.html
- [ ] Create overlay panel container with color preview, format display, and history sections
- [ ] Add CSS for FAB positioning, eyedropper cursor states, and hover effects
- [ ] Implement CSS animations for smooth panel slide-in/slide-out transitions
- [ ] Add eyedropper cursor styling and visual feedback states
- [ ] Test FAB icon display and cursor state changes across different browser window sizes

**Phase 2: Pixel Sampling and Canvas Integration**
- [ ] Implement canvas pixel sampling using getImageData() for color detection
- [ ] Add event handlers for FAB click to activate eyedropper mode
- [ ] Implement click-anywhere-to-sample functionality on canvas elements
- [ ] Integrate with existing Three.js visualization canvas for color sampling
- [ ] Add support for sampling from loaded image canvas elements
- [ ] Test pixel sampling accuracy across different canvas types and zoom levels

**Phase 3: JSColor Integration and Fine-tuning**
- [ ] Fix JSColor rendering issues (empty cell problem in current implementation)
- [ ] Initialize JSColor picker within panel for fine-tuning sampled colors
- [ ] Connect sampled color data to JSColor picker for adjustment
- [ ] Implement real-time format updates when JSColor picker value changes
- [ ] Add color swatch preview showing currently sampled/selected color
- [ ] Test JSColor integration with sampled color data accuracy

**Phase 4: Format Conversion and Display**
- [ ] Create format conversion functions for Hex, RGB, HSL, and CMYK color spaces
- [ ] Implement real-time format updates when sampled or adjusted colors change
- [ ] Add copy-to-clipboard functionality for each color format with visual feedback
- [ ] Create color history storage using localStorage for sampled colors
- [ ] Implement history display showing last 10 sampled colors as clickable swatches
- [ ] Test format conversion accuracy and clipboard functionality across operating systems

**Phase 5: Integration and Polish**
- [ ] Ensure eyedropper doesn't interfere with existing Three.js 3D visualization interactions
- [ ] Add keyboard shortcuts (Esc to close panel, Esc to cancel eyedropper mode)
- [ ] Implement proper event handling to prevent conflicts with existing canvas interactions
- [ ] Add loading states and error handling for pixel sampling operations
- [ ] Perform cross-platform testing (Windows, macOS, Linux builds)
- [ ] Test performance impact on main color analysis functionality
- [ ] Validate eyedropper accessibility and provide alternative keyboard-based sampling

### Acceptance Criteria

**Scenario 1:** User wants to sample and copy a color from the canvas

**GIVEN** the Color Analyzer application is running with an image loaded and Three.js visualization displayed
**WHEN** the user clicks the floating eyedropper button in the bottom-right corner
**THEN** the cursor changes to an eyedropper icon and the FAB button appears grayed out
**WHEN** the user clicks on any pixel within the canvas area or loaded image
**THEN** the color picker panel opens displaying the sampled color in Hex, RGB, HSL, and CMYK formats
**AND** the panel includes a JSColor picker pre-filled with the sampled color for fine-tuning
**WHEN** the user clicks the "Copy" button next to the Hex value
**THEN** the hex value is copied to the system clipboard
**AND** a visual confirmation notification appears indicating successful copy

**Scenario 2:** User accesses color history and fine-tuning

**GIVEN** the color picker panel is open and the user has previously sampled 5 different colors
**WHEN** the user views the history section of the panel
**THEN** the last 5 sampled colors appear as clickable color swatches
**WHEN** the user clicks on a historical color swatch
**THEN** the JSColor picker updates to that color and all format displays refresh
**WHEN** the user adjusts the color using the JSColor picker
**THEN** all format displays update in real-time to reflect the adjustments
**WHEN** the user clicks outside the panel or presses Esc key
**THEN** the panel smoothly slides closed and the FAB returns to normal state
**AND** the sampled color history is preserved for the next session

**Scenario 3:** Cross-platform eyedropper functionality and integration

**GIVEN** the application is running on Windows, macOS, or Linux
**WHEN** the user activates the eyedropper and samples colors while performing color analysis
**THEN** the eyedropper operates without interfering with 3D visualization rotation or image analysis
**AND** pixel sampling accuracy is consistent across different operating systems
**AND** clipboard functionality works correctly on the respective operating system
**WHEN** the user closes and reopens the application
**THEN** the color history persists and displays the previously sampled colors
**AND** all eyedropper and fine-tuning functionality remains fully operational

### Issues Encountered

*This section will be populated during implementation as issues arise and are resolved.*