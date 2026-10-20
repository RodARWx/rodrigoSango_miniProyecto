// ==========================================================================
// RICK AND MORTY APPLICATION - CLIENT-SIDE FRONTEND (PURE VANILLA JS)
// Direct external API consumption (Endpoint 1) + localStorage persistence
// ==========================================================================

const API_BASE = 'https://rickandmortyapi.com/api';
const STORAGE_KEY_FAVORITOS = 'rick_morty_favoritos';

// Global application state
let vistaActual = 'catalogo'; // 'catalogo' | 'favoritos'
let paginaActual = 1;
let totalPaginas = 1;
let totalPersonajes = 0;
let terminoBusqueda = '';
let estadoSeleccionado = '';
let generoSeleccionado = '';

// In-memory set of favorite IDs synchronized with localStorage
let idsFavoritos = new Set();

// Strict 4.0-second delay control with animated spinner feedback
const DELAY_MS = 4000;
let temporizadorBusqueda = null;

// DOM Elements
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
const toastContenedor = document.getElementById('toast-contenedor');

// ==========================================================================
// 1. LOCAL STORAGE MANAGER (LOCALSTORAGE)
// ==========================================================================

/**
 * Retrieves the list of favorite characters stored in localStorage.
 * @returns {Array<Object>} List of favorite character objects
 */
function obtenerFavoritosStorage() {
    try {
        const data = localStorage.getItem(STORAGE_KEY_FAVORITOS);
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error('Error reading favorites from localStorage:', error);
        return [];
    }
}

/**
 * Persists the entire favorites collection to localStorage.
 * @param {Array<Object>} favoritos
 */
function guardarFavoritosStorage(favoritos) {
    try {
        localStorage.setItem(STORAGE_KEY_FAVORITOS, JSON.stringify(favoritos));
    } catch (error) {
        console.error('Error saving favorites to localStorage:', error);
        mostrarToast('Browser storage error', 'eliminar');
    }
}

/**
 * Synchronizes the in-memory `idsFavoritos` Set and visual counter badges.
 */
function sincronizarFavoritos() {
    const lista = obtenerFavoritosStorage();
    idsFavoritos = new Set(lista.map(item => Number(item.id)));
    actualizarContadoresFavoritos(idsFavoritos.size);
    return lista;
}

/**
 * Updates favorite counter badges in the navbar and navigation tabs.
 * @param {number} total
 */
function actualizarContadoresFavoritos(total) {
    if (contadorNavFav) contadorNavFav.textContent = total;
    if (conteoTabFav) conteoTabFav.textContent = total;
}

/**
 * Toggles the favorite status of a character in localStorage.
 * @param {Object} personaje
 * @param {HTMLElement} btnElement
 */
function toggleFavorito(personaje, btnElement) {
    const id = Number(personaje.id);
    let favoritos = obtenerFavoritosStorage();
    const indice = favoritos.findIndex(f => Number(f.id) === id);

    if (indice !== -1) {
        // Remove from favorites
        favoritos.splice(indice, 1);
        guardarFavoritosStorage(favoritos);
        idsFavoritos.delete(id);

        btnElement.classList.remove('es-favorito');
        btnElement.innerHTML = '☆';
        btnElement.title = 'Guardar en Favoritos';
        mostrarToast(`"${personaje.nombre || personaje.name}" removed from Favorites`, 'eliminar');

        if (vistaActual === 'favoritos') {
            consultarFavoritosLocal();
        }
    } else {
        // Add to favorites
        const nuevoFavorito = {
            id: Number(personaje.id),
            nombre: personaje.nombre || personaje.name,
            estado: personaje.estado || personaje.status || 'unknown',
            especie: personaje.especie || personaje.species || 'Desconocida',
            genero: personaje.genero || personaje.gender || 'unknown',
            imagen: personaje.imagen || personaje.image,
            origen: personaje.origen || personaje.origin?.name || 'Desconocido',
            fechaGuardado: new Date().toISOString()
        };

        favoritos.unshift(nuevoFavorito);
        guardarFavoritosStorage(favoritos);
        idsFavoritos.add(id);

        btnElement.classList.add('es-favorito');
        btnElement.innerHTML = '★';
        btnElement.title = 'Eliminar de Favoritos';
        mostrarToast(`⭐ "${nuevoFavorito.nombre}" saved to Favorites`, 'exito');
    }

    actualizarContadoresFavoritos(idsFavoritos.size);
}

