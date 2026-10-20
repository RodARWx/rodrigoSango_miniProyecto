# 🚀 Rick & Morty Portal - Full-Stack Architecture (API + PostgreSQL)

[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-4.19+-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![Java 17](https://img.shields.io/badge/Java-17-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)](https://www.oracle.com/java/)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.2.x-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white)](https://spring.io/projects/spring-boot)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14+-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Vanilla JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![HTML5 & CSS3](https://img.shields.io/badge/HTML5_%26_CSS3-Responsive-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/)

---

## 📋 Table of Contents
1. [Project Overview & Architecture](#-project-overview--architecture)
2. [Objectives](#-objectives)
   - [General Objective](#general-objective)
   - [Specific Objectives](#specific-objectives)
3. [Scope of the System](#-scope-of-the-system)
   - [Core Features](#core-features)
   - [Boundaries & Constraints](#boundaries--constraints)
4. [The 3 Official Endpoints Consumed](#-the-3-official-endpoints-consumed)
5. [Project Directory Structure](#-project-directory-structure)
6. [Technology Stack](#-technology-stack)
7. [Prerequisites](#-prerequisites)
8. [Database Setup & Configuration](#-database-setup--configuration)
9. [Execution Guide (How to Run the Application)](#-execution-guide-how-to-run-the-application)
   - [Option 1: Node.js / Express Backend (Recommended)](#option-1-nodejs--express-backend-recommended)
   - [Option 2: Java Spring Boot Backend](#option-2-java-spring-boot-backend)
10. [Local REST API Specifications](#-local-rest-api-specifications)
11. [Error Handling & User Feedback](#-error-handling--user-feedback)
12. [Troubleshooting & FAQ](#-troubleshooting--faq)
13. [Authors & Credits](#-authors--credits)

---

## 📖 Project Overview & Architecture

The **Rick & Morty Portal** is a full-stack web application built with semantic **HTML5**, modern **CSS3**, and pure **Vanilla ES6+ JavaScript** on the frontend, decoupled from a robust backend architecture featuring **Node.js / Express** (with an alternative **Java 17 / Spring Boot** boilerplate) and relational persistence in **PostgreSQL**.

The application strictly complies with the constraint of consuming **only three (3) official endpoints** from the public Rick and Morty API ([rickandmortyapi.com](https://rickandmortyapi.com/)), while enabling users to bookmark and persist their favorite characters in PostgreSQL.

---

## 🎯 Objectives

### General Objective
To develop a decoupled full-stack web application that combines public third-party REST API consumption with local relational persistence in PostgreSQL, respecting strict architectural constraints.

### Specific Objectives
- **Strict API Rate & Constraint Handling**: Consume strictly three (3) endpoints from the official Rick & Morty API without accessing unauthorized resources.
- **Search Delay UX**: Implement an intentional 4.0-second delay (`DELAY_MS = 4000`) with a natural rotating circular CSS spinner for optimized query frequency.
- **Dual Backend Implementations**: Provide both a Node.js/Express service and a Java Spring Boot alternative to demonstrate polyglot backend capability.
- **Relational Persistence**: Model and manage character favorites in PostgreSQL using clean connection pooling (`pg.Pool`).
- **Responsive Client Interface**: Build a responsive dark sci-fi UI using CSS Grid and Flexbox with zero client-side framework overhead.

---

## 🔭 Scope of the System

### Core Features

1. **Search with Strict 4.0s Delay & Circular Spinner**:
   - 4.0-second timer (`DELAY_MS = 4000`) while typing in the catalog search input.
   - Smooth rotating circular CSS spinner providing fluid visual feedback.
   - Immediate search execution available via the <kbd>Enter</kbd> key.

2. **Frontend Vanilla JavaScript**:
   - Zero heavyweight client frameworks or bundlers.
   - Asynchronous requests using native `fetch` and `async/await`.
   - Dark sci-fi aesthetic with *Inter* typography and toast alerts.

3. **Backend Boilerplate with PostgreSQL**:
   - Native PostgreSQL connection pool via `pg.Pool`.
   - Layered architecture: Controllers (`controllers`), SQL Models (`models`), Routes (`routes`), and Config (`config/database.js`).
   - Automated schema initialization (`backend/database/schema.sql`).
   - Alternative Java 17 (Spring Boot + Spring Data JPA) backend in `backend-java/`.

### Boundaries & Constraints
- Only the **3 authorized endpoints** from `rickandmortyapi.com` are accessed.
- Persistence relies strictly on **PostgreSQL**.

---

## 🎯 The 3 Official Endpoints Consumed

| # | Endpoint URL | HTTP Method | Application Usage |
|---|---|:---:|---|
| **1** | `https://rickandmortyapi.com/api/character/?name={name}&status={status}&gender={gender}&page={page}` | `GET` | **Catalog & Search**: Filter by name, status, gender, and live page index. |
| **2** | `https://rickandmortyapi.com/api/character/{id}` | `GET` | **Character Profile**: Detailed attributes by unique ID (species, origin, location). |
| **3** | `https://rickandmortyapi.com/api/episode/{ids}` | `GET` | **Episode History**: Fetches episode titles, season codes, and air dates. |

---

## 📁 Project Directory Structure

```text
miniproyecto_rick_morty/
├── backend/                         # Node.js / Express Backend
│   ├── config/
│   │   └── database.js              # PostgreSQL pool connection (pg.Pool)
│   ├── controllers/
│   │   └── favoritosController.js   # REST controllers for favorites and stats
│   ├── models/
│   │   └── favoritoModel.js         # SQL queries for PostgreSQL
│   ├── routes/
│   │   └── api.js                   # Express router (/api/favoritos, /api/health, /api/stats)
│   ├── database/
│   │   ├── schema.sql               # PostgreSQL DDL schema
│   │   └── init_postgres.js         # Automated schema initializer
│   └── server.js                    # Express app and static asset delivery
│
├── backend-java/                    # Alternative Java Spring Boot Backend
│   ├── pom.xml                      # Maven dependencies (Spring Boot, JPA, PostgreSQL Driver)
│   └── src/main/
│       ├── java/com/rickandmorty/   # Application, Favorito model, repo, and controller
│       └── resources/
│           └── application.properties # JDBC connection parameters for PostgreSQL
│
├── index.html                       # Character catalog, search input, and favorites tab
├── detalle.html                     # Single character technical profile view
├── style.css                        # Responsive styles and rotating circular spinner animation
├── app.js                           # Client logic for Endpoint 1 and DB synchronization
├── detalle.js                       # Client logic for Endpoints 2 & 3 with DB save toggle
├── .env                             # Environment variables (PostgreSQL credentials)
├── .env.example                     # Environment template
└── package.json                     # Node.js scripts and dependencies
```

---

## 🛠️ Technology Stack

| Component | Technology |
|---|---|
| **Frontend** | Semantic HTML5, CSS3 Grid/Flexbox, Native JavaScript (ES6+) |
| **Primary Backend** | Node.js (v18+), Express.js 4.19, `pg` (node-postgres) |
| **Alternative Backend**| Java 17, Spring Boot 3.2.x, Spring Data JPA, Hibernate |
| **Database** | PostgreSQL 14+ |
| **Typography** | Google Fonts (*Inter*) |
| **External API** | [The Rick and Morty API](https://rickandmortyapi.com/) |

---

## ⚙️ Prerequisites

- **Node.js**: Version 18.0.0 or higher.
- **Java JDK**: Version 17+ (if choosing the Java backend).
- **Maven**: Version 3.8+ (for Java backend).
- **PostgreSQL**: Running on port `5432`.
- **Modern Web Browser**: Chrome, Firefox, Edge, Safari.

---

## 💾 Database Setup & Configuration

1. In PostgreSQL, create the dedicated database:
   ```sql
   CREATE DATABASE rick_morty;
   ```
2. Configure credentials in `miniproyecto_rick_morty/.env`:
   ```env
   PORT=3000
   PGHOST=localhost
   PGPORT=5432
   PGUSER=postgres
   PGPASSWORD=your_password
   PGDATABASE=rick_morty
   ```
3. Initialize the table schema:
   ```bash
   node backend/database/init_postgres.js
   ```

---

## 🚀 Execution Guide (How to Run the Application)

### Option 1: Node.js / Express Backend (Recommended)
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the server:
   ```bash
   npm start
   ```
3. Open in your browser:
   - 🌐 Web Application: [http://localhost:3000](http://localhost:3000)
   - 🩺 Health Check: [http://localhost:3000/api/health](http://localhost:3000/api/health)
   - ⭐ Favorites API: [http://localhost:3000/api/favoritos](http://localhost:3000/api/favoritos)

---

### Option 2: Java Spring Boot Backend
1. Navigate to `backend-java`:
   ```bash
   cd backend-java
   ```
2. Configure PostgreSQL credentials in `src/main/resources/application.properties`.
3. Launch via Maven:
   ```bash
   mvn spring-boot:run
   ```
4. The Java backend runs at port `8080`.

---

## 📡 Local REST API Specifications

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/favoritos` | List all bookmarked favorite characters from PostgreSQL |
| `POST` | `/api/favoritos` | Save a character to PostgreSQL (`character_id`, `name`, `image`, etc.) |
| `DELETE`| `/api/favoritos/:id` | Remove a character from favorites by local record ID |
| `GET` | `/api/stats` | System statistics (total favorites count, dominant species) |
| `GET` | `/api/health` | Health check verifying PostgreSQL database connectivity |

---

## 🛡️ Error Handling & User Feedback

1. **Search with No Matches**: Empty state message inviting the user to adjust filter terms.
2. **Database Downtime**: Graceful `503 Service Unavailable` response if PostgreSQL is offline, with frontend toast alert.
3. **Network Failures**: Catches external API fetch errors and displays non-blocking toast notifications.

---

## ❓ Troubleshooting & FAQ

### 1. `Error: connect ECONNREFUSED 127.0.0.1:5432`
Ensure PostgreSQL service is running and credentials in `.env` match your local setup.

### 2. Can I run both backends simultaneously?
Node.js uses port 3000 and Java uses port 8080. If running Java, ensure the port does not conflict with the Student Management backend.

---

## 👥 Authors & Credits

- **Developer**: Rodrigo Brayan Sango
- **Course**: Web Programming - Seventh Semester
- **Institution**: Universidad Central del Ecuador (UCE)
- **External Data Source**: [The Rick and Morty API](https://rickandmortyapi.com/)
