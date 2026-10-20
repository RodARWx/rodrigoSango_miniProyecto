# 🎓 Monorepo: Web Programming Projects (Seventh Semester)

[![Java 17](https://img.shields.io/badge/Java-17-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)](https://www.oracle.com/java/)
[![Spring Boot 3.2.11](https://img.shields.io/badge/Spring_Boot-3.2.11-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white)](https://spring.io/projects/spring-boot)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14+-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![JavaScript Vanilla](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![HTML5 & CSS3](https://img.shields.io/badge/HTML5_%26_CSS3-Responsive-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

---

## 📋 Table of Contents
1. [Project Overview & Context](#-project-overview--context)
2. [Objectives](#-objectives)
   - [General Objective](#general-objective)
   - [Specific Objectives](#specific-objectives)
3. [Scope of the System](#-scope-of-the-system)
   - [Key Features](#key-features)
   - [Boundaries & Constraints](#boundaries--constraints)
4. [Monorepo Directory Structure](#-monorepo-directory-structure)
5. [Technology Stack & Dependencies](#-technology-stack--dependencies)
6. [Prerequisites](#-prerequisites)
7. [Installation & Configuration](#-installation--configuration)
   - [Step 1: Clone Repository](#step-1-clone-repository)
   - [Step 2: PostgreSQL Database Setup](#step-2-postgresql-database-setup)
   - [Step 3: Environment Variables & Properties](#step-3-environment-variables--properties)
8. [Execution Guide (How to Run the Projects)](#-execution-guide-how-to-run-the-projects)
   - [1. Main Project: Student Academic Management System](#1-main-project-student-academic-management-system)
   - [2. Subproject: Rick & Morty Portal](#2-subproject-rick--morty-portal)
9. [API & Endpoint Specifications](#-api--endpoint-specifications)
   - [Student Management REST API](#student-management-rest-api)
   - [Rick & Morty Portal API](#rick--morty-portal-api)
10. [Error Handling & Validation Rules](#-error-handling--validation-rules)
11. [Troubleshooting & FAQ](#-troubleshooting--faq)
12. [Authors & Credits](#-authors--credits)

---

## 📖 Project Overview & Context

This monorepo repository hosts practical web applications developed for the **Web Programming** course (Seventh Semester) within the Information Systems / Computer Engineering degree at **Universidad Central del Ecuador (UCE)**.

The monorepo follows modern software engineering principles, decoupling the presentation layer (Vanilla Frontend built with semantic HTML5, modern CSS3, and native ES6+ JavaScript) from the business and integration services (RESTful backends built with **Java 17 / Spring Boot** and **Node.js / Express**), backed by relational persistence in **PostgreSQL**.

### Integrated Projects in the `main` Branch:
1. **Student Academic Management & Query System (Main Project)**:
   - A full-featured academic management platform providing real-time search, server-side dynamic filtering, multi-criteria sorting, high-scale pagination (`Pageable`), and complete CRUD operations using dynamic modal dialogs.
2. **Rick & Morty Portal (Integrated Subproject)**:
   - A full-stack web application strictly consuming 3 endpoints from the public official API ([rickandmortyapi.com](https://rickandmortyapi.com/)), featuring deferred search (strict 4.0-second delay with a natural circular rotating spinner) and persistent character bookmarking in PostgreSQL powered by a dual-backend architecture (Node.js or Java Spring Boot).

---

## 🎯 Objectives

### General Objective
To design and build responsive, interactive, and scalable web solutions that demonstrate mastery of fundamental modern web technologies, covering client-side DOM manipulation, asynchronous network communication, RESTful API architecture, and relational database persistence.

### Specific Objectives
- **Structured Frontend Architecture**: Develop attractive, accessible, and performant user interfaces without relying on heavy frameworks, utilizing CSS Grid, Flexbox, CSS Variables, Media Queries, and asynchronous JavaScript (`fetch`, `async/await`).
- **RESTful API Engineering**: Construct clean, idempotent, and well-documented REST APIs with Spring Boot 3.x and Express.js.
- **Server-Side Scalability & Optimization**: Implement server-side pagination, sorting, and multi-field filtering to handle large data volumes with low latency.
- **External API Integration & Orchestration**: Consume third-party APIs under strict architectural constraints and combine remote payloads with local database persistence.
- **Data Integrity & Validation**: Enforce bidirectional input validation (frontend client and backend server), error sanitization, and descriptive feedback.

---

## 🔭 Scope of the System

### Key Features

#### 1. Student Academic Management Module:
- **Server-Side Paginated Catalog**: Dynamic responsive grid with configurable items per page (6, 9, 12, 24) and responsive navigation controls.
- **Real-Time Search & Autocomplete**: Debounced input (300ms), floating instant suggestion menu, and server-side global queries across student name, email, and enrolled course.
- **Dynamic Course Filters**: Dropdown dynamically populated directly from database records to ensure consistency.
- **Multi-Criteria Sorting**: Order records by registration timestamp (newest first), student name (A-Z / Z-A), and course title (A-Z).
- **Registration Form with Avatars**: Interactive form with built-in preset avatar selector (DiceBear Avatars) or support for external custom image URLs, real-time regex validation, and live character counter for bio descriptions.
- **Modal-Based Updating (PUT)**: Seamless inline editing via an overlay modal without requiring page reloads, preserving client-side catalog state.
- **Safe Deletion (DELETE)**: Interactive confirmation prompt followed by immediate catalog refresh and pagination recalculation.

#### 2. Rick & Morty Exploration Portal:
- **Search with Strict 4.0s Delay**: Strict timer requirement (`DELAY_MS = 4000`) paired with a rotating circular CSS spinner during character catalog queries.
- **Character Technical Sheet & Episodes**: Individual detail view with high-resolution imagery, biological traits, location data, and dynamically queried episode history.
- **Persistent Favorites**: Ability to save, query, and remove favorite characters directly stored in a dedicated PostgreSQL database.

### Boundaries & Constraints
- The client layer exclusively uses **Vanilla JavaScript** (no React, Vue, or Angular) according to course pedagogical requirements.
- The Rick & Morty module strictly consumes **three (3) official endpoints**; no unauthorized endpoints or external proxies are allowed.
- Relational database storage must run on **PostgreSQL** (version 14 or higher).

---

## 📁 Monorepo Directory Structure

```text
miniproyecto_plan_b/
├── pom.xml                                   # Maven configuration for Main Backend (Spring Boot 3.2.11)
├── seed.sql                                  # Initial SQL dataset to populate student records in PostgreSQL
├── iniciar-postgres.bat                      # Windows batch utility to start PostgreSQL 18 service
├── detener-postgres.bat                      # Windows batch utility to stop PostgreSQL 18 service
│
├── src/                                      # Main Backend Source Code (Java 17)
│   └── main/
│       ├── java/com/uce/estudiantes/
│       │   ├── EstudiantesApplication.java   # Spring Boot entry point with main() method
│       │   ├── controller/
│       │   │   └── EstudianteController.java # REST Controller with CRUD, pagination, and filter endpoints
│       │   ├── model/
│       │   │   └── Estudiante.java           # JPA Entity mapped to 'estudiantes' database table
│       │   └── repository/
│       │       └── EstudianteRepository.java # Spring Data JPA repository with custom JPQL queries
│       └── resources/
│           └── application.properties        # Server port (8080), PostgreSQL JDBC, and Hibernate properties
│
├── frontend/                                 # Presentation Layer for Student Management System
│   ├── index.html                            # SPA structure with tab navigation (Catalog / Registration) & Edit Modal
│   ├── style.css                             # Modern stylesheet (CSS variables, Flexbox, Grid, Responsive)
│   └── app.js                                # Client logic (fetch API, debounce, autocomplete, DOM rendering)
│
└── miniproyecto_rick_morty/                  # Subproject: Rick & Morty Portal (Dual Backend)
    ├── README.md                             # Subproject-specific technical documentation
    ├── package.json                          # Node.js dependencies and scripts for Express backend
    ├── package-lock.json                     # Locked dependency tree for Node modules
    ├── .env.example                          # Environment variables template for PostgreSQL
    ├── index.html                            # Character catalog view, delayed search, and favorites tab
    ├── detalle.html                          # Single character detail view with episode list
    ├── style.css                             # Portal styles and rotating circular loader animation
    ├── app.js                                # Client catalog logic and search delay controller
    ├── detalle.js                            # Client detail logic and favorites database synchronization
    │
    ├── backend/                              # Option 1: Node.js + Express Backend
    │   ├── server.js                         # Express server, CORS setup, and static asset serving
    │   ├── config/database.js                # PostgreSQL connection pool (pg.Pool)
    │   ├── controllers/favoritosController.js# Controllers for favorites CRUD and system statistics
    │   ├── models/favoritoModel.js           # Native parameterized SQL queries
    │   ├── routes/api.js                     # API router for /api/favoritos, /api/health, /api/stats
    │   └── database/
    │       ├── schema.sql                    # DDL script for 'favoritos' table
    │       └── init_postgres.js              # Script to automatically verify and apply SQL schema
    │
    └── backend-java/                         # Option 2: Alternative Java Spring Boot Backend
        ├── pom.xml                           # Maven dependencies (Spring Boot, JPA, PostgreSQL Driver)
        └── src/main/
            ├── java/com/rickandmorty/        # Java source code (Application, Model, Repo, Controller)
            └── resources/
                └── application.properties    # JDBC connection properties for rick_morty database
```

---

## 🛠️ Technology Stack & Dependencies

### Main Backend (Student Management)
- **Language**: Java 17 (LTS)
- **Framework**: Spring Boot 3.2.11
- **Spring Modules**:
  - `spring-boot-starter-web`: RESTful endpoints creation and embedded Tomcat server.
  - `spring-boot-starter-data-jpa`: Data access abstraction with Hibernate ORM.
  - `postgresql`: JDBC driver for native PostgreSQL communication.
- **Build Tool**: Apache Maven 3.8+

### Frontend (Both Projects)
- **Structure**: Semantic HTML5 (`<nav>`, `<header>`, `<main>`, `<section>`, `<article>`).
- **Styling**: Pure CSS3, Custom Properties (`:root`), CSS Grid, Flexbox, keyframe animations, and Media Queries for responsive cross-device layout.
- **Typography**: Google Fonts (*Inter*).
- **Client Logic**: Native modern JavaScript (ES6+), Async/Await, Fetch API, and direct DOM manipulation.
- **Assets & Avatars**: DiceBear Avatars API and Unsplash high-resolution photography.

### Rick & Morty Backend (Subproject)
- **Runtime Environment**: Node.js v18+ / v20+
- **Web Framework**: Express.js 4.19+
- **Database Client**: `pg` (node-postgres with connection pooling)
- **Utilities**: `cors`, `dotenv`
- **Java Alternative**: Spring Boot 3.2.x located in `backend-java/`

### Database
- **Engine**: PostgreSQL 14 / 15 / 16 / 18
- **Persistence Mechanisms**: JPA / Hibernate ORM (Main Java Backend) and Parameterized SQL Queries (Node.js Backend).

---

## ⚙️ Prerequisites

Ensure the following tools and runtimes are installed before running the projects:

1. **Java Development Kit (JDK)**: Version 17 or higher.
   ```bash
   java -version
   ```
2. **Apache Maven**: Version 3.8 or higher.
   ```bash
   mvn -version
   ```
3. **Node.js**: Version 18.0.0 or higher (including npm).
   ```bash
   node -v
   npm -v
   ```
4. **PostgreSQL**: Running locally on the standard port `5432`.
   ```bash
   psql -U postgres -p 5432
   ```
5. **Modern Web Browser**: Google Chrome, Mozilla Firefox, Microsoft Edge, or Safari.

---

## 🚀 Installation & Configuration

### Step 1: Clone Repository
Clone the repository and enter the project folder:
```bash
git clone <repository-url>
cd miniproyecto_plan_b
```
Ensure you are on the `main` branch:
```bash
git checkout main
```

---

### Step 2: PostgreSQL Database Setup

1. **Start the PostgreSQL Service**:
   - On Windows (if service is configured), execute:
     ```cmd
     iniciar-postgres.bat
     ```
   - Alternatively, start PostgreSQL from Windows Services (`services.msc`).

2. **Create the Required Databases**:
   Using `psql`, pgAdmin, or DBeaver, create the two distinct databases:
   ```sql
   -- Database for the main student academic management system
   CREATE DATABASE estudiantes_db;

   -- Database for the Rick and Morty subproject
   CREATE DATABASE rick_morty;
   ```

3. **Populate Initial Seed Data for Students (Recommended)**:
   Run the [seed.sql](file:///c:/Users/braya/Documents/Septimo/Programción%20Web/miniproyecto_plan_b/seed.sql) script to populate test records with preset avatars:
   ```bash
   psql -U postgres -d estudiantes_db -f seed.sql
   ```

---

### Step 3: Environment Variables & Properties

#### 1. Main Backend (Java Spring Boot)
Verify [src/main/resources/application.properties](file:///c:/Users/braya/Documents/Septimo/Programción%20Web/miniproyecto_plan_b/src/main/resources/application.properties) and update your PostgreSQL credentials if needed:
```properties
server.port=8080
spring.datasource.url=jdbc:postgresql://localhost:5432/estudiantes_db
spring.datasource.username=postgres
spring.datasource.password=1709
spring.jpa.hibernate.ddl-auto=update
```

#### 2. Rick & Morty Subproject (Node.js)
Navigate to the subproject folder and copy the environment template:
```bash
cd miniproyecto_rick_morty
cp .env.example .env
```
Adjust credentials in the `.env` file:
```env
PORT=3000
PGHOST=localhost
PGPORT=5432
PGUSER=postgres
PGPASSWORD=your_password_here
PGDATABASE=rick_morty
```
Install Node.js dependencies:
```bash
npm install
```

---

## 💻 Execution Guide (How to Run the Projects)

### 1. Main Project: Student Academic Management System

#### Step A: Run the Backend (Spring Boot)
From the root repository directory (`miniproyecto_plan_b`):
```bash
mvn spring-boot:run
```
The backend server will start at port **`8080`**. Verify by visiting:
[http://localhost:8080/api/estudiantes](http://localhost:8080/api/estudiantes)

#### Step B: Run the Frontend
Since the frontend uses pure client-side JavaScript interacting with the API:
- **Recommended Option (Live Server or Static HTTP Server)**:
  - In VS Code, right-click `frontend/index.html` and select **"Open with Live Server"**.
  - Or run a lightweight local server: `npx serve frontend` or `python -m http.server 5500` inside `frontend/`.
- **Direct Option**:
  - Open `frontend/index.html` directly in your browser.

---

### 2. Subproject: Rick & Morty Portal

#### Recommended Option: Node.js / Express Backend
1. Open a terminal and navigate to `miniproyecto_rick_morty`:
   ```bash
   cd miniproyecto_rick_morty
   ```
2. Initialize database schema:
   ```bash
   node backend/database/init_postgres.js
   ```
3. Launch the server:
   ```bash
   npm start
   ```
4. Access via browser:
   - 🌐 Web Application: [http://localhost:3000](http://localhost:3000)
   - 🩺 Health Check: [http://localhost:3000/api/health](http://localhost:3000/api/health)
   - ⭐ Favorites API: [http://localhost:3000/api/favoritos](http://localhost:3000/api/favoritos)

#### Alternative Option: Java Spring Boot Backend
If executing the Rick & Morty backend with Java:
1. Navigate to `miniproyecto_rick_morty/backend-java`:
   ```bash
   cd miniproyecto_rick_morty/backend-java
   ```
2. Run:
   ```bash
   mvn spring-boot:run
   ```

---

## 📡 API & Endpoint Specifications

### Student Management REST API (`http://localhost:8080/api/estudiantes`)

| Method | Endpoint | Query / Path Parameters | Description |
|---|---|---|---|
| `GET` | `/api/estudiantes` | `buscar`, `curso`, `page` (def: 0), `size` (def: 9), `sort` (def: `id,desc`) | Paginated and filtered student list evaluated server-side |
| `GET` | `/api/estudiantes/todos` | None | Returns all student records without pagination (cache and backup) |
| `GET` | `/api/estudiantes/cursos` | None | Returns distinct list of registered courses for dynamic filter menus |
| `GET` | `/api/estudiantes/sugerencias` | `q` (search query term) | Returns up to 5 fast autocomplete suggestions |
| `GET` | `/api/estudiantes/{id}` | `id` (Long) | Fetches a single student record by primary key ID |
| `POST` | `/api/estudiantes` | Body JSON (`nombre`, `correo`, `curso`, `descripcion`, `imageUrl`) | Creates a new student record after strict server validation |
| `PUT` | `/api/estudiantes/{id}` | `id` (Long), Body JSON | Updates an existing student's data |
| `DELETE`| `/api/estudiantes/{id}` | `id` (Long) | Permanently deletes a student record from the database |

#### Example JSON Payload (POST / PUT):
```json
{
  "nombre": "Ana Morales",
  "correo": "ana.morales@uce.edu.ec",
  "curso": "Programacion Web 7mo",
  "descripcion": "UI/UX design specialist and responsive web developer.",
  "imageUrl": "https://api.dicebear.com/7.x/personas/svg?seed=Ana&backgroundColor=b6e3f4"
}
```

---

### Rick & Morty Portal API

#### Official External Endpoints Consumed (Strict Limit of 3):
1. **Catalog & Filters**: `GET https://rickandmortyapi.com/api/character/?name={name}&status={status}&gender={gender}&page={page}`
2. **Individual Profile**: `GET https://rickandmortyapi.com/api/character/{id}`
3. **Episode Details**: `GET https://rickandmortyapi.com/api/episode/{ids}`

#### Local Persistence Endpoints (PostgreSQL / Express):
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/favoritos` | Retrieve all bookmarked favorite characters from PostgreSQL |
| `POST` | `/api/favoritos` | Bookmark a character (`character_id`, `name`, `image`, `status`, etc.) |
| `DELETE`| `/api/favoritos/:id` | Remove a bookmarked character by local record ID |
| `GET` | `/api/stats` | System statistics (total favorites count, dominant species) |
| `GET` | `/api/health` | Health check endpoint verifying database connectivity |

---

## 🛡️ Error Handling & Validation Rules

Both frontend and backend implement layered validation to preserve data integrity:

1. **Name Field**: Minimum 3 characters, maximum 100 characters. Allows alphabetic characters (including accented letters) and spaces only.
2. **Email Address**: Validates standard email structure (`user@domain.tld`) and checks database uniqueness (`findByCorreo` / unique index).
3. **Course / Section**: Mandatory field, bounded between 3 and 100 characters.
4. **Description**: Optional field up to 500 characters with a live character counter (`0 / 500`).
5. **Image URL**: Accepts built-in preset avatar URLs or custom URLs starting strictly with `http://` or `https://` (up to 500 characters).
6. **HTTP Response Status Codes**:
   - `200 OK` / `201 Created`: Successful operations with response payloads.
   - `400 Bad Request`: Validation failure containing a field-by-field error map (`{"nombre": "...", "correo": "..."}`).
   - `404 Not Found`: When querying an ID that does not exist.
   - `500 Internal Server Error`: Unhandled server-side issues with secured console logging.

---

## ❓ Troubleshooting & FAQ

### 1. `org.postgresql.util.PSQLException: Connection to localhost:5432 refused`
- **Cause**: The PostgreSQL service is stopped or listening on a different port.
- **Solution**: Start the service via `iniciar-postgres.bat` or through Windows Services (`services.msc`). Ensure `postgresql-x64-XX` is running.

### 2. CORS Error when triggering `fetch` requests
- **Cause**: Cross-origin restrictions when opening static files directly via `file://` or custom local ports.
- **Solution**: The Spring Boot [EstudianteController](file:///c:/Users/braya/Documents/Septimo/Programción%20Web/miniproyecto_plan_b/src/main/java/com/uce/estudiantes/controller/EstudianteController.java#L24) includes `@CrossOrigin(origins = "*")`. Make sure the backend is active.

### 3. Maven Build Issues (`mvn clean install`)
- **Cause**: Outdated Java compiler or mismatched `JAVA_HOME`.
- **Solution**: Verify that your `JAVA_HOME` environment variable references JDK 17 or higher.

---

## 👥 Authors & Credits

- **Author / Developer**: Rodrigo Brayan Sango
- **Course**: Web Programming - Seventh Semester
- **Institution**: Universidad Central del Ecuador (UCE)
- **Data Sources & Media**:
  - Rick & Morty Public API: [The Rick and Morty API](https://rickandmortyapi.com/)
  - Preset Avatars: [DiceBear Avatars](https://www.dicebear.com/)
  - Sample Stock Photography: [Unsplash](https://unsplash.com/)


