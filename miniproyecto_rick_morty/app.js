/**
 * ==============================================================================
 * RICK AND MORTY APPLICATION - CATALOG CONTROLLER (ES MODULE - WEB-13)
 * ==============================================================================
 * Orchestrates application view lifecycle, user event bindings, and UI state.
 *
 * Adheres strictly to the Single Responsibility Principle (SRP):
 * - Networking delegated to 'js/api/rickMortyApi.js'
 * - Persistence delegated to 'js/storage/favoritesStorage.js'
 * - UI markup and presentation delegated to 'js/ui/renderers.js'
 * - Notifications delegated to 'js/ui/toast.js'
 * - Rate limiters delegated to 'js/utils/throttle.js'
 * ==============================================================================
 */

import { getCharacters } from './js/api/rickMortyApi.js';
import {
    getFavorites,
    toggleFavorite,
    getFavoriteIds
} from './js/storage/favoritesStorage.js';
import {
    createCharacterCardElement,
    renderPaginationControls,
    renderEmptyState,
    renderErrorState
} from './js/ui/renderers.js';
import { showToast } from './js/ui/toast.js';
import { throttleLeading } from './js/utils/throttle.js';

// ==============================================================================
// 1. APPLICATION STATE
// ==============================================================================

let vistaActual = 'catalogo'; // 'catalogo' | 'favoritos'
let paginaActual = 1;
let totalPaginas = 1;
let totalPersonajes = 0;
let terminoBusqueda = '';
let estadoSeleccionado = '';
let generoSeleccionado = '';

let idsFavoritos = new Set();

// Pedagogical 4.0-second delay control with animated spinner feedback
const DELAY_MS = 4000;
let temporizadorBusqueda = null;

// ==============================================================================
// 2. DOM ELEMENT REFERENCES
// ==============================================================================

const gridPersonajes = document.getElementById('grid-personajes');
const inputBusqueda = document.getElementById('input-busqueda');
const spinnerBusqueda = document.getElementById('spinner-busqueda');
const filtroEstado = document.getElementById('filtro-estado');
const filtroGenero = document.getElementById('filtro-genero');
const btnLimpiarFiltros = document.getElementById('btn-limpiar-filtros');
const badgeContador = document.getElementById('contador-resultados');
const tituloVista = document.getElementById('titulo-vista');

const btnPaginaAnterior = document.getElementById('btn-pagina-anterior');
const btnPaginaSiguiente = document.getElementById('btn-pagina-siguiente');
const infoPaginacion = document.getElementById('info-paginacion');
const paginacionContenedor = document.getElementById('paginacion-contenedor');

const tabCatalogo = document.getElementById('tab-catalogo');
const tabFavoritos = document.getElementById('tab-favoritos');
const navBtnCatalogo = document.getElementById('nav-btn-catalogo');
const navBtnFavoritos = document.getElementById('nav-btn-favoritos');
const contadorNavFav = document.getElementById('contador-nav-fav');
const conteoTabFav = document.getElementById('conteo-tab-fav');

// ==============================================================================
// 3. STORAGE & FAVORITES SYNCHRONIZATION
// ==============================================================================

/**
 * Synchronizes in-memory favorite IDs and visual counter badges.
 */
function sincronizarFavoritos() {
    idsFavoritos = getFavoriteIds();
    const total = idsFavoritos.size;
    if (contadorNavFav) contadorNavFav.textContent = total;
    if (conteoTabFav) conteoTabFav.textContent = total;
    return getFavorites();
}

/**
 * Handles toggling bookmark state when user clicks on a card star button.
 */
const manejarToggleFavorito = throttleLeading((personaje, btnElement) => {
    try {
        const { isFavorite: esFav, character: charGuardado } = toggleFavorite(personaje);
        sincronizarFavoritos();

        if (btnElement) {
            btnElement.classList.toggle('es-favorito', esFav);
            btnElement.innerHTML = esFav ? '★' : '☆';
            btnElement.title = esFav ? 'Remove from Favorites' : 'Save to Favorites';
        }

        const nombre = charGuardado.nombre || charGuardado.name;
        if (esFav) {
            showToast(`⭐ "${nombre}" saved to Favorites`, 'exito');
        } else {
            showToast(`"${nombre}" removed from Favorites`, 'eliminar');
            if (vistaActual === 'favoritos') {
                consultarFavoritosLocal();
            }
        }
    } catch (error) {
        console.error('Error toggling favorite:', error);
        showToast('Storage error updating bookmark', 'eliminar');
    }
}, 350);

// ==============================================================================
// 4. CARD RENDERING ORCHESTRATION
// ==============================================================================

/**
 * Renders an array of character data objects into the catalog grid container.
 *
 * @param {Array<Object>} personajes - List of character records.
 */
