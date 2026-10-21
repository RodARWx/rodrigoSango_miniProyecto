// ==========================================================================
// CONFIGURATION & GLOBAL STATE (Designed for scalability)
// ==========================================================================
const API_URL = 'http://localhost:8080/api/estudiantes';

// Preset Avatars Catalog (clean, consistent designs)
const AVATARES_PREDETERMINADOS = [
    { id: 'av-1', url: 'https://api.dicebear.com/7.x/personas/svg?seed=Ana&backgroundColor=b6e3f4', label: 'Estudiante 1' },
    { id: 'av-2', url: 'https://api.dicebear.com/7.x/personas/svg?seed=Carlos&backgroundColor=c0aede', label: 'Estudiante 2' },
    { id: 'av-3', url: 'https://api.dicebear.com/7.x/personas/svg?seed=Sofia&backgroundColor=d1d4f9', label: 'Estudiante 3' },
    { id: 'av-4', url: 'https://api.dicebear.com/7.x/personas/svg?seed=Mateo&backgroundColor=ffd5dc', label: 'Estudiante 4' },
    { id: 'av-5', url: 'https://api.dicebear.com/7.x/personas/svg?seed=Valeria&backgroundColor=ffdfbf', label: 'Estudiante 5' },
    { id: 'av-6', url: 'https://api.dicebear.com/7.x/personas/svg?seed=David&backgroundColor=c0aede', label: 'Estudiante 6' },
    { id: 'av-7', url: 'https://api.dicebear.com/7.x/personas/svg?seed=Camila&backgroundColor=b6e3f4', label: 'Estudiante 7' },
    { id: 'av-8', url: 'https://api.dicebear.com/7.x/personas/svg?seed=Andres&backgroundColor=d1d4f9', label: 'Estudiante 8' }
];

// Pagination and server-side filter state
let paginaActual = 0;
let totalPaginas = 1;
let totalElementos = 0;
let tamanoPagina = 9;
let terminoBusqueda = '';
let cursoSeleccionado = '';
let ordenSeleccionado = 'id,desc';
let debounceTimer = null;
let cacheEstudiantes = []; // In-memory cache for instant autocomplete (0ms)

// DOM Elements - Search, Filters, and Pagination
const listaContenedor = document.getElementById('lista-estudiantes');
const inputBusqueda = document.getElementById('input-busqueda');
const listaSugerencias = document.getElementById('lista-sugerencias');
const badgeContador = document.getElementById('contador-resultados');
const filtroCurso = document.getElementById('filtro-curso');
const ordenResultados = document.getElementById('orden-resultados');
const tamanoPaginaSelect = document.getElementById('tamano-pagina');
const btnPaginaAnterior = document.getElementById('btn-pagina-anterior');
const btnPaginaSiguiente = document.getElementById('btn-pagina-siguiente');
const infoPaginacion = document.getElementById('info-paginacion');

// DOM Elements - Tab Navigation
const tabConsultas = document.getElementById('tab-consultas');
const tabRegistro = document.getElementById('tab-registro');
const vistaConsultas = document.getElementById('vista-consultas');
const vistaRegistro = document.getElementById('vista-registro');
const tituloHero = document.getElementById('titulo-hero');
const formularioRegistro = document.getElementById('formulario-estudiante');

// DOM Elements - Edit Modal (PUT)
const modalEdicion = document.getElementById('modal-edicion');
const modalBackdrop = document.getElementById('modal-backdrop');
const btnCerrarModal = document.getElementById('btn-cerrar-modal');
const btnCancelarEdicion = document.getElementById('btn-cancelar-edicion');
const formularioEdicion = document.getElementById('formulario-edicion');

// ==========================================================================
// UTILITY: THROTTLE CONTROLLER (RATE LIMITING FOR USER ACTIONS)
// ==========================================================================
/**
 * Leading-edge throttle utility for UI button interactions and form submissions.
 * Fires immediately on the first trigger and ignores subsequent events
 * until the cooldown window has elapsed, preventing duplicate requests and server overload.
 *
 * @param {Function} func - Callback function to throttle.
 * @param {number} cooldownMs - Minimum elapsed milliseconds between allowed executions.
 * @returns {Function} Throttled callback.
 */
function throttleLeading(func, cooldownMs = 400) {
    let lastExecuted = 0;
    return function (...args) {
        const now = Date.now();
        if (now - lastExecuted >= cooldownMs) {
            lastExecuted = now;
            return func.apply(this, args);
        }
    };
}

