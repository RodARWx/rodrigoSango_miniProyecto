/**
 * ==============================================================================
 * DOM & STRING UTILITIES (ES6 MODULE)
 * ==============================================================================
 * Pure helper functions for string sanitization, HTML escaping, and dynamic
 * text highlighting in UI search suggestions and lists.
 * ==============================================================================
 */

/**
 * Escapes special HTML characters in a string to prevent XSS injection.
 *
 * @param {string} str - Raw string to escape.
 * @returns {string} HTML-escaped string.
 */
export function escaparHTML(str) {
    if (!str || typeof str !== 'string') return '';
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

/**
 * Highlights occurrences of a search term within a given text by wrapping
 * matched sequences in <strong> tags. Safely handles regex special characters.
 *
 * @param {string} texto - Source text string.
 * @param {string} termino - Search substring to highlight.
 * @returns {string} Text with matched segments enclosed in <strong>.
 */
export function resaltarTexto(texto, termino) {
    if (!texto) return '';
    if (!termino || typeof termino !== 'string' || !termino.trim()) {
        return texto;
    }

    const seguro = termino.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${seguro})`, 'gi');
    return texto.replace(regex, '<strong>$1</strong>');
}
