// ==========================================================================
// CHARACTER DETAIL VIEW - CLIENT-SIDE FRONTEND (PURE VANILLA JS)
// Chained API Join (WEB-9):
//   1. Character Service: GET /api/character/{id}
//   2. Location Service:  GET /api/location/{id} (Chained from character location)
//   3. Episode Service:   GET /api/episode/{ids} (Chained from character episode list)
// + localStorage persistence
// ==========================================================================

const API_BASE = 'https://rickandmortyapi.com/api';
const STORAGE_KEY_FAVORITOS = 'rick_morty_favoritos';

// Extract character ID from URL search parameters (?id=...)
const urlParams = new URLSearchParams(window.location.search);
const personajeId = urlParams.get('id');

let datosPersonajeActual = null;
let esFavoritoLocal = false;

// DOM Elements - Navigation & Header
const detalleNombre = document.getElementById('detalle-nombre');
const detalleSubtitulo = document.getElementById('detalle-subtitulo');
const cargandoDetalle = document.getElementById('cargando-detalle');
const toastContenedor = document.getElementById('toast-contenedor');

// DOM Elements - Pipeline Indicator (WEB-9)
const pasoPersonaje = document.getElementById('paso-personaje');
const pasoUbicacion = document.getElementById('paso-ubicacion');
const pasoEpisodios = document.getElementById('paso-episodios');

// DOM Elements - Service 1: Character Technical Specifications
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
const btnToggleFavorito = document.getElementById('btn-toggle-favorito');
const iconoFavoritoDetalle = document.getElementById('icono-favorito-detalle');
const textoFavoritoDetalle = document.getElementById('texto-favorito-detalle');

// DOM Elements - Service 2: Location Section (WEB-9 Chained Join)
const seccionUbicacion = document.getElementById('seccion-ubicacion');
const badgeUbicacionTipo = document.getElementById('badge-ubicacion-tipo');
const locNombre = document.getElementById('loc-nombre');
const locTipo = document.getElementById('loc-tipo');
const locDimension = document.getElementById('loc-dimension');
const locResidentes = document.getElementById('loc-residentes');
const locContenidoGrilla = document.getElementById('loc-contenido-grilla');
const locMensajeVacio = document.getElementById('loc-mensaje-vacio');

// DOM Elements - Service 3: Episodes Section (WEB-9 Chained Join)
const seccionEpisodios = document.getElementById('seccion-episodios');
const listaEpisodios = document.getElementById('lista-episodios');
const contadorEpisodios = document.getElementById('contador-episodios');

// ==========================================================================
// 1. LOCALSTORAGE FAVORITES MANAGER
// ==========================================================================

function obtenerFavoritosStorage() {
    try {
        const data = localStorage.getItem(STORAGE_KEY_FAVORITOS);
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error('Error reading favorites from localStorage:', error);
        return [];
    }
}

function guardarFavoritosStorage(favoritos) {
    try {
        localStorage.setItem(STORAGE_KEY_FAVORITOS, JSON.stringify(favoritos));
    } catch (error) {
        console.error('Error saving favorites to localStorage:', error);
        mostrarToast('Browser storage error', 'eliminar');
    }
}

function verificarFavoritoLocal(id) {
    if (!id) return;
    const favoritos = obtenerFavoritosStorage();
    esFavoritoLocal = favoritos.some(item => Number(item.id) === Number(id));
    actualizarBotonFavorito();
}

function actualizarBotonFavorito() {
    if (!btnToggleFavorito) return;
    if (esFavoritoLocal) {
        btnToggleFavorito.classList.add('es-favorito');
        iconoFavoritoDetalle.textContent = '★';
        textoFavoritoDetalle.textContent = 'Saved in Favorites';
    } else {
        btnToggleFavorito.classList.remove('es-favorito');
        iconoFavoritoDetalle.textContent = '☆';
        textoFavoritoDetalle.textContent = 'Save to Favorites';
    }
}

function alternarFavorito() {
    if (!datosPersonajeActual) return;
    const id = Number(datosPersonajeActual.id);
    let favoritos = obtenerFavoritosStorage();
    const indice = favoritos.findIndex(f => Number(f.id) === id);

    if (indice !== -1) {
        favoritos.splice(indice, 1);
        guardarFavoritosStorage(favoritos);
        esFavoritoLocal = false;
        actualizarBotonFavorito();
        mostrarToast(`"${datosPersonajeActual.name}" removed from Favorites`, 'eliminar');
    } else {
        const nuevoFavorito = {
            id,
            nombre: datosPersonajeActual.name,
            estado: datosPersonajeActual.status || 'unknown',
            especie: datosPersonajeActual.species || 'Unknown',
            genero: datosPersonajeActual.gender || 'unknown',
            imagen: datosPersonajeActual.image,
            origen: datosPersonajeActual.origin?.name || 'Unknown',
            fechaGuardado: new Date().toISOString()
        };

        favoritos.unshift(nuevoFavorito);
        guardarFavoritosStorage(favoritos);
        esFavoritoLocal = true;
        actualizarBotonFavorito();
        mostrarToast(`⭐ "${datosPersonajeActual.name}" saved to Favorites`, 'exito');
    }
}

