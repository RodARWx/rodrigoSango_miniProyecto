/**
 * ==============================================================================
 * FAVORITES STORAGE SERVICE (ES6 MODULE)
 * ==============================================================================
 * Pure, decoupled persistence service managing favorite character bookmarks.
 * 
 * Responsibilities:
 * - Centralizes all localStorage interactions for bookmarks.
 * - Enforces zero DOM and zero browser-global UI dependencies.
 * - Standardizes the stored character schema across catalog and detail views.
 * - Provides synchronous queries, updates, toggle operations, and ID sets.
 * ==============================================================================
 */

export const STORAGE_KEY_FAVORITOS = 'rick_morty_favoritos';

/**
 * Normalizes a character payload into a consistent favorite schema.
 * Ensures compatibility between raw external API schemas and local UI representations.
 *
 * @param {Object} character - Raw or mapped character object.
 * @returns {Object} Normalized character bookmark object.
 */
export function normalizeFavoriteCharacter(character) {
    if (!character || character.id === undefined || character.id === null) {
        throw new Error('Invalid character: ID is required to bookmark.');
    }

    const id = Number(character.id);
    const nombre = character.nombre || character.name || 'Unknown Character';
    const estado = character.estado || character.status || 'unknown';
    const especie = character.especie || character.species || 'Unknown';
    const genero = character.genero || character.gender || 'unknown';
    const imagen = character.imagen || character.image || '';
    
    let origen = 'Unknown';
    if (typeof character.origin === 'object' && character.origin !== null && character.origin.name) {
        origen = character.origin.name;
    } else if (typeof character.origen === 'string' && character.origen) {
        origen = character.origen;
    } else if (typeof character.origin === 'string' && character.origin) {
        origen = character.origin;
    }

    return {
        id,
        nombre,
        name: nombre,
        estado,
        status: estado,
        especie,
        species: especie,
        genero,
        gender: genero,
        imagen,
        image: imagen,
        origen,
        origin: typeof character.origin === 'object' && character.origin !== null ? character.origin : { name: origen, url: '' },
        fechaGuardado: character.fechaGuardado || new Date().toISOString()
    };
}

/**
 * Retrieves the stored list of favorite characters.
 *
 * @returns {Array<Object>} List of favorite characters or empty array on failure.
 */
export function getFavorites() {
    try {
        if (typeof window === 'undefined' || !window.localStorage) {
            return [];
        }
        const data = window.localStorage.getItem(STORAGE_KEY_FAVORITOS);
        if (!data) return [];
        const parsed = JSON.parse(data);
        return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
        console.error('Error reading favorites from localStorage:', error);
        return [];
    }
}

/**
 * Persists the entire favorites collection to localStorage.
 *
 * @param {Array<Object>} favorites - Array of character items to save.
 * @returns {boolean} True if saved successfully, false otherwise.
 */
export function saveFavorites(favorites) {
    try {
        if (typeof window === 'undefined' || !window.localStorage) {
            return false;
        }
        if (!Array.isArray(favorites)) {
            console.error('saveFavorites expects an array but received:', typeof favorites);
            return false;
        }
        window.localStorage.setItem(STORAGE_KEY_FAVORITOS, JSON.stringify(favorites));
        return true;
    } catch (error) {
        console.error('Error saving favorites to localStorage:', error);
        return false;
    }
}

/**
 * Checks whether a character ID is currently marked as favorite.
 *
 * @param {number|string} id - Character ID to check.
 * @returns {boolean} True if character is in favorites.
 */
export function isFavorite(id) {
    if (id === undefined || id === null) return false;
    const numericId = Number(id);
    const favorites = getFavorites();
    return favorites.some(item => Number(item.id) === numericId);
}

/**
 * Retrieves a Set of favorite character IDs for fast O(1) membership checks.
 *
 * @returns {Set<number>} Set containing all favorite character IDs.
 */
export function getFavoriteIds() {
    const favorites = getFavorites();
    return new Set(favorites.map(item => Number(item.id)));
}

/**
 * Toggles a character's favorite state in storage.
 * If present, removes it; if absent, standardizes and unshifts it.
 *
 * @param {Object} character - Character object to toggle.
 * @returns {{ isFavorite: boolean, character: Object, favorites: Array<Object> }} Result descriptor.
 */
export function toggleFavorite(character) {
    if (!character || character.id === undefined || character.id === null) {
        throw new Error('Cannot toggle favorite: invalid character object.');
    }

    const id = Number(character.id);
    const favorites = getFavorites();
    const index = favorites.findIndex(f => Number(f.id) === id);

    let isFav = false;
    let targetCharacter = null;

    if (index !== -1) {
        // Remove existing favorite
        targetCharacter = favorites.splice(index, 1)[0];
        isFav = false;
    } else {
        // Add new favorite with standardized attributes
        targetCharacter = normalizeFavoriteCharacter(character);
        favorites.unshift(targetCharacter);
        isFav = true;
    }

    saveFavorites(favorites);

    return {
        isFavorite: isFav,
        character: targetCharacter,
        favorites
    };
}

/**
 * Clears all favorites from localStorage.
 *
 * @returns {boolean} True if successfully cleared.
 */
export function clearFavorites() {
    try {
        if (typeof window !== 'undefined' && window.localStorage) {
            window.localStorage.removeItem(STORAGE_KEY_FAVORITOS);
        }
        return true;
    } catch (error) {
        console.error('Error clearing favorites:', error);
        return false;
    }
}
