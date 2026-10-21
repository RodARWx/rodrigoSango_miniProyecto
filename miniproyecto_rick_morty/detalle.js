/**
 * ==============================================================================
 * CHARACTER DETAIL VIEW - PIPELINE ORCHESTRATOR (ES MODULE - WEB-14)
 * ==============================================================================
 * Coordinates the 3-step chained multi-service API join (WEB-9):
 *   Step 1: Character Service (GET /api/character/{id})
 *   Step 2: Location Service  (GET /api/location/{id} chained from location.url)
 *   Step 3: Episode Service   (GET /api/episode/{ids} chained from character.episode)
 *
 * Adheres strictly to the Single Responsibility Principle (SRP):
 * - Networking delegated to 'js/api/rickMortyApi.js'
 * - Persistence delegated to 'js/storage/favoritesStorage.js'
 * - UI rendering & formatting delegated to 'js/ui/renderers.js'
 * - Notifications delegated to 'js/ui/toast.js'
 * - Rate limiting delegated to 'js/utils/throttle.js'
 * ==============================================================================
 */

import { getCharacterById, getLocation, getEpisodes } from './js/api/rickMortyApi.js';
import { toggleFavorite, isFavorite } from './js/storage/favoritesStorage.js';
import {
    formatStatus,
    formatGender,
    renderErrorState,
    renderEpisodeItemHtml
} from './js/ui/renderers.js';
import { showToast } from './js/ui/toast.js';
import { throttleLeading } from './js/utils/throttle.js';

// ==============================================================================
// 1. STATE & ROUTE PARAMETER EXTRACTION
// ==============================================================================

const urlParams = new URLSearchParams(window.location.search);
const personajeId = urlParams.get('id');

let datosPersonajeActual = null;
let esFavoritoLocal = false;

// ==============================================================================
// 2. DOM ELEMENT REFERENCES
// ==============================================================================

// Header & Status Elements
const detalleNombre = document.getElementById('detalle-nombre');
const detalleSubtitulo = document.getElementById('detalle-subtitulo');
const cargandoDetalle = document.getElementById('cargando-detalle');
const contenedorDetalle = document.getElementById('contenedor-detalle');

// Chained Pipeline Indicators (WEB-9)
const pasoPersonaje = document.getElementById('paso-personaje');
const pasoUbicacion = document.getElementById('paso-ubicacion');
const pasoEpisodios = document.getElementById('paso-episodios');

// Service 1: Character Technical Specifications
const fichaTecnica = document.getElementById('ficha-tecnica');
const personajeFoto = document.getElementById('personaje-foto');
const personajeEstadoBadge = document.getElementById('personaje-estado-badge');
const personajeNombreH2 = document.getElementById('personaje-nombre-h2');
const personajeEspecie = document.getElementById('personaje-especie');
const personajeGenero = document.getElementById('personaje-genero');
const personajeTipo = document.getElementById('personaje-tipo');
const personajeOrigen = document.getElementById('personaje-origen');
const personajeUbicacion = document.getElementById('personaje-ubicacion');
const personajeTotalEpisodios = document.getElementById('personaje-total-episodios');

// Bookmark Action Button
const btnToggleFavorito = document.getElementById('btn-toggle-favorito');
const iconoFavoritoDetalle = document.getElementById('icono-favorito-detalle');
const textoFavoritoDetalle = document.getElementById('texto-favorito-detalle');

// Service 2: Location Section
const seccionUbicacion = document.getElementById('seccion-ubicacion');
const badgeUbicacionTipo = document.getElementById('badge-ubicacion-tipo');
const locNombre = document.getElementById('loc-nombre');
const locTipo = document.getElementById('loc-tipo');
const locDimension = document.getElementById('loc-dimension');
const locResidentes = document.getElementById('loc-residentes');
const locContenidoGrilla = document.getElementById('loc-contenido-grilla');
const locMensajeVacio = document.getElementById('loc-mensaje-vacio');

// Service 3: Episodes Section
const seccionEpisodios = document.getElementById('seccion-episodios');
const listaEpisodios = document.getElementById('lista-episodios');
const contadorEpisodios = document.getElementById('contador-episodios');

// ==============================================================================
// 3. BOOKMARK TOGGLE SYNCHRONIZATION
// ==============================================================================

/**
 * Updates bookmark button appearance based on current favorite state.
 */
function actualizarBotonFavorito() {
    if (!btnToggleFavorito) return;

    btnToggleFavorito.classList.toggle('es-favorito', esFavoritoLocal);
    if (iconoFavoritoDetalle) {
        iconoFavoritoDetalle.textContent = esFavoritoLocal ? '★' : '☆';
    }
    if (textoFavoritoDetalle) {
        textoFavoritoDetalle.textContent = esFavoritoLocal ? 'Saved in Favorites' : 'Save to Favorites';
    }
}

