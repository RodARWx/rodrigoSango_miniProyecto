# 🎓 Monorepo: Web Programming Projects (Branch: `feature/WEB-6-translate-documentation-comments-to-english`)

[![Java 17](https://img.shields.io/badge/Java-17-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)](https://www.oracle.com/java/)
[![Spring Boot 3.2.11](https://img.shields.io/badge/Spring_Boot-3.2.11-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white)](https://spring.io/projects/spring-boot)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14+-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![jQuery 3.7.1](https://img.shields.io/badge/jQuery-3.7.1-0769AD?style=for-the-badge&logo=jquery&logoColor=white)](https://jquery.com/)
[![JavaScript Vanilla](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![HTML5 & CSS3](https://img.shields.io/badge/HTML5_%26_CSS3-Responsive-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/)
[![Jira: WEB-6](https://img.shields.io/badge/Jira_Task-WEB--6:_English_Docs_%26_Comments-blueviolet?style=for-the-badge)](https://sistemas-uce.atlassian.net/browse/WEB-6)

---

## 📋 Table of Contents
1. [Project Overview & Context](#-project-overview--context)
2. [Feature Spotlight: Monorepo-Wide English Translation (WEB-6)](#-feature-spotlight-monorepo-wide-english-translation-web-6)
3. [Objectives](#-objectives)
   - [General Objective](#general-objective)
   - [Specific Objectives](#specific-objectives)
4. [Scope of the System](#-scope-of-the-system)
   - [1. Student Academic Management System](#1-student-academic-management-system)
   - [2. Rick & Morty Exploration Portal](#2-rick--morty-exploration-portal)
   - [Boundaries & Constraints](#boundaries--constraints)
5. [Monorepo Directory Structure](#-monorepo-directory-structure)
6. [Technology Stack & Dependencies](#-technology-stack--dependencies)
7. [Responsive Design Specifications & Breakpoints](#-responsive-design-specifications--breakpoints)
8. [Prerequisites](#-prerequisites)
9. [Installation & Setup](#-installation--setup)
   - [Step 1: Clone Repository & Switch Branch](#step-1-clone-repository--switch-branch)
   - [Step 2: PostgreSQL Database for Student System](#step-2-postgresql-database-for-student-system)
   - [Step 3: Configuration Properties](#step-3-configuration-properties)
10. [Execution Guide (How to Run Both Projects)](#-execution-guide-how-to-run-both-projects)
    - [Running the Student Management System](#running-the-student-management-system)
    - [Running the Rick & Morty Portal](#running-the-rick--morty-portal)
    - [Testing Responsive Behavior in DevTools](#testing-responsive-behavior-in-devtools)
11. [API Specifications](#-api-specifications)
12. [Error Handling & Validation Rules](#-error-handling--validation-rules)
13. [Troubleshooting & FAQ](#-troubleshooting--faq)
14. [Authors & Credits](#-authors--credits)

---

## 📖 Project Overview & Context

This branch represents the implementation of **Jira Task WEB-6: Translate projects documentation and code comments to English** within the academic monorepo for the **Web Programming** course (Seventh Semester) at **Universidad Central del Ecuador (UCE)**.

The monorepo contains two primary web applications:
1. **Student Academic Management & Query System**: A full-stack academic platform featuring a **Java 17 / Spring Boot** RESTful backend, **PostgreSQL** relational database persistence, and an enhanced responsive frontend with **jQuery 3.7.1** and modern CSS.
2. **Rick & Morty Portal (Subproject)**: An interactive client-side exploration portal consuming the official Rick & Morty REST API ([rickandmortyapi.com](https://rickandmortyapi.com/)) with `localStorage` bookmarking and mobile-first jQuery adaptivity.

---

## 🌐 Feature Spotlight: Monorepo-Wide English Translation (WEB-6)

In this branch, the entire codebase was audited and refactored to comply with professional global software development standards by translating all internal and external documentation into English across 17 files:

### Key Translation Areas:
1. **Backend Java & Spring Boot (`/src`)**:
   - Class-level and method-level **Javadoc** in [`EstudianteController.java`](file:///c:/Users/braya/Documents/Septimo/Programción%20Web/miniproyecto_plan_b/src/main/java/com/uce/estudiantes/controller/EstudianteController.java), [`Estudiante.java`](file:///c:/Users/braya/Documents/Septimo/Programción%20Web/miniproyecto_plan_b/src/main/java/com/uce/estudiantes/model/Estudiante.java), and [`EstudianteRepository.java`](file:///c:/Users/braya/Documents/Septimo/Programción%20Web/miniproyecto_plan_b/src/main/java/com/uce/estudiantes/repository/EstudianteRepository.java).
   - Validation error messages and descriptions in [`application.properties`](file:///c:/Users/braya/Documents/Septimo/Programción%20Web/miniproyecto_plan_b/src/main/resources/application.properties) and [`pom.xml`](file:///c:/Users/braya/Documents/Septimo/Programción%20Web/miniproyecto_plan_b/pom.xml).
   - Mock database records and seed data comments in [`seed.sql`](file:///c:/Users/braya/Documents/Septimo/Programción%20Web/miniproyecto_plan_b/seed.sql).

2. **Student Management Frontend (`/frontend`)**:
   - Comprehensive **JSDoc annotations** and technical block comments across [`app.js`](file:///c:/Users/braya/Documents/Septimo/Programción%20Web/miniproyecto_plan_b/frontend/app.js) and [`responsive.js`](file:///c:/Users/braya/Documents/Septimo/Programción%20Web/miniproyecto_plan_b/frontend/responsive.js).
   - User-facing status messages, placeholders, tooltips, and accessibility labels in [`index.html`](file:///c:/Users/braya/Documents/Septimo/Programción%20Web/miniproyecto_plan_b/frontend/index.html).
   - CSS component section headers and animation keyframe notes in [`style.css`](file:///c:/Users/braya/Documents/Septimo/Programción%20Web/miniproyecto_plan_b/frontend/style.css).

3. **Rick & Morty Subproject (`/miniproyecto_rick_morty`)**:
   - All logic comments in [`app.js`](file:///c:/Users/braya/Documents/Septimo/Programción%20Web/miniproyecto_plan_b/miniproyecto_rick_morty/app.js), [`detalle.js`](file:///c:/Users/braya/Documents/Septimo/Programción%20Web/miniproyecto_plan_b/miniproyecto_rick_morty/detalle.js), and [`responsive.js`](file:///c:/Users/braya/Documents/Septimo/Programción%20Web/miniproyecto_plan_b/miniproyecto_rick_morty/responsive.js).
   - Markup semantic notes and internationalized toast notifications across [`index.html`](file:///c:/Users/braya/Documents/Septimo/Programción%20Web/miniproyecto_plan_b/miniproyecto_rick_morty/index.html) and [`detalle.html`](file:///c:/Users/braya/Documents/Septimo/Programción%20Web/miniproyecto_plan_b/miniproyecto_rick_morty/detalle.html).

---

## 🎯 Objectives

### General Objective
To elevate the quality, maintainability, and professionalism of the monorepo by standardizing all source code comments, API documentation, and technical documentation into industry-standard English, while maintaining full full-stack responsiveness.

### Specific Objectives
- **Codebase Internationalization (WEB-6)**: Establish uniform English conventions across Java, JavaScript, HTML, CSS, SQL, and configuration files.
- **Maintain Full Responsiveness (WEB-7 & WEB-8)**: Keep jQuery 3.7.1 responsive controllers in both applications (mobile hamburger menus, collapsible filter drawers, floating back-to-top actions).
- **Ensure Strict API Compliance**: Adhere to the pedagogical constraint of querying **strictly three (3) official endpoints** from the public Rick & Morty API.
- **Data Integrity & Scalability**: Preserve server-side pagination (`Pageable`), filtering, and multi-criteria sorting on the Student Academic Management system.

---

## 🔭 Scope of the System

### 1. Student Academic Management System
- **Responsive Navigation**: Hamburger drawer on mobile (`<= 768px`), horizontal navbar on desktop (`> 768px`).
- **Collapsible Filter Bar**: Expandable filter panel on mobile, always-visible inline bar on desktop.
- **Server-Side Paginated Catalog**: Responsive cards adapting from 1 column (mobile) to 2 columns (tablet) and 3 columns (desktop).
- **Search & Autocomplete**: Debounced query input with instant floating suggestion menu.
- **Full CRUD with Modales**: Inline editing modal dialog (PUT), strict validation, and safe deletion (DELETE).
- **Floating Scroll-To-Top**: Smooth animated scrolling on catalog lists.

### 2. Rick & Morty Exploration Portal
- **Direct API Catalog**: Real-time queries for characters, pagination, and multi-filter controls (Status & Gender).
- **Strict 4.0s Search Delay & Spinner**: Pedagogical requirement enforced (`DELAY_MS = 4000`) with rotating circular CSS loader and immediate <kbd>Enter</kbd> trigger.
- **Responsive Navigation**: Cyber hamburger menu on mobile, horizontal navigation on desktop.
- **Collapsible Filter Bar**: Expandable filter drawer on mobile viewports.
- **Dual-View Mobile Integration**: Unified responsive header across `index.html` and `detalle.html`.
- **`localStorage` Bookmarks**: Add, view, and remove favorites with immediate UI feedback toasts.

### Boundaries & Constraints
- Only the **Student Management System** requires Java, Maven, and PostgreSQL.
- The **Rick & Morty Portal** is strictly static client-side (no Node.js or database needed).
- All source code and documentation must remain strictly in **English**.

---

## 📁 Monorepo Directory Structure

```text
miniproyecto_plan_b/ (Branch: feature/WEB-6-translate-documentation-comments-to-english)
├── pom.xml                                   # Maven configuration with English comments (Spring Boot 3.2.11)
├── seed.sql                                  # Test dataset with English annotations for PostgreSQL
├── iniciar-postgres.bat                      # Windows script to start PostgreSQL service
├── detener-postgres.bat                      # Windows script to stop PostgreSQL service
│
├── src/                                      # Main Student Backend (Java 17 + Spring Boot, English Javadoc)
│   └── main/
│       ├── java/com/uce/estudiantes/
│       │   ├── EstudiantesApplication.java   # Spring Boot Application entry point
│       │   ├── controller/
│       │   │   └── EstudianteController.java # REST Controller with comprehensive English Javadoc
│       │   ├── model/
│       │   │   └── Estudiante.java           # JPA Entity for PostgreSQL 'estudiantes' table
│       │   └── repository/
│       │       └── EstudianteRepository.java # JPA Repository with custom JPQL queries
│       └── resources/
│           └── application.properties        # Server port (8080) and PostgreSQL JDBC settings
│
├── frontend/                                 # Student System Presentation Layer (English JSDoc)
│   ├── index.html                            # SPA interface (Catalog, Registration, Edit Modal, jQuery CDN)
│   ├── style.css                             # Responsive CSS (Grid, Flexbox, hamburger animations, media queries)
│   ├── app.js                                # Core application logic with English JSDoc comments
│   └── responsive.js                         # jQuery responsiveness controller with English comments
│
└── miniproyecto_rick_morty/                  # Client-Side Rick & Morty App (Modular Architecture, WEB-11 to WEB-14)
    ├── README.md                             # Subproject technical documentation (English)
    ├── js/                                   # Pure ES6 modular architecture (WEB-11 & WEB-12)
    │   ├── api/rickMortyApi.js               # Decoupled REST HTTP client (Character, Location, Episode APIs)
    │   ├── storage/favoritesStorage.js       # LocalStorage bookmark manager & data normalizer
    │   ├── ui/                               # Presentation layer (WEB-12)
    │   │   ├── renderers.js                  # Card, pagination & status template renderers
    │   │   └── toast.js                      # Standalone floating notification dispatcher
    │   └── utils/throttle.js                 # Rate limiters (throttleLeading, throttle, debounce)
    ├── index.html                            # Character catalog with cyber hamburger & jQuery CDN
    ├── detalle.html                          # Single character detail view with responsive header & jQuery CDN
    ├── style.css                             # Cyber-themed responsive stylesheet
    ├── app.js                                # Modular catalog controller (ES Module - WEB-13)
    ├── detalle.js                            # Modular pipeline orchestrator (ES Module - WEB-14)
    ├── responsive.js                         # jQuery responsive controller with English comments
    ├── test-regression.mjs                   # Automated E2E regression verification test runner (WEB-15)
    └── .gitignore                            # Subproject git ignore rules
```

---

## 🛠️ Technology Stack & Dependencies

### Main Project (Student Management System)
- **Backend**: Java 17, Spring Boot 3.2.11 (`web`, `data-jpa`, `postgresql`)
- **Database**: PostgreSQL 14+ (`localhost:5432/estudiantes_db`)
- **UI Responsiveness**: **jQuery 3.7.1** (via Google CDN)
- **Frontend Logic**: Native JavaScript (ES6+), Fetch API, DOM APIs
- **Presentation**: Semantic HTML5, CSS3 Grid, Flexbox, Custom Properties

### Rick & Morty Subproject (Client-Side)
- **UI Responsiveness**: **jQuery 3.7.1** (via Google CDN)
- **Architecture**: 100% Static Client-Side
- **Networking**: Asynchronous `fetch` / `async/await`
- **Persistence**: Browser-native `localStorage` (`rick_morty_favoritos`)
- **Styling**: Sci-fi dark palette, CSS Grid, Flexbox, `@keyframes` animations

---

## 📐 Responsive Design Specifications & Breakpoints

| Breakpoint | Target Devices | Layout Behavior |
|---|---|---|
| `< 480px` | Small Smartphones | Single-column cards, compact search placeholder, full-width buttons |
| `480px - 768px` | Large Smartphones / Tablets | Mobile hamburger menu active, collapsible filter panel, 1-2 column cards |
| `769px - 1024px`| Tablets / Small Laptops | Desktop navigation, full horizontal filter bar, 2-column card grid |
| `> 1024px` | Desktops / Large Screens | Standard 3-column card grid, expanded search placeholder, full modal width |

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
git checkout feature/WEB-6-translate-documentation-comments-to-english
```

### Step 2: PostgreSQL Database for Student System
1. Start PostgreSQL (e.g., execute `iniciar-postgres.bat` on Windows).
2. Create the required database:
   ```sql
   CREATE DATABASE estudiantes_db;
   ```
3. (Optional) Populate seed data:
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

## 💻 Execution Guide (How to Run Both Projects)

### Running the Student Management System
1. **Launch the Spring Boot Backend**:
   ```bash
   mvn spring-boot:run
   ```
   Backend will start at: [http://localhost:8080/api/estudiantes](http://localhost:8080/api/estudiantes)

2. **Open the Student Frontend**:
   - Open `frontend/index.html` in VS Code using **Live Server**, or
   - Run `npx serve frontend` inside `frontend/`.

---

### Running the Rick & Morty Portal
- **Option A (VS Code Live Server - Recommended)**:
  Right-click `miniproyecto_rick_morty/index.html` and choose **"Open with Live Server"**.
- **Option B (Direct Browser)**:
  Double-click `miniproyecto_rick_morty/index.html` in your file explorer.
- **Option C (Lightweight Local Server)**:
  ```bash
  cd miniproyecto_rick_morty
  npx serve .
  ```
  Open [http://localhost:3000](http://localhost:3000).

---

### Testing Responsive Behavior in DevTools
1. Press <kbd>F12</kbd> or <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>I</kbd> in your browser.
2. Toggle the Device Toolbar (<kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>M</kbd>).
3. Test both applications under mobile dimensions (`<= 768px`):
   - **Student Portal**:
     - Click the mobile hamburger menu in the top right to verify smooth `slideToggle`.
     - Click **"Show Filters"** to expand the course and sort dropdowns.
     - Scroll down to verify the floating **Scroll-to-Top** button.
   - **Rick & Morty Portal**:
     - Test the glowing cyber hamburger menu on both `index.html` and `detalle.html`.
     - Collapse and expand character status/gender filters.
     - Scroll through the character catalog and test the animated back-to-top scroll.

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

### 2. Rick & Morty API (Chained Multi-Service Join - WEB-9)
The client application chains and orchestrates the **three official resources** of the public API:
1. `GET https://rickandmortyapi.com/api/character/{id}` (**Character Service**): Queries baseline character traits and relational URLs (`location.url`, `episode[]`).
2. `GET https://rickandmortyapi.com/api/location/{id}` (**Location Service**): Chained from `character.location.url` to resolve planetary specifications, dimension, and resident count.
3. `GET https://rickandmortyapi.com/api/episode/{ids}` (**Episode Service**): Chained from `character.episode` to perform a batch query for episode titles, season codes, and air dates.
*Catalog querying also utilizes `GET /api/character/?name=...` with a strict 4.0s debounce.*

### 3. Rate Limiting & Performance Optimization (Throttle & Debounce)
Both projects implement standardized rate-limiting utilities to ensure fluid 60fps rendering and prevent duplicate requests:
- **Debounce**: 4000ms delay with rotating spinner feedback on Rick & Morty search input; 250ms debounce on Student search filtering.
- **Scroll Throttle**: Floating scroll-to-top button threshold checks throttled to 150ms in both subprojects.
- **Resize Throttle**: Responsive viewport recalculations throttled to 100ms in both subprojects.
- **Leading Throttle (Actions & Pagination)**: Catalog pagination buttons throttled to 400–450ms; favorite bookmarks throttled to 350–400ms; Student form submissions (POST/PUT) throttled to 400ms to eliminate duplicate server records.

---

## 🛡️ Error Handling & Validation Rules

- **Student System**: Server-side validation rejecting invalid names, malformed/duplicate emails, and over-length descriptions.
- **Rick & Morty System**: Client-side network error handling with `try...catch`, non-blocking toast notifications on failed requests, empty search feedback, and validation of missing URL parameters on `detalle.html`.

---

## ❓ Troubleshooting & FAQ

### 1. Why are all comments and documentation written in English?
To meet the requirements of Jira task WEB-6, which standardizes documentation, code comments, and interfaces into English to follow international engineering best practices.

### 2. Does jQuery affect desktop performance?
**No.** All jQuery listeners use event delegation and debounced resize handlers (60ms), ensuring high rendering performance and zero layout stutter.

---

## 👥 Authors & Credits

- **Developer**: Rodrigo Brayan Sango
- **Course**: Web Programming - Seventh Semester
- **Institution**: Universidad Central del Ecuador (UCE)
- **External Resources**:
  - [The Rick and Morty API](https://rickandmortyapi.com/)
  - [jQuery 3.7.1](https://jquery.com/)
  - [DiceBear Avatars](https://www.dicebear.com/)
  - [Unsplash](https://unsplash.com/)
