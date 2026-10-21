/**
 * ==============================================================================
 * RICK AND MORTY API CLIENT (ES6 MODULE)
 * ==============================================================================
 * Pure, decoupled HTTP client encapsulating all communication with the
 * official Rick & Morty REST API (https://rickandmortyapi.com/api).
 *
 * Responsibilities:
 * - Encapsulates endpoints for Character Catalog, Location, and Episode services.
 * - Standardizes URL query parameter construction via URLSearchParams.
 * - Uniformly handles HTTP errors, 404 empty result sets, and batch ID queries.
 * - Normalizes variable API responses (such as single vs array episode payloads).
 * - Pure data fetching with zero DOM or UI dependencies.
 * ==============================================================================
 */

export const API_BASE = 'https://rickandmortyapi.com/api';

/**
 * Standard empty catalog response payload when filters produce no matches.
 */
const EMPTY_CATALOG_RESPONSE = {
    info: {
        count: 0,
        pages: 0,
        next: null,
        prev: null
    },
    results: []
};

/**
 * Queries the Character Catalog endpoint with optional pagination and filters.
 *
 * @param {Object} [options={}] - Filter and pagination criteria.
 * @param {number} [options.page=1] - Page number.
 * @param {string} [options.name=''] - Character name filter.
 * @param {string} [options.status=''] - Character status filter ('alive' | 'dead' | 'unknown').
 * @param {string} [options.gender=''] - Character gender filter ('female' | 'male' | 'genderless' | 'unknown').
 * @returns {Promise<{ info: { count: number, pages: number, next: string|null, prev: string|null }, results: Array<Object> }>}
 */
export async function getCharacters({ page = 1, name = '', status = '', gender = '' } = {}) {
    const params = new URLSearchParams();

    if (page && Number(page) > 1) {
        params.append('page', String(page));
    }

    if (name && typeof name === 'string' && name.trim()) {
        params.append('name', name.trim());
    }

    if (status && typeof status === 'string' && status.trim()) {
        params.append('status', status.trim());
    }

    if (gender && typeof gender === 'string' && gender.trim()) {
        params.append('gender', gender.trim());
    }

    const queryString = params.toString();
    const endpoint = queryString ? `${API_BASE}/character/?${queryString}` : `${API_BASE}/character`;

    const response = await fetch(endpoint);

    // Rick & Morty API returns HTTP 404 with { error: "There is nothing here" } when search yields 0 matches
    if (response.status === 404) {
        return EMPTY_CATALOG_RESPONSE;
    }

    if (!response.ok) {
        throw new Error(`HTTP Error ${response.status}: Failed to fetch characters.`);
    }

    const data = await response.json();
    return {
        info: data.info || { count: 0, pages: 0, next: null, prev: null },
        results: Array.isArray(data.results) ? data.results : []
    };
}

/**
 * Fetches a single character by ID.
 *
 * @param {number|string} id - Unique numeric identifier of the character.
 * @returns {Promise<Object>} Character data object.
 */
export async function getCharacterById(id) {
    if (!id) {
        throw new Error('A valid character ID is required.');
    }

    const response = await fetch(`${API_BASE}/character/${id}`);

    if (!response.ok) {
        throw new Error(`HTTP Error ${response.status}: Character #${id} not found.`);
    }

    return await response.json();
}

/**
 * Fetches location details by ID or direct URL (Service 2 in Chained Join).
 *
 * @param {number|string} locationIdOrUrl - Location ID or full endpoint URL.
 * @returns {Promise<Object|null>} Location data object or null if invalid/unmapped.
 */
export async function getLocation(locationIdOrUrl) {
    if (!locationIdOrUrl) {
        return null;
    }

    const urlString = String(locationIdOrUrl).trim();
    if (!urlString || urlString.toLowerCase() === 'unknown') {
        return null;
    }

    const endpoint = urlString.startsWith('http')
        ? urlString
        : `${API_BASE}/location/${urlString}`;

    const response = await fetch(endpoint);

    if (!response.ok) {
        throw new Error(`HTTP Error ${response.status}: Failed to fetch location details.`);
    }

    return await response.json();
}

/**
 * Extracts a numeric ID from an API resource URL (e.g., ".../episode/28" -> "28").
 *
 * @param {string} url - Resource URL.
 * @returns {string|null} Extracted ID or null.
 */
export function extractIdFromUrl(url) {
    if (!url || typeof url !== 'string') return null;
    const parts = url.split('/').filter(Boolean);
    const lastPart = parts[parts.length - 1];
    return lastPart && !isNaN(Number(lastPart)) ? lastPart : null;
}

/**
 * Fetches batch or individual episodes by IDs or endpoint URLs (Service 3 in Chained Join).
 * Automatically normalizes single-episode responses into an array.
 *
 * @param {Array<string|number>|string|number} idsOrUrls - Array of episode IDs, URLs, or a single ID.
 * @returns {Promise<Array<Object>>} Normalized list of episode records.
 */
export async function getEpisodes(idsOrUrls) {
    let ids = [];

    if (Array.isArray(idsOrUrls)) {
        ids = idsOrUrls
            .map(item => {
                if (typeof item === 'string' && item.startsWith('http')) {
                    return extractIdFromUrl(item);
                }
                return String(item).trim();
            })
            .filter(id => id && !isNaN(Number(id)));
    } else if (typeof idsOrUrls === 'string' && idsOrUrls.startsWith('http')) {
        const extracted = extractIdFromUrl(idsOrUrls);
        if (extracted) ids.push(extracted);
    } else if (idsOrUrls !== undefined && idsOrUrls !== null) {
        // Comma-separated string or single numeric ID
        ids = String(idsOrUrls)
            .split(',')
            .map(s => s.trim())
            .filter(id => id && !isNaN(Number(id)));
    }

    if (ids.length === 0) {
        return [];
    }

    const endpoint = `${API_BASE}/episode/${ids.join(',')}`;
    const response = await fetch(endpoint);

    if (!response.ok) {
        throw new Error(`HTTP Error ${response.status}: Failed to fetch episode details.`);
    }

    const data = await response.json();

    // The Rick & Morty API returns an Object for a single ID query, and an Array for multiple IDs.
    // Standardize to always return an Array.
    return Array.isArray(data) ? data : [data];
}