if (btnToggleFavorito) {
    btnToggleFavorito.addEventListener('click', alternarFavorito);
}

// ==========================================================================
// 2. CHAINED EXECUTION PIPELINE (WEB-9)
// Character (Service 1) ➔ Location (Service 2) ➔ Episodes (Service 3)
// ==========================================================================

async function cargarDetallePersonaje() {
    if (!personajeId) {
        mostrarError('No valid character identifier was specified in the URL.');
        return;
    }

    try {
        // STEP 1: Query Character Service (GET /api/character/{id})
        if (pasoPersonaje) pasoPersonaje.classList.add('activo');
        
        const res = await fetch(`${API_BASE}/character/${personajeId}`);
        if (!res.ok) {
            throw new Error(`Character not found (HTTP ${res.status})`);
        }

        const personaje = await res.json();
        datosPersonajeActual = personaje;
        renderizarFichaTecnica(personaje);
        verificarFavoritoLocal(personaje.id);

        // Hide main loading spinner once character baseline is ready
        cargandoDetalle.style.display = 'none';

        // STEP 2: Chained Join ➔ Location Service (GET /api/location/{id})
        await cargarUbicacionEncadenada(personaje.location, personaje.origin);

        // STEP 3: Chained Join ➔ Episode Service (GET /api/episode/{ids})
        if (personaje.episode && personaje.episode.length > 0) {
            await cargarEpisodios(personaje.episode);
        } else {
            if (pasoEpisodios) pasoEpisodios.classList.add('activo');
            contadorEpisodios.textContent = '0 episodes recorded';
            listaEpisodios.innerHTML = '<p style="color: #94a3b8; grid-column: 1 / -1;">No episodes recorded for this character.</p>';
            seccionEpisodios.style.display = 'block';
        }

    } catch (error) {
        console.error('Error executing chained API join:', error);
        mostrarError('Could not retrieve character information from the API services.');
    }
}

// ==========================================================================
// 3. SERVICE 1 RENDERING: CHARACTER TECHNICAL SPECIFICATIONS
// ==========================================================================

function renderizarFichaTecnica(personaje) {
    document.title = `${personaje.name} - Character Details (WEB-9)`;
    detalleNombre.textContent = personaje.name;
    detalleSubtitulo.textContent = 'Chained multi-service join: Character specs, planet details, and episode history';

    personajeFoto.src = personaje.image;
    personajeFoto.alt = `Portrait of ${personaje.name}`;
    personajeNombreH2.textContent = personaje.name;

    const estadoMin = (personaje.status || 'unknown').toLowerCase();
    let claseEstado = 'estado-unknown';
    let textoEstado = 'Unknown';
    if (estadoMin === 'alive') {
        claseEstado = 'estado-alive';
        textoEstado = 'Alive';
    } else if (estadoMin === 'dead') {
        claseEstado = 'estado-dead';
        textoEstado = 'Dead';
    }

    personajeEstadoBadge.className = `estado-flotante ${claseEstado}`;
    personajeEstadoBadge.textContent = textoEstado;

    personajeEspecie.textContent = personaje.species || 'Not specified';
    personajeGenero.textContent = traducirGenero(personaje.gender);
    personajeTipo.textContent = personaje.type ? personaje.type : 'None (Standard)';
    personajeOrigen.textContent = personaje.origin?.name || 'Unknown';
    personajeUbicacion.textContent = personaje.location?.name || 'Unknown';
    personajeTotalEpisodios.textContent = `${personaje.episode?.length || 0} episode(s)`;

    fichaTecnica.style.display = 'grid';
}

// ==========================================================================
// 4. SERVICE 2 QUERY: LOCATION SERVICE (GET /api/location/{id} - CHAINED)
// ==========================================================================

