/**
 * ==============================================================================
 * UI PRESENTATION RENDERERS (ES6 MODULE)
 * ==============================================================================
 * Pure UI presentation components for the Rick & Morty explorer application.
 *
 * Responsibilities:
 * - Decouples HTML markup generation and presentation formatting from controllers.
 * - Operates strictly on input data objects (Single Responsibility Principle).
 * - Zero direct dependencies on network fetching or storage mutations.
 * - Provides standardized card templates, pagination states, empty/error placeholders,
 *   and chained technical profile specifications.
 * ==============================================================================
 */

/**
 * Maps raw character status to CSS class and display text.
 *
 * @param {string} status - Raw status ('alive' | 'dead' | 'unknown').
 * @returns {{ cssClass: string, text: string }} Formatted status descriptor.
 */
export function formatStatus(status) {
    const s = (status || '').toLowerCase().trim();
    if (s === 'alive') {
        return { cssClass: 'estado-alive', text: 'Alive' };
    }
    if (s === 'dead') {
        return { cssClass: 'estado-dead', text: 'Dead' };
    }
    return { cssClass: 'estado-unknown', text: 'Unknown' };
}

/**
 * Translates and normalizes raw gender string into display text.
 *
 * @param {string} gender - Raw gender ('female' | 'male' | 'genderless' | 'unknown').
 * @returns {string} Standardized gender label.
 */
export function formatGender(gender) {
    const g = (gender || '').toLowerCase().trim();
    switch (g) {
        case 'female': return 'Female';
        case 'male': return 'Male';
        case 'genderless': return 'Genderless';
        default: return 'Unknown';
    }
}

/**
 * Escapes HTML characters to prevent XSS injection.
 *
 * @param {string|number} str - String to sanitize.
 * @returns {string} Sanitized string.
 */
export function sanitizeHtml(str) {
    if (str === undefined || str === null) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

/**
 * Generates pure HTML markup for an individual character card in the catalog grid.
 *
 * @param {Object} character - Character data payload.
 * @param {boolean} [isFavorite=false] - Whether the character is in favorites.
 * @returns {string} HTML markup string.
 */
export function createCharacterCardHtml(character, isFavorite = false) {
    if (!character) return '';

    const id = sanitizeHtml(character.id);
    const nombre = sanitizeHtml(character.name || character.nombre || 'Unknown');
    const especie = sanitizeHtml(character.species || character.especie || 'Unknown');
    const genero = formatGender(character.gender || character.genero);
    const imagen = sanitizeHtml(character.image || character.imagen || '');
    
    let origen = 'Unknown';
    if (character.origin && typeof character.origin === 'object' && character.origin.name) {
        origen = sanitizeHtml(character.origin.name);
    } else if (character.origen && typeof character.origen === 'string') {
        origen = sanitizeHtml(character.origen);
    } else if (character.origin && typeof character.origin === 'string') {
        origen = sanitizeHtml(character.origin);
    }

    const { cssClass, text: statusText } = formatStatus(character.status || character.estado);
    const favClass = isFavorite ? 'es-favorito' : '';
    const favTitle = isFavorite ? 'Remove from Favorites' : 'Save to Favorites';
    const favStar = isFavorite ? '★' : '☆';

    return `
        <article class="tarjeta-personaje" tabindex="0" role="button" aria-label="View details for ${nombre}" data-id="${id}">
            <div class="tarjeta-foto-envoltura">
                <img src="${imagen}" alt="Portrait of ${nombre}" loading="lazy">
                
                <button type="button" class="btn-favorito-tarjeta ${favClass}" 
                    title="${favTitle}" 
                    aria-label="Toggle favorite"
                    data-id="${id}">
                    ${favStar}
                </button>

                <div class="badge-estado ${cssClass}">
                    <span class="punto-estado"></span>
                    <span>${statusText}</span>
                </div>
            </div>
            <div class="tarjeta-contenido">
                <h3 class="tarjeta-nombre">${nombre}</h3>
                <div class="tarjeta-meta">
                    <span><strong>Especie:</strong> ${especie}</span>
                    <span><strong>Género:</strong> ${genero}</span>
                    <span><strong>Origen:</strong> ${origen}</span>
                </div>
                <div class="tarjeta-accion-enlace">
                    <span>Ver ficha técnica</span>
                    <span>&rarr;</span>
                </div>
            </div>
        </article>
    `.trim();
}

/**
 * Creates and returns a character card DOM element with optional click callbacks.
 *
 * @param {Object} character - Character data.
 * @param {boolean} isFavorite - Favorite status.
 * @param {Object} [handlers={}] - Event handlers.
 * @param {Function} [handlers.onFavoriteClick] - Triggered when the star button is clicked.
 * @param {Function} [handlers.onCardClick] - Triggered when the card is clicked.
 * @returns {HTMLElement} The constructed article card node.
 */
export function createCharacterCardElement(character, isFavorite = false, { onFavoriteClick, onCardClick } = {}) {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = createCharacterCardHtml(character, isFavorite);
    const card = wrapper.firstElementChild;

    if (!card) return document.createElement('article');

    const favBtn = card.querySelector('.btn-favorito-tarjeta');
    if (favBtn && typeof onFavoriteClick === 'function') {
        favBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            onFavoriteClick(character, favBtn);
        });
    }

    if (typeof onCardClick === 'function') {
        card.addEventListener('click', () => onCardClick(character));
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') onCardClick(character);
        });
    }

    return card;
}

