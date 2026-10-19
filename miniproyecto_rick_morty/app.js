// ==========================================================================
// APLICACIÓN RICK AND MORTY - FRONTEND FULL-STACK (VANILLA JS)
// Consumo de Endpoint 1 de la API externa + Persistencia en Base de Datos PostgreSQL
// ==========================================================================

const API_BASE = 'https://rickandmortyapi.com/api';
const BACKEND_API = '/api';

// Estado global de la aplicación
let vistaActual = 'catalogo'; // 'catalogo' o 'favoritos'
let paginaActual = 1;
let totalPaginas = 1;
let totalPersonajes = 0;
let terminoBusqueda = '';
let estadoSeleccionado = '';
let generoSeleccionado = '';

// Almacén en memoria de IDs favoritos en la Base de Datos
let idsFavoritos = new Set();

// Control de delay estricto de 4 segundos con animación natural
const DELAY_MS = 4000;
let temporizadorBusqueda = null;

// Elementos del DOM
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

const badgeServidor = document.getElementById('badge-servidor');
const textoServidor = document.getElementById('texto-servidor');
const toastContenedor = document.getElementById('toast-contenedor');

// ==========================================================================
// 1. VERIFICACIÓN DEL ESTADO DEL BACKEND Y BASE DE DATOS POSTGRESQL
// ==========================================================================
async function verificarEstadoBackend() {
    try {
        const respuesta = await fetch(`${BACKEND_API}/stats`);
        if (!respuesta.ok) throw new Error('Servidor no respondió');
        const data = await respuesta.json();

        if (data.postgresConectado) {
            textoServidor.textContent = '🐘 PostgreSQL Activo';
            badgeServidor.className = 'badge-servidor';
            badgeServidor.title = 'Conectado a servidor PostgreSQL';
        } else {
            textoServidor.textContent = '⚡ BD Local Activa';
            badgeServidor.className = 'badge-servidor';
            badgeServidor.title = 'Almacenamiento de respaldo activo';
        }

        // Cargar lista de favoritos desde la base de datos
        await sincronizarFavoritosDesdeBD();

    } catch (error) {
        console.warn('Backend no disponible o ejecutándose en modo estático:', error.message);
        textoServidor.textContent = '⚠️ Modo Estático';
        badgeServidor.className = 'badge-servidor desconectado';
    }
}

async function sincronizarFavoritosDesdeBD() {
    try {
        const res = await fetch(`${BACKEND_API}/favoritos`);
        if (!res.ok) return;
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
            idsFavoritos = new Set(json.data.map(f => f.id));
            actualizarContadoresFavoritos(idsFavoritos.size);
        }
    } catch (err) {
        console.warn('No se pudieron sincronizar favoritos de la BD:', err);
    }
}

function actualizarContadoresFavoritos(total) {
    if (contadorNavFav) contadorNavFav.textContent = total;
    if (conteoTabFav) conteoTabFav.textContent = total;
}

