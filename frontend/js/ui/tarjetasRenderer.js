/**
 * ==============================================================================
 * STUDENT CARD GRID RENDERER (ES6 MODULE)
 * ==============================================================================
 * Presentation component responsible for rendering student cards into the
 * responsive catalog grid, managing avatar fallbacks, and rendering empty states.
 * ==============================================================================
 */

import { escaparHTML } from '../utils/domUtils.js';

/**
 * Renders an array of student objects as interactive cards into the target container.
 *
 * @param {Array<Object>} estudiantes - Array of student records.
 * @param {HTMLElement} contenedor - Target DOM grid element.
 * @param {Object} [callbacks={}] - Action handler callbacks.
 * @param {Function} [callbacks.onEditar] - Triggered when clicking Edit (receives student ID).
 * @param {Function} [callbacks.onEliminar] - Triggered when clicking Delete (receives student ID).
 */
export function renderizarTarjetas(estudiantes, contenedor, callbacks = {}) {
    if (!contenedor) return;
    contenedor.innerHTML = '';

    if (!estudiantes || estudiantes.length === 0) {
        contenedor.innerHTML = `
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

        const nombreSeguro = escaparHTML(estudiante.nombre || 'Estudiante');
        const cursoSeguro = escaparHTML(estudiante.curso || 'Sin curso');
        const correoSeguro = escaparHTML(estudiante.correo || '');
        const descSegura = escaparHTML(estudiante.descripcion || 'Sin descripción disponible.');

        card.innerHTML = `
            <div class="tarjeta-superior">
                <div class="tarjeta-foto-contenedor">
                    <img src="${imagenUrl}" alt="Foto de ${nombreSeguro}" loading="lazy">
                </div>
                <div class="tarjeta-info">
                    <h3 class="tarjeta-nombre" title="${nombreSeguro}">${nombreSeguro}</h3>
                    <span class="curso-badge" title="${cursoSeguro}">${cursoSeguro}</span>
                    <p class="correo-texto" title="${correoSeguro}">${correoSeguro}</p>
                </div>
            </div>
            <div class="tarjeta-cuerpo">
                <p class="tarjeta-desc">${descSegura}</p>
            </div>
            <div class="tarjeta-acciones">
                <button type="button" class="btn-editar" data-id="${estudiante.id}">Editar</button>
                <button type="button" class="btn-eliminar" data-id="${estudiante.id}">Eliminar</button>
            </div>
        `;

        // Direct event delegation for buttons
        const btnEdit = card.querySelector('.btn-editar');
        if (btnEdit && typeof callbacks.onEditar === 'function') {
            btnEdit.addEventListener('click', () => callbacks.onEditar(estudiante.id));
        }

        const btnDel = card.querySelector('.btn-eliminar');
        if (btnDel && typeof callbacks.onEliminar === 'function') {
            btnDel.addEventListener('click', () => callbacks.onEliminar(estudiante.id));
        }

        contenedor.appendChild(card);
    });
}

/**
 * Renders a user-friendly error card when communication with the backend fails.
 *
 * @param {HTMLElement} contenedor - Target DOM grid element.
 * @param {HTMLElement} badgeContador - Status indicator badge element.
 */
export function renderizarErrorServidor(contenedor, badgeContador) {
    if (badgeContador) {
        badgeContador.textContent = 'Error al conectar con el servidor';
    }

    if (contenedor) {
        contenedor.innerHTML = `
            <div class="sin-resultados">
                <p>No se pudo conectar con el servidor (Spring Boot).</p>
                <small style="color: #64748b; margin-top: 0.5rem; display: block;">
                    Verifica que el servicio esté corriendo en http://localhost:8080
                </small>
            </div>
        `;
    }
}
