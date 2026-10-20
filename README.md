# 🎓 Monorepo: Web Programming Projects (Branch: `refactor/rick-morty-mod`)

[![Java 17](https://img.shields.io/badge/Java-17-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)](https://www.oracle.com/java/)
[![Spring Boot 3.2.11](https://img.shields.io/badge/Spring_Boot-3.2.11-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white)](https://spring.io/projects/spring-boot)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14+-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![JavaScript Vanilla](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![HTML5 & CSS3](https://img.shields.io/badge/HTML5_%26_CSS3-Responsive-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/)
[![Refactor Status](https://img.shields.io/badge/Refactor-Client--Side_Rick_%26_Morty-brightgreen?style=for-the-badge)](#-architectural-refactoring-in-this-branch)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

---

## 📋 Table of Contents
1. [Project Overview & Monorepo Context](#-project-overview--monorepo-context)
2. [Architectural Refactoring in this Branch](#-architectural-refactoring-in-this-branch)
3. [Objectives](#-objectives)
   - [General Objective](#general-objective)
   - [Specific Objectives](#specific-objectives)
4. [Scope of the System](#-scope-of-the-system)
   - [1. Student Academic Management System](#1-student-academic-management-system)
   - [2. Refactored Rick & Morty Client Portal](#2-refactored-rick--morty-client-portal)
   - [Boundaries & Constraints](#boundaries--constraints)
5. [Monorepo Directory Structure](#-monorepo-directory-structure)
6. [Technology Stack & Architectural Differences](#-technology-stack--architectural-differences)
7. [Prerequisites](#-prerequisites)
8. [Installation & Setup](#-installation--setup)
   - [Step 1: Clone Repository & Switch Branch](#step-1-clone-repository--switch-branch)
   - [Step 2: PostgreSQL Database for Student System](#step-2-postgresql-database-for-student-system)
   - [Step 3: Configuration Properties](#step-3-configuration-properties)
9. [Execution Guide (How to Run Each Project)](#-execution-guide-how-to-run-each-project)
   - [Running the Student Management System](#running-the-student-management-system)
   - [Running the Refactored Rick & Morty Portal](#running-the-refactored-rick--morty-portal)
10. [API Specifications](#-api-specifications)
11. [Error Handling & Validation Rules](#-error-handling--validation-rules)
12. [Troubleshooting & FAQ](#-troubleshooting--faq)
13. [Authors & Credits](#-authors--credits)
14. [License](#-license)

---

## 📖 Project Overview & Monorepo Context

This repository represents the **`refactor/rick-morty-mod`** branch of the academic monorepo for the **Web Programming** course (Seventh Semester) at **Universidad Central del Ecuador (UCE)**.

The monorepo contains two primary web applications:
1. **Student Academic Management & Query System**: A robust full-stack academic platform featuring a **Java 17 / Spring Boot** backend, relational persistence in **PostgreSQL**, and a modern Vanilla JavaScript presentation layer.
2. **Rick & Morty Portal**: An interactive exploration portal consuming the official Rick & Morty REST API ([rickandmortyapi.com](https://rickandmortyapi.com/)), which has been **fully refactored in this branch** to be 100% static client-side.

---

## 💡 Architectural Refactoring in this Branch

### The Context Behind `refactor/rick-morty-mod`
In initial iterations of the monorepo, an intermediary backend layer (Node.js/Express and Java Spring Boot backed by PostgreSQL) was built for the Rick & Morty subproject. 

Upon architectural re-evaluation, this design choice was identified as an **anti-pattern and unnecessary operational complexity**:
- The data source is an **external, public, read-only REST API** already optimized for search, filtering, and pagination.
- Introducing a local backend created redundant proxy hops, artificial network latency, and unnecessary server maintenance.
- User bookmarking (favorites) is private to individual browser sessions and does not require relational database transactions or multi-user server coordination.

### Key Refactor Changes Made:
- **Complete Removal of Redundant Backend Infrastructure**: Deleted the `backend/` (Node.js/Express) and `backend-java/` folders, `package.json`, and database initialization scripts from `miniproyecto_rick_morty/`.
- **Direct Client-to-API Communication**: The frontend directly performs asynchronous `fetch` calls against the 3 required endpoints of the official API using modern `async/await`.
- **Seamless Local Persistence via `localStorage`**: Favorites are persisted in the browser's native `localStorage` under `rick_morty_favoritos`, eliminating PostgreSQL requirements for this subproject while providing instant offline access.
- **Zero-Setup Execution**: The Rick & Morty application can now be launched simply by opening `index.html` or running a static HTTP server.

---

## 🎯 Objectives

### General Objective
To maintain high architectural standards within the monorepo by separating enterprise-grade server-side management (applied where needed in the Student Management System) from efficient, serverless client-side consumption of external public APIs (in the Rick & Morty Portal).

### Specific Objectives
- **Demonstrate Architectural Discernment**: Identify when a dedicated backend is truly required (Student records CRUD, relational integrity) versus when it introduces needless overhead (public API consumption).
- **Client-Side Storage Engineering**: Implement a modular and robust `localStorage` persistence layer in pure Vanilla JavaScript with duplicate prevention and real-time state synchronization.
- **API Orchestration Under Constraints**: Consume strictly three (3) endpoints from the external Rick & Morty API with debounced search and animated circular spinners.
- **Enterprise REST API Maintenance**: Maintain the Java Spring Boot REST API for students with server-side pagination (`Pageable`), filtering, and modal-driven updates.

---

## 🔭 Scope of the System

### 1. Student Academic Management System
- **Server-Side Paginator**: Dynamic responsive cards with configurable page sizing (6, 9, 12, 24).
- **Search with Server Autocomplete**: Debounced query input with instant floating suggestion menu.
- **Dynamic Course Filtering**: Dropdown populated from unique course entries in PostgreSQL.
- **Full CRUD with Modales**: Inline editing modal dialog (PUT), strict validation, and safe deletion (DELETE).

### 2. Refactored Rick & Morty Client Portal
- **Direct API Catalog**: Real-time queries for characters, pagination, and multi-filter controls (Status & Gender).
- **Strict 4.0s Search Delay & Spinner**: Pedagogical requirement enforced (`DELAY_MS = 4000`) with rotating circular CSS loader and immediate <kbd>Enter</kbd> trigger.
- **Detailed Profile & Episode Breakdown**: Technical sheet (`detalle.html`) combining character profile data with batched episode history.
- **`localStorage` Bookmarks**: Add, view, and remove favorites with immediate UI feedback toasts and zero database overhead.

### Boundaries & Constraints
- Only the **Student Management System** requires Java, Maven, and PostgreSQL.
- The **Rick & Morty Portal** is strictly static client-side (no Node.js or database needed).
- All frontend interactions use **Vanilla JavaScript (ES6+)** without external UI frameworks.

---

## 📁 Monorepo Directory Structure

```text
miniproyecto_plan_b/ (Branch: refactor/rick-morty-mod)
├── pom.xml                                   # Maven configuration for Student Backend (Spring Boot 3.2.11)
├── seed.sql                                  # Test dataset for student records in PostgreSQL
├── iniciar-postgres.bat                      # Windows script to start PostgreSQL service
├── detener-postgres.bat                      # Windows script to stop PostgreSQL service
│
├── src/                                      # Main Student Backend (Java 17 + Spring Boot)
│   └── main/
│       ├── java/com/uce/estudiantes/
│       │   ├── EstudiantesApplication.java   # Spring Boot Application entry point
│       │   ├── controller/
│       │   │   └── EstudianteController.java # REST Controller (CRUD, pagination, filters)
│       │   ├── model/
│       │   │   └── Estudiante.java           # JPA Entity for PostgreSQL 'estudiantes' table
│       │   └── repository/
│       │       └── EstudianteRepository.java # JPA Repository with JPQL queries
│       └── resources/
│           └── application.properties        # Server port (8080) and PostgreSQL JDBC settings
│
├── frontend/                                 # Student System Presentation Layer
│   ├── index.html                            # SPA interface (Catalog, Registration, Edit Modal)
│   ├── style.css                             # Responsive CSS (Grid, Flexbox, Theme variables)
│   └── app.js                                # Vanilla JavaScript client logic and API interaction
│
└── miniproyecto_rick_morty/                  # 🚀 REFACTORED: 100% Client-Side Rick & Morty App
    ├── README.md                             # Subproject-specific technical documentation
    ├── index.html                            # Character catalog, 4s delay search, favorites tab
    ├── detalle.html                          # Character technical sheet and episode breakdown
    ├── style.css                             # Dark sci-fi responsive styles and spinner animation
    ├── app.js                                # Client logic: Endpoint 1 consumption and localStorage sync
    ├── detalle.js                            # Client logic: Endpoints 2 & 3 consumption and favorite toggle
    └── .gitignore                            # Subproject git ignore rules
```

---

## 🛠️ Technology Stack & Architectural Differences

| Component | Student Management System | Rick & Morty Portal (Refactored) |
|---|---|---|
| **Architecture** | Full-Stack (Decoupled Client-Server) | Pure Static Client-Side (Serverless) |
| **Backend Language** | Java 17 (OpenJDK) | *None (Direct API consumption)* |
| **Backend Framework**| Spring Boot 3.2.11 | *None* |
| **Frontend Language** | Vanilla JavaScript (ES6+) | Vanilla JavaScript (ES6+) |
| **Styling** | Semantic HTML5 & CSS3 Responsive | Semantic HTML5 & CSS3 Responsive |
| **Persistence** | PostgreSQL (`estudiantes_db`) | Browser **`localStorage`** (`rick_morty_favoritos`) |
| **API Consumer** | Internal REST API (`/api/estudiantes`)| External REST API (`rickandmortyapi.com`) |

---

## ⚙️ Prerequisites

- **For the Student Management System**:
  - JDK 17+
  - Apache Maven 3.8+
  - PostgreSQL 14+ (running on port 5432)
- **For the Rick & Morty Portal**:
  - **Only a modern web browser** (Chrome, Firefox, Edge, Safari). No runtimes or database required!

---

## 🚀 Installation & Setup

### Step 1: Clone Repository & Switch Branch
```bash
git clone <repository-url>
cd miniproyecto_plan_b
git checkout refactor/rick-morty-mod
```

### Step 2: PostgreSQL Database for Student System
1. Start your PostgreSQL service (or run `iniciar-postgres.bat` on Windows).
2. Create the student database:
   ```sql
   CREATE DATABASE estudiantes_db;
   ```
3. (Optional) Run the seed script:
   ```bash
   psql -U postgres -d estudiantes_db -f seed.sql
   ```

### Step 3: Configuration Properties
Verify [src/main/resources/application.properties](file:///c:/Users/braya/Documents/Septimo/Programción%20Web/miniproyecto_plan_b/src/main/resources/application.properties):
```properties
server.port=8080
spring.datasource.url=jdbc:postgresql://localhost:5432/estudiantes_db
spring.datasource.username=postgres
spring.datasource.password=1709
spring.jpa.hibernate.ddl-auto=update
```

---

## 💻 Execution Guide (How to Run Each Project)

### Running the Student Management System

1. **Launch the Spring Boot Backend**:
   ```bash
   mvn spring-boot:run
   ```
   Backend will start at: [http://localhost:8080/api/estudiantes](http://localhost:8080/api/estudiantes)

2. **Open the Student Frontend**:
   - Open `frontend/index.html` in VS Code using **Live Server**, or
   - Run `npx serve frontend` / `python -m http.server 5500` inside `frontend/`, or
   - Double-click `frontend/index.html` directly in your file manager.

---

### Running the Refactored Rick & Morty Portal

Because all backend baggage was eliminated in this refactor, running it is instantaneous:

- **Option A (VS Code Live Server - Recommended)**:
  Right-click `miniproyecto_rick_morty/index.html` and choose **"Open with Live Server"**.
- **Option B (Zero Install / Direct Browser)**:
  Double-click `miniproyecto_rick_morty/index.html` in your file explorer.
- **Option C (Lightweight Local Server)**:
  ```bash
  cd miniproyecto_rick_morty
  npx serve .
  ```
  Open [http://localhost:3000](http://localhost:3000).

---

## 📡 API Specifications

### 1. Student Management API (Local Spring Boot)
- `GET /api/estudiantes`: Paginated and filtered query (`buscar`, `curso`, `page`, `size`, `sort`).
- `GET /api/estudiantes/todos`: Full student listing without pagination.
- `GET /api/estudiantes/cursos`: List of distinct enrolled courses.
- `GET /api/estudiantes/sugerencias?q=...`: Fast autocomplete suggestions.
- `GET /api/estudiantes/{id}`: Single student detail.
- `POST /api/estudiantes`: Register new student (validated).
- `PUT /api/estudiantes/{id}`: Update existing student data.
- `DELETE /api/estudiantes/{id}`: Delete student by ID.

### 2. Rick & Morty API (Official External Endpoints Consumed)
1. `GET https://rickandmortyapi.com/api/character/?name=...&status=...&gender=...&page=...` (Catalog & search)
2. `GET https://rickandmortyapi.com/api/character/{id}` (Character profile)
3. `GET https://rickandmortyapi.com/api/episode/{ids}` (Batched episode details)

---

## 🛡️ Error Handling & Validation Rules

- **Student System**: Server-side validation rejecting invalid names (< 3 chars, symbols), invalid email formats, duplicate emails, and descriptions exceeding 500 characters.
- **Rick & Morty System**: Client-side network error handling with `try...catch`, non-blocking toast notifications on failed requests, empty search feedback, and validation of missing URL parameters on `detalle.html`.

---

## ❓ Troubleshooting & FAQ

### 1. Why does Rick & Morty not need `npm start` or PostgreSQL in this branch?
In this branch, the unnecessary backend was removed because consuming an external public API does not require a local backend. Favorites are stored directly in browser `localStorage`.

### 2. Does the Student Management System still require PostgreSQL?
**Yes.** Student records represent institutional academic data that requires relational database transactions, unique constraints, and server-side pagination.

---

## 👥 Authors & Credits

- **Developer**: Rodrigo Brayan Sango
- **Course**: Web Programming - Seventh Semester
- **Institution**: Universidad Central del Ecuador (UCE)
- **External Resources**:
  - [The Rick and Morty API](https://rickandmortyapi.com/)
  - [DiceBear Avatars](https://www.dicebear.com/)
  - [Unsplash](https://unsplash.com/)

---