function renderizarTarjetas(personajes) {
    gridPersonajes.innerHTML = '';

    if (!personajes || personajes.length === 0) {
        gridPersonajes.innerHTML = renderEmptyState('No characters match the specified search criteria.', {
            submessage: 'Try another keyword or reset the search filters.'
        });
        return;
    }

    const fragment = document.createDocumentFragment();

    personajes.forEach(personaje => {
        const id = Number(personaje.id);
        const esFav = idsFavoritos.has(id);

        const cardElement = createCharacterCardElement(personaje, esFav, {
            onFavoriteClick: (char, btn) => manejarToggleFavorito(char, btn),
            onCardClick: (char) => {
                window.location.href = `detalle.html?id=${char.id}`;
            }
        });

        fragment.appendChild(cardElement);
    });

    gridPersonajes.appendChild(fragment);
}

// ==============================================================================
// 5. CATALOG DATA FETCHING (API ORCHESTRATION)
// ==============================================================================

/**
 * Queries characters from the API via 'rickMortyApi.js' and updates the view.
 *
 * @param {number} [pagina=1] - Catalog page number.
 */
async function consultarPersonajes(pagina = 1) {
    if (vistaActual !== 'catalogo') return;

    cancelarTemporizador();
    paginaActual = pagina;
    mostrarCirculoCarga(true);
    badgeContador.textContent = 'Consulting API...';

    gridPersonajes.innerHTML = `
        <div class="estado-mensaje" style="grid-column: 1 / -1;">
            <div class="spinner"></div>
            <p>Fetching characters from the official Rick & Morty API...</p>
        </div>
    `;

    try {
        const data = await getCharacters({
            page: paginaActual,
            name: terminoBusqueda,
            status: estadoSeleccionado,
            gender: generoSeleccionado
        });

        totalPaginas = data.info.pages;
        totalPersonajes = data.info.count;

        actualizarControlesPaginacion();

        if (data.results.length === 0) {
            badgeContador.textContent = '0 characters found';
            gridPersonajes.innerHTML = renderEmptyState('No characters match the specified search criteria.', {
                submessage: 'Try another keyword or reset the search filters.'
            });
            return;
        }

        renderizarTarjetas(data.results);

    } catch (error) {
        console.error('Error fetching catalog:', error);
        badgeContador.textContent = 'Connection error';
        gridPersonajes.innerHTML = renderErrorState('Could not connect to the Rick and Morty API.');
        showToast('Connection error querying characters', 'error');
    } finally {
        mostrarCirculoCarga(false);
    }
}

/**
 * Updates pagination bar labels and boundary button states using 'renderers.js'.
 */
function actualizarControlesPaginacion() {
    const controls = renderPaginationControls(paginaActual, totalPaginas, totalPersonajes);

    badgeContador.textContent = controls.counterText;
    infoPaginacion.textContent = controls.infoText;
    btnPaginaAnterior.disabled = controls.prevDisabled;
    btnPaginaSiguiente.disabled = controls.nextDisabled;
    paginacionContenedor.style.display = totalPaginas > 0 ? 'flex' : 'none';
}

// ==============================================================================
// 6. FAVORITES VIEW ORCHESTRATION
// ==============================================================================

/**
 * Displays stored favorite characters without making network requests.
 */
function consultarFavoritosLocal() {
    mostrarCirculoCarga(false);
    paginacionContenedor.style.display = 'none';

    const lista = sincronizarFavoritos();
    badgeContador.textContent = `${lista.length} character(s) saved`;

    if (lista.length === 0) {
        gridPersonajes.innerHTML = renderEmptyState('You have no saved favorite characters yet.', {
            submessage: 'Explore the catalog and click the star icon ⭐ on any character to bookmark it in your browser.',
            actionButtonText: 'Explore Character Catalog',
            actionButtonId: 'btn-explorar-catalogo'
        });

        const btnExplorar = document.getElementById('btn-explorar-catalogo');
        if (btnExplorar) {
            btnExplorar.addEventListener('click', activarVistaCatalogo);
        }
        return;
    }

    renderizarTarjetas(lista);
}

/**
 * Filters the stored favorites list in memory using the active search/filter criteria.
 */
function filtrarFavoritosLocal() {
    mostrarCirculoCarga(false);
    let lista = getFavorites();

    if (terminoBusqueda) {
        const termino = terminoBusqueda.toLowerCase();
        lista = lista.filter(p => (p.nombre || p.name || '').toLowerCase().includes(termino));
    }
    if (estadoSeleccionado) {
        const est = estadoSeleccionado.toLowerCase();
        lista = lista.filter(p => (p.estado || p.status || '').toLowerCase() === est);
    }
    if (generoSeleccionado) {
        const gen = generoSeleccionado.toLowerCase();
        lista = lista.filter(p => (p.genero || p.gender || '').toLowerCase() === gen);
    }

    badgeContador.textContent = `${lista.length} match(es) in Favorites`;
    renderizarTarjetas(lista);
}

