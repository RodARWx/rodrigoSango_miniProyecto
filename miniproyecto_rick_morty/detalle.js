// ==========================================================================
// VISTA DE DETALLE - FRONTEND CLIENT-SIDE (VANILLA JS PURO)
// Consumo directo de ENDPOINT 2 (Personaje) y ENDPOINT 3 (Episodios)
// + Persistencia en localStorage
// ==========================================================================

const API_BASE = 'https://rickandmortyapi.com/api';
const STORAGE_KEY_FAVORITOS = 'rick_morty_favoritos';

// Obtener el ID del personaje desde la URL (?id=...)
const urlParams = new URLSearchParams(window.location.search);
const personajeId = urlParams.get('id');

let datosPersonajeActual = null;
let esFavoritoLocal = false;

// Elementos del DOM
const detalleNombre = document.getElementById('detalle-nombre');
const detalleSubtitulo = document.getElementById('detalle-subtitulo');
const cargandoDetalle = document.getElementById('cargando-detalle');
const fichaTecnica = document.getElementById('ficha-tecnica');
const seccionEpisodios = document.getElementById('seccion-episodios');

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

const listaEpisodios = document.getElementById('lista-episodios');
const contadorEpisodios = document.getElementById('contador-episodios');
const toastContenedor = document.getElementById('toast-contenedor');

// ==========================================================================
// 1. GESTOR DE FAVORITOS EN LOCALSTORAGE
// ==========================================================================

function obtenerFavoritosStorage() {
    try {
        const data = localStorage.getItem(STORAGE_KEY_FAVORITOS);
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error('Error al leer favoritos desde localStorage:', error);
        return [];
    }
}

function guardarFavoritosStorage(favoritos) {
    try {
        localStorage.setItem(STORAGE_KEY_FAVORITOS, JSON.stringify(favoritos));
    } catch (error) {
        console.error('Error al guardar favoritos en localStorage:', error);
        mostrarToast('Error de almacenamiento en el navegador', 'eliminar');
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
        textoFavoritoDetalle.textContent = 'Guardado en Favoritos (Eliminar)';
    } else {
        btnToggleFavorito.classList.remove('es-favorito');
        iconoFavoritoDetalle.textContent = '☆';
        textoFavoritoDetalle.textContent = 'Guardar en Favoritos';
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
        mostrarToast(`"${datosPersonajeActual.name}" eliminado de Favoritos`, 'eliminar');
    } else {
        const nuevoFavorito = {
            id,
            nombre: datosPersonajeActual.name,
            estado: datosPersonajeActual.status || 'unknown',
            especie: datosPersonajeActual.species || 'Desconocida',
            genero: datosPersonajeActual.gender || 'unknown',
            imagen: datosPersonajeActual.image,
            origen: datosPersonajeActual.origin?.name || 'Desconocido',
            fechaGuardado: new Date().toISOString()
        };

        favoritos.unshift(nuevoFavorito);
        guardarFavoritosStorage(favoritos);
        esFavoritoLocal = true;
        actualizarBotonFavorito();
        mostrarToast(`⭐ "${datosPersonajeActual.name}" guardado en Favoritos`, 'exito');
    }
}

if (btnToggleFavorito) {
    btnToggleFavorito.addEventListener('click', alternarFavorito);
}

// ==========================================================================
// 2. CARGA DE DETALLES DEL PERSONAJE (ENDPOINT 2: GET /api/character/{id})
// ==========================================================================

async function cargarDetallePersonaje() {
    if (!personajeId) {
        mostrarError('No se especificó un identificador de personaje válido.');
        return;
    }

    try {
        // LLAMADA DIRECTA AL ENDPOINT 2 DE LA API EXTERNA
        const res = await fetch(`${API_BASE}/character/${personajeId}`);
        if (!res.ok) {
            throw new Error(`Personaje no encontrado (HTTP ${res.status})`);
        }

        const personaje = await res.json();
        datosPersonajeActual = personaje;
        renderizarFichaTecnica(personaje);

        // Verificar si este personaje ya está en favoritos de localStorage
        verificarFavoritoLocal(personaje.id);

        // LLAMADA AL ENDPOINT 3 para consultar la lista de episodios
        if (personaje.episode && personaje.episode.length > 0) {
            cargarEpisodios(personaje.episode);
        } else {
            contadorEpisodios.textContent = '0 episodios registrados';
            listaEpisodios.innerHTML = '<p style="color: #94a3b8;">No se registraron episodios para este personaje.</p>';
            seccionEpisodios.style.display = 'block';
        }

    } catch (error) {
        console.error('Error al consultar Endpoint 2:', error);
        mostrarError('No se pudo obtener la información del personaje desde la API.');
    }
}

