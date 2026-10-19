// ============================================================================
// ENRUTADOR PRINCIPAL DE LA API REST (POSTGRESQL)
// ============================================================================

const express = require('express');
const router = express.Router();
const FavoritosController = require('../controllers/favoritosController');

// Endpoint de salud del servidor (Healthcheck)
router.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        database: {
            connected: true,
            engine: 'PostgreSQL'
        }
    });
});

// Estadísticas generales de la base de datos
router.get('/stats', FavoritosController.estadisticas);

// Rutas del recurso Favoritos en PostgreSQL
router.get('/favoritos', FavoritosController.listar);
router.get('/favoritos/check/:id', FavoritosController.verificar);
router.post('/favoritos', FavoritosController.agregar);
router.delete('/favoritos/:id', FavoritosController.eliminar);

module.exports = router;
