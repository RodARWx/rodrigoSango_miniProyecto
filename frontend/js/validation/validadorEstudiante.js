/**
 * ==============================================================================
 * STUDENT VALIDATION ENGINE (ES6 MODULE)
 * ==============================================================================
 * Pure validation rules and real-time form feedback controllers for
 * student creation (POST) and update (PUT) dialogs.
 * ==============================================================================
 */

/**
 * Validates a student's full name.
 * Requirements: mandatory, minimum 3 chars, max 100 chars, letters and spaces only.
 *
 * @param {string} valor - Input string.
 * @returns {string} Error message or empty string if valid.
 */
export function validarNombre(valor) {
    if (!valor || valor.trim() === '') return 'El nombre completo es obligatorio.';
    const v = valor.trim();
    if (v.length < 3) return 'El nombre debe contener al menos 3 caracteres.';
    if (v.length > 100) return 'El nombre no puede exceder 100 caracteres.';
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/.test(v)) {
        return 'El nombre solo puede contener letras y espacios.';
    }
    return '';
}

/**
 * Validates a student's institutional email address.
 *
 * @param {string} valor - Input string.
 * @returns {string} Error message or empty string if valid.
 */
export function validarCorreo(valor) {
    if (!valor || valor.trim() === '') return 'El correo electrónico es obligatorio.';
    const v = valor.trim();
    const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!regexEmail.test(v)) return 'Ingresa un correo electrónico válido (ej. usuario@uce.edu.ec).';
    return '';
}

/**
 * Validates student course or parallel assignment.
 *
 * @param {string} valor - Input string.
 * @returns {string} Error message or empty string if valid.
 */
export function validarCurso(valor) {
    if (!valor || valor.trim() === '') return 'El curso o paralelo es obligatorio.';
    const v = valor.trim();
    if (v.length < 3) return 'El curso debe contener al menos 3 caracteres.';
    if (v.length > 100) return 'El curso no puede exceder 100 caracteres.';
    return '';
}

/**
 * Validates optional bio or profile description.
 *
 * @param {string} valor - Input string.
 * @returns {string} Error message or empty string if valid.
 */
export function validarDescripcion(valor) {
    if (valor && valor.length > 500) return 'La descripción no puede superar los 500 caracteres.';
    return '';
}

/**
 * Validates optional student avatar image URL.
 *
 * @param {string} valor - Input string.
 * @returns {string} Error message or empty string if valid.
 */
export function validarImageUrl(valor) {
    if (valor && valor.trim() !== '') {
        const v = valor.trim();
        if (v.length > 500) return 'La URL es demasiado extensa (máx. 500 caracteres).';
        if (!v.startsWith('http://') && !v.startsWith('https://')) {
            return 'La URL debe comenzar con http:// o https://';
        }
    }
    return '';
}

/**
 * Applies visual validation feedback class names and error labels to an input element.
 *
 * @param {HTMLElement|null} inputEl - Target input or textarea element.
 * @param {string} mensajeError - Error message string, or empty if valid.
 */
export function aplicarEstadoValidacion(inputEl, mensajeError) {
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

/**
 * Clears visual error states from a form field.
 *
 * @param {HTMLElement|null} inputEl - Target element.
 */
export function limpiarErrorCampo(inputEl) {
    if (!inputEl) return;
    inputEl.classList.remove('campo-invalido', 'campo-valido');
    const errorEl = document.getElementById(`error-${inputEl.id}`);
    if (errorEl) errorEl.textContent = '';
}

/**
 * Binds real-time live input listeners, numeric key suppression, and character counters.
 *
 * @param {string} formId - ID of parent form.
 * @param {string} [prefijo=''] - Field ID prefix (e.g., 'edit' for edit modal).
 */
export function configurarValidacionesEnVivo(formId, prefijo = '') {
    const inputNom = document.getElementById(prefijo ? `${prefijo}-nombre` : 'nombre');
    const inputCor = document.getElementById(prefijo ? `${prefijo}-correo` : 'correo');
    const inputCur = document.getElementById(prefijo ? `${prefijo}-curso` : 'curso');
    const inputImg = document.getElementById(prefijo ? `${prefijo}-imageUrl` : 'imageUrl');
    const inputDes = document.getElementById(prefijo ? `${prefijo}-descripcion` : 'descripcion');
    const contadorDes = document.getElementById(prefijo ? `contador-${prefijo}-descripcion` : 'contador-descripcion');

    if (inputNom) {
        // Actively block numeric input (physical and numeric keyboard)
        inputNom.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey || e.altKey) return;
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

/**
 * Validates all fields in a form before submission and focuses the first invalid element.
 *
 * @param {string} [prefijo=''] - Field ID prefix ('edit' or '').
 * @returns {boolean} True if all fields satisfy validation constraints.
 */
export function validarFormularioCompleto(prefijo = '') {
    const inputNom = document.getElementById(prefijo ? `${prefijo}-nombre` : 'nombre');
    const inputCor = document.getElementById(prefijo ? `${prefijo}-correo` : 'correo');
    const inputCur = document.getElementById(prefijo ? `${prefijo}-curso` : 'curso');
    const inputImg = document.getElementById(prefijo ? `${prefijo}-imageUrl` : 'imageUrl');
    const inputDes = document.getElementById(prefijo ? `${prefijo}-descripcion` : 'descripcion');

    let esValido = true;
    let primerInvalido = null;

    if (inputNom) {
        const errNom = validarNombre(inputNom.value);
        aplicarEstadoValidacion(inputNom, errNom);
        if (errNom) { esValido = false; primerInvalido = primerInvalido || inputNom; }
    }

    if (inputCor) {
        const errCor = validarCorreo(inputCor.value);
        aplicarEstadoValidacion(inputCor, errCor);
        if (errCor) { esValido = false; primerInvalido = primerInvalido || inputCor; }
    }

    if (inputCur) {
        const errCur = validarCurso(inputCur.value);
        aplicarEstadoValidacion(inputCur, errCur);
        if (errCur) { esValido = false; primerInvalido = primerInvalido || inputCur; }
    }

    if (inputImg) {
        const errImg = validarImageUrl(inputImg.value);
        aplicarEstadoValidacion(inputImg, errImg);
        if (errImg) { esValido = false; primerInvalido = primerInvalido || inputImg; }
    }

    if (inputDes) {
        const errDes = validarDescripcion(inputDes.value);
        aplicarEstadoValidacion(inputDes, errDes);
        if (errDes) { esValido = false; primerInvalido = primerInvalido || inputDes; }
    }

    if (primerInvalido) primerInvalido.focus();
    return esValido;
}
