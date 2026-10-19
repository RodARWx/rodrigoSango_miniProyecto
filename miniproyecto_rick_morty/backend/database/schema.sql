-- ============================================================================
-- BOILERPLATE POSTGRESQL - ESQUEMA DE BASE DE DATOS
-- PROYECTO: Catálogo Rick and Morty con Base de Datos Relacional
-- ============================================================================

-- 1. Creación de la base de datos (Ejecutar en caso de crearla manualmente):
-- CREATE DATABASE rick_morty;

-- 2. Conectar a la base de datos rick_morty antes de crear las tablas:
-- \c rick_morty;

-- 3. Tabla de Personajes Favoritos guardados desde la aplicación
CREATE TABLE IF NOT EXISTS favoritos (
    id INTEGER PRIMARY KEY,                      -- ID oficial del personaje en la API externa
    nombre VARCHAR(255) NOT NULL,               -- Nombre del personaje
    estado VARCHAR(50) DEFAULT 'unknown',       -- Alive, Dead, unknown
    especie VARCHAR(100) DEFAULT 'Desconocida',  -- Especie (Human, Alien, etc.)
    genero VARCHAR(50) DEFAULT 'unknown',       -- Male, Female, Genderless, unknown
    imagen TEXT NOT NULL,                       -- URL de la imagen oficial
    origen VARCHAR(255) DEFAULT 'Desconocido',  -- Nombre del planeta o dimensión de origen
    fecha_guardado TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP -- Marca de tiempo
);

-- 4. Índice para optimizar consultas por fecha
CREATE INDEX IF NOT EXISTS idx_favoritos_fecha ON favoritos (fecha_guardado DESC);

-- 5. Tabla opcional para registro de auditoría o historial de búsquedas
CREATE TABLE IF NOT EXISTS historial_busquedas (
    id SERIAL PRIMARY KEY,
    termino_busqueda VARCHAR(255) NOT NULL,
    filtro_estado VARCHAR(50),
    filtro_genero VARCHAR(50),
    fecha_busqueda TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