// ==============================================================================
// 7. SEARCH & FILTER CONTROLLER (4.0s DELAY & INSTANT ENTER)
// ==============================================================================

function mostrarCirculoCarga(mostrar) {
    if (spinnerBusqueda) {
        spinnerBusqueda.style.display = mostrar ? 'block' : 'none';
    }
}

function cancelarTemporizador() {
    if (temporizadorBusqueda) {
        clearTimeout(temporizadorBusqueda);
        temporizadorBusqueda = null;
    }
    mostrarCirculoCarga(false);
}

function ejecutarBusquedaInmediata() {
    cancelarTemporizador();
    terminoBusqueda = inputBusqueda.value.trim();
    if (vistaActual === 'catalogo') {
        consultarPersonajes(1);
    } else {
        filtrarFavoritosLocal();
    }
}

function manejarEntradaBusqueda() {
    cancelarTemporizador();

    const texto = inputBusqueda.value.trim();
    if (!texto) {
        terminoBusqueda = '';
        if (vistaActual === 'catalogo') {
            consultarPersonajes(1);
        } else {
            consultarFavoritosLocal();
        }
        return;
    }

    // Pedagogical requirement: smooth rotating spinner during 4.0s delay
    mostrarCirculoCarga(true);
    badgeContador.textContent = 'Searching characters...';

    temporizadorBusqueda = setTimeout(() => {
        cancelarTemporizador();
        terminoBusqueda = inputBusqueda.value.trim();
        if (vistaActual === 'catalogo') {
            consultarPersonajes(1);
        } else {
            filtrarFavoritosLocal();
        }
    }, DELAY_MS);
}

// ==============================================================================
// 8. TAB NAVIGATION CONTROLLER
// ==============================================================================

export function activarVistaCatalogo() {
    vistaActual = 'catalogo';
    tabCatalogo?.classList.add('activo');
    tabFavoritos?.classList.remove('activo');
    navBtnCatalogo?.classList.add('activo');
    navBtnFavoritos?.classList.remove('activo');

    if (tituloVista) tituloVista.textContent = 'Explorar Personajes de la Serie';
    paginacionContenedor.style.display = 'flex';
    consultarPersonajes(1);
}

export function activarVistaFavoritos() {
    vistaActual = 'favoritos';
    tabFavoritos?.classList.add('activo');
    tabCatalogo?.classList.remove('activo');
    navBtnFavoritos?.classList.add('activo');
    navBtnCatalogo?.classList.remove('activo');

    if (tituloVista) tituloVista.textContent = 'Mis Personajes Favoritos';
    consultarFavoritosLocal();
}

// Global hook for inline or delegated template calls
window.activarVistaCatalogo = activarVistaCatalogo;
window.activarVistaFavoritos = activarVistaFavoritos;

// ==============================================================================
// 9. EVENT LISTENERS SETUP
// ==============================================================================

// Search input events
inputBusqueda?.addEventListener('input', manejarEntradaBusqueda);
inputBusqueda?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        ejecutarBusquedaInmediata();
    }
});

// Dropdown filter change events
filtroEstado?.addEventListener('change', (e) => {
    estadoSeleccionado = e.target.value;
    ejecutarBusquedaInmediata();
});

filtroGenero?.addEventListener('change', (e) => {
    generoSeleccionado = e.target.value;
    ejecutarBusquedaInmediata();
});

// Reset filters button
btnLimpiarFiltros?.addEventListener('click', () => {
    cancelarTemporizador();
    if (inputBusqueda) inputBusqueda.value = '';
    if (filtroEstado) filtroEstado.value = '';
    if (filtroGenero) filtroGenero.value = '';
    terminoBusqueda = '';
    estadoSeleccionado = '';
    generoSeleccionado = '';

    if (vistaActual === 'catalogo') {
        consultarPersonajes(1);
    } else {
        consultarFavoritosLocal();
    }
});

// Throttled pagination controls (450ms)
btnPaginaAnterior?.addEventListener('click', throttleLeading(() => {
    if (paginaActual > 1) {
        consultarPersonajes(paginaActual - 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}, 450));

btnPaginaSiguiente?.addEventListener('click', throttleLeading(() => {
    if (paginaActual < totalPaginas) {
        consultarPersonajes(paginaActual + 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}, 450));

// Navigation tab clicks
tabCatalogo?.addEventListener('click', activarVistaCatalogo);
tabFavoritos?.addEventListener('click', activarVistaFavoritos);
navBtnCatalogo?.addEventListener('click', activarVistaCatalogo);
navBtnFavoritos?.addEventListener('click', activarVistaFavoritos);

// ==============================================================================
// 10. INITIALIZATION
// ==============================================================================

sincronizarFavoritos();
consultarPersonajes(1);
