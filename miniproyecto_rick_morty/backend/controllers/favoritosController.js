// ============================================================================
// CONTROLADOR - FAVORITOS Y ESTADÍSTICAS (EXCLUSIVO POSTGRESQL)
// ============================================================================

const FavoritoModel = require('../models/favoritoModel');

const FavoritosController = {
    // GET /api/favoritos
    async listar(req, res) {
        try {
            const favoritos = await FavoritoModel.obtenerTodos();
            return res.json({
                success: true,
                total: favoritos.length,
                motor: 'PostgreSQL',
                data: favoritos
            });
        } catch (error) {
            console.error('Error al listar favoritos en PostgreSQL:', error);
            return res.status(500).json({
                success: false,
                mensaje: 'Error al consultar favoritos en PostgreSQL.',
                error: error.message
            });
        }
    },

    // GET /api/favoritos/check/:id
    async verificar(req, res) {
        const { id } = req.params;
        try {
            const favorito = await FavoritoModel.obtenerPorId(id);
            return res.json({
                success: true,
                esFavorito: !!favorito,
                motor: 'PostgreSQL',
                data: favorito
            });
        } catch (error) {
            console.error('Error al verificar favorito en PostgreSQL:', error);
            return res.status(500).json({
                success: false,
                mensaje: 'Error al verificar favorito en PostgreSQL.',
                error: error.message
            });
        }
    },

    // POST /api/favoritos
    async agregar(req, res) {
        const { id, nombre, estado, especie, genero, imagen, origen } = req.body;

        if (!id || !nombre || !imagen) {
            return res.status(400).json({
                success: false,
                mensaje: 'Los campos "id", "nombre" e "imagen" son obligatorios.'
            });
        }

        try {
            const nuevoFavorito = await FavoritoModel.guardar({
                id: parseInt(id, 10),
                nombre,
                estado,
                especie,
                genero,
                imagen,
                origen
            });

            return res.status(201).json({
                success: true,
                mensaje: `Personaje "${nombre}" guardado en PostgreSQL con éxito.`,
                motor: 'PostgreSQL',
                data: nuevoFavorito
            });
        } catch (error) {
            console.error('Error al guardar favorito en PostgreSQL:', error);
            return res.status(500).json({
                success: false,
                mensaje: 'Error al guardar el personaje en PostgreSQL.',
                error: error.message
            });
        }
    },

    // DELETE /api/favoritos/:id
    async eliminar(req, res) {
        const { id } = req.params;

        try {
            const existente = await FavoritoModel.obtenerPorId(id);
            if (!existente) {
                return res.status(404).json({
                    success: false,
                    mensaje: `El personaje con ID ${id} no está en tus favoritos.`
                });
            }

            await FavoritoModel.eliminar(id);
            return res.json({
                success: true,
                mensaje: `Personaje "${existente.nombre}" eliminado de PostgreSQL.`,
                motor: 'PostgreSQL',
                id: parseInt(id, 10)
            });
        } catch (error) {
            console.error('Error al eliminar favorito en PostgreSQL:', error);
            return res.status(500).json({
                success: false,
                mensaje: 'Error al eliminar el personaje de PostgreSQL.',
                error: error.message
            });
        }
    },

    // GET /api/stats
    async estadisticas(req, res) {
        try {
            const total = await FavoritoModel.contarTotal();
            return res.json({
                success: true,
                servidor: 'Activo',
                motorBaseDatos: 'PostgreSQL Oficial 🐘',
                postgresConectado: true,
                totalFavoritosGuardados: total,
                fechaServidor: new Date().toISOString()
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }
};

module.exports = FavoritosController;
