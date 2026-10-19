// ============================================================================
// CONFIGURACIÓN EXCLUSIVA DE BASE DE DATOS POSTGRESQL (pg.Pool)
// ============================================================================

require('dotenv').config();
const { Pool } = require('pg');

// Configuración del Pool de PostgreSQL desde el archivo .env
const pool = new Pool({
    host: process.env.PGHOST || 'localhost',
    port: parseInt(process.env.PGPORT || '5432', 10),
    user: process.env.PGUSER || 'postgres',
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE || 'rick_morty',
    max: 15,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000
});

// Eventos del pool para monitoreo
pool.on('connect', () => {
    // Conexión activa en el pool
});

pool.on('error', (err) => {
    console.error('❌ Error imprevisto en el cliente de PostgreSQL:', err.message);
});

// Inicialización y verificación de la tabla en PostgreSQL
async function inicializarBaseDatos() {
    console.log(`\n🐘 Conectando exclusivamente a PostgreSQL (${process.env.PGHOST}:${process.env.PGPORT}/${process.env.PGDATABASE})...`);
    
    try {
        const client = await pool.connect();
        
        // Crear tabla oficial de favoritos en PostgreSQL
        await client.query(`
            CREATE TABLE IF NOT EXISTS favoritos (
                id INTEGER PRIMARY KEY,
                nombre VARCHAR(255) NOT NULL,
                estado VARCHAR(50) DEFAULT 'unknown',
                especie VARCHAR(100) DEFAULT 'Desconocida',
                genero VARCHAR(50) DEFAULT 'unknown',
                imagen TEXT NOT NULL,
                origen VARCHAR(255) DEFAULT 'Desconocido',
                fecha_guardado TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // Obtener conteo de registros actuales
        const res = await client.query('SELECT COUNT(*) AS total FROM favoritos;');
        const total = res.rows[0].total;

        client.release();

        console.log('====================================================================');
        console.log('✅ BASE DE DATOS POSTGRESQL CONECTADA Y OPERATIVA');
        console.log(`📊 Total de personajes favoritos almacenados: ${total}`);
        console.log('====================================================================\n');

        return { success: true, motor: 'PostgreSQL Oficial' };

    } catch (err) {
        console.error('\n❌ ERROR AL CONECTAR CON POSTGRESQL:');
        console.error(`   ${err.message}`);
        console.error('   👉 Revisa las credenciales en tu archivo .env (PGUSER, PGPASSWORD, PGDATABASE).\n');
        throw err;
    }
}

// Ejecutor directo de consultas sobre PostgreSQL
async function query(text, params) {
    const start = Date.now();
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    if (process.env.NODE_ENV === 'development') {
        // Log de depuración opcional
    }
    return res;
}

module.exports = {
    pool,
    query,
    inicializarBaseDatos
};