// ==========================================================================
// 1. COURSE LOADING & DATA PRELOADING
// ==========================================================================
async function cargarCursos() {
    try {
        const respuesta = await fetch(`${API_URL}/cursos`);
        if (!respuesta.ok) return;

        const cursos = await respuesta.json();
        const valorActual = filtroCurso.value;

        filtroCurso.innerHTML = '<option value="">Todos los cursos</option>';
        cursos.forEach(curso => {
            if (curso && curso.trim() !== '') {
                const option = document.createElement('option');
                option.value = curso;
                option.textContent = curso;
                if (curso === valorActual) option.selected = true;
                filtroCurso.appendChild(option);
            }
        });
    } catch (error) {
        console.error('Error al cargar la lista de cursos:', error);
    }
}

async function precargarEstudiantes() {
    try {
        const respuesta = await fetch(`${API_URL}/todos`);
        if (respuesta.ok) {
            const data = await respuesta.json();
            if (Array.isArray(data)) {
                cacheEstudiantes = data;
                return;
            }
        }
    } catch (_) {}

    try {
        const respuesta = await fetch(`${API_URL}?size=100`);
        if (respuesta.ok) {
            const data = await respuesta.json();
            cacheEstudiantes = data.content || (Array.isArray(data) ? data : []);
        }
    } catch (_) {}
}

// ==========================================================================
// 2. FETCH STUDENTS WITH PAGINATION AND SERVER-SIDE FILTERS
// ==========================================================================
async function obtenerEstudiantes(pagina = 0) {
    try {
        badgeContador.textContent = 'Cargando registros...';

        const params = new URLSearchParams({
            page: pagina,
            size: tamanoPagina,
            sort: ordenSeleccionado
        });

        if (terminoBusqueda && terminoBusqueda.trim() !== '') {
            params.append('buscar', terminoBusqueda.trim());
        }

        if (cursoSeleccionado && cursoSeleccionado.trim() !== '') {
            params.append('curso', cursoSeleccionado.trim());
        }

        const respuesta = await fetch(`${API_URL}?${params.toString()}`);
        if (!respuesta.ok) {
            throw new Error(`Error HTTP: ${respuesta.status}`);
        }

        const data = await respuesta.json();

        // Support both Spring's Page<Estudiante> and List<Estudiante> (backwards compatibility)
        let estudiantes = [];
        if (data.content !== undefined) {
            estudiantes = data.content;
            paginaActual = data.number;
            totalPaginas = data.totalPages;
            totalElementos = data.totalElements;
        } else if (Array.isArray(data)) {
            let filtrados = data;

            if (terminoBusqueda && terminoBusqueda.trim() !== '') {
                const term = terminoBusqueda.toLowerCase().trim();
                filtrados = filtrados.filter(est =>
                    (est.nombre && est.nombre.toLowerCase().includes(term)) ||
                    (est.curso && est.curso.toLowerCase().includes(term)) ||
                    (est.correo && est.correo.toLowerCase().includes(term))
                );
            }

            if (cursoSeleccionado && cursoSeleccionado.trim() !== '') {
                filtrados = filtrados.filter(est => est.curso === cursoSeleccionado.trim());
            }

            if (ordenSeleccionado === 'nombre,asc') {
                filtrados.sort((a, b) => (a.nombre || '').localeCompare(b.nombre || ''));
            } else if (ordenSeleccionado === 'nombre,desc') {
                filtrados.sort((a, b) => (b.nombre || '').localeCompare(a.nombre || ''));
            } else if (ordenSeleccionado === 'curso,asc') {
                filtrados.sort((a, b) => (a.curso || '').localeCompare(b.curso || ''));
            } else {
                filtrados.sort((a, b) => (b.id || 0) - (a.id || 0));
            }

            totalElementos = filtrados.length;
            totalPaginas = Math.ceil(totalElementos / tamanoPagina) || 1;
            paginaActual = Math.min(pagina, Math.max(0, totalPaginas - 1));
            estudiantes = filtrados.slice(paginaActual * tamanoPagina, (paginaActual + 1) * tamanoPagina);
        }

        // Keep enriched local cache for instant autocomplete
        estudiantes.forEach(est => {
            const idx = cacheEstudiantes.findIndex(c => c.id === est.id);
            if (idx >= 0) {
                cacheEstudiantes[idx] = est;
            } else {
                cacheEstudiantes.push(est);
            }
        });

        actualizarControlesPaginacion();
        renderizarTarjetas(estudiantes);

    } catch (error) {
        console.error('Error al consultar estudiantes:', error);
        badgeContador.textContent = 'Error al conectar con el servidor';
        listaContenedor.innerHTML = `
            <div class="sin-resultados">
                <p>No se pudo conectar con el servidor (Spring Boot).</p>
                <small style="color: #64748b; margin-top: 0.5rem; display: block;">
                    Verifica que el servicio esté corriendo en http://localhost:8080
                </small>
            </div>
        `;
        if (infoPaginacion) infoPaginacion.textContent = 'Página 0 de 0';
        if (btnPaginaAnterior) btnPaginaAnterior.disabled = true;
        if (btnPaginaSiguiente) btnPaginaSiguiente.disabled = true;
    }
}

