# 🚀 Portal Rick & Morty - Full-Stack Boilerplate (API + PostgreSQL)

Aplicación web Full-Stack construida con **HTML5, CSS3, Vanilla JavaScript puro** en el frontend, y arquitectura desacoplada con **Node.js / Express** (y plantilla en **Java Spring Boot**) para el backend con persistencia en **Base de Datos Relacional PostgreSQL**.

El sistema cumple rigurosamente con la restricción de consumir **únicamente 3 endpoints** de la API oficial pública de Rick and Morty ([rickandmortyapi.com](https://rickandmortyapi.com/)).

---

## ⚡ Características Principales

1. **Búsqueda con Delay Estricto de 4.0 Segundos y Círculo de Carga Natural**:
   - Se mantiene el **tiempo estricto de 4.0 segundos (`DELAY_MS = 4000`)** requerido para la búsqueda mientras el usuario escribe en el catálogo.
   - En lugar de la barra de progreso rígida anterior, se utiliza un **círculo de carga animado natural (Spinner rotatorio)** que gira fluidamente durante los 4 segundos de espera, acompañado de un mensaje sutil de estado.
   - Búsqueda 100% natural y automática: al escribir, el círculo gira de forma fluida durante 4.0 segundos y consulta la API (con soporte de la tecla `Enter` si se desea consultar de inmediato).

2. **Frontend Vanilla JavaScript Puro**:
   - Sin frameworks pesados ni dependencias de empaquetado en el cliente.
   - Peticiones asíncronas modernas con `fetch` y `async/await`.
   - Sistema de diseño responsivo basado en **CSS Grid** y **Flexbox**, con paleta de colores de ciencia ficción (modo oscuro de alto contraste) y tipografía *Inter*.

3. **Backend Boilerplate Exclusivo con PostgreSQL**:
   - **100% PostgreSQL:** Sin motores intermedios ni SQLite. Conexión directa mediante `pg.Pool`.
   - Arquitectura limpia en capas: Controladores (`controllers`), Modelos SQL (`models`), Rutas (`routes`) y Conexión (`config/database.js`).
   - Inicialización automática de la tabla `favoritos` en PostgreSQL.
   - Endpoints REST para persistir, consultar y eliminar personajes favoritos en PostgreSQL.
   - Plantilla alternativa completa incluida en **Java 17 (Spring Boot + Spring Data JPA)** en la carpeta `backend-java/`.

---

## 🎯 Los 3 Endpoints Exclusivos de la API Consumidos

| # | Endpoint Oficial | Método HTTP | Uso en la Aplicación |
|---|---|---|---|
| **1** | `https://rickandmortyapi.com/api/character/?name=...&status=...&gender=...&page=...` | `GET` | **Catálogo General y Búsqueda**: Filtrado por nombre, estado (*Alive*, *Dead*, *Unknown*), género y paginación en vivo. |
| **2** | `https://rickandmortyapi.com/api/character/{id}` | `GET` | **Ficha Técnica Individual**: Detalle completo del personaje (imagen en alta calidad, especie, sub-tipo, origen y ubicación actual). |
| **3** | `https://rickandmortyapi.com/api/episode/{ids}` | `GET` | **Historial de Episodios**: Consulta de nombres, códigos de temporada/capítulo y fechas de emisión de los episodios en los que aparece el personaje. |

*Ningún otro endpoint de rickandmortyapi.com es consumido por la aplicación.*

---

## 📁 Estructura del Proyecto

```text
miniproyecto_rick_morty/
├── backend/                         # Backend Boilerplate en JavaScript (Node.js / Express)
│   ├── config/
│   │   └── database.js              # Conexión Pool a PostgreSQL y ejecución SQL
│   ├── controllers/
│   │   └── favoritosController.js   # Controladores REST para favoritos y estadísticas
│   ├── models/
│   │   └── favoritoModel.js         # Capa de datos con consultas SQL para PostgreSQL
│   ├── routes/
│   │   └── api.js                   # Enrutamiento de /api/favoritos, /api/health, /api/stats
│   ├── database/
│   │   └── schema.sql               # Script DDL oficial para PostgreSQL
│   └── server.js                    # Servidor Express y entrega de archivos estáticos
│
├── backend-java/                    # Boilerplate alternativo en Java Spring Boot
│   ├── pom.xml                      # Dependencias Maven (Spring Boot, JPA, Driver PostgreSQL)
│   └── src/main/
│       ├── java/com/rickandmorty/   # Application, Entidad Favorito, Repositorio y Controlador
│       └── resources/
│           └── application.properties # Parámetros de conexión JDBC a PostgreSQL
│
├── index.html                       # Catálogo de personajes, buscador natural y pestaña de favoritos
├── detalle.html                     # Vista de ficha técnica individual (Endpoints 2 y 3)
├── style.css                        # Estilos responsivos con spinners circulares modernos
├── app.js                           # Lógica cliente para Endpoint 1 y sincronización con BD
├── detalle.js                       # Lógica cliente para Endpoints 2 y 3 con guardado en BD
├── .env                             # Variables de entorno (Credenciales PostgreSQL)
├── .env.example                     # Plantilla de variables de entorno
└── package.json                     # Scripts y dependencias de Node.js
```

---

## 🛠️ Cómo Ejecutar el Proyecto

### Opción 1: Backend en Node.js / Express (Recomendado y listo para usar)

1. **Configurar credenciales de PostgreSQL** (en el archivo `.env`):
   ```env
   PORT=3000
   PGHOST=localhost
   PGPORT=5432
   PGUSER=postgres
   PGPASSWORD=tu_contraseña_aqui
   PGDATABASE=rick_morty
   ```

2. **Iniciar el servidor**:
   ```bash
   npm start
   ```

3. **Abrir en tu navegador**:
   - 🌐 Aplicación Web: [http://localhost:3000](http://localhost:3000)
   - 📑 Verificación de Salud: [http://localhost:3000/api/health](http://localhost:3000/api/health)
   - ⭐ API de Favoritos en BD: [http://localhost:3000/api/favoritos](http://localhost:3000/api/favoritos)
   - 📊 Estadísticas del Sistema: [http://localhost:3000/api/stats](http://localhost:3000/api/stats)

---

### Opción 2: Backend en Java (Spring Boot)

Si prefieres o te solicitan el backend en Java:
1. Dirígete a la carpeta `backend-java`:
   ```bash
   cd backend-java
   ```
2. Configura tus credenciales de PostgreSQL en `src/main/resources/application.properties`.
3. Ejecuta con Maven o tu IDE preferido (IntelliJ / Eclipse / VS Code):
   ```bash
   mvn spring-boot:run
   ```
4. El backend en Java responderá en el puerto `8080`.
