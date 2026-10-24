/**
 * ==============================================================================
 * STUDENT MANAGEMENT APPLICATION CONTROLLER & ORCHESTRATOR (ES6 MODULE)
 * ==============================================================================
 * Master application controller that orchestrates state, asynchronous API flows,
 * UI renderers, validation rules, and SPA tab navigation.
 *
 * Architecture:
 * - Decoupled REST API Client: ./js/api/estudianteApi.js
 * - Rate Limiting & Execution: ./js/utils/throttle.js
 * - DOM & Text Manipulation: ./js/utils/domUtils.js
 * - Form Validation Engine: ./js/validation/validadorEstudiante.js
 * - Avatar Selection UI: ./js/ui/avatarSelector.js
 * - Cards Grid Renderer: ./js/ui/tarjetasRenderer.js
 * - Server-Side Pagination UI: ./js/ui/paginacionUi.js
 * - Edit Modal Lifecycle: ./js/ui/modalEdicion.js
 * ==============================================================================
 */

import {
    listarEstudiantes,
    listarTodosEstudiantes,
    listarCursos,
    obtenerSugerencias,
    obtenerEstudiantePorId,
    registrarEstudiante,
    actualizarEstudiante,
    eliminarEstudiante
} from './js/api/estudianteApi.js';

import { throttleLeading, debounce } from './js/utils/throttle.js';
import { resaltarTexto } from './js/utils/domUtils.js';

import {
    configurarValidacionesEnVivo,
    validarFormularioCompleto,
    limpiarErrorCampo,
    aplicarEstadoValidacion
} from './js/validation/validadorEstudiante.js';

import { configurarSelectorAvatares } from './js/ui/avatarSelector.js';
import { renderizarTarjetas, renderizarErrorServidor } from './js/ui/tarjetasRenderer.js';
import { actualizarControlesPaginacion, configurarEventosPaginacion } from './js/ui/paginacionUi.js';
import { abrirModalEdicion, cerrarModalEdicion, configurarEventosModal } from './js/ui/modalEdicion.js';

// ==============================================================================
// 1. GLOBAL APPLICATION STATE
// ==============================================================================
let paginaActual = 0;
let totalPaginas = 1;
let totalElementos = 0;
let tamanoPagina = 9;
let terminoBusqueda = '';
let cursoSeleccionado = '';
let ordenSeleccionado = 'id,desc';
let cacheEstudiantes = [];

// ==============================================================================
// 2. DOM ELEMENT REFERENCES
// ==============================================================================
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

// Tab Navigation Elements
const tabConsultas = document.getElementById('tab-consultas');
const tabRegistro = document.getElementById('tab-registro');
const vistaConsultas = document.getElementById('vista-consultas');
const vistaRegistro = document.getElementById('vista-registro');
const tituloHero = document.getElementById('titulo-hero');
const formularioRegistro = document.getElementById('formulario-estudiante');

// Modal Elements
const modalEdicion = document.getElementById('modal-edicion');
const modalBackdrop = document.getElementById('modal-backdrop');
const btnCerrarModal = document.getElementById('btn-cerrar-modal');
const btnCancelarEdicion = document.getElementById('btn-cancelar-edicion');
const formularioEdicion = document.getElementById('formulario-edicion');

// ==============================================================================
// 3. CATALOG QUERY & RENDERING LIFECYCLE
// ==============================================================================
async function obtenerEstudiantes(pagina = 0) {
    try {
        if (badgeContador) badgeContador.textContent = 'Cargando registros...';

        const data = await listarEstudiantes({
            page: pagina,
            size: tamanoPagina,
            sort: ordenSeleccionado,
            buscar: terminoBusqueda,
            curso: cursoSeleccionado
        });

        let estudiantes = [];
        if (data.content !== undefined) {
            estudiantes = data.content;
            paginaActual = data.number;
            totalPaginas = data.totalPages;
            totalElementos = data.totalElements;
        } else if (Array.isArray(data)) {
            estudiantes = data;
            totalElementos = data.length;
            totalPaginas = Math.ceil(totalElementos / tamanoPagina) || 1;
            paginaActual = Math.min(pagina, Math.max(0, totalPaginas - 1));
        }

        // Keep local cache enriched for instant autocomplete
        estudiantes.forEach(est => {
            const idx = cacheEstudiantes.findIndex(c => c.id === est.id);
            if (idx >= 0) cacheEstudiantes[idx] = est;
            else cacheEstudiantes.push(est);
        });

        actualizarControlesPaginacion({
            paginaActual,
            totalPaginas,
            totalElementos,
            badgeContador,
            infoPaginacion,
            btnPaginaAnterior,
            btnPaginaSiguiente
        });

        renderizarTarjetas(estudiantes, listaContenedor, {
            onEditar: manejarAbrirEdicion,
            onEliminar: manejarEliminar
        });

    } catch (error) {
        console.error('Error al consultar estudiantes:', error);
        renderizarErrorServidor(listaContenedor, badgeContador);
        if (infoPaginacion) infoPaginacion.textContent = 'Página 0 de 0';
        if (btnPaginaAnterior) btnPaginaAnterior.disabled = true;
        if (btnPaginaSiguiente) btnPaginaSiguiente.disabled = true;
    }
}