// ==========================================================================
// 2. CONSULTA DE PERSONAJES (ENDPOINT 1: GET /api/character/?...)
// ==========================================================================
async function consultarPersonajes(pagina = 1) {
    if (vistaActual !== 'catalogo') return;

    cancelarTemporizador();
    paginaActual = pagina;
    mostrarCirculoCarga(true);
    badgeContador.textContent = 'Consultando API...';

    gridPersonajes.innerHTML = `
        <div class="estado-mensaje" style="grid-column: 1 / -1;">
            <div class="spinner"></div>
            <p>Obteniendo personajes desde el Endpoint 1 de la API...</p>
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

        // LLAMADA EXCLUSIVA AL ENDPOINT 1 DE LA API EXTERNA
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
        try {
            renderizarTarjetas(data.results);
        } catch (renderError) {
            console.error('Error al renderizar tarjetas:', renderError);
        }

    } catch (error) {
        console.error('Error al consultar Endpoint 1 de la API:', error);
        badgeContador.textContent = 'Error de conexión';
        gridPersonajes.innerHTML = `
            <div class="estado-mensaje" style="grid-column: 1 / -1;">
                <p>No se pudo conectar con la API de Rick and Morty.</p>
                <small style="color: #64748b; margin-top: 0.5rem; display: block;">
                    Verifica tu conexión a internet o intenta nuevamente.
                </small>
            </div>
        `;
    } finally {
        mostrarCirculoCarga(false);
    }
}

// ==========================================================================
// 3. CONSULTA DE FAVORITOS ALMACENADOS EN BASE DE DATOS (POSTGRESQL)
// ==========================================================================
async function consultarFavoritosBD() {
    mostrarCirculoCarga(true);
    badgeContador.textContent = 'Consultando base de datos...';
    paginacionContenedor.style.display = 'none';

    gridPersonajes.innerHTML = `
        <div class="estado-mensaje" style="grid-column: 1 / -1;">
            <div class="spinner"></div>
            <p>Cargando favoritos almacenados en PostgreSQL...</p>
        </div>
    `;

    try {
        const respuesta = await fetch(`${BACKEND_API}/favoritos`);
        if (!respuesta.ok) throw new Error('Error al consultar el backend');
        const resultado = await respuesta.json();

        const lista = resultado.data || [];
        idsFavoritos = new Set(lista.map(f => f.id));
        actualizarContadoresFavoritos(lista.length);

        badgeContador.textContent = `${lista.length} guardados en BD (${resultado.motor})`;

        if (lista.length === 0) {
            gridPersonajes.innerHTML = `
                <div class="estado-mensaje" style="grid-column: 1 / -1;">
                    <p>No tienes personajes guardados en la base de datos todavía.</p>
                    <small style="color: #64748b; margin-top: 0.5rem; display: block;">
                        Explora el catálogo y pulsa la estrella ⭐ en cualquier personaje para persistirlo en PostgreSQL.
                    </small>
                    <button type="button" class="btn btn-buscar" style="margin-top: 1rem;" onclick="activarVistaCatalogo()">
                        Explorar Catálogo de Personajes
                    </button>
                </div>
            `;
            return;
        }

        renderizarTarjetas(lista);

    } catch (error) {
        console.error('Error al cargar favoritos de la BD:', error);
        gridPersonajes.innerHTML = `
            <div class="estado-mensaje" style="grid-column: 1 / -1;">
                <p>Error al conectar con la base de datos.</p>
                <small style="color: #64748b; margin-top: 0.5rem; display: block;">
                    Asegúrate de que el backend esté ejecutándose con "npm start".
                </small>
            </div>
        `;
    } finally {
        mostrarCirculoCarga(false);
    }
}

// ==========================================================================
// 4. RENDERIZADO DE TARJETAS (CSS GRID RESPONSIVO)
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
        tarjeta.setAttribute('aria-label', `Ver detalles de ${personaje.name || personaje.nombre}`);

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

        const esFav = (idsFavoritos instanceof Set) ? idsFavoritos.has(personaje.id) : false;

        tarjeta.innerHTML = `
            <div class="tarjeta-foto-envoltura">
                <img src="${imagen}" alt="Retrato de ${nombre}" loading="lazy">
                
                <!-- Botón de estrella para guardar/eliminar en PostgreSQL -->
                <button type="button" class="btn-favorito-tarjeta ${esFav ? 'es-favorito' : ''}" 
                    title="${esFav ? 'Eliminar de favoritos en BD' : 'Guardar en PostgreSQL'}" 
                    aria-label="Marcar como favorito"
                    data-id="${personaje.id}">
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
                    <span>Ficha técnica (Endpoint 2 y 3)</span>
                    <span>&rarr;</span>
                </div>
            </div>
        `;

        // Evento para el botón de favoritos en base de datos
        const btnFav = tarjeta.querySelector('.btn-favorito-tarjeta');
        btnFav.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleFavorito({
                id: personaje.id,
                nombre,
                estado,
                especie,
                genero,
                imagen,
                origen
            }, btnFav);
        });

        // Navegación al hacer clic en la tarjeta o presionar Enter
        tarjeta.addEventListener('click', () => irADetalle(personaje.id));
        tarjeta.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') irADetalle(personaje.id);
        });

        gridPersonajes.appendChild(tarjeta);
    });
}

function renderizarSinResultados() {
    badgeContador.textContent = '0 personajes encontrados';
    infoPaginacion.textContent = 'Página 0 de 0';
    btnPaginaAnterior.disabled = true;
    btnPaginaSiguiente.disabled = true;

    gridPersonajes.innerHTML = `
        <div class="estado-mensaje" style="grid-column: 1 / -1;">
            <p>No se encontraron personajes que coincidan con la búsqueda.</p>
            <small style="color: #64748b; margin-top: 0.5rem; display: block;">
                Intenta con otro término o limpia los filtros de búsqueda.
            </small>
        </div>
    `;
}

// ==========================================================================
// 5. GESTIÓN DE FAVORITOS EN BASE DE DATOS POSTGRESQL (PERSISTENCIA FULL-STACK)
// ==========================================================================
async function toggleFavorito(personaje, btnElement) {
    const id = personaje.id;
    const esFavActualmente = idsFavoritos.has(id);

    try {
        if (esFavActualmente) {
            // Eliminar de PostgreSQL
            const res = await fetch(`${BACKEND_API}/favoritos/${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Error al eliminar');

            idsFavoritos.delete(id);
            btnElement.classList.remove('es-favorito');
            btnElement.innerHTML = '☆';
            btnElement.title = 'Guardar en PostgreSQL';
            mostrarToast(`"${personaje.nombre}" eliminado de la Base de Datos`, 'eliminar');

            if (vistaActual === 'favoritos') {
                consultarFavoritosBD();
            }
        } else {
            // Guardar en PostgreSQL
            const res = await fetch(`${BACKEND_API}/favoritos`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(personaje)
            });
            if (!res.ok) throw new Error('Error al guardar');

            idsFavoritos.add(id);
            btnElement.classList.add('es-favorito');
            btnElement.innerHTML = '★';
            btnElement.title = 'Eliminar de favoritos en BD';
            mostrarToast(`⭐ "${personaje.nombre}" guardado en PostgreSQL`, 'exito');
        }

        actualizarContadoresFavoritos(idsFavoritos.size);

    } catch (err) {
        console.error('Error al actualizar favorito en backend:', err);
        mostrarToast('Error al conectar con la base de datos', 'eliminar');
    }
}

