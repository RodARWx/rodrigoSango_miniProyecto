/**
 * ==============================================================================
 * SERVER-SIDE PAGINATION CONTROLLER (ES6 MODULE)
 * ==============================================================================
 * Manages the state, accessibility attributes, and DOM labels for server-side
 * paginated catalogues.
 * ==============================================================================
 */

import { throttleLeading } from '../utils/throttle.js';

/**
 * Updates pagination text, badge indicators, and disabled button states.
 *
 * @param {Object} options - Pagination state and DOM elements.
 * @param {number} options.paginaActual - 0-indexed current page.
 * @param {number} options.totalPaginas - Total number of pages.
 * @param {number} options.totalElementos - Total matching student records.
 * @param {HTMLElement|null} options.badgeContador - Top results counter pill.
 * @param {HTMLElement|null} options.infoPaginacion - Page indicator text.
 * @param {HTMLButtonElement|null} options.btnPaginaAnterior - Previous page button.
 * @param {HTMLButtonElement|null} options.btnPaginaSiguiente - Next page button.
 */
export function actualizarControlesPaginacion({
    paginaActual = 0,
    totalPaginas = 1,
    totalElementos = 0,
    badgeContador,
    infoPaginacion,
    btnPaginaAnterior,
    btnPaginaSiguiente
}) {
    if (badgeContador) {
        badgeContador.textContent = `${totalElementos} estudiante(s) encontrado(s)`;
    }

    if (infoPaginacion) {
        infoPaginacion.textContent = totalPaginas === 0
            ? 'Página 0 de 0'
            : `Página ${paginaActual + 1} de ${totalPaginas}`;
    }

    if (btnPaginaAnterior) {
        btnPaginaAnterior.disabled = (paginaActual <= 0);
    }

    if (btnPaginaSiguiente) {
        btnPaginaSiguiente.disabled = (paginaActual >= totalPaginas - 1 || totalPaginas === 0);
    }
}

/**
 * Binds throttled click handlers to previous and next pagination buttons.
 *
 * @param {HTMLButtonElement} btnPaginaAnterior - Previous button element.
 * @param {HTMLButtonElement} btnPaginaSiguiente - Next button element.
 * @param {Function} onCambiarPagina - Callback receiving target page index.
 * @param {Function} getEstadoPaginacion - Accessor returning { paginaActual, totalPaginas }.
 */
export function configurarEventosPaginacion(
    btnPaginaAnterior,
    btnPaginaSiguiente,
    onCambiarPagina,
    getEstadoPaginacion
) {
    if (btnPaginaAnterior) {
        btnPaginaAnterior.addEventListener('click', throttleLeading(() => {
            const { paginaActual } = getEstadoPaginacion();
            if (paginaActual > 0) {
                onCambiarPagina(paginaActual - 1);
            }
        }, 400));
    }

    if (btnPaginaSiguiente) {
        btnPaginaSiguiente.addEventListener('click', throttleLeading(() => {
            const { paginaActual, totalPaginas } = getEstadoPaginacion();
            if (paginaActual < totalPaginas - 1) {
                onCambiarPagina(paginaActual + 1);
            }
        }, 400));
    }
}