// ==========================================================================
// 2. CHARACTER QUERY (ENDPOINT 1: GET /api/character/?...)
// ==========================================================================

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
        const params = new URLSearchParams({ page: paginaActual });

        if (terminoBusqueda && terminoBusqueda.trim() !== '') {
            params.append('name', terminoBusqueda.trim());
        }
        if (estadoSeleccionado && estadoSeleccionado.trim() !== '') {
            params.append('status', estadoSeleccionado.trim());
        }
        if (generoSeleccionado && generoSeleccionado.trim() !== '') {
            params.append('gender', generoSeleccionado.trim());
        }

        // Direct request to Endpoint 1 of the external API
        const respuesta = await fetch(`${API_BASE}/character/?${params.toString()}`);

        if (respuesta.status === 404) {
            renderizarSinResultados();
            return;
        }

        if (!respuesta.ok) {
            throw new Error(`Error HTTP: ${respuesta.status}`);
        }

        const data = await respuesta.json();

        totalPaginas = data.info.pages;
        totalPersonajes = data.info.count;

        actualizarControlesPaginacion();
        renderizarTarjetas(data.results);

    } catch (error) {
        console.error('Error querying Endpoint 1 of the API:', error);
        badgeContador.textContent = 'Connection error';
        gridPersonajes.innerHTML = `
            <div class="estado-mensaje" style="grid-column: 1 / -1;">
                <p>Could not connect to the Rick and Morty API.</p>
                <small style="color: #64748b; margin-top: 0.5rem; display: block;">
                    Please check your internet connection or try again later.
                </small>
            </div>
        `;
    } finally {
        mostrarCirculoCarga(false);
    }
}

// ==========================================================================
// 3. QUERY FAVORITES STORED IN LOCALSTORAGE
// ==========================================================================

function consultarFavoritosLocal() {
    mostrarCirculoCarga(false);
    paginacionContenedor.style.display = 'none';

    const lista = sincronizarFavoritos();
    badgeContador.textContent = `${lista.length} character(s) saved`;

    if (lista.length === 0) {
        gridPersonajes.innerHTML = `
            <div class="estado-mensaje" style="grid-column: 1 / -1;">
                <p>You have no saved favorite characters yet.</p>
                <small style="color: #64748b; margin-top: 0.5rem; display: block;">
                    Explore the catalog and click the star icon ⭐ on any character to bookmark it in your browser.
                </small>
                <button type="button" class="btn btn-buscar" style="margin-top: 1rem;" onclick="activarVistaCatalogo()">
                    Explore Character Catalog
                </button>
            </div>
        `;
        return;
    }

    renderizarTarjetas(lista);
}

// ==========================================================================
// 4. CARD RENDERING (RESPONSIVE CSS GRID)
// ==========================================================================

function renderizarTarjetas(personajes) {
    gridPersonajes.innerHTML = '';

    if (!personajes || personajes.length === 0) {
        renderizarSinResultados();
        return;
    }

    personajes.forEach(personaje => {
        const tarjeta = document.createElement('article');
        tarjeta.classList.add('tarjeta-personaje');
        tarjeta.setAttribute('tabindex', '0');
        tarjeta.setAttribute('role', 'button');
        tarjeta.setAttribute('aria-label', `View details for ${personaje.name || personaje.nombre}`);

        const id = Number(personaje.id);
        const nombre = personaje.name || personaje.nombre;
        const especie = personaje.species || personaje.especie || 'N/D';
        const genero = personaje.gender || personaje.genero || 'unknown';
        const imagen = personaje.image || personaje.imagen;
        const origen = personaje.origin?.name || personaje.origen || 'Desconocido';
        const estado = (personaje.status || personaje.estado || 'unknown').toLowerCase();

        let claseEstado = 'estado-unknown';
        let textoEstado = 'Desconocido';
        if (estado === 'alive') {
            claseEstado = 'estado-alive';
            textoEstado = 'Vivo';
        } else if (estado === 'dead') {
            claseEstado = 'estado-dead';
            textoEstado = 'Muerto';
        }

        const esFav = idsFavoritos.has(id);

        tarjeta.innerHTML = `
            <div class="tarjeta-foto-envoltura">
                <img src="${imagen}" alt="Portrait of ${nombre}" loading="lazy">
                
                <!-- Star button to save/remove favorite from localStorage -->
                <button type="button" class="btn-favorito-tarjeta ${esFav ? 'es-favorito' : ''}" 
                    title="${esFav ? 'Remove from Favorites' : 'Save to Favorites'}" 
                    aria-label="Toggle favorite"
                    data-id="${id}">
                    ${esFav ? '★' : '☆'}
                </button>

                <div class="badge-estado ${claseEstado}">
                    <span class="punto-estado"></span>
                    <span>${textoEstado}</span>
                </div>
            </div>
            <div class="tarjeta-contenido">
                <h3 class="tarjeta-nombre">${nombre}</h3>
                <div class="tarjeta-meta">
                    <span><strong>Especie:</strong> ${especie}</span>
                    <span><strong>Género:</strong> ${traducirGenero(genero)}</span>
                    <span><strong>Origen:</strong> ${origen}</span>
                </div>
                <div class="tarjeta-accion-enlace">
                    <span>Ver ficha técnica</span>
                    <span>&rarr;</span>
                </div>
            </div>
        `;

        // Event listener for favorite button (prevents card click navigation)
        const btnFav = tarjeta.querySelector('.btn-favorito-tarjeta');
        btnFav.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleFavorito({
                id,
                nombre,
                estado,
                especie,
                genero,
                imagen,
                origen
            }, btnFav);
        });

        // Navigation click or keyboard Enter listener
        tarjeta.addEventListener('click', () => irADetalle(id));
        tarjeta.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') irADetalle(id);
        });

        gridPersonajes.appendChild(tarjeta);
    });
}

