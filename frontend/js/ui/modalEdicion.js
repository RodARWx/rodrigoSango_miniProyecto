/**
 * ==============================================================================
 * STUDENT EDIT MODAL COMPONENT (ES6 MODULE)
 * ==============================================================================
 * Manages the lifecycle, input population, avatar synchronization, and
 * accessibility for the student update (PUT) modal dialog.
 * ==============================================================================
 */

import { configurarSelectorAvatares } from './avatarSelector.js';
import { limpiarErrorCampo, validarFormularioCompleto, aplicarEstadoValidacion } from '../validation/validadorEstudiante.js';
import { throttleLeading } from '../utils/throttle.js';

/**
 * Opens and populates the student edit modal with existing entity data.
 *
 * @param {Object} estudiante - Student entity to edit.
 * @param {HTMLElement} modalEdicion - Modal wrapper element.
 */
export function abrirModalEdicion(estudiante, modalEdicion) {
    if (!estudiante || !modalEdicion) return;

    // Populate modal input fields
    const inputId = document.getElementById('edit-id');
    const inputNom = document.getElementById('edit-nombre');
    const inputCor = document.getElementById('edit-correo');
    const inputCur = document.getElementById('edit-curso');
    const inputDes = document.getElementById('edit-descripcion');

    if (inputId) inputId.value = estudiante.id;
    if (inputNom) inputNom.value = estudiante.nombre || '';
    if (inputCor) inputCor.value = estudiante.correo || '';
    if (inputCur) inputCur.value = estudiante.curso || '';
    if (inputDes) inputDes.value = estudiante.descripcion || '';

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
    if (inputNom) inputNom.focus();
}

/**
 * Closes the edit modal and resets all internal form fields and validation errors.
 *
 * @param {HTMLElement} modalEdicion - Modal wrapper element.
 * @param {HTMLFormElement} formularioEdicion - Edit form element.
 */
export function cerrarModalEdicion(modalEdicion, formularioEdicion) {
    if (!modalEdicion) return;
    modalEdicion.style.display = 'none';

    if (formularioEdicion) {
        formularioEdicion.reset();
    }

    ['edit-nombre', 'edit-correo', 'edit-curso', 'edit-imageUrl', 'edit-descripcion'].forEach(campo => {
        limpiarErrorCampo(document.getElementById(campo));
    });
}

/**
 * Configures all event listeners for the edit modal: close button, cancel button,
 * backdrop click, Escape key, and form submission.
 *
 * @param {Object} options - Configuration options and elements.
 * @param {HTMLElement} options.modalEdicion - Modal wrapper element.
 * @param {HTMLFormElement} options.formularioEdicion - Modal form element.
 * @param {HTMLElement} options.btnCerrarModal - Header close button.
 * @param {HTMLElement} options.btnCancelarEdicion - Cancel button.
 * @param {HTMLElement} options.modalBackdrop - Backdrop click layer.
 * @param {Function} options.onGuardar - Async callback receiving (id, datosActualizados).
 */
export function configurarEventosModal({
    modalEdicion,
    formularioEdicion,
    btnCerrarModal,
    btnCancelarEdicion,
    modalBackdrop,
    onGuardar
}) {
    const cerrar = () => cerrarModalEdicion(modalEdicion, formularioEdicion);

    if (btnCerrarModal) btnCerrarModal.addEventListener('click', cerrar);
    if (btnCancelarEdicion) btnCancelarEdicion.addEventListener('click', cerrar);
    if (modalBackdrop) modalBackdrop.addEventListener('click', cerrar);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalEdicion && modalEdicion.style.display === 'flex') {
            cerrar();
        }
    });

    if (formularioEdicion && typeof onGuardar === 'function') {
        formularioEdicion.addEventListener('submit', throttleLeading(async (e) => {
            e.preventDefault();

            if (!validarFormularioCompleto('edit')) {
                return;
            }

            const inputId = document.getElementById('edit-id');
            const id = inputId ? inputId.value : null;

            const datosActualizados = {
                nombre: (document.getElementById('edit-nombre')?.value || '').trim(),
                correo: (document.getElementById('edit-correo')?.value || '').trim(),
                curso: (document.getElementById('edit-curso')?.value || '').trim(),
                imageUrl: (document.getElementById('edit-imageUrl')?.value || '').trim(),
                descripcion: (document.getElementById('edit-descripcion')?.value || '').trim()
            };

            const exito = await onGuardar(id, datosActualizados);
            if (exito) {
                cerrar();
            }
        }, 400));
    }
}