async function cargarCursos() {
    try {
        const cursos = await listarCursos();
        const valorActual = filtroCurso ? filtroCurso.value : '';

        if (filtroCurso) {
            filtroCurso.innerHTML = '<option value="">Todos los cursos</option>';
            cursos.forEach(curso => {
                if (curso && curso.trim() !== '') {
                    const opt = document.createElement('option');
                    opt.value = curso;
                    opt.textContent = curso;
                    if (curso === valorActual) opt.selected = true;
                    filtroCurso.appendChild(opt);
                }
            });
        }
    } catch (error) {
        console.error('Error al cargar la lista de cursos:', error);
    }
}

async function precargarEstudiantes() {
    try {
        cacheEstudiantes = await listarTodosEstudiantes();
    } catch (_) {}
}

// ==============================================================================
// 4. ACTION HANDLERS (EDIT & DELETE)
// ==============================================================================
async function manejarAbrirEdicion(id) {
    try {
        const estudiante = await obtenerEstudiantePorId(id);
        abrirModalEdicion(estudiante, modalEdicion);
    } catch (error) {
        console.error('Error al abrir modal de edición:', error);
        alert('Error al conectar con el servidor.');
    }
}

async function manejarGuardarEdicion(id, datosActualizados) {
    try {
        const res = await actualizarEstudiante(id, datosActualizados);
        if (res.ok) {
            alert('Estudiante actualizado correctamente.');
            obtenerEstudiantes(paginaActual);
            cargarCursos();
            precargarEstudiantes();
            return true;
        }

        if (res.errors && typeof res.errors === 'object') {
            Object.keys(res.errors).forEach(campo => {
                const input = document.getElementById(`edit-${campo}`);
                aplicarEstadoValidacion(input, res.errors[campo]);
            });
        } else {
            alert('Error al actualizar el estudiante.');
        }
        return false;
    } catch (error) {
        console.error('Error al actualizar estudiante:', error);
        alert('No se pudo conectar con el servidor para actualizar.');
        return false;
    }
}

async function manejarEliminar(id) {
    const confirmar = confirm('¿Está seguro de eliminar este estudiante?');
    if (!confirmar) return;

    try {
        const ok = await eliminarEstudiante(id);
        if (ok) {
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

// ==============================================================================
// 5. SEARCH & AUTOCOMPLETE CONTROLLER
// ==============================================================================
function cerrarSugerencias() {
    if (listaSugerencias) {
        listaSugerencias.classList.remove('abierto');
        listaSugerencias.innerHTML = '';
    }
}

function mostrarSugerencias(sugerencias, termino) {
    if (!listaSugerencias) return;
    if (!sugerencias || sugerencias.length === 0) {
        cerrarSugerencias();
        return;
    }

    listaSugerencias.classList.add('abierto');
    listaSugerencias.innerHTML = '';

    sugerencias.slice(0, 6).forEach(est => {
        const li = document.createElement('li');
        li.classList.add('sugerencia-item');
        li.innerHTML = `
            <span>${resaltarTexto(est.nombre, termino)}</span>
            <small class="sugerencia-curso">${est.curso || ''}</small>
        `;
        li.addEventListener('mousedown', () => seleccionarSugerencia(est.nombre || ''));
        listaSugerencias.appendChild(li);
    });
}

function seleccionarSugerencia(nombre) {
    if (inputBusqueda) inputBusqueda.value = nombre;
    terminoBusqueda = (nombre || '').trim();
    cerrarSugerencias();

    // Instant in-memory visual rendering from cache
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

        actualizarControlesPaginacion({
            paginaActual,
            totalPaginas,
            totalElementos,
            badgeContador,
            infoPaginacion,
            btnPaginaAnterior,
            btnPaginaSiguiente
        });

        renderizarTarjetas(filtrados.slice(0, tamanoPagina), listaContenedor, {
            onEditar: manejarAbrirEdicion,
            onEliminar: manejarEliminar
        });
    }

    obtenerEstudiantes(0);
}

const buscarDebounced = debounce((texto) => {
    terminoBusqueda = texto;
    obtenerEstudiantes(0);
}, 250);

if (inputBusqueda) {
    inputBusqueda.addEventListener('input', (e) => {
        const texto = e.target.value.trim();

        if (texto.length >= 2) {
            const coincidenciasLocales = cacheEstudiantes.filter(est =>
                (est.nombre && est.nombre.toLowerCase().includes(texto.toLowerCase())) ||
                (est.curso && est.curso.toLowerCase().includes(texto.toLowerCase()))
            );

            if (coincidenciasLocales.length > 0) {
                mostrarSugerencias(coincidenciasLocales, texto);
            } else {
                obtenerSugerencias(texto).then(res => mostrarSugerencias(res, texto));
            }
        } else {
            cerrarSugerencias();
        }

        buscarDebounced(texto);
    });

    inputBusqueda.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            terminoBusqueda = inputBusqueda.value.trim();
            cerrarSugerencias();
            buscarDebounced.cancel();
            obtenerEstudiantes(0);
        }
    });
}