function actualizarControlesPaginacion() {
    badgeContador.textContent = `${totalElementos} estudiante(s) encontrado(s)`;
    infoPaginacion.textContent = totalPaginas === 0 
        ? 'Página 0 de 0' 
        : `Página ${paginaActual + 1} de ${totalPaginas}`;

    btnPaginaAnterior.disabled = (paginaActual <= 0);
    btnPaginaSiguiente.disabled = (paginaActual >= totalPaginas - 1 || totalPaginas === 0);
}

// ==========================================================================
// 3. STUDENT CARDS RENDERING
// ==========================================================================
function renderizarTarjetas(estudiantes) {
    listaContenedor.innerHTML = '';

    if (!estudiantes || estudiantes.length === 0) {
        listaContenedor.innerHTML = `
            <div class="sin-resultados">
                <p>No se encontraron estudiantes que coincidan con los filtros aplicados.</p>
            </div>
        `;
        return;
    }

    estudiantes.forEach(estudiante => {
        const card = document.createElement('article');
        card.classList.add('tarjeta-estudiante');

        // Avatar fallback if no custom image is specified
        const imagenUrl = (estudiante.imageUrl && estudiante.imageUrl.trim() !== '')
            ? estudiante.imageUrl
            : `https://api.dicebear.com/7.x/personas/svg?seed=${encodeURIComponent(estudiante.nombre || 'estudiante')}&backgroundColor=b6e3f4`;

        card.innerHTML = `
            <div class="tarjeta-superior">
                <div class="tarjeta-foto-contenedor">
                    <img src="${imagenUrl}" alt="Foto de ${estudiante.nombre || 'Estudiante'}">
                </div>
                <div class="tarjeta-info">
                    <h3 class="tarjeta-nombre" title="${estudiante.nombre}">${estudiante.nombre}</h3>
                    <span class="curso-badge" title="${estudiante.curso}">${estudiante.curso}</span>
                    <p class="correo-texto" title="${estudiante.correo}">${estudiante.correo}</p>
                </div>
            </div>
            <div class="tarjeta-cuerpo">
                <p class="tarjeta-desc">${estudiante.descripcion || 'Sin descripción disponible.'}</p>
            </div>
            <div class="tarjeta-acciones">
                <button class="btn-editar" onclick="abrirModalEdicion(${estudiante.id})">Editar</button>
                <button class="btn-eliminar" onclick="eliminarEstudiante(${estudiante.id})">Eliminar</button>
            </div>
        `;

        listaContenedor.appendChild(card);
    });
}