/**
 * Toggles favorite state via 'favoritesStorage.js' with leading-edge rate limiting.
 */
const alternarFavorito = throttleLeading(() => {
    if (!datosPersonajeActual) return;

    try {
        const { isFavorite: esFav } = toggleFavorite(datosPersonajeActual);
        esFavoritoLocal = esFav;
        actualizarBotonFavorito();

        const nombre = datosPersonajeActual.name || datosPersonajeActual.nombre;
        if (esFav) {
            showToast(`⭐ "${nombre}" saved to Favorites`, 'exito');
        } else {
            showToast(`"${nombre}" removed from Favorites`, 'eliminar');
        }
    } catch (error) {
        console.error('Error toggling favorite in detail view:', error);
        showToast('Storage error updating bookmark', 'eliminar');
    }
}, 400);

btnToggleFavorito?.addEventListener('click', alternarFavorito);

// ==============================================================================
// 4. CHAINED PIPELINE ORCHESTRATION (WEB-9)
// ==============================================================================

/**
 * Primary pipeline orchestrator coordinating the 3-step chained join.
 */
async function cargarDetallePersonaje() {
    if (!personajeId) {
        mostrarError('No valid character identifier was specified in the URL.');
        return;
    }

    try {
        // ----------------------------------------------------------------------
        // STEP 1: Query Character Service (GET /api/character/{id})
        // ----------------------------------------------------------------------
        pasoPersonaje?.classList.add('activo');

        const personaje = await getCharacterById(personajeId);
        datosPersonajeActual = personaje;

        renderizarFichaTecnica(personaje);
        esFavoritoLocal = isFavorite(personaje.id);
        actualizarBotonFavorito();

        // Hide preliminary spinner once character baseline is ready
        if (cargandoDetalle) cargandoDetalle.style.display = 'none';

        // ----------------------------------------------------------------------
        // STEP 2: Chained Join ➔ Location Service (GET /api/location/{id})
        // ----------------------------------------------------------------------
        await cargarUbicacionEncadenada(personaje.location, personaje.origin);

        // ----------------------------------------------------------------------
        // STEP 3: Chained Join ➔ Episode Service (GET /api/episode/{ids})
        // ----------------------------------------------------------------------
        await cargarEpisodiosEncadenados(personaje.episode);

    } catch (error) {
        console.error('Error executing chained API join:', error);
        mostrarError('Could not retrieve character information from the API services.');
        showToast('Error loading character details', 'error');
    }
}

/**
 * Step 1 Presentation: Renders Character Technical Specifications.
 *
 * @param {Object} personaje - Raw character payload.
 */
function renderizarFichaTecnica(personaje) {
    document.title = `${personaje.name} - Character Details (WEB-9)`;
    if (detalleNombre) detalleNombre.textContent = personaje.name;
    if (detalleSubtitulo) {
        detalleSubtitulo.textContent = 'Chained multi-service join: Character specs, planet details, and episode history';
    }

    if (personajeFoto) {
        personajeFoto.src = personaje.image;
        personajeFoto.alt = `Portrait of ${personaje.name}`;
    }
    if (personajeNombreH2) personajeNombreH2.textContent = personaje.name;

    const { cssClass, text: statusText } = formatStatus(personaje.status);
    if (personajeEstadoBadge) {
        personajeEstadoBadge.className = `estado-flotante ${cssClass}`;
        personajeEstadoBadge.textContent = statusText;
    }

    if (personajeEspecie) personajeEspecie.textContent = personaje.species || 'Not specified';
    if (personajeGenero) personajeGenero.textContent = formatGender(personaje.gender);
    if (personajeTipo) personajeTipo.textContent = personaje.type ? personaje.type : 'None (Standard)';
    if (personajeOrigen) personajeOrigen.textContent = personaje.origin?.name || 'Unknown';
    if (personajeUbicacion) personajeUbicacion.textContent = personaje.location?.name || 'Unknown';
    if (personajeTotalEpisodios) {
        personajeTotalEpisodios.textContent = `${personaje.episode?.length || 0} episode(s)`;
    }

    if (fichaTecnica) fichaTecnica.style.display = 'grid';
}

/**
 * Step 2: Location Service Join (GET /api/location/{id} chained from location.url).
 *
 * @param {Object} locationObj - Location reference object.
 * @param {Object} originObj - Origin reference object as fallback.
 */