document.addEventListener('click', (e) => {
    if (!e.target.closest('.buscador-envoltura')) {
        cerrarSugerencias();
    }
});

// ==============================================================================
// 6. FILTERS & PAGINATION EVENT LISTENERS
// ==============================================================================
if (filtroCurso) {
    filtroCurso.addEventListener('change', (e) => {
        cursoSeleccionado = e.target.value;
        obtenerEstudiantes(0);
    });
}

if (ordenResultados) {
    ordenResultados.addEventListener('change', (e) => {
        ordenSeleccionado = e.target.value;
        obtenerEstudiantes(0);
    });
}

if (tamanoPaginaSelect) {
    tamanoPaginaSelect.addEventListener('change', (e) => {
        tamanoPagina = parseInt(e.target.value, 10);
        obtenerEstudiantes(0);
    });
}

configurarEventosPaginacion(
    btnPaginaAnterior,
    btnPaginaSiguiente,
    (nuevaPagina) => obtenerEstudiantes(nuevaPagina),
    () => ({ paginaActual, totalPaginas })
);

// ==============================================================================
// 7. REGISTRATION FORM (POST)
// ==============================================================================
if (formularioRegistro) {
    formularioRegistro.addEventListener('submit', throttleLeading(async (e) => {
        e.preventDefault();

        if (!validarFormularioCompleto('')) {
            return;
        }

        const datosFormulario = new FormData(formularioRegistro);
        const nuevoEstudiante = Object.fromEntries(datosFormulario.entries());

        try {
            const res = await registrarEstudiante(nuevoEstudiante);
            if (res.ok) {
                alert('Estudiante registrado exitosamente.');
                formularioRegistro.reset();
                configurarSelectorAvatares('selector-avatares-registro', 'imageUrl', 'wrap-url-registro', 'btn-toggle-url-registro');
                ['nombre', 'correo', 'curso', 'imageUrl', 'descripcion'].forEach(campo => {
                    limpiarErrorCampo(document.getElementById(campo));
                });
                const contDesc = document.getElementById('contador-descripcion');
                if (contDesc) contDesc.textContent = '0 / 500';

                cargarCursos();
                precargarEstudiantes();
                cambiarPestaña('consultas');
                obtenerEstudiantes(0);
            } else {
                if (res.errors && typeof res.errors === 'object') {
                    Object.keys(res.errors).forEach(campo => {
                        const input = document.getElementById(campo);
                        aplicarEstadoValidacion(input, res.errors[campo]);
                    });
                } else {
                    alert('No se pudo registrar el estudiante. Revisa los datos.');
                }
            }
        } catch (error) {
            console.error('Error al registrar estudiante:', error);
            alert('No se pudo conectar con el servidor.');
        }
    }, 400));
}

// Configure edit modal
configurarEventosModal({
    modalEdicion,
    formularioEdicion,
    btnCerrarModal,
    btnCancelarEdicion,
    modalBackdrop,
    onGuardar: manejarGuardarEdicion
});

// ==============================================================================
// 8. SPA TAB ROUTING
// ==============================================================================
function cambiarPestaña(pestaña) {
    if (!vistaConsultas || !vistaRegistro) return;

    if (pestaña === 'registro') {
        vistaConsultas.style.display = 'none';
        vistaRegistro.style.display = 'block';
        if (tabConsultas) tabConsultas.classList.remove('activo');
        if (tabRegistro) tabRegistro.classList.add('activo');
        if (tituloHero) tituloHero.textContent = 'Registrar Nuevo Estudiante';
        const inputNombre = document.getElementById('nombre');
        if (inputNombre) inputNombre.focus();
    } else {
        vistaRegistro.style.display = 'none';
        vistaConsultas.style.display = 'block';
        if (tabRegistro) tabRegistro.classList.remove('activo');
        if (tabConsultas) tabConsultas.classList.add('activo');
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

// Global window bridges for backwards compatibility with HTML inline calls
window.seleccionarSugerencia = seleccionarSugerencia;
window.eliminarEstudiante = manejarEliminar;
window.abrirModalEdicion = manejarAbrirEdicion;

// ==============================================================================
// 9. APPLICATION INITIALIZATION
// ==============================================================================
cargarCursos();
precargarEstudiantes();
obtenerEstudiantes(0);

configurarSelectorAvatares('selector-avatares-registro', 'imageUrl', 'wrap-url-registro', 'btn-toggle-url-registro');
configurarValidacionesEnVivo('formulario-estudiante', '');
configurarValidacionesEnVivo('formulario-edicion', 'edit');