function renderizarSinResultados() {
    badgeContador.textContent = '0 characters found';
    infoPaginacion.textContent = 'Page 0 of 0';
    btnPaginaAnterior.disabled = true;
    btnPaginaSiguiente.disabled = true;

    gridPersonajes.innerHTML = `
        <div class="estado-mensaje" style="grid-column: 1 / -1;">
            <p>No characters match the specified search criteria.</p>
            <small style="color: #64748b; margin-top: 0.5rem; display: block;">
                Try another keyword or reset the search filters.
            </small>
        </div>
    `;
}

// ==========================================================================
// 5. NATURAL SEARCH (WITH ANIMATED SPINNER AND 4.0-SECOND DEBOUNCE)
// ==========================================================================

function mostrarCirculoCarga(mostrar) {
    if (spinnerBusqueda) {
        spinnerBusqueda.style.display = mostrar ? 'block' : 'none';
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

    // Activate smooth rotating spinner during the 4.0-second delay
    mostrarCirculoCarga(true);
    badgeContador.textContent = 'Searching characters...';

    // Strict trigger after exactly 4000 ms
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

function filtrarFavoritosLocal() {
    mostrarCirculoCarga(false);
    let lista = obtenerFavoritosStorage();

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

// Search input event listeners
inputBusqueda.addEventListener('input', manejarEntradaBusqueda);
inputBusqueda.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        ejecutarBusquedaInmediata();
    }
});

// Combined filter change listeners
filtroEstado.addEventListener('change', (e) => {
    estadoSeleccionado = e.target.value;
    ejecutarBusquedaInmediata();
});

filtroGenero.addEventListener('change', (e) => {
    generoSeleccionado = e.target.value;
    ejecutarBusquedaInmediata();
});

btnLimpiarFiltros.addEventListener('click', () => {
    cancelarTemporizador();
    inputBusqueda.value = '';
    terminoBusqueda = '';
    filtroEstado.value = '';
    estadoSeleccionado = '';
    filtroGenero.value = '';
    generoSeleccionado = '';

    if (vistaActual === 'catalogo') {
        consultarPersonajes(1);
    } else {
        consultarFavoritosLocal();
    }
});

// Pagination event listeners
btnPaginaAnterior.addEventListener('click', () => {
    if (paginaActual > 1) {
        consultarPersonajes(paginaActual - 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
});

btnPaginaSiguiente.addEventListener('click', () => {
    if (paginaActual < totalPaginas) {
        consultarPersonajes(paginaActual + 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
});

function actualizarControlesPaginacion() {
    badgeContador.textContent = `${totalPersonajes} characters in catalog (API)`;
    infoPaginacion.textContent = `Page ${paginaActual} of ${totalPaginas}`;
    btnPaginaAnterior.disabled = (paginaActual <= 1);
    btnPaginaSiguiente.disabled = (paginaActual >= totalPaginas);
    paginacionContenedor.style.display = 'flex';
}

// ==========================================================================
// 6. TAB CONTROLLER (CATALOG vs FAVORITES)
// ==========================================================================

function activarVistaCatalogo() {
    vistaActual = 'catalogo';
    tabCatalogo.classList.add('activo');
    tabFavoritos.classList.remove('activo');
    navBtnCatalogo.classList.add('activo');
    navBtnFavoritos.classList.remove('activo');

    tituloVista.textContent = 'Explorar Personajes de la Serie';
    paginacionContenedor.style.display = 'flex';
    consultarPersonajes(1);
}

function activarVistaFavoritos() {
    vistaActual = 'favoritos';
    tabFavoritos.classList.add('activo');
    tabCatalogo.classList.remove('activo');
    navBtnFavoritos.classList.add('activo');
    navBtnCatalogo.classList.remove('activo');

    tituloVista.textContent = 'Mis Personajes Favoritos';
    consultarFavoritosLocal();
}

tabCatalogo.addEventListener('click', activarVistaCatalogo);
tabFavoritos.addEventListener('click', activarVistaFavoritos);
navBtnCatalogo.addEventListener('click', activarVistaCatalogo);
navBtnFavoritos.addEventListener('click', activarVistaFavoritos);

// ==========================================================================
// 7. UTILITIES
// ==========================================================================

function traducirGenero(genero) {
    const g = (genero || '').toLowerCase();
    switch (g) {
        case 'female': return 'Femenino';
        case 'male': return 'Masculino';
        case 'genderless': return 'Sin género';
        default: return 'Desconocido';
    }
}

function irADetalle(id) {
    window.location.href = `detalle.html?id=${id}`;
}

function mostrarToast(mensaje, tipo = 'exito') {
    if (!toastContenedor) return;
    const toast = document.createElement('div');
    toast.className = `toast ${tipo}`;
    toast.innerHTML = `<span>${tipo === 'exito' ? '✅' : 'ℹ️'}</span><span>${mensaje}</span>`;
    toastContenedor.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(10px)';
        setTimeout(() => toast.remove(), 300);
    }, 2800);
}

// ==========================================================================
// 8. INITIALIZATION
// ==========================================================================

sincronizarFavoritos();
consultarPersonajes(1);
