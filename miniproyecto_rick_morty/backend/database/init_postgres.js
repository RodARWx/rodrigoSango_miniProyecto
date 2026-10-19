// ============================================================================
// INICIALIZADOR EXCLUSIVO DE POSTGRESQL
// ============================================================================

require('dotenv').config();
const { Client } = require('pg');

async function inicializarPostgreSQL() {
    console.log('🐘 Conectando a PostgreSQL como usuario:', process.env.PGUSER);

    // Conectar a la base de datos por defecto 'postgres' para verificar/crear 'rick_morty'
    const adminClient = new Client({
        host: process.env.PGHOST || 'localhost',
        port: parseInt(process.env.PGPORT || '5432', 10),
        user: process.env.PGUSER || 'postgres',
        password: process.env.PGPASSWORD,
        database: 'postgres'
    });

    try {
        await adminClient.connect();
        console.log('✅ Autenticación exitosa en PostgreSQL con el usuario postgres.');

        const dbName = process.env.PGDATABASE || 'rick_morty';
        const res = await adminClient.query(
            "SELECT 1 FROM pg_database WHERE datname = $1",
            [dbName]
        );

        if (res.rows.length === 0) {
            console.log(`📦 Creando base de datos "${dbName}" en PostgreSQL...`);
            await adminClient.query(`CREATE DATABASE "${dbName}"`);
            console.log(`✅ Base de datos "${dbName}" creada exitosamente.`);
        } else {
            console.log(`✅ La base de datos "${dbName}" ya existe en PostgreSQL.`);
        }

        await adminClient.end();

        // Conectar ahora a la base de datos 'rick_morty' y crear las tablas
        const appClient = new Client({
            host: process.env.PGHOST || 'localhost',
            port: parseInt(process.env.PGPORT || '5432', 10),
            user: process.env.PGUSER || 'postgres',
            password: process.env.PGPASSWORD,
            database: dbName
        });

        await appClient.connect();
        console.log(`✅ Conectado a la base de datos "${dbName}". Verificando tablas...`);

        await appClient.query(`
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
        console.log('✅ Tabla "favoritos" verificada y lista en PostgreSQL.');

        // Insertar registros iniciales si está vacía
        const conteo = await appClient.query("SELECT COUNT(*) FROM favoritos");
        const total = parseInt(conteo.rows[0].count, 10);
        console.log(`📊 Total de personajes favoritos en PostgreSQL: ${total}`);

        if (total === 0) {
            console.log('⭐ Insertando personajes de muestra en PostgreSQL...');
            await appClient.query(`
                INSERT INTO favoritos (id, nombre, estado, especie, genero, imagen, origen)
                VALUES 
                (1, 'Rick Sanchez', 'Alive', 'Human', 'Male', 'https://rickandmortyapi.com/api/character/avatar/1.jpeg', 'Earth (C-137)'),
                (2, 'Morty Smith', 'Alive', 'Human', 'Male', 'https://rickandmortyapi.com/api/character/avatar/2.jpeg', 'Earth (C-137)'),
                (3, 'Summer Smith', 'Alive', 'Human', 'Female', 'https://rickandmortyapi.com/api/character/avatar/3.jpeg', 'Earth (Replacement Dimension)')
                ON CONFLICT (id) DO NOTHING;
            `);
            console.log('✅ Personajes iniciales insertados en PostgreSQL.');
        }

        await appClient.end();
        console.log('\n🎉 ¡PostgreSQL está 100% configurado y operativo!\n');

    } catch (err) {
        console.error('❌ Error configurando PostgreSQL:', err.message);
        process.exit(1);
    }
}

inicializarPostgreSQL();
