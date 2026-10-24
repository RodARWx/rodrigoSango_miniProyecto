/**
 * ==============================================================================
 * AVATAR SELECTOR COMPONENT (ES6 MODULE)
 * ==============================================================================
 * Interactive avatar radio gallery and custom external image URL toggle.
 * ==============================================================================
 */

import { limpiarErrorCampo } from '../validation/validadorEstudiante.js';

export const AVATARES_PREDETERMINADOS = [
    { id: 'av-1', url: 'https://api.dicebear.com/7.x/personas/svg?seed=Ana&backgroundColor=b6e3f4', label: 'Estudiante 1' },
    { id: 'av-2', url: 'https://api.dicebear.com/7.x/personas/svg?seed=Carlos&backgroundColor=c0aede', label: 'Estudiante 2' },
    { id: 'av-3', url: 'https://api.dicebear.com/7.x/personas/svg?seed=Sofia&backgroundColor=d1d4f9', label: 'Estudiante 3' },
    { id: 'av-4', url: 'https://api.dicebear.com/7.x/personas/svg?seed=Mateo&backgroundColor=ffd5dc', label: 'Estudiante 4' },
    { id: 'av-5', url: 'https://api.dicebear.com/7.x/personas/svg?seed=Valeria&backgroundColor=ffdfbf', label: 'Estudiante 5' },
    { id: 'av-6', url: 'https://api.dicebear.com/7.x/personas/svg?seed=David&backgroundColor=c0aede', label: 'Estudiante 6' },
    { id: 'av-7', url: 'https://api.dicebear.com/7.x/personas/svg?seed=Camila&backgroundColor=b6e3f4', label: 'Estudiante 7' },
    { id: 'av-8', url: 'https://api.dicebear.com/7.x/personas/svg?seed=Andres&backgroundColor=d1d4f9', label: 'Estudiante 8' }
];

/**
 * Configures the interactive avatar gallery with radio accessibility roles,
 * custom URL inputs, and active selection state syncing.
 *
 * @param {string} contenedorId - ID of avatar choices grid container.
 * @param {string} inputUrlId - ID of hidden or visible image URL input.
 * @param {string} wrapUrlId - ID of custom URL input wrapper div.
 * @param {string} toggleBtnId - ID of button toggling custom URL visibility.
 * @param {string} [valorInicial=''] - Initial avatar URL to select or show.
 */
export function configurarSelectorAvatares(contenedorId, inputUrlId, wrapUrlId, toggleBtnId, valorInicial = '') {
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