// ==========================================================================
// 4. REAL-TIME SEARCH WITH INSTANT SUGGESTIONS AND DEBOUNCE
// ==========================================================================
function resaltarTexto(texto, termino) {
    if (!termino || !texto) return texto || '';
    const seguro = termino.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${seguro})`, 'gi');
    return texto.replace(regex, '<strong>$1</strong>');
}

function mostrarSugerencias(sugerencias, termino) {
    if (!sugerencias || sugerencias.length === 0) {
        cerrarSugerencias();
        return;
    }

    listaSugerencias.classList.add('abierto');
    listaSugerencias.innerHTML = sugerencias.slice(0, 6).map(est => `
        <li class="sugerencia-item" onmousedown="seleccionarSugerencia('${(est.nombre || '').replace(/'/g, "\\'")}')">
            <span>${resaltarTexto(est.nombre, termino)}</span>
            <small>${resaltarTexto(est.curso, termino)}</small>
        </li>
    `).join('');
}

function buscarSugerenciasLocales(termino) {
    if (!termino) return [];
    const termMin = termino.toLowerCase();
    return cacheEstudiantes.filter(est =>
        (est.nombre && est.nombre.toLowerCase().includes(termMin)) ||
        (est.curso && est.curso.toLowerCase().includes(termMin)) ||
        (est.correo && est.correo.toLowerCase().includes(termMin))
    );
}

inputBusqueda.addEventListener('input', (e) => {
    const texto = e.target.value.trim();

    if (texto === '') {
        cerrarSugerencias();
        terminoBusqueda = '';
        clearTimeout(debounceTimer);
        obtenerEstudiantes(0);
        return;
    }

    // Step 1: Display suggestions immediately at 0ms
    const coincidenciasLocales = buscarSugerenciasLocales(texto);
    if (coincidenciasLocales.length > 0) {
        mostrarSugerencias(coincidenciasLocales, texto);
    } else {
        cerrarSugerencias();
    }

    // Step 2: Enrich from the server concurrently
    fetch(`${API_URL}/sugerencias?q=${encodeURIComponent(texto)}`)
        .then(res => res.ok ? res.json() : null)
        .then(sugerenciasServidor => {
            if (Array.isArray(sugerenciasServidor) && sugerenciasServidor.length > 0) {
                sugerenciasServidor.forEach(s => {
                    if (!cacheEstudiantes.some(c => c.id === s.id)) cacheEstudiantes.push(s);
                });
                mostrarSugerencias(sugerenciasServidor, texto);
            }
        })
        .catch(() => {});

    // Step 3: Debounce card grid filtering
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
        terminoBusqueda = texto;
        obtenerEstudiantes(0);
    }, 250);
});

inputBusqueda.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        const texto = inputBusqueda.value.trim();
        terminoBusqueda = texto;
        cerrarSugerencias();
        clearTimeout(debounceTimer);
        obtenerEstudiantes(0);
    }
});

function seleccionarSugerencia(nombre) {
    inputBusqueda.value = nombre;
    terminoBusqueda = (nombre || '').trim();
    cerrarSugerencias();
    clearTimeout(debounceTimer);

    // Instant in-memory visual filtering
    if (cacheEstudiantes.length > 0) {
        const term = terminoBusqueda.toLowerCase();
        let filtrados = cacheEstudiantes.filter(est =>
            (est.nombre && est.nombre.toLowerCase().includes(term)) ||
            (est.curso && est.curso.toLowerCase().includes(term)) ||
            (est.correo && est.correo.toLowerCase().includes(term))
        );

        if (cursoSeleccionado) {
            filtrados = filtrados.filter(est => est.curso === cursoSeleccionado);
        }

        totalElementos = filtrados.length;
        totalPaginas = Math.ceil(totalElementos / tamanoPagina) || 1;
        paginaActual = 0;
        actualizarControlesPaginacion();
        renderizarTarjetas(filtrados.slice(0, tamanoPagina));
    }

    obtenerEstudiantes(0);
}

function cerrarSugerencias() {
    listaSugerencias.classList.remove('abierto');
    listaSugerencias.innerHTML = '';
}

document.addEventListener('click', (e) => {
    if (!e.target.closest('.buscador-envoltura')) {
        cerrarSugerencias();
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        cerrarSugerencias();
        cerrarModalEdicion();
    }
});

// ==========================================================================
// 5. FILTERS, SORTING, AND PAGINATION
// ==========================================================================
filtroCurso.addEventListener('change', (e) => {
    cursoSeleccionado = e.target.value;
    obtenerEstudiantes(0);
});

ordenResultados.addEventListener('change', (e) => {
    ordenSeleccionado = e.target.value;
    obtenerEstudiantes(0);
});

tamanoPaginaSelect.addEventListener('change', (e) => {
    tamanoPagina = parseInt(e.target.value, 10);
    obtenerEstudiantes(0);
});

// Pagination event listeners (throttled to 400ms to prevent spamming backend page queries)
btnPaginaAnterior.addEventListener('click', throttleLeading(() => {
    if (paginaActual > 0) {
        obtenerEstudiantes(paginaActual - 1);
    }
}, 400));

btnPaginaSiguiente.addEventListener('click', throttleLeading(() => {
    if (paginaActual < totalPaginas - 1) {
        obtenerEstudiantes(paginaActual + 1);
    }
}, 400));

// ==========================================================================
// 6. INTERACTIVE PRESET AVATARS SELECTOR
// ==========================================================================
function configurarSelectorAvatares(contenedorId, inputUrlId, wrapUrlId, toggleBtnId, valorInicial = '') {
    const contenedor = document.getElementById(contenedorId);
    const inputUrl = document.getElementById(inputUrlId);
    const wrapUrl = document.getElementById(wrapUrlId);
    const btnToggle = document.getElementById(toggleBtnId);

    if (!contenedor || !inputUrl) return;

    contenedor.innerHTML = '';
    const avatarPorDefecto = valorInicial || AVATARES_PREDETERMINADOS[0].url;
    inputUrl.value = avatarPorDefecto;

    let esUrlPersonalizada = true;

    AVATARES_PREDETERMINADOS.forEach((avatar) => {
        const item = document.createElement('div');
        item.classList.add('avatar-opcion');
        item.setAttribute('role', 'radio');
        item.setAttribute('aria-label', avatar.label);

        const img = document.createElement('img');
        img.src = avatar.url;
        img.alt = avatar.label;

        if (avatar.url === avatarPorDefecto) {
            item.classList.add('seleccionado');
            item.setAttribute('aria-checked', 'true');
            esUrlPersonalizada = false;
        } else {
            item.setAttribute('aria-checked', 'false');
        }

        item.addEventListener('click', () => {
            contenedor.querySelectorAll('.avatar-opcion').forEach(el => {
                el.classList.remove('seleccionado');
                el.setAttribute('aria-checked', 'false');
            });
            item.classList.add('seleccionado');
            item.setAttribute('aria-checked', 'true');

            inputUrl.value = avatar.url;
            limpiarErrorCampo(inputUrl);

            // Hide custom URL input field if open
            if (wrapUrl) wrapUrl.style.display = 'none';
        });

        item.appendChild(img);
        contenedor.appendChild(item);
    });

    // If initial image was a custom external URL, reveal input field
    if (esUrlPersonalizada && valorInicial && valorInicial.trim() !== '') {
        if (wrapUrl) wrapUrl.style.display = 'block';
    }

    if (btnToggle && wrapUrl) {
        btnToggle.onclick = () => {
            const visible = wrapUrl.style.display === 'block';
            wrapUrl.style.display = visible ? 'none' : 'block';
            if (!visible) inputUrl.focus();
        };
    }

    inputUrl.oninput = () => {
        const urlEscrita = inputUrl.value.trim();
        let coincidencia = false;

        contenedor.querySelectorAll('.avatar-opcion').forEach((el, index) => {
            if (AVATARES_PREDETERMINADOS[index].url === urlEscrita) {
                el.classList.add('seleccionado');
                el.setAttribute('aria-checked', 'true');
                coincidencia = true;
            } else {
                el.classList.remove('seleccionado');
                el.setAttribute('aria-checked', 'false');
            }
        });

        if (!coincidencia) {
            contenedor.querySelectorAll('.avatar-opcion').forEach(el => {
                el.classList.remove('seleccionado');
                el.setAttribute('aria-checked', 'false');
            });
        }
    };
}

// ==========================================================================
// 7. REAL-TIME VALIDATION ENGINE
// ==========================================================================
function validarNombre(valor) {
    if (!valor || valor.trim() === '') return 'El nombre completo es obligatorio.';
    const v = valor.trim();
    if (v.length < 3) return 'El nombre debe contener al menos 3 caracteres.';
    if (v.length > 100) return 'El nombre no puede exceder 100 caracteres.';
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/.test(v)) {
        return 'El nombre solo puede contener letras y espacios.';
    }
    return '';
}

function validarCorreo(valor) {
    if (!valor || valor.trim() === '') return 'El correo electrónico es obligatorio.';
    const v = valor.trim();
    const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!regexEmail.test(v)) return 'Ingresa un correo electrónico válido (ej. usuario@uce.edu.ec).';
    return '';
}

function validarCurso(valor) {
    if (!valor || valor.trim() === '') return 'El curso o paralelo es obligatorio.';
    const v = valor.trim();
    if (v.length < 3) return 'El curso debe contener al menos 3 caracteres.';
    if (v.length > 100) return 'El curso no puede exceder 100 caracteres.';
    return '';
}

function validarDescripcion(valor) {
    if (valor && valor.length > 500) return 'La descripción no puede superar los 500 caracteres.';
    return '';
}

function validarImageUrl(valor) {
    if (valor && valor.trim() !== '') {
        const v = valor.trim();
        if (v.length > 500) return 'La URL es demasiado extensa (máx. 500 caracteres).';
        if (!v.startsWith('http://') && !v.startsWith('https://')) {
            return 'La URL debe comenzar con http:// o https://';
        }
    }
    return '';
}

function aplicarEstadoValidacion(inputEl, mensajeError) {
    if (!inputEl) return;
    const errorEl = document.getElementById(`error-${inputEl.id}`);

    if (mensajeError) {
        inputEl.classList.add('campo-invalido');
        inputEl.classList.remove('campo-valido');
        if (errorEl) errorEl.textContent = mensajeError;
    } else {
        inputEl.classList.remove('campo-invalido');
        inputEl.classList.add('campo-valido');
        if (errorEl) errorEl.textContent = '';
    }
}

function limpiarErrorCampo(inputEl) {
    if (!inputEl) return;
    inputEl.classList.remove('campo-invalido', 'campo-valido');
    const errorEl = document.getElementById(`error-${inputEl.id}`);
    if (errorEl) errorEl.textContent = '';
}

function configurarValidacionesEnVivo(formId, prefijo = '') {
    const inputNom = document.getElementById(prefijo ? `${prefijo}-nombre` : 'nombre');
    const inputCor = document.getElementById(prefijo ? `${prefijo}-correo` : 'correo');
    const inputCur = document.getElementById(prefijo ? `${prefijo}-curso` : 'curso');
    const inputImg = document.getElementById(prefijo ? `${prefijo}-imageUrl` : 'imageUrl');
    const inputDes = document.getElementById(prefijo ? `${prefijo}-descripcion` : 'descripcion');
    const contadorDes = document.getElementById(prefijo ? `contador-${prefijo}-descripcion` : 'contador-descripcion');

    if (inputNom) {
        // Actively block numeric input (physical and numeric keyboard)
        inputNom.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey || e.altKey) return; // Allow key combinations such as Ctrl+C, Ctrl+V, etc.
            if (e.key >= '0' && e.key <= '9') {
                e.preventDefault();
            }
        });

        // Block on mobile virtual keyboards and autofill
        inputNom.addEventListener('beforeinput', (e) => {
            if (e.data && /[0-9]/.test(e.data)) {
                e.preventDefault();
            }
        });

        // Automatically strip numeric characters if pasted from clipboard
        inputNom.addEventListener('input', () => {
            if (/[0-9]/.test(inputNom.value)) {
                const cursor = inputNom.selectionStart;
                const longitudAntes = inputNom.value.length;
                inputNom.value = inputNom.value.replace(/[0-9]/g, '');
                const longitudDespues = inputNom.value.length;
                if (cursor !== null) {
                    const nuevoCursor = Math.max(0, cursor - (longitudAntes - longitudDespues));
                    inputNom.setSelectionRange(nuevoCursor, nuevoCursor);
                }
            }
            aplicarEstadoValidacion(inputNom, validarNombre(inputNom.value));
        });

        inputNom.addEventListener('blur', () => aplicarEstadoValidacion(inputNom, validarNombre(inputNom.value)));
    }

    if (inputCor) {
        inputCor.addEventListener('input', () => aplicarEstadoValidacion(inputCor, validarCorreo(inputCor.value)));
        inputCor.addEventListener('blur', () => aplicarEstadoValidacion(inputCor, validarCorreo(inputCor.value)));
    }

    if (inputCur) {
        inputCur.addEventListener('input', () => aplicarEstadoValidacion(inputCur, validarCurso(inputCur.value)));
        inputCur.addEventListener('blur', () => aplicarEstadoValidacion(inputCur, validarCurso(inputCur.value)));
    }

    if (inputImg) {
        inputImg.addEventListener('input', () => aplicarEstadoValidacion(inputImg, validarImageUrl(inputImg.value)));
        inputImg.addEventListener('blur', () => aplicarEstadoValidacion(inputImg, validarImageUrl(inputImg.value)));
    }

    if (inputDes) {
        inputDes.addEventListener('input', () => {
            const err = validarDescripcion(inputDes.value);
            aplicarEstadoValidacion(inputDes, err);
            if (contadorDes) {
                contadorDes.textContent = `${inputDes.value.length} / 500`;
                contadorDes.style.color = inputDes.value.length > 480 ? 'var(--color-peligro)' : 'var(--color-texto-mutado)';
            }
        });
    }
}

function validarFormularioCompleto(prefijo = '') {
    const inputNom = document.getElementById(prefijo ? `${prefijo}-nombre` : 'nombre');
    const inputCor = document.getElementById(prefijo ? `${prefijo}-correo` : 'correo');
    const inputCur = document.getElementById(prefijo ? `${prefijo}-curso` : 'curso');
    const inputImg = document.getElementById(prefijo ? `${prefijo}-imageUrl` : 'imageUrl');
    const inputDes = document.getElementById(prefijo ? `${prefijo}-descripcion` : 'descripcion');

    let esValido = true;
    let primerInvalido = null;

    const errNom = validarNombre(inputNom.value);
    aplicarEstadoValidacion(inputNom, errNom);
    if (errNom) { esValido = false; primerInvalido = primerInvalido || inputNom; }

    const errCor = validarCorreo(inputCor.value);
    aplicarEstadoValidacion(inputCor, errCor);
    if (errCor) { esValido = false; primerInvalido = primerInvalido || inputCor; }

    const errCur = validarCurso(inputCur.value);
    aplicarEstadoValidacion(inputCur, errCur);
    if (errCur) { esValido = false; primerInvalido = primerInvalido || inputCur; }

    const errImg = validarImageUrl(inputImg.value);
    aplicarEstadoValidacion(inputImg, errImg);
    if (errImg) { esValido = false; primerInvalido = primerInvalido || inputImg; }

    const errDes = validarDescripcion(inputDes.value);
    aplicarEstadoValidacion(inputDes, errDes);
    if (errDes) { esValido = false; primerInvalido = primerInvalido || inputDes; }

    if (primerInvalido) primerInvalido.focus();
    return esValido;
}

// ==========================================================================
// 8. STUDENT REGISTRATION (POST) WITH VALIDATION & VISUAL FEEDBACK
// ==========================================================================
formularioRegistro.addEventListener('submit', throttleLeading(async (e) => {
    e.preventDefault();

    if (!validarFormularioCompleto('')) {
        return; // Abort submission if client-side validation errors exist
    }

    const datosFormulario = new FormData(e.target);
    const nuevoEstudiante = Object.fromEntries(datosFormulario.entries());

    try {
        const res = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(nuevoEstudiante)
        });

        if (res.ok) {
            alert('Estudiante registrado exitosamente.');
            e.target.reset();
            configurarSelectorAvatares('selector-avatares-registro', 'imageUrl', 'wrap-url-registro', 'btn-toggle-url-registro');
            ['nombre', 'correo', 'curso', 'imageUrl', 'descripcion'].forEach(campo => {
                limpiarErrorCampo(document.getElementById(campo));
            });
            document.getElementById('contador-descripcion').textContent = '0 / 500';

            cargarCursos();
            precargarEstudiantes();
            cambiarPestaña('consultas');
            obtenerEstudiantes(0);
        } else {
            // Handle backend validation or conflict errors (HTTP 400 or 409)
            const errorData = await res.json().catch(() => null);
            if (errorData && typeof errorData === 'object') {
                Object.keys(errorData).forEach(campo => {
                    const input = document.getElementById(campo);
                    aplicarEstadoValidacion(input, errorData[campo]);
                });
            } else {
                alert('No se pudo registrar el estudiante. Revisa los datos.');
            }
        }
    } catch (error) {
        console.error('Error al registrar estudiante:', error);
        alert('No se pudo conectar con el servidor.');
    }
});

// ==========================================================================
// 9. STUDENT EDITING (PUT) WITH MODAL & VALIDATION
// ==========================================================================
async function abrirModalEdicion(id) {
    try {
        const respuesta = await fetch(`${API_URL}/${id}`);
        if (!respuesta.ok) {
            alert('No se pudo obtener la información del estudiante para editar.');
            return;
        }

        const estudiante = await respuesta.json();

        // Populate modal input fields
        document.getElementById('edit-id').value = estudiante.id;
        document.getElementById('edit-nombre').value = estudiante.nombre || '';
        document.getElementById('edit-correo').value = estudiante.correo || '';
        document.getElementById('edit-curso').value = estudiante.curso || '';
        document.getElementById('edit-descripcion').value = estudiante.descripcion || '';

        // Clear previous visual validation errors
        ['edit-nombre', 'edit-correo', 'edit-curso', 'edit-imageUrl', 'edit-descripcion'].forEach(campo => {
            limpiarErrorCampo(document.getElementById(campo));
        });

        // Configure avatar selector with current student image
        configurarSelectorAvatares(
            'selector-avatares-edicion',
            'edit-imageUrl',
            'wrap-url-edicion',
            'btn-toggle-url-edicion',
            estudiante.imageUrl || ''
        );

        // Character counter
        const contador = document.getElementById('contador-edit-descripcion');
        if (contador) contador.textContent = `${(estudiante.descripcion || '').length} / 500`;

        modalEdicion.style.display = 'flex';
        document.getElementById('edit-nombre').focus();

    } catch (error) {
        console.error('Error al abrir modal de edición:', error);
        alert('Error al conectar con el servidor.');
    }
}

function cerrarModalEdicion() {
    modalEdicion.style.display = 'none';
    formularioEdicion.reset();
    ['edit-nombre', 'edit-correo', 'edit-curso', 'edit-imageUrl', 'edit-descripcion'].forEach(campo => {
        limpiarErrorCampo(document.getElementById(campo));
    });
}

btnCerrarModal.addEventListener('click', cerrarModalEdicion);
btnCancelarEdicion.addEventListener('click', cerrarModalEdicion);
modalBackdrop.addEventListener('click', cerrarModalEdicion);

formularioEdicion.addEventListener('submit', throttleLeading(async (e) => {
    e.preventDefault();

    if (!validarFormularioCompleto('edit')) {
        return; // Abort if client validation errors exist
    }

    const id = document.getElementById('edit-id').value;
    const datosActualizados = {
        nombre: document.getElementById('edit-nombre').value.trim(),
        correo: document.getElementById('edit-correo').value.trim(),
        curso: document.getElementById('edit-curso').value.trim(),
        imageUrl: document.getElementById('edit-imageUrl').value.trim(),
        descripcion: document.getElementById('edit-descripcion').value.trim()
    };

    try {
        const res = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datosActualizados)
        });

        if (res.ok) {
            alert('Estudiante actualizado correctamente.');
            cerrarModalEdicion();
            obtenerEstudiantes(paginaActual);
            cargarCursos();
            precargarEstudiantes();
        } else {
            const errorData = await res.json().catch(() => null);
            if (errorData && typeof errorData === 'object') {
                Object.keys(errorData).forEach(campo => {
                    const input = document.getElementById(`edit-${campo}`);
                    aplicarEstadoValidacion(input, errorData[campo]);
                });
            } else {
                alert('Error al actualizar el estudiante.');
            }
        }
    } catch (error) {
        console.error('Error al actualizar estudiante:', error);
        alert('No se pudo conectar con el servidor para actualizar.');
    }
});

// ==========================================================================
// 10. DELETE STUDENT (DELETE)
// ==========================================================================
async function eliminarEstudiante(id) {
    const confirmar = confirm('¿Está seguro de eliminar este estudiante?');
    if (!confirmar) return;

    try {
        const res = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });

        if (res.ok) {
            alert('Estudiante eliminado correctamente.');
            obtenerEstudiantes(paginaActual);
            cargarCursos();
            precargarEstudiantes();
        } else {
            alert('Error en el servidor al intentar eliminar el estudiante.');
        }
    } catch (error) {
        console.error('Error al eliminar estudiante:', error);
        alert('No se pudo establecer conexión con el servidor.');
    }
}

// ==========================================================================
// 11. TAB MANAGEMENT (SPA)
// ==========================================================================
function cambiarPestaña(pestaña) {
    if (pestaña === 'registro') {
        vistaConsultas.style.display = 'none';
        vistaRegistro.style.display = 'block';
        tabConsultas.classList.remove('activo');
        tabRegistro.classList.add('activo');
        if (tituloHero) tituloHero.textContent = 'Registrar Nuevo Estudiante';
        const inputNombre = document.getElementById('nombre');
        if (inputNombre) inputNombre.focus();
    } else {
        vistaRegistro.style.display = 'none';
        vistaConsultas.style.display = 'block';
        tabRegistro.classList.remove('activo');
        tabConsultas.classList.add('activo');
        if (tituloHero) tituloHero.textContent = 'Catálogo y Consulta de Estudiantes';
    }
}

if (tabConsultas) {
    tabConsultas.addEventListener('click', (e) => {
        e.preventDefault();
        cambiarPestaña('consultas');
        window.location.hash = 'consultas';
    });
}

if (tabRegistro) {
    tabRegistro.addEventListener('click', (e) => {
        e.preventDefault();
        cambiarPestaña('registro');
        window.location.hash = 'registro';
    });
}

function sincronizarPestañaPorHash() {
    if (window.location.hash === '#registro') {
        cambiarPestaña('registro');
    } else {
        cambiarPestaña('consultas');
    }
}

sincronizarPestañaPorHash();
window.addEventListener('hashchange', sincronizarPestañaPorHash);

// Expose global functions to window for HTML onclick attributes
window.seleccionarSugerencia = seleccionarSugerencia;
window.eliminarEstudiante = eliminarEstudiante;
window.abrirModalEdicion = abrirModalEdicion;

// ==========================================================================
// 12. APPLICATION INITIALIZATION
// ==========================================================================
cargarCursos();
precargarEstudiantes();
obtenerEstudiantes(0);

// Configure avatar selectors and real-time live validations
configurarSelectorAvatares('selector-avatares-registro', 'imageUrl', 'wrap-url-registro', 'btn-toggle-url-registro');
configurarValidacionesEnVivo('formulario-estudiante', '');
configurarValidacionesEnVivo('formulario-edicion', 'edit');

