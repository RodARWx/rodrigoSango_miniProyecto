// ============================================================================
// MODELO DE DATOS - FAVORITOS (EXCLUSIVO PARA POSTGRESQL)
// ============================================================================

const { query } = require('../config/database');

const FavoritoModel = {
    // Obtener todos los favoritos desde PostgreSQL
    async obtenerTodos() {
        const sql = `
            SELECT id, nombre, estado, especie, genero, imagen, origen, fecha_guardado
            FROM favoritos
            ORDER BY fecha_guardado DESC;
        `;
        const res = await query(sql);
        return res.rows;
    },

    // Buscar si un personaje existe en PostgreSQL por su ID
    async obtenerPorId(id) {
        const sql = `
            SELECT id, nombre, estado, especie, genero, imagen, origen, fecha_guardado
            FROM favoritos
            WHERE id = $1;
        `;
        const res = await query(sql, [id]);
        return res.rows[0] || null;
    },

    // Guardar personaje en PostgreSQL con manejo de duplicados
    async guardar(personaje) {
        const { id, nombre, estado, especie, genero, imagen, origen } = personaje;

        const existente = await this.obtenerPorId(id);
        if (existente) {
            return existente;
        }

        const sql = `
            INSERT INTO favoritos (id, nombre, estado, especie, genero, imagen, origen)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *;
        `;
        const res = await query(sql, [
            id,
            nombre,
            estado || 'unknown',
            especie || 'Desconocida',
            genero || 'unknown',
            imagen,
            origen || 'Desconocido'
        ]);
        return res.rows[0];
    },

    // Eliminar personaje de PostgreSQL
    async eliminar(id) {
        const sql = `DELETE FROM favoritos WHERE id = $1;`;
        await query(sql, [id]);
        return { id: parseInt(id, 10), eliminado: true };
    },

    // Contar total de registros en PostgreSQL
    async contarTotal() {
        const sql = `SELECT COUNT(*) AS total FROM favoritos;`;
        const res = await query(sql);
        return parseInt(res.rows[0].total, 10);
    }
};

module.exports = FavoritoModel;
