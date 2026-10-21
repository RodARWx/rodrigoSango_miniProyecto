/**
 * ==============================================================================
 * TOAST NOTIFICATION SYSTEM (ES6 MODULE)
 * ==============================================================================
 * Standalone, decoupled alert and feedback dispatcher supporting multiple
 * notification levels ('success', 'warning', 'eliminar', 'error', 'info').
 *
 * Responsibilities:
 * - Decouples user feedback dispatching from DOM views and business controllers.
 * - Dynamically mounts to an existing `#toast-contenedor` or creates one automatically.
 * - Manages entry and exit animations (auto-dismiss after configurable duration).
 * - Safe for cross-page reuse (Catalog and Detail views).
 * ==============================================================================
 */

/**
 * Visual badge/icon mappings for supported notification levels.
 */
const ICON_MAP = {
    exito: '✅',
    success: '✅',
    eliminar: '🗑️',
    advertencia: '⚠️',
    warning: '⚠️',
    error: '❌',
    info: 'ℹ️'
};

/**
 * Standard CSS class mappings for notification levels.
 */
const CLASS_MAP = {
    exito: 'exito',
    success: 'exito',
    eliminar: 'eliminar',
    advertencia: 'advertencia',
    warning: 'warning',
    error: 'error',
    info: 'info'
};

/**
 * Retrieves the global toast container element or creates one if absent.
 *
 * @returns {HTMLElement} The active toast container.
 */
export function getOrCreateToastContainer() {
    let container = document.getElementById('toast-contenedor');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-contenedor';
        container.className = 'toast-contenedor';
        container.setAttribute('aria-live', 'polite');
        document.body.appendChild(container);
    }
    return container;
}

/**
 * Dispatches a non-blocking floating toast notification.
 *
 * @param {string} message - Notification text to display.
 * @param {'success'|'exito'|'eliminar'|'warning'|'advertencia'|'error'|'info'} [type='exito'] - Notification type.
 * @param {number} [durationMs=2800] - Duration in milliseconds before fading out.
 * @returns {HTMLElement|null} The created toast element.
 */
export function showToast(message, type = 'exito', durationMs = 2800) {
    if (typeof document === 'undefined') return null;

    const container = getOrCreateToastContainer();
    const normalizedType = String(type).toLowerCase();
    const cssClass = CLASS_MAP[normalizedType] || 'exito';
    const icon = ICON_MAP[normalizedType] || 'ℹ️';

    const toast = document.createElement('div');
    toast.className = `toast ${cssClass}`;
    toast.setAttribute('role', 'status');

    // Build toast internal markup safely
    const iconSpan = document.createElement('span');
    iconSpan.textContent = icon;

    const textSpan = document.createElement('span');
    textSpan.textContent = message;

    toast.appendChild(iconSpan);
    toast.appendChild(textSpan);
    container.appendChild(toast);

    // Schedule fade-out and removal animation
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(10px)';
        toast.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        setTimeout(() => {
            if (toast.parentNode) {
                toast.remove();
            }
        }, 300);
    }, durationMs);

    return toast;
}

/**
 * Backward-compatible alias for existing controllers.
 */
export const mostrarToast = showToast;

/**
 * Convenience dispatchers for common notification levels.
 */
export const showSuccess = (msg, duration) => showToast(msg, 'success', duration);
export const showError = (msg, duration) => showToast(msg, 'error', duration);
export const showWarning = (msg, duration) => showToast(msg, 'warning', duration);
export const showInfo = (msg, duration) => showToast(msg, 'info', duration);
