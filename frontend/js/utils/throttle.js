/**
 * ==============================================================================
 * RATE LIMITING & EXECUTION UTILITIES (ES6 MODULE)
 * ==============================================================================
 * Provides pure, zero-dependency functional rate limiters for UI actions,
 * animations, and asynchronous requests:
 * 
 * 1. throttleLeading: Leading-edge throttle for interactive UI buttons and form
 *    submissions. Fires immediately on the initial trigger and enforces a cooldown
 *    window, preventing duplicate submissions and server overload.
 * 
 * 2. throttle: Standard interval throttle for high-frequency events (scroll, resize).
 *    Guarantees function execution at most once per defined time window.
 * 
 * 3. debounce: Postpones execution until a specified delay has elapsed since
 *    the last invocation. Essential for instant search input typing.
 * ==============================================================================
 */

/**
 * Leading-edge throttle utility.
 * Invokes the callback immediately on the first call, then ignores subsequent
 * calls until `cooldownMs` milliseconds have elapsed.
 *
 * @template T
 * @param {Function} func - The callback function to throttle.
 * @param {number} [cooldownMs=400] - Minimum elapsed milliseconds before allowing next execution.
 * @returns {Function} Throttled version of the input function.
 */
export function throttleLeading(func, cooldownMs = 400) {
    let lastExecuted = 0;

    return function (...args) {
        const now = Date.now();
        if (now - lastExecuted >= cooldownMs) {
            lastExecuted = now;
            return func.apply(this, args);
        }
    };
}

/**
 * Standard interval throttle utility.
 * Ensures the wrapped function is called at most once every `limitMs` milliseconds.
 *
 * @param {Function} func - Function to throttle.
 * @param {number} [limitMs=150] - Throttle interval in milliseconds.
 * @returns {Function} Throttled function.
 */
export function throttle(func, limitMs = 150) {
    let inThrottle = false;

    return function (...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => {
                inThrottle = false;
            }, limitMs);
        }
    };
}

/**
 * Debounce utility.
 * Delays the execution of `func` until `delayMs` milliseconds have elapsed
 * since the last time the debounced function was called.
 *
 * @param {Function} func - The callback to debounce.
 * @param {number} [delayMs=250] - Inactivity delay in milliseconds.
 * @returns {Function} Debounced function with an attached `.cancel()` method.
 */
export function debounce(func, delayMs = 250) {
    let timer = null;

    const debounced = function (...args) {
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => {
            func.apply(this, args);
            timer = null;
        }, delayMs);
    };

    debounced.cancel = function () {
        if (timer) {
            clearTimeout(timer);
            timer = null;
        }
    };

    return debounced;
}
