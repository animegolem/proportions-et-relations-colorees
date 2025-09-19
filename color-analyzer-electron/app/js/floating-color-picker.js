/**
 * Floating Color Picker Module
 * Provides a floating overlay color picker with format conversion and history
 */

class FloatingColorPicker {
    constructor() {
        this.picker = null;
        this.isOpen = false;
        this.eyedropperMode = false;
        this.colorHistory = this.loadColorHistory();
        this.currentColor = '#ff6600';

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initializeJSColor();
        this.updateFormatDisplays(this.currentColor);
        this.renderColorHistory();
    }

    setupEventListeners() {
        const fab = document.getElementById('colorPickerFAB');
        const closeBtn = document.getElementById('closeColorPicker');
        const container = document.getElementById('floatingColorPicker');
        const copyButtons = document.querySelectorAll('.copy-btn');

        fab.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.toggleEyedropper();
        });
        closeBtn.addEventListener('click', () => this.closePicker());

        // Close on backdrop click
        container.addEventListener('click', (e) => {
            if (e.target === container) {
                this.closePicker();
            }
        });

        // ESC key to close or cancel eyedropper
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                if (this.eyedropperMode) {
                    this.deactivateEyedropper();
                } else if (this.isOpen) {
                    this.closePicker();
                }
            }
        });

        // Global click handler for color sampling (capture to pre-empt form behaviors)
        const clickHandler = (e) => {
            if (this.eyedropperMode) {
                // Don't sample if clicking on the FAB button or color picker panel
                if (e.target.closest('#colorPickerFAB') || e.target.closest('#floatingColorPicker')) {
                    return;
                }

                e.preventDefault();
                e.stopPropagation();
                this.sampleColorAtEvent(e);
            }
        };
        document.addEventListener('click', clickHandler, true);
        document.addEventListener('pointerdown', clickHandler, true);

        // Copy button handlers
        copyButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const format = e.target.getAttribute('data-format');
                this.copyToClipboard(format);
            });
            btn.addEventListener('pointerdown', (e) => {
                e.preventDefault();
                e.stopPropagation();
            }, true);
        });
    }

    initializeJSColor() {
        const colorInput = document.getElementById('floatingColorInput');

        // For JSColor 1.4.2, we need to add the class and let it auto-bind when visible
        colorInput.className = 'color-input color';

        // Set up color change handler
        colorInput.addEventListener('change', () => {
            const color = '#' + colorInput.value;
            this.currentColor = color;
            this.updateFormatDisplays(color);
            this.updateColorPreview(color);
        });

        // Add input event as well for real-time updates
        colorInput.addEventListener('input', () => {
            const color = '#' + colorInput.value;
            this.currentColor = color;
            this.updateFormatDisplays(color);
            this.updateColorPreview(color);
        });
    }

    initializeColorPicker() {
        // Called when the panel opens to ensure JSColor is bound and live-updating
        const colorInput = document.getElementById('floatingColorInput');

        // Trigger JSColor to bind to our element if it hasn't already
        if (!colorInput.color && typeof jscolor !== 'undefined' && jscolor.bind) {
            jscolor.bind();
        }

        // Wait a moment for binding to complete, then set initial color and hooks
        setTimeout(() => {
            if (colorInput.color) {
                this.picker = colorInput.color;
                this.picker.fromString(this.currentColor.substring(1));
                // Live updates while dragging (fix swatch lag)
                this.picker.onImmediateChange = () => {
                    const hex = '#' + (this.picker ? this.picker.toString() : (colorInput.value || '')).replace(/^#/, '');
                    if (hex.length >= 4) {
                        this.currentColor = hex;
                        this.updateFormatDisplays(hex);
                        this.updateColorPreview(hex);
                    }
                };
            }
        }, 50);

        // Ensure gradient visuals each time the input opens the picker
        const ensure = () => setTimeout(() => this.ensureJscolorVisuals(), 50);
        colorInput.addEventListener('focus', ensure, { once: false });
        colorInput.addEventListener('click', ensure, { once: false });
    }

    ensureJscolorVisuals() {
        try {
            if (window.jscolor && jscolor.picker) {
                const pad = jscolor.picker.pad;     // gradient area
                const sld = jscolor.picker.sld;     // slider area
                if (pad && !pad.style.backgroundImage.includes('linear-gradient')) {
                    // Fallback background composed of hue stripes + vertical fade
                    // Approximates hs/hv pads without external images
                    const hue = 'linear-gradient(90deg, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%)';
                    const fade = 'linear-gradient(0deg, rgba(0,0,0,0.0) 0%, rgba(0,0,0,1) 100%)';
                    pad.style.backgroundImage = fade + ', ' + hue;
                    pad.style.backgroundRepeat = 'no-repeat';
                    pad.style.backgroundSize = '100% 100%';
                }
                if (sld && sld.childNodes && sld.childNodes.length === 0) {
                    // Create simple slider segments if not present
                    const segCount = 20;
                    for (let i = 0; i < segCount; i++) {
                        const seg = document.createElement('div');
                        seg.style.height = Math.round(jscolor.images.sld[1] / segCount) + 'px';
                        seg.style.fontSize = '1px';
                        seg.style.lineHeight = '0';
                        sld.appendChild(seg);
                    }
                }
            }
        } catch (_) {
            // Non-fatal visual fallback
        }
    }

    toggleEyedropper() {
        console.log('toggleEyedropper called, current mode:', this.eyedropperMode);
        if (this.eyedropperMode) {
            this.deactivateEyedropper();
        } else {
            this.activateEyedropper();
        }
    }

    activateEyedropper() {
        this.eyedropperMode = true;
        const fab = document.getElementById('colorPickerFAB');

        // Update visual state
        fab.classList.add('active');
        fab.title = 'Click anywhere to sample color (ESC to cancel)';
        document.body.classList.add('eyedropper-active');
    }

    deactivateEyedropper() {
        this.eyedropperMode = false;
        const fab = document.getElementById('colorPickerFAB');

        // Reset visual state
        fab.classList.remove('active');
        fab.title = 'Click to activate eyedropper';
        document.body.classList.remove('eyedropper-active');
    }

    sampleColorAtEvent(event) {
        // Deactivate eyedropper mode first
        this.deactivateEyedropper();

        // Get the color from the clicked position
        const color = this.getColorAtPosition(event.clientX, event.clientY);

        if (color) {
            this.currentColor = color;
            this.openPickerWithSampledColor(color);
        }
    }

    getColorAtPosition(x, y) {
        console.log('Sampling color at position:', x, y);

        // Get the element at the position
        const element = document.elementFromPoint(x, y);
        console.log('Element at position:', element);

        if (!element) {
            console.log('No element found at position');
            return '#ffffff';
        }

        // If clicking over our own UI, ignore sampling
        if (element.closest('#colorPickerFAB') || element.closest('#floatingColorPicker')) {
            return this.currentColor;
        }

        // Image sampling: map clicks from visible IMG or overlay canvas to offscreen image canvas
        if ((element.tagName.toLowerCase() === 'img' && element.id === 'myImg') ||
            (element.tagName.toLowerCase() === 'canvas' && element.id === 'myImgCanvas')) {
            const color = this.sampleOffscreenImageCanvas(element, x, y);
            if (color) return color;
        }

        // Three.js WebGL canvas sampling
        if (element.tagName.toLowerCase() === 'canvas' && element.closest('#ThreeJS')) {
            const color = this.sampleWebGLCanvasColor(element, x, y);
            if (color) return color;
        }

        // Generic canvas (2D) sampling fallback
        if (element.tagName.toLowerCase() === 'canvas') {
            const color = this.sampleCanvasColor(element, x, y);
            if (color) return color;
        }

        // SVG sampling (Chromatic Circle 2D)
        if (element.closest && element.closest('#svg')) {
            const color = this.sampleSvgColor(element, x, y);
            if (color) return color;
        }

        // For non-canvas elements, try to get computed background color
        const computedStyle = window.getComputedStyle(element);
        const bgColor = computedStyle.backgroundColor;
        console.log('Element background color:', bgColor);

        if (bgColor && bgColor !== 'rgba(0, 0, 0, 0)' && bgColor !== 'transparent') {
            const parsedColor = this.parseColorString(bgColor);
            console.log('Parsed background color:', parsedColor);
            return parsedColor;
        }

        // Try to get color from image elements by mapping to offscreen canvas
        if (element.tagName.toLowerCase() === 'img') {
            const color = this.sampleOffscreenImageCanvas(element, x, y);
            if (color) return color;
        }

        console.log('Using fallback color #ffffff');
        return '#ffffff'; // Default fallback
    }

    sampleSvgColor(element, clientX, clientY) {
        try {
            const svgEl = element.ownerSVGElement || (element.tagName.toLowerCase() === 'svg' ? element : null);
            const targetEl = svgEl || (element.closest ? element.closest('#svg') : null);
            if (!targetEl) return null;

            const rect = (svgEl || targetEl).getBoundingClientRect();
            const histCtx = window.histCtx || null;
            const width = (histCtx && histCtx.width) ? histCtx.width : Math.max(1, Math.round(rect.width));
            const height = (histCtx && histCtx.height) ? histCtx.height : Math.max(1, Math.round(rect.height));

            let canvas = document.getElementById('canvasImg');
            if (!canvas) {
                canvas = document.createElement('canvas');
                canvas.id = 'canvasImg';
                canvas.style.display = 'none';
                document.body.appendChild(canvas);
            }
            canvas.width = width;
            canvas.height = height;

            let svgHTML = null;
            if (histCtx && histCtx.__root && histCtx.__root.outerHTML) {
                svgHTML = histCtx.__root.outerHTML;
            } else if (svgEl) {
                svgHTML = svgEl.outerHTML;
            } else {
                const childSvg = targetEl.querySelector('svg');
                if (childSvg) svgHTML = childSvg.outerHTML;
            }
            if (!svgHTML) return '#ffffff';

            if (typeof canvg === 'function') {
                canvg(canvas, svgHTML);
            } else {
                return '#ffffff';
            }

            const scaleX = canvas.width / rect.width;
            const scaleY = canvas.height / rect.height;
            let x = Math.floor((clientX - rect.left) * scaleX);
            let y = Math.floor((clientY - rect.top) * scaleY);
            x = Math.max(0, Math.min(canvas.width - 1, x));
            y = Math.max(0, Math.min(canvas.height - 1, y));

            const ctx = canvas.getContext('2d');
            const { data } = ctx.getImageData(x, y, 1, 1);
            const [r, g, b, a] = data;
            if (a === 0) return '#ffffff';
            return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
        } catch (e) {
            console.warn('SVG sampling failed', e);
            return '#ffffff';
        }
    }

    sampleOffscreenImageCanvas(displayEl, clientX, clientY) {
        try {
            // Use global offscreen image canvas prepared by the app
            const imgCanvas = window.imgCanvas || null;
            if (!imgCanvas) return null;
            const rect = displayEl.getBoundingClientRect();
            const scaleX = imgCanvas.width / rect.width;
            const scaleY = imgCanvas.height / rect.height;
            let x = Math.floor((clientX - rect.left) * scaleX);
            let y = Math.floor((clientY - rect.top) * scaleY);
            x = Math.max(0, Math.min(imgCanvas.width - 1, x));
            y = Math.max(0, Math.min(imgCanvas.height - 1, y));
            const ctx = imgCanvas.getContext('2d');
            const { data } = ctx.getImageData(x, y, 1, 1);
            const [r, g, b, a] = data;
            if (a === 0) return '#ffffff';
            return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
        } catch (e) {
            console.warn('Offscreen image sampling failed', e);
            return null;
        }
    }

    sampleWebGLCanvasColor(canvas, clientX, clientY) {
        try {
            const rect = canvas.getBoundingClientRect();
            const scaleX = (canvas.width || 0) / rect.width;
            const scaleY = (canvas.height || 0) / rect.height;
            let x = Math.floor((clientX - rect.left) * scaleX);
            let y = Math.floor((clientY - rect.top) * scaleY);

            // Clamp
            x = Math.max(0, Math.min((canvas.width || 1) - 1, x));
            y = Math.max(0, Math.min((canvas.height || 1) - 1, y));

            const gl = canvas.getContext('webgl2') || canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
            if (!gl) return null;

            const dbw = gl.drawingBufferWidth || canvas.width;
            const dbh = gl.drawingBufferHeight || canvas.height;
            // Convert to bottom-left origin
            const yGL = (dbh - 1) - Math.floor(y);
            const pixels = new Uint8Array(4);
            gl.readPixels(Math.floor(x), yGL, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
            const [r, g, b, a] = pixels;
            if (a === 0) return '#ffffff';
            return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
        } catch (e) {
            console.warn('WebGL sampling failed', e);
            return null;
        }
    }

    sampleCanvasColor(canvas, clientX, clientY) {
        try {
            console.log('Sampling canvas:', canvas.id, 'dimensions:', canvas.width, 'x', canvas.height);

            // Get canvas position
            const rect = canvas.getBoundingClientRect();
            const scaleX = canvas.width / rect.width;
            const scaleY = canvas.height / rect.height;

            const x = Math.floor((clientX - rect.left) * scaleX);
            const y = Math.floor((clientY - rect.top) * scaleY);

            console.log('Canvas rect:', rect);
            console.log('Scale factors:', scaleX, scaleY);
            console.log('Converted coordinates:', x, y);

            // Check if coordinates are within canvas bounds
            if (x < 0 || y < 0 || x >= canvas.width || y >= canvas.height) {
                console.log('Coordinates outside canvas bounds');
                return '#ffffff';
            }

            // Get canvas context
            const ctx = canvas.getContext('2d');

            if (!ctx) {
                console.log('Could not get 2D context from canvas');
                return '#ffffff';
            }

            // Sample pixel data
            const imageData = ctx.getImageData(x, y, 1, 1);
            const [r, g, b, a] = imageData.data;

            console.log('Pixel data:', { r, g, b, a });

            // Check for transparency
            if (a === 0) {
                console.log('Transparent pixel detected');
                return '#ffffff';
            }

            // Convert to hex
            const hex = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
            console.log('Final hex color:', hex);
            return hex;

        } catch (error) {
            console.warn('Could not sample canvas color:', error);
            return '#ffffff';
        }
    }

    parseColorString(colorStr) {
        // Handle rgb() and rgba() strings
        const rgbMatch = colorStr.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
        if (rgbMatch) {
            const [, r, g, b] = rgbMatch;
            return `#${parseInt(r).toString(16).padStart(2, '0')}${parseInt(g).toString(16).padStart(2, '0')}${parseInt(b).toString(16).padStart(2, '0')}`;
        }

        // Handle hex colors
        if (colorStr.startsWith('#')) {
            return colorStr;
        }

        return '#ffffff'; // Fallback
    }

    openPickerWithSampledColor(color) {
        // Update current color and input immediately
        this.currentColor = color;
        const colorInput = document.getElementById('floatingColorInput');
        if (colorInput) {
            colorInput.value = color.substring(1);
        }
        this.updateFormatDisplays(color);
        this.updateColorPreview(color);

        // Open the panel
        this.openPicker();
    }

    openPicker() {
        const container = document.getElementById('floatingColorPicker');
        container.style.display = 'flex';
        this.isOpen = true;

        // Prevent background scroll to keep overlays aligned (compensate scrollbar width)
        const sbw = window.innerWidth - document.documentElement.clientWidth;
        document.body.dataset.prevOverflow = document.body.style.overflow || '';
        document.body.dataset.prevPaddingRight = document.body.style.paddingRight || '';
        document.body.style.overflow = 'hidden';
        if (sbw > 0) {
            const currentPR = parseInt(getComputedStyle(document.body).paddingRight || '0', 10) || 0;
            document.body.style.paddingRight = (currentPR + sbw) + 'px';
        }

        // Initialize JSColor picker now that the panel is visible
        this.initializeColorPicker();

        // Add current color to history when opened
        this.addToHistory(this.currentColor);
    }

    closePicker() {
        const container = document.getElementById('floatingColorPicker');
        const panel = container.querySelector('.color-picker-panel');

        // Add closing animation (sync to animationend for cross-platform consistency)
        try {
            if (this.picker && typeof this.picker.hidePicker === 'function') {
                this.picker.hidePicker();
            }
            if (window.jscolor && jscolor.picker && jscolor.picker.boxB) {
                jscolor.picker.boxB.style.display = 'none';
            }
        } catch (_) {}

        container.style.pointerEvents = 'none';
        container.classList.add('closing');
        panel.classList.add('closing');

        const cleanup = () => {
            container.style.display = 'none';
            container.classList.remove('closing');
            panel.classList.remove('closing');
            this.isOpen = false;
            // Restore background scroll on the next frame to avoid width jump
            requestAnimationFrame(() => {
                if (document.body.dataset.prevOverflow !== undefined) {
                    document.body.style.overflow = document.body.dataset.prevOverflow;
                    delete document.body.dataset.prevOverflow;
                }
                if (document.body.dataset.prevPaddingRight !== undefined) {
                    document.body.style.paddingRight = document.body.dataset.prevPaddingRight;
                    delete document.body.dataset.prevPaddingRight;
                }
                container.style.pointerEvents = '';
            });
        };

        let done = false;
        const onEnd = (ev) => {
            if (done) return;
            if (ev.target !== container) return; // wait for container fadeOut
            done = true;
            container.removeEventListener('animationend', onEnd, true);
            container.removeEventListener('webkitAnimationEnd', onEnd, true);
            cleanup();
        };
        container.addEventListener('animationend', onEnd, true);
        container.addEventListener('webkitAnimationEnd', onEnd, true);
        // Fallback in case animation events don’t fire
        setTimeout(() => { if (!done) { done = true; cleanup(); } }, 350);
    }

    updateFormatDisplays(hexColor) {
        const rgb = this.hexToRgb(hexColor);
        const hsl = this.rgbToHsl(rgb.r, rgb.g, rgb.b);
        const cmyk = this.rgbToCmyk(rgb.r, rgb.g, rgb.b);

        document.getElementById('hexValue').textContent = hexColor.toUpperCase();
        document.getElementById('rgbValue').textContent = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
        document.getElementById('hslValue').textContent = `hsl(${Math.round(hsl.h)}, ${Math.round(hsl.s)}%, ${Math.round(hsl.l)}%)`;
        document.getElementById('cmykValue').textContent = `cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)`;
    }

    updateColorPreview(color) {
        const preview = document.getElementById('colorPreview');
        preview.style.backgroundColor = color;
    }

    // Color conversion functions
    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }

    rgbToHsl(r, g, b) {
        r /= 255;
        g /= 255;
        b /= 255;

        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;

        if (max === min) {
            h = s = 0;
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }

        return {
            h: h * 360,
            s: s * 100,
            l: l * 100
        };
    }

    rgbToCmyk(r, g, b) {
        r /= 255;
        g /= 255;
        b /= 255;

        const k = 1 - Math.max(r, g, b);
        const c = (1 - r - k) / (1 - k) || 0;
        const m = (1 - g - k) / (1 - k) || 0;
        const y = (1 - b - k) / (1 - k) || 0;

        return {
            c: Math.round(c * 100),
            m: Math.round(m * 100),
            y: Math.round(y * 100),
            k: Math.round(k * 100)
        };
    }

    // Clipboard functionality
    async copyToClipboard(format) {
        let textToCopy = '';

        switch (format) {
            case 'hex':
                textToCopy = document.getElementById('hexValue').textContent;
                break;
            case 'rgb':
                textToCopy = document.getElementById('rgbValue').textContent;
                break;
            case 'hsl':
                textToCopy = document.getElementById('hslValue').textContent;
                break;
            case 'cmyk':
                textToCopy = document.getElementById('cmykValue').textContent;
                break;
        }

        const done = (ok) => {
            this.showCopyNotification(format.toUpperCase() + ' copied!');
            this.highlightCopyButton(format);
        };

        try {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(textToCopy);
                return done(true);
            }
        } catch (err) {
            // fall through to Electron clipboard
        }

        // Electron clipboard fallback (works across X11/Wayland)
        if (window.electronAPI && window.electronAPI.writeClipboardText) {
            try {
                await window.electronAPI.writeClipboardText(textToCopy);
                return done(true);
            } catch (e) {
                // ignore
            }
        }

        // Legacy DOM fallback
        this.fallbackCopyToClipboard(textToCopy);
        done(true);
    }

    fallbackCopyToClipboard(text) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
            document.execCommand('copy');
        } catch (err) {
            console.error('Fallback copy failed', err);
        }

        document.body.removeChild(textArea);
    }

    showCopyNotification(message) {
        // Remove existing notification
        const existing = document.querySelector('.copy-notification');
        if (existing) {
            existing.remove();
        }

        const notification = document.createElement('div');
        notification.className = 'copy-notification';
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('hiding');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 2000);
    }

    highlightCopyButton(format) {
        const button = document.querySelector(`[data-format="${format}"]`);
        button.classList.add('copied');

        setTimeout(() => {
            button.classList.remove('copied');
        }, 1000);
    }

    // Color history management
    addToHistory(color) {
        // Don't add if already the most recent
        if (this.colorHistory.length > 0 && this.colorHistory[0] === color) {
            return;
        }

        // Remove color if it exists elsewhere in history
        const existingIndex = this.colorHistory.indexOf(color);
        if (existingIndex > -1) {
            this.colorHistory.splice(existingIndex, 1);
        }

        // Add to beginning and limit to 10
        this.colorHistory.unshift(color);
        if (this.colorHistory.length > 10) {
            this.colorHistory = this.colorHistory.slice(0, 10);
        }

        this.saveColorHistory();
        this.renderColorHistory();
    }

    renderColorHistory() {
        const container = document.getElementById('colorHistory');
        container.innerHTML = '';

        this.colorHistory.forEach(color => {
            const swatch = document.createElement('div');
            swatch.className = 'history-swatch';
            swatch.style.backgroundColor = color;
            swatch.title = color;

            swatch.addEventListener('click', () => {
                this.selectColorFromHistory(color);
            });

            container.appendChild(swatch);
        });
    }

    selectColorFromHistory(color) {
        this.currentColor = color;
        const colorInput = document.getElementById('floatingColorInput');
        colorInput.value = color.substring(1); // Remove # for JSColor

        // Trigger JSColor update
        if (this.picker) {
            this.picker.fromString(color.substring(1));
        }

        this.updateFormatDisplays(color);
        this.updateColorPreview(color);
        this.addToHistory(color);
    }

    loadColorHistory() {
        try {
            const stored = localStorage.getItem('colorPickerHistory');
            return stored ? JSON.parse(stored) : [];
        } catch (e) {
            return [];
        }
    }

    saveColorHistory() {
        try {
            localStorage.setItem('colorPickerHistory', JSON.stringify(this.colorHistory));
        } catch (e) {
            console.warn('Could not save color history to localStorage');
        }
    }
}

// Initialize the floating color picker when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Wait for JSColor to load and initialize
    const initPicker = () => {
        if (typeof jscolor !== 'undefined') {
            new FloatingColorPicker();
            // Trigger JSColor binding manually to catch our new element
            if (jscolor.bind) {
                jscolor.bind();
            }
        } else {
            setTimeout(initPicker, 100);
        }
    };

    // Small delay to ensure all scripts are loaded
    setTimeout(initPicker, 200);
});
