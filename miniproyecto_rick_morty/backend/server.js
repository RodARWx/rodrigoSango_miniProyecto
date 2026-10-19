// ============================================================================
// SERVIDOR PRINCIPAL EXPRESS (BACKEND EXCLUSIVO CON POSTGRESQL)
// ============================================================================

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');

const { inicializarBaseDatos } = require('./config/database');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares globales
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Rutas de la API REST del backend
app.use('/api', apiRoutes);

// Servir la aplicación web Frontend (HTML5, CSS3, Vanilla JS)
const frontendPath = path.join(__dirname, '..');
app.use(express.static(frontendPath));

// Manejador para cualquier ruta de API no encontrada
app.use((req, res, next) => {
    if (req.path.startsWith('/api')) {
        return res.status(404).json({
            success: false,
            error: `Ruta API "${req.originalUrl}" no encontrada.`
        });
    }
    res.sendFile(path.join(frontendPath, 'index.html'));
});

// Manejador central de errores
app.use((err, req, res, next) => {
    console.error('💥 Error no controlado en el servidor:', err);
    res.status(500).json({
        success: false,
        mensaje: 'Error interno en el servidor.',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Iniciar servidor y verificar conexión a PostgreSQL
async function startServer() {
    try {
        await inicializarBaseDatos();

        app.listen(PORT, () => {
            console.log('\n====================================================================');
            console.log('🚀 SERVIDOR OPERATIVO Y DISPONIBLE EN:');
            console.log(`🌐 Aplicación Web:       http://localhost:${PORT}`);
            console.log(`📑 Healthcheck API:      http://localhost:${PORT}/api/health`);
            console.log(`⭐ Favoritos PostgreSQL: http://localhost:${PORT}/api/favoritos`);
            console.log(`📊 Estadísticas BD:      http://localhost:${PORT}/api/stats`);
            console.log('🗄️  Motor de BD:          PostgreSQL Exclusivo 🐘');
            console.log('====================================================================\n');
        });
    } catch (err) {
        console.error('❌ No se pudo iniciar el servidor debido a un error de conexión con PostgreSQL:', err.message);
        process.exit(1);
    }
}

startServer();

module.exports = app;