async function cargarUbicacionEncadenada(locationObj, originObj) {
    if (seccionUbicacion) seccionUbicacion.style.display = 'block';

    const targetUrl = (locationObj && locationObj.url)
        ? locationObj.url
        : (originObj && originObj.url ? originObj.url : null);

    const locationName = (locationObj && locationObj.name)
        ? locationObj.name
        : (originObj && originObj.name ? originObj.name : 'Unknown');

    // Handle unmapped or unknown locations
    if (!targetUrl || locationName.toLowerCase() === 'unknown') {
        pasoUbicacion?.classList.add('activo');
        if (badgeUbicacionTipo) badgeUbicacionTipo.textContent = 'Unmapped Location';
        if (locContenidoGrilla) locContenidoGrilla.style.display = 'none';
        if (locMensajeVacio) locMensajeVacio.style.display = 'block';
        return;
    }

    try {
        if (badgeUbicacionTipo) badgeUbicacionTipo.textContent = 'Querying Location API...';

        const locData = await getLocation(targetUrl);

        pasoUbicacion?.classList.add('activo');

        if (locNombre) locNombre.textContent = locData?.name || locationName;
        if (locTipo) locTipo.textContent = locData?.type || 'Standard';
        if (locDimension) locDimension.textContent = locData?.dimension || 'Unknown dimension';
        if (locResidentes) {
            locResidentes.textContent = `${locData?.residents ? locData.residents.length : 0} known resident(s)`;
        }
        if (badgeUbicacionTipo) {
            badgeUbicacionTipo.textContent = locData?.type ? `Type: ${locData.type}` : 'Location Record';
        }

        if (locContenidoGrilla) locContenidoGrilla.style.display = 'grid';
        if (locMensajeVacio) locMensajeVacio.style.display = 'none';

    } catch (err) {
        console.warn('Could not query chained Location API:', err);
        pasoUbicacion?.classList.add('activo');
        if (badgeUbicacionTipo) badgeUbicacionTipo.textContent = 'Unavailable';
        if (locNombre) locNombre.textContent = locationName;
        if (locTipo) locTipo.textContent = 'Unknown';
        if (locDimension) locDimension.textContent = 'Unknown';
        if (locResidentes) locResidentes.textContent = 'Data unavailable';
        if (locContenidoGrilla) locContenidoGrilla.style.display = 'grid';
        if (locMensajeVacio) locMensajeVacio.style.display = 'none';
    }
}

/**
 * Step 3: Episode Service Join (GET /api/episode/{ids} chained from character.episode).
 *
 * @param {Array<string>} urlsEpisodios - Array of episode resource URLs.
 */
async function cargarEpisodiosEncadenados(urlsEpisodios) {
    if (seccionEpisodios) seccionEpisodios.style.display = 'block';

    if (!urlsEpisodios || urlsEpisodios.length === 0) {
        pasoEpisodios?.classList.add('activo');
        if (contadorEpisodios) contadorEpisodios.textContent = '0 episodes recorded';
        if (listaEpisodios) {
            listaEpisodios.innerHTML = '<p style="color: #94a3b8; grid-column: 1 / -1;">No episodes recorded for this character.</p>';
        }
        return;
    }

    if (contadorEpisodios) contadorEpisodios.textContent = 'Consulting episodes...';
    if (listaEpisodios) {
        listaEpisodios.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 2rem;">
                <div class="spinner"></div>
                <p style="color: #94a3b8; font-size: 0.9rem;">Fetching episode details from API...</p>
            </div>
        `;
    }

    try {
        const episodios = await getEpisodes(urlsEpisodios);

        pasoEpisodios?.classList.add('activo');

        if (contadorEpisodios) {
            contadorEpisodios.textContent = `${episodios.length} episode(s) found`;
        }

        if (listaEpisodios) {
            listaEpisodios.innerHTML = episodios.map(renderEpisodeItemHtml).join('');
        }

    } catch (error) {
        console.error('Error querying Episode service:', error);
        pasoEpisodios?.classList.add('activo');
        if (contadorEpisodios) contadorEpisodios.textContent = 'Error loading';
        if (listaEpisodios) {
            listaEpisodios.innerHTML = `
                <p style="color: #f87171; grid-column: 1 / -1;">
                    Could not fetch episode details from the API service.
                </p>
            `;
        }
    }
}

// ==============================================================================
// 5. ERROR STATE HANDLER
// ==============================================================================

/**
 * Renders standardized error state using 'renderers.js'.
 *
 * @param {string} mensaje - Human-readable error message.
 */
function mostrarError(mensaje) {
    if (cargandoDetalle) cargandoDetalle.style.display = 'none';
    if (fichaTecnica) fichaTecnica.style.display = 'none';
    if (seccionUbicacion) seccionUbicacion.style.display = 'none';
    if (seccionEpisodios) seccionEpisodios.style.display = 'none';

    if (detalleNombre) detalleNombre.textContent = 'Error';
    if (detalleSubtitulo) detalleSubtitulo.textContent = mensaje;

    if (contenedorDetalle) {
        const errorHtml = renderErrorState(mensaje, 'index.html');
        const wrapper = document.createElement('div');
        wrapper.innerHTML = errorHtml;
        contenedorDetalle.appendChild(wrapper.firstElementChild);
    }
}

// ==============================================================================
// 6. INITIALIZATION
// ==============================================================================

cargarDetallePersonaje();
