# 🎓 Monorepo: Web Programming Projects (Branch: `feature/WEB-8-jquery-responsiveness-rick-morty`)

[![Java 17](https://img.shields.io/badge/Java-17-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)](https://www.oracle.com/java/)
[![Spring Boot 3.2.11](https://img.shields.io/badge/Spring_Boot-3.2.11-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white)](https://spring.io/projects/spring-boot)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14+-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![jQuery 3.7.1](https://img.shields.io/badge/jQuery-3.7.1-0769AD?style=for-the-badge&logo=jquery&logoColor=white)](https://jquery.com/)
[![JavaScript Vanilla](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Feature: WEB-8](https://img.shields.io/badge/Jira_Task-WEB--8:_jQuery_Responsiveness_(Rick_%26_Morty)-blueviolet?style=for-the-badge)](https://sistemas-uce.atlassian.net/browse/WEB-8)

---

## 📋 Table of Contents
1. [Project Overview & Context](#-project-overview--context)
2. [Feature Spotlight: Rick & Morty jQuery Responsiveness (WEB-8)](#-feature-spotlight-rick--morty-jquery-responsiveness-web-8)
3. [Objectives](#-objectives)
   - [General Objective](#general-objective)
   - [Specific Objectives](#specific-objectives)
4. [Scope of the System](#-scope-of-the-system)
   - [1. Student Academic Management System](#1-student-academic-management-system)
   - [2. Rick & Morty Responsive Exploration Portal](#2-rick--morty-responsive-exploration-portal)
   - [Boundaries & Constraints](#boundaries--constraints)
5. [Monorepo Directory Structure](#-monorepo-directory-structure)
6. [Technology Stack & Dependencies](#-technology-stack--dependencies)
7. [Responsive Design Specifications & Breakpoints](#-responsive-design-specifications--breakpoints)
8. [Prerequisites](#-prerequisites)
9. [Installation & Setup](#-installation--setup)
   - [Step 1: Clone Repository & Switch Branch](#step-1-clone-repository--switch-branch)
   - [Step 2: PostgreSQL Database for Student System](#step-2-postgresql-database-for-student-system)
   - [Step 3: Configuration Properties](#step-3-configuration-properties)
10. [Execution Guide (How to Run Each Project)](#-execution-guide-how-to-run-each-project)
    - [Running the Student Management System](#running-the-student-management-system)
    - [Running the Rick & Morty Responsive Portal](#running-the-rick--morty-responsive-portal)
    - [Testing Mobile Responsiveness in DevTools](#testing-mobile-responsiveness-in-devtools)
11. [API Specifications](#-api-specifications)
12. [Error Handling & Validation Rules](#-error-handling--validation-rules)
13. [Troubleshooting & FAQ](#-troubleshooting--faq)
14. [Authors & Credits](#-authors--credits)

---

## 📖 Project Overview & Context

This branch represents the implementation of **Jira Task WEB-8: Implement jQuery responsiveness for the Rick and Morty project** within the academic monorepo for the **Web Programming** course (Seventh Semester) at **Universidad Central del Ecuador (UCE)**.

The monorepo contains two primary web applications:
1. **Student Academic Management System**: Full-stack platform featuring a **Java 17 / Spring Boot** RESTful backend, **PostgreSQL** relational database persistence, and an interactive Vanilla JavaScript frontend.
2. **Rick & Morty Portal (Subproject)**: A 100% client-side exploration web app that directly consumes the official public REST API ([rickandmortyapi.com](https://rickandmortyapi.com/)), now enhanced with **jQuery 3.7.1** for seamless mobile responsiveness and fluid animations.

---

## 📱 Feature Spotlight: Rick & Morty jQuery Responsiveness (WEB-8)

In this branch, the Rick & Morty subproject received comprehensive mobile responsiveness improvements via **jQuery 3.7.1** and a shared responsive controller ([miniproyecto_rick_morty/responsive.js](file:///c:/Users/braya/Documents/Septimo/Programción%20Web/miniproyecto_plan_b/miniproyecto_rick_morty/responsive.js)):

### Key Enhancements Implemented in WEB-8:
1. **Cyber-Themed Mobile Hamburger Navigation (`slideToggle`)**:
   - A dedicated hamburger menu button (`#btn-menu-movil`) is displayed on screens `<= 768px`.
   - Smoothly reveals or hides navigation tabs with a 250ms slide animation (`slideDown` / `slideUp`).
   - The hamburger icon animates into an illuminated "X" through CSS transforms (`.abierto`).
   - Automatically collapses when selecting a tab or clicking outside the navigation bar.

2. **Mobile Collapsible Filter Drawer**:
   - An interactive toggle button (`#btn-toggle-filtros`) allows users to collapse or expand the status and gender filters.
   - Dynamic label updates (`"Show Filters"` ↔ `"Hide Filters"`) with animated chevron indicators (`▼` ↔ `▲`).
   - Prioritizes character cards on smaller viewports while keeping filters accessible with a single tap.

3. **Floating Sci-Fi Scroll-To-Top Button**:
   - Monitored scroll listener fades in a back-to-top floating button (`#btn-scroll-top`) past **280px** scroll threshold (`fadeIn(250)`).
   - Smooth animated programmatic scroll to the top (`$('html, body').animate({ scrollTop: 0 }, 400)`).

4. **Dual-View Integration (`index.html` & `detalle.html`)**:
   - The responsive controller is integrated across both the main character catalog and the individual character detail view.
   - Dynamic placeholder swapping on the search input (compact on mobile vs detailed on desktop).
   - Real-time debounced resize listener (60ms) ensuring smooth transition between mobile and desktop layouts.

---

## 🎯 Objectives

### General Objective
To optimize the mobile user experience of the Rick & Morty Portal using jQuery 3.7.1, enabling touch-friendly navigation, collapsible filter panels, and smooth animations across all screen sizes.

### Specific Objectives
- **Integrate jQuery 3.7.1 via CDN**: Implement UI helper routines without conflicting with the native `fetch` data-fetching pipeline.
- **Mobile-First UX Patterns**: Reduce visual clutter on handheld devices by collapsing secondary controls into accessible toggle drawers.
- **Multi-View Consistency**: Share the responsive controller seamlessly across both the main character catalog (`index.html`) and the individual detail view (`detalle.html`).
- **Maintain Strict API Constraints**: Continue adhering to the project rule of consuming **strictly three (3) official API endpoints**.
- **Preserve Zero-Backend Simplicity**: Keep the application 100% serverless with instant deployment capability.

---

## 🔭 Scope of the System

### 1. Student Academic Management System
- **Server-Side Paginator**: Dynamic responsive cards with configurable page sizing (6, 9, 12, 24).
- **Search with Server Autocomplete**: Debounced query input with instant floating suggestion menu.
- **Dynamic Course Filtering**: Dropdown populated from unique course entries in PostgreSQL.
- **Full CRUD with Modales**: Inline editing modal dialog (PUT), strict validation, and safe deletion (DELETE).

### 2. Rick & Morty Responsive Exploration Portal
- **Direct API Catalog**: Real-time queries for characters, pagination, and multi-filter controls (Status & Gender).
- **Strict 4.0s Search Delay & Spinner**: Pedagogical requirement enforced (`DELAY_MS = 4000`) with rotating circular CSS loader and immediate <kbd>Enter</kbd> trigger.
- **Responsive Navigation**: Cyber hamburger menu on mobile, horizontal navigation on desktop.
- **Collapsible Filter Bar**: Expandable filter drawer on mobile viewports.
- **Floating Scroll-To-Top**: Smooth animated scrolling on long catalogs.
- **`localStorage` Bookmarks**: Add, view, and remove favorites with immediate UI feedback toasts.

### Boundaries & Constraints
- Only the **Student Management System** requires Java, Maven, and PostgreSQL.
- The **Rick & Morty Portal** is strictly static client-side (no Node.js or database needed).
- All frontend interactions use **Vanilla JavaScript (ES6+)** combined with **jQuery 3.7.1** for UI responsiveness.

---

## 📁 Monorepo Directory Structure

```text
miniproyecto_plan_b/ (Branch: feature/WEB-8-jquery-responsiveness-rick-morty)
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
└── miniproyecto_rick_morty/                  # 🚀 RESPONSIVE ENHANCED RICK & MORTY PORTAL (WEB-8)
    ├── README.md                             # Subproject technical documentation
    ├── index.html                            # Character catalog with mobile hamburger & jQuery CDN
    ├── detalle.html                          # Single character detail view with mobile header & jQuery CDN
    ├── style.css                             # Cyber-themed responsive stylesheet
    ├── app.js                                # Client logic and localStorage favorites manager
    ├── detalle.js                            # Detail logic and episode breakdown
    ├── responsive.js                         # 🌟 WEB-8: jQuery responsive controller
    └── .gitignore                            # Subproject git ignore rules
```

---

## 🛠️ Technology Stack & Dependencies

### Main Project
- **Backend**: Java 17, Spring Boot 3.2.11 (`web`, `data-jpa`, `postgresql`)
- **Database**: PostgreSQL 14+ (`localhost:5432/estudiantes_db`)
- **Frontend Logic**: Native JavaScript (ES6+), Fetch API, DOM APIs
- **Presentation**: Semantic HTML5, CSS3 Grid, Flexbox, Custom Properties

### Rick & Morty Subproject (WEB-8 Enhanced)
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
| `> 768px` | Desktops / Laptops | Standard horizontal navigation, inline filter bar, 3-column card grid, full placeholder |

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
git checkout feature/WEB-8-jquery-responsiveness-rick-morty
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

## 💻 Execution Guide (How to Run Each Project)

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

### Running the Rick & Morty Responsive Portal
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

### Testing Mobile Responsiveness in DevTools
1. Press <kbd>F12</kbd> or <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>I</kbd> in your browser.
2. Toggle the Device Toolbar (<kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>M</kbd>).
3. Select mobile dimensions (`<= 768px`):
   - Click the cyber hamburger icon in the navigation bar to test the `slideToggle` menu.
   - Click **"Show Filters"** to expand the status and gender filters.
   - Notice the compact search input placeholder.
   - Scroll down the catalog to trigger the **floating scroll-to-top button**, and click it to smoothly scroll back to the top.

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

- **Student System**: Server-side validation rejecting invalid names, malformed/duplicate emails, and over-length descriptions.
- **Rick & Morty System**: Client-side network error handling with `try...catch`, non-blocking toast notifications on failed requests, empty search feedback, and validation of missing URL parameters on `detalle.html`.

---

## ❓ Troubleshooting & FAQ

### 1. Does jQuery slow down the API calls?
**No.** jQuery is solely used for DOM presentation helpers (hamburger menu, collapsible filters, and smooth scroll). Networking is handled natively via ES6+ `fetch`.

### 2. Can I use the mobile menu on `detalle.html`?
**Yes.** The `responsive.js` controller is linked on both `index.html` and `detalle.html`, providing a consistent mobile experience across all views.

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
