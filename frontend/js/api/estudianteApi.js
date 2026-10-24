/**
 * ==============================================================================
 * STUDENT REST API CLIENT (ES6 MODULE)
 * ==============================================================================
 * Pure, decoupled HTTP client encapsulating all communication with the
 * Spring Boot backend (http://localhost:8080/api/estudiantes).
 *
 * Responsibilities:
 * - Encapsulates server endpoints for paginated queries, suggestions, and CRUD.
 * - Standardizes URL query parameter construction via URLSearchParams.
 * - Uniformly handles HTTP errors, status codes, and server validation responses.
 * - Zero DOM or UI dependencies, enabling clean testing and reusability.
 * ==============================================================================
 */

export const API_BASE_URL = 'http://localhost:8080/api/estudiantes';

/**
 * Queries the students catalog endpoint with server-side pagination, sorting, and filtering.
 *
 * @param {Object} [options={}] - Query parameters.
 * @param {number} [options.page=0] - 0-indexed page number.
 * @param {number} [options.size=9] - Number of items per page.
 * @param {string} [options.sort='id,desc'] - Sort criteria (property,direction).
 * @param {string} [options.buscar=''] - Full-text search term.
 * @param {string} [options.curso=''] - Filter by course name.
 * @returns {Promise<{ content: Array<Object>, totalPages: number, totalElements: number, number: number }>}
 */
export async function listarEstudiantes({
    page = 0,
    size = 9,
    sort = 'id,desc',
    buscar = '',
    curso = ''
} = {}) {
    const params = new URLSearchParams({
        page: String(page),
        size: String(size),
        sort: sort || 'id,desc'
    });

    if (buscar && typeof buscar === 'string' && buscar.trim()) {
        params.append('buscar', buscar.trim());
    }

    if (curso && typeof curso === 'string' && curso.trim()) {
        params.append('curso', curso.trim());
    }

    const respuesta = await fetch(`${API_BASE_URL}?${params.toString()}`);
    if (!respuesta.ok) {
        throw new Error(`Error en el servidor al listar estudiantes (HTTP ${respuesta.status})`);
    }

    return await respuesta.json();
}

/**
 * Fetches all students without pagination for autocomplete in-memory cache and suggestions.
 *
 * @returns {Promise<Array<Object>>} Array of student records.
 */
export async function listarTodosEstudiantes() {
    try {
        const respuesta = await fetch(`${API_BASE_URL}/todos`);
        if (respuesta.ok) {
            const data = await respuesta.json();
            if (Array.isArray(data)) return data;
        }
    } catch (_) {}

    // Fallback: query large page if /todos is unavailable
    try {
        const fallbackRes = await fetch(`${API_BASE_URL}?size=100`);
        if (fallbackRes.ok) {
            const data = await fallbackRes.json();
            return data.content || (Array.isArray(data) ? data : []);
        }
    } catch (_) {}

    return [];
}

/**
 * Retrieves the distinct list of enrolled courses to populate filter dropdowns.
 *
 * @returns {Promise<Array<string>>} List of unique course names.
 */
export async function listarCursos() {
    const respuesta = await fetch(`${API_BASE_URL}/cursos`);
    if (!respuesta.ok) {
        throw new Error(`Error al obtener lista de cursos (HTTP ${respuesta.status})`);
    }
    return await respuesta.json();
}

/**
 * Queries server-side autocomplete suggestions matching a search term.
 *
 * @param {string} termino - Search keyword.
 * @returns {Promise<Array<Object>>} Up to 5 matched student suggestion objects.
 */
export async function obtenerSugerencias(termino) {
    if (!termino || !termino.trim()) return [];

    const params = new URLSearchParams({ q: termino.trim() });
    const respuesta = await fetch(`${API_BASE_URL}/sugerencias?${params.toString()}`);
    if (!respuesta.ok) return [];

    return await respuesta.json();
}

/**
 * Retrieves a single student record by their primary identifier.
 *
 * @param {number|string} id - Student ID.
 * @returns {Promise<Object>} Student record object.
 */
export async function obtenerEstudiantePorId(id) {
    const respuesta = await fetch(`${API_BASE_URL}/${id}`);
    if (!respuesta.ok) {
        throw new Error(`No se encontró el estudiante con ID ${id} (HTTP ${respuesta.status})`);
    }
    return await respuesta.json();
}

/**
 * Registers a new student in the database (POST /api/estudiantes).
 *
 * @param {Object} estudiante - New student payload.
 * @returns {Promise<{ ok: boolean, status: number, data?: Object, errors?: Object }>}
 */
export async function registrarEstudiante(estudiante) {
    const respuesta = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(estudiante)
    });

    if (respuesta.ok) {
        const data = await respuesta.json();
        return { ok: true, status: respuesta.status, data };
    }

    const errors = await respuesta.json().catch(() => null);
    return { ok: false, status: respuesta.status, errors };
}

/**
 * Updates an existing student record (PUT /api/estudiantes/{id}).
 *
 * @param {number|string} id - Student ID.
 * @param {Object} estudiante - Updated student attributes.
 * @returns {Promise<{ ok: boolean, status: number, data?: Object, errors?: Object }>}
 */
export async function actualizarEstudiante(id, estudiante) {
    const respuesta = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(estudiante)
    });

    if (respuesta.ok) {
        const data = await respuesta.json();
        return { ok: true, status: respuesta.status, data };
    }

    const errors = await respuesta.json().catch(() => null);
    return { ok: false, status: respuesta.status, errors };
}

/**
 * Deletes a student record by ID (DELETE /api/estudiantes/{id}).
 *
 * @param {number|string} id - Student ID.
 * @returns {Promise<boolean>} True if deletion succeeded.
 */
export async function eliminarEstudiante(id) {
    const respuesta = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'DELETE'
    });
    return respuesta.ok;
}