// ==========================================================================
// 3. RENDERIZADO DE LA FICHA TÉCNICA
// ==========================================================================

function renderizarFichaTecnica(personaje) {
    document.title = `${personaje.name} - Detalle del Personaje`;
    detalleNombre.textContent = personaje.name;
    detalleSubtitulo.textContent = 'Ficha técnica detallada e historial de episodios en el multiverso';

    personajeFoto.src = personaje.image;
    personajeFoto.alt = `Retrato de ${personaje.name}`;
    personajeNombreH2.textContent = personaje.name;

    const estadoMin = (personaje.status || 'unknown').toLowerCase();
    let claseEstado = 'estado-unknown';
    let textoEstado = 'Desconocido';
    if (estadoMin === 'alive') {
        claseEstado = 'estado-alive';
        textoEstado = 'Vivo (Alive)';
    } else if (estadoMin === 'dead') {
        claseEstado = 'estado-dead';
        textoEstado = 'Muerto (Dead)';
    }

    personajeEstadoBadge.className = `estado-flotante ${claseEstado}`;
    personajeEstadoBadge.textContent = textoEstado;

    personajeEspecie.textContent = personaje.species || 'No especificada';
    personajeGenero.textContent = traducirGenero(personaje.gender);
    personajeTipo.textContent = personaje.type ? personaje.type : 'Ninguno (Estándar)';
    personajeOrigen.textContent = personaje.origin?.name || 'Desconocido';
    personajeUbicacion.textContent = personaje.location?.name || 'Desconocida';
    personajeTotalEpisodios.textContent = `${personaje.episode?.length || 0} episodio(s)`;

    cargandoDetalle.style.display = 'none';
    fichaTecnica.style.display = 'grid';
}

// ==========================================================================
// 4. CONSULTA DE EPISODIOS (ENDPOINT 3: GET /api/episode/{ids})
// ==========================================================================

async function cargarEpisodios(urlsEpisodios) {
    seccionEpisodios.style.display = 'block';
    contadorEpisodios.textContent = 'Consultando episodios...';
    listaEpisodios.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 2rem;">
            <div class="spinner"></div>
            <p style="color: #94a3b8; font-size: 0.9rem;">Obteniendo información de episodios desde la API...</p>
        </div>
    `;

    try {
        // Extraer los IDs de cada URL (ej. "https://rickandmortyapi.com/api/episode/1" -> "1")
        const ids = urlsEpisodios
            .map(url => url.split('/').filter(Boolean).pop())
            .filter(Boolean);

        if (ids.length === 0) return;

        // LLAMADA DIRECTA AL ENDPOINT 3: consulta múltiple por IDs separados por coma
        const endpointUrl = `${API_BASE}/episode/${ids.join(',')}`;
        const respuesta = await fetch(endpointUrl);

        if (!respuesta.ok) {
            throw new Error(`Error HTTP al consultar episodios: ${respuesta.status}`);
        }

        const data = await respuesta.json();
        const episodios = Array.isArray(data) ? data : [data];

        contadorEpisodios.textContent = `${episodios.length} episodio(s) encontrado(s)`;
        renderizarListaEpisodios(episodios);

    } catch (error) {
        console.error('Error al consultar Endpoint 3:', error);
        contadorEpisodios.textContent = 'Error al cargar';
        listaEpisodios.innerHTML = `
            <p style="color: #f87171; grid-column: 1 / -1;">
                No se pudieron obtener los detalles de los episodios desde la API.
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
            <span class="episodio-fecha">Emisión: ${ep.air_date || 'N/D'}</span>
        `;
        listaEpisodios.appendChild(item);
    });
}

function traducirGenero(genero) {
    const g = (genero || '').toLowerCase();
    switch (g) {
        case 'female': return 'Femenino';
        case 'male': return 'Masculino';
        case 'genderless': return 'Sin género';
        default: return 'Desconocido';
    }
}

function mostrarError(mensaje) {
    cargandoDetalle.style.display = 'none';
    fichaTecnica.style.display = 'none';
    seccionEpisodios.style.display = 'none';

    detalleNombre.textContent = 'Error';
    detalleSubtitulo.textContent = mensaje;

    const errorContainer = document.createElement('div');
    errorContainer.className = 'estado-mensaje';
    errorContainer.innerHTML = `
        <p style="color: #ef4444; font-weight: 600;">${mensaje}</p>
        <a href="index.html" class="btn btn-secundario" style="margin-top: 1.5rem; display: inline-block;">
            Volver al catálogo de personajes
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

// Iniciar carga de detalles
cargarDetallePersonaje();