// ==========================================================================
// 6. BÚSQUEDA NATURAL (CON CÍRCULO DE CARGA Y DEBOUNCE DINÁMICO)
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
        if (vistaActual === 'catalogo') consultarPersonajes(1);
        else consultarFavoritosBD();
        return;
    }

    // Activar círculo de carga natural rotatorio (sin texto ni segundos en pantalla)
    mostrarCirculoCarga(true);
    badgeContador.textContent = 'Buscando personajes...';

    // Disparo estricto a los 4000 ms exactos
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

async function filtrarFavoritosLocal() {
    mostrarCirculoCarga(true);
    try {
        const respuesta = await fetch(`${BACKEND_API}/favoritos`);
        const json = await respuesta.json();
        let lista = json.data || [];

        if (terminoBusqueda) {
            lista = lista.filter(p => (p.nombre || '').toLowerCase().includes(terminoBusqueda.toLowerCase()));
        }
        if (estadoSeleccionado) {
            lista = lista.filter(p => (p.estado || '').toLowerCase() === estadoSeleccionado.toLowerCase());
        }
        if (generoSeleccionado) {
            lista = lista.filter(p => (p.genero || '').toLowerCase() === generoSeleccionado.toLowerCase());
        }

        badgeContador.textContent = `${lista.length} coincidencia(s) en BD`;
        renderizarTarjetas(lista);
    } finally {
        mostrarCirculoCarga(false);
    }
}

// Eventos de búsqueda
inputBusqueda.addEventListener('input', manejarEntradaBusqueda);
inputBusqueda.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        ejecutarBusquedaInmediata();
    }
});

// Filtros
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
        consultarFavoritosBD();
    }
});

// Paginación
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
    badgeContador.textContent = `${totalPersonajes} personajes en catálogo (API)`;
    infoPaginacion.textContent = `Página ${paginaActual} de ${totalPaginas}`;
    btnPaginaAnterior.disabled = (paginaActual <= 1);
    btnPaginaSiguiente.disabled = (paginaActual >= totalPaginas);
    paginacionContenedor.style.display = 'flex';
}

// ==========================================================================
// 7. CONTROL DE PESTAÑAS (CATÁLOGO vs FAVORITOS)
// ==========================================================================
function activarVistaCatalogo() {
    vistaActual = 'catalogo';
    tabCatalogo.classList.add('activo');
    tabFavoritos.classList.remove('activo');
    navBtnCatalogo.classList.add('activo');
    navBtnFavoritos.classList.remove('activo');

    tituloVista.textContent = 'Explorar Personajes de la Serie (Endpoint 1)';
    paginacionContenedor.style.display = 'flex';
    consultarPersonajes(1);
}

function activarVistaFavoritos() {
    vistaActual = 'favoritos';
    tabFavoritos.classList.add('activo');
    tabCatalogo.classList.remove('activo');
    navBtnFavoritos.classList.add('activo');
    navBtnCatalogo.classList.remove('activo');

    tituloVista.textContent = 'Personajes Guardados en PostgreSQL';
    consultarFavoritosBD();
}

tabCatalogo.addEventListener('click', activarVistaCatalogo);
tabFavoritos.addEventListener('click', activarVistaFavoritos);
navBtnCatalogo.addEventListener('click', activarVistaCatalogo);
navBtnFavoritos.addEventListener('click', activarVistaFavoritos);

// ==========================================================================
// 8. UTILIDADES
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
// 9. INICIALIZACIÓN
// ==========================================================================
verificarEstadoBackend();
consultarPersonajes(1);