async function cargarUbicacionEncadenada(locationObj, originObj) {
    seccionUbicacion.style.display = 'block';
    
    // Determine target location URL (primary current location or origin fallback)
    const targetUrl = (locationObj && locationObj.url) ? locationObj.url : (originObj && originObj.url ? originObj.url : null);
    const locationName = (locationObj && locationObj.name) ? locationObj.name : (originObj && originObj.name ? originObj.name : 'Unknown');

    // If no API URL exists or name is unknown
    if (!targetUrl || locationName.toLowerCase() === 'unknown') {
        if (pasoUbicacion) pasoUbicacion.classList.add('activo');
        badgeUbicacionTipo.textContent = 'Unmapped Location';
        locContenidoGrilla.style.display = 'none';
        locMensajeVacio.style.display = 'block';
        return;
    }

    try {
        badgeUbicacionTipo.textContent = 'Querying Location API...';

        const res = await fetch(targetUrl);
        if (!res.ok) {
            throw new Error(`Location HTTP error: ${res.status}`);
        }

        const locData = await res.json();

        // Update pipeline step 2
        if (pasoUbicacion) pasoUbicacion.classList.add('activo');

        // Populate location specifications
        locNombre.textContent = locData.name || locationName;
        locTipo.textContent = locData.type || 'Standard';
        locDimension.textContent = locData.dimension || 'Unknown dimension';
        locResidentes.textContent = `${locData.residents ? locData.residents.length : 0} known resident(s)`;
        badgeUbicacionTipo.textContent = locData.type ? `Type: ${locData.type}` : 'Location Record';

        locContenidoGrilla.style.display = 'grid';
        locMensajeVacio.style.display = 'none';

    } catch (err) {
        console.warn('Could not query chained Location API:', err);
        if (pasoUbicacion) pasoUbicacion.classList.add('activo');
        badgeUbicacionTipo.textContent = 'Unavailable';
        locNombre.textContent = locationName;
        locTipo.textContent = 'Unknown';
        locDimension.textContent = 'Unknown';
        locResidentes.textContent = 'Data unavailable';
        locContenidoGrilla.style.display = 'grid';
        locMensajeVacio.style.display = 'none';
    }
}

// ==========================================================================
// 5. SERVICE 3 QUERY: EPISODE SERVICE (GET /api/episode/{ids} - CHAINED)
// ==========================================================================

async function cargarEpisodios(urlsEpisodios) {
    seccionEpisodios.style.display = 'block';
    contadorEpisodios.textContent = 'Consulting episodes...';
    listaEpisodios.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 2rem;">
            <div class="spinner"></div>
            <p style="color: #94a3b8; font-size: 0.9rem;">Fetching episode details from API...</p>
        </div>
    `;

    try {
        // Extract IDs from each URL (e.g., "https://rickandmortyapi.com/api/episode/1" -> "1")
        const ids = urlsEpisodios
            .map(url => url.split('/').filter(Boolean).pop())
            .filter(Boolean);

        if (ids.length === 0) {
            if (pasoEpisodios) pasoEpisodios.classList.add('activo');
            contadorEpisodios.textContent = '0 episodes recorded';
            listaEpisodios.innerHTML = '<p style="color: #94a3b8; grid-column: 1 / -1;">No episodes recorded for this character.</p>';
            return;
        }

        // Direct request to Service 3: comma-separated batch ID query
        const endpointUrl = `${API_BASE}/episode/${ids.join(',')}`;
        const respuesta = await fetch(endpointUrl);

        if (!respuesta.ok) {
            throw new Error(`HTTP Error fetching episodes: ${respuesta.status}`);
        }

        const data = await respuesta.json();
        const episodios = Array.isArray(data) ? data : [data];

        // Update pipeline step 3
        if (pasoEpisodios) pasoEpisodios.classList.add('activo');

        contadorEpisodios.textContent = `${episodios.length} episode(s) found`;
        renderizarListaEpisodios(episodios);

    } catch (error) {
        console.error('Error querying Service 3:', error);
        if (pasoEpisodios) pasoEpisodios.classList.add('activo');
        contadorEpisodios.textContent = 'Error loading';
        listaEpisodios.innerHTML = `
            <p style="color: #f87171; grid-column: 1 / -1;">
                Could not fetch episode details from the API service.
            </p>
        `;
    }
}

function renderizarListaEpisodios(episodios) {
    listaEpisodios.innerHTML = '';

    episodios.forEach(ep => {
        const item = document.createElement('div');
        item.classList.add('tarjeta-episodio');
        item.innerHTML = `
            <span class="episodio-codigo">${ep.episode}</span>
            <h4 class="episodio-titulo">${ep.name}</h4>
            <span class="episodio-fecha">Air date: ${ep.air_date || 'N/A'}</span>
        `;
        listaEpisodios.appendChild(item);
    });
}

function traducirGenero(genero) {
    const g = (genero || '').toLowerCase();
    switch (g) {
        case 'female': return 'Female';
        case 'male': return 'Male';
        case 'genderless': return 'Genderless';
        default: return 'Unknown';
    }
}

function mostrarError(mensaje) {
    cargandoDetalle.style.display = 'none';
    fichaTecnica.style.display = 'none';
    if (seccionUbicacion) seccionUbicacion.style.display = 'none';
    seccionEpisodios.style.display = 'none';

    detalleNombre.textContent = 'Error';
    detalleSubtitulo.textContent = mensaje;

    const errorContainer = document.createElement('div');
    errorContainer.className = 'estado-mensaje';
    errorContainer.innerHTML = `
        <p style="color: #ef4444; font-weight: 600;">${mensaje}</p>
        <a href="index.html" class="btn btn-secundario" style="margin-top: 1.5rem; display: inline-block;">
            &larr; Back to character catalog
        </a>
    `;
    document.getElementById('contenedor-detalle').appendChild(errorContainer);
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

// Initialize chained character detail loading
cargarDetallePersonaje();