/**
 * Calculates pagination boundary states and descriptive labels.
 *
 * @param {number} currentPage - Currently active page number.
 * @param {number} totalPages - Total available pages.
 * @param {number} [totalCount=0] - Total character records found.
 * @returns {{ currentPage: number, totalPages: number, infoText: string, counterText: string, prevDisabled: boolean, nextDisabled: boolean }}
 */
export function renderPaginationControls(currentPage, totalPages, totalCount = 0) {
    const page = Math.max(1, Number(currentPage) || 1);
    const total = Math.max(0, Number(totalPages) || 0);
    const count = Math.max(0, Number(totalCount) || 0);

    const prevDisabled = page <= 1;
    const nextDisabled = page >= total || total === 0;

    return {
        currentPage: page,
        totalPages: total,
        totalCount: count,
        infoText: total > 0 ? `Page ${page} of ${total}` : 'Page 0 of 0',
        counterText: `${count} characters in catalog (API)`,
        prevDisabled,
        nextDisabled
    };
}

/**
 * Standardized empty-state placeholder markup.
 *
 * @param {string} message - Primary informational message.
 * @param {Object} [options={}] - Customization options.
 * @param {string} [options.submessage=''] - Secondary hint.
 * @param {string} [options.actionButtonText=''] - Button text if an action button is required.
 * @param {string} [options.actionButtonId=''] - DOM ID for the action button.
 * @returns {string} HTML markup string.
 */
export function renderEmptyState(message, { submessage = '', actionButtonText = '', actionButtonId = '' } = {}) {
    const safeMsg = sanitizeHtml(message);
    const safeSub = submessage ? `<small style="color: #64748b; margin-top: 0.5rem; display: block;">${sanitizeHtml(submessage)}</small>` : '';
    const safeBtn = actionButtonText ? `
        <button type="button" ${actionButtonId ? `id="${actionButtonId}"` : ''} class="btn btn-buscar" style="margin-top: 1rem;">
            ${sanitizeHtml(actionButtonText)}
        </button>
    ` : '';

    return `
        <div class="estado-mensaje" style="grid-column: 1 / -1;">
            <p>${safeMsg}</p>
            ${safeSub}
            ${safeBtn}
        </div>
    `.trim();
}

/**
 * Standardized error-state placeholder markup.
 *
 * @param {string} message - Error explanation message.
 * @param {string} [backLink='index.html'] - Back navigation link URL.
 * @returns {string} HTML markup string.
 */
export function renderErrorState(message, backLink = 'index.html') {
    const safeMsg = sanitizeHtml(message);
    const safeBack = backLink ? `
        <a href="${sanitizeHtml(backLink)}" class="btn btn-secundario" style="margin-top: 1.5rem; display: inline-block;">
            &larr; Back to character catalog
        </a>
    ` : '';

    return `
        <div class="estado-mensaje" style="grid-column: 1 / -1;">
            <p style="color: #ef4444; font-weight: 600;">${safeMsg}</p>
            ${safeBack}
        </div>
    `.trim();
}

/**
 * Standardized episode item card markup.
 *
 * @param {Object} episode - Episode record from the Episode Service.
 * @returns {string} HTML markup string.
 */
export function renderEpisodeItemHtml(episode) {
    if (!episode) return '';
    const codigo = sanitizeHtml(episode.episode || 'N/A');
    const titulo = sanitizeHtml(episode.name || 'Untitled Episode');
    const fecha = sanitizeHtml(episode.air_date || 'N/A');

    return `
        <div class="tarjeta-episodio">
            <span class="episodio-codigo">${codigo}</span>
            <h4 class="episodio-titulo">${titulo}</h4>
            <span class="episodio-fecha">Air date: ${fecha}</span>
        </div>
    `.trim();
}

/**
 * Standardizes technical profile presentation data for the Detail view (WEB-9 Chained Join).
 *
 * @param {Object} character - Character specifications.
 * @param {Object} [locationData=null] - Chained location data (Service 2).
 * @param {Array<Object>} [episodesData=[]] - Chained episodes data (Service 3).
 * @returns {Object} Structured data ready for direct DOM binding.
 */
export function renderCharacterProfile(character, locationData = null, episodesData = []) {
    if (!character) return null;

    const { cssClass: statusClass, text: statusText } = formatStatus(character.status);

    return {
        character: {
            id: character.id,
            name: character.name,
            image: character.image,
            statusClass,
            statusText,
            species: character.species || 'Not specified',
            gender: formatGender(character.gender),
            type: character.type ? character.type : 'None (Standard)',
            originName: character.origin?.name || 'Unknown',
            locationName: character.location?.name || 'Unknown',
            totalEpisodesText: `${character.episode?.length || 0} episode(s)`
        },
        location: locationData ? {
            name: locationData.name || 'Unknown',
            type: locationData.type || 'Standard',
            dimension: locationData.dimension || 'Unknown dimension',
            residentsCountText: `${locationData.residents ? locationData.residents.length : 0} known resident(s)`,
            typeBadgeText: locationData.type ? `Type: ${locationData.type}` : 'Location Record'
        } : null,
        episodes: Array.isArray(episodesData) ? episodesData.map(renderEpisodeItemHtml) : []
    };
}
