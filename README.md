# 🎓 Monorepo: Web Programming Projects (Branch: `feature/WEB-7-jquery-responsiveness-main-project`)

[![Java 17](https://img.shields.io/badge/Java-17-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)](https://www.oracle.com/java/)
[![Spring Boot 3.2.11](https://img.shields.io/badge/Spring_Boot-3.2.11-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white)](https://spring.io/projects/spring-boot)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14+-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![jQuery 3.7.1](https://img.shields.io/badge/jQuery-3.7.1-0769AD?style=for-the-badge&logo=jquery&logoColor=white)](https://jquery.com/)
[![JavaScript Vanilla](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Feature: WEB-7](https://img.shields.io/badge/Jira_Task-WEB--7:_jQuery_Responsiveness-blueviolet?style=for-the-badge)](https://sistemas-uce.atlassian.net/browse/WEB-7)

---

## 📋 Table of Contents
1. [Project Overview & Context](#-project-overview--context)
2. [Feature Spotlight: jQuery Responsiveness (WEB-7)](#-feature-spotlight-jquery-responsiveness-web-7)
3. [Objectives](#-objectives)
   - [General Objective](#general-objective)
   - [Specific Objectives](#specific-objectives)
4. [Scope of the System](#-scope-of-the-system)
   - [1. Student Academic Management System (Responsive Enhanced)](#1-student-academic-management-system-responsive-enhanced)
   - [2. Rick & Morty Client Portal](#2-rick--morty-client-portal)
   - [Boundaries & Constraints](#boundaries--constraints)
5. [Monorepo Directory Structure](#-monorepo-directory-structure)
6. [Technology Stack & Dependencies](#-technology-stack--dependencies)
7. [Responsive Design Specifications & Breakpoints](#-responsive-design-specifications--breakpoints)
8. [Prerequisites](#-prerequisites)
9. [Installation & Setup](#-installation--setup)
   - [Step 1: Clone Repository & Switch Branch](#step-1-clone-repository--switch-branch)
   - [Step 2: PostgreSQL Database Setup](#step-2-postgresql-database-setup)
   - [Step 3: Configuration Properties](#step-3-configuration-properties)
10. [Execution Guide (How to Run the Project)](#-execution-guide-how-to-run-the-project)
    - [Running the Spring Boot Backend](#running-the-spring-boot-backend)
    - [Running the Responsive Frontend](#running-the-responsive-frontend)
    - [Testing Responsive Features in DevTools](#testing-responsive-features-in-devtools)
11. [API & Endpoint Specifications](#-api--endpoint-specifications)
12. [Error Handling & Validation Rules](#-error-handling--validation-rules)
13. [Troubleshooting & FAQ](#-troubleshooting--faq)
14. [Authors & Credits](#-authors--credits)

---

## 📖 Project Overview & Context

This branch represents the implementation of **Jira Task WEB-7: Implement jQuery responsiveness for the main project** within the academic monorepo for the **Web Programming** course (Seventh Semester) at **Universidad Central del Ecuador (UCE)**.

The monorepo contains two primary modules:
1. **Student Academic Management System (Main Project)**: A full-stack academic platform featuring a **Java 17 / Spring Boot** RESTful backend, **PostgreSQL** relational database persistence, and an enhanced responsive frontend with **jQuery 3.7.1** and modern CSS.
2. **Rick & Morty Portal (Subproject)**: An interactive client-side exploration portal consuming the official Rick & Morty REST API ([rickandmortyapi.com](https://rickandmortyapi.com/)) with `localStorage` bookmarking.

---

## 📱 Feature Spotlight: jQuery Responsiveness (WEB-7)

In this branch, the user experience for mobile devices, tablets, and small viewports has been elevated through the integration of **jQuery 3.7.1** and a dedicated responsive controller ([frontend/responsive.js](file:///c:/Users/braya/Documents/Septimo/Programción%20Web/miniproyecto_plan_b/frontend/responsive.js)):

### Key Responsive Features Implemented:
1. **Mobile Animated Hamburger Navigation (`slideToggle`)**:
   - A hamburger toggle button (`#btn-menu-movil`) is displayed on screens `<= 768px`.
   - Clicking smoothly expands or collapses the navigation menu with a 250ms slide animation (`slideDown` / `slideUp`).
   - The hamburger icon dynamically morphs into an "X" via CSS transitions (`.abierto`).
   - **Auto-Close Behavior**: Automatically closes when any navigation link is clicked or when clicking anywhere outside the navbar.

2. **Collapsible Mobile Filter Panel**:
   - A dedicated button (`#btn-toggle-filtros`) enables mobile users to expand or collapse the filtering and sorting controls bar.
   - Dynamic label updates (`"Show Filters"` ↔ `"Hide Filters"`) with animated directional chevron toggles (`▼` ↔ `▲`).
   - Maintains full accessibility compliance with `aria-expanded` attributes.

3. **Floating Scroll-To-Top Button with Smooth Animated Scroll**:
   - A floating back-to-top action button (`#btn-scroll-top`) monitors window scroll events.
   - Smoothly fades in (`fadeIn(250)`) when the user scrolls past **280px**, and fades out (`fadeOut(250)`) when near the top.
   - Clicking triggers a smooth jQuery programmatic scroll (`$('html, body').animate({ scrollTop: 0 }, 400)`).

4. **Real-Time Resolution Adaptation & State Management (`adaptResolution`)**:
   - Window load and debounced resize listeners (`$(window).on('resize load')`, 60ms debounce).
   - Dynamically assigns viewport state classes (`.modo-movil` vs `.modo-escritorio`) to `<body>`.
   - **Context-Aware Search Placeholder**: Automatically sets a compact placeholder on mobile (`"Buscar estudiantes..."`) and restores the full placeholder on desktop screens (`"Escribe para buscar por nombre, curso o correo..."`).
   - Automatically cleans up jQuery inline styles when returning to desktop viewport.

---

## 🎯 Objectives

### General Objective
To optimize the user interface and mobile responsiveness of the Student Academic Management System using jQuery, ensuring seamless navigation, touch friendliness, and fluid animations across all device screen resolutions.

### Specific Objectives
- **Integrate jQuery 3.7.1 via CDN**: Leverage lightweight jQuery methods for cross-browser DOM manipulation, event delegation, and animation effects without altering the existing Vanilla JavaScript application logic ([frontend/app.js](file:///c:/Users/braya/Documents/Septimo/Programción%20Web/miniproyecto_plan_b/frontend/app.js)).
- **Mobile-First Navigation Patterns**: Implement an accessible off-canvas/collapsible hamburger menu that auto-collapses on selection and outside clicks.
- **Save Screen Real Estate**: Keep search filters collapsed by default on narrow mobile viewports to prioritize catalog card content.
- **Enhance Ergonomics**: Provide instant one-tap scroll-to-top navigation for long paginated catalog listings on handheld touch devices.
- **Preserve Desktop Experience**: Ensure zero visual artifacts or lingering inline styles when resizing between mobile and desktop viewport sizes.

---

## 🔭 Scope of the System

### 1. Student Academic Management System (Responsive Enhanced)
- **Responsive Navigation**: Hamburger drawer on mobile (`<= 768px`), standard horizontal navbar on desktop (`> 768px`).
- **Collapsible Filter Bar**: Expandable filter panel on mobile, always-visible inline bar on desktop.
- **Server-Side Paginated Catalog**: 6, 9, 12, or 24 cards per page adapting gracefully from 1 column (mobile) to 2 columns (tablet) and 3 columns (desktop).
- **Search & Autocomplete**: Debounced search with suggestion dropdown styled to prevent viewport overflow.
- **CRUD Operations**: Registration form and update modal with touch-friendly form fields and button targets.
- **Scroll Utility**: Smooth floating scroll-to-top trigger.

### 2. Rick & Morty Client Portal
- 100% static client-side application querying 3 official endpoints.
- Persistent favorites stored in `localStorage`.
- Strict 4.0-second search delay with rotating circular spinner.

### Boundaries & Constraints
- jQuery is strictly utilized for viewport responsiveness, menu transitions, and UI helpers; core data binding and REST API communication continue to run on native ES6+ `fetch`.
- Backend services remain powered by **Java 17 + Spring Boot 3.2.11** with **PostgreSQL**.

---

## 📁 Monorepo Directory Structure

```text
miniproyecto_plan_b/ (Branch: feature/WEB-7-jquery-responsiveness-main-project)
├── pom.xml                                   # Maven configuration for Student Backend (Spring Boot 3.2.11)
├── seed.sql                                  # Initial SQL dataset for PostgreSQL
├── iniciar-postgres.bat                      # Windows batch utility to start PostgreSQL
├── detener-postgres.bat                      # Windows batch utility to stop PostgreSQL
│
├── src/                                      # Main Backend Source Code (Java 17)
│   └── main/
│       ├── java/com/uce/estudiantes/
│       │   ├── EstudiantesApplication.java   # Spring Boot entry point
│       │   ├── controller/
│       │   │   └── EstudianteController.java # REST Controller (CRUD, pagination, filters)
│       │   ├── model/
│       │   │   └── Estudiante.java           # JPA Entity for PostgreSQL 'estudiantes' table
│       │   └── repository/
│       │       └── EstudianteRepository.java # JPA Repository with custom JPQL queries
│       └── resources/
│           └── application.properties        # Server port (8080) and PostgreSQL JDBC settings
│
├── frontend/                                 # 🚀 RESPONSIVE ENHANCED PRESENTATION LAYER
│   ├── index.html                            # Semantic SPA structure with hamburger toggle, modal & CDN jQuery
│   ├── style.css                             # Enhanced responsive stylesheet with mobile animations & media queries
│   ├── app.js                                # Core application logic (fetch, CRUD, debounce, catalog rendering)
│   └── responsive.js                         # 🌟 WEB-7: jQuery responsiveness controller
│
└── miniproyecto_rick_morty/                  # Subproject: 100% Client-Side Rick & Morty App
    ├── README.md                             # Subproject technical documentation
    ├── index.html                            # Character catalog view
    ├── detalle.html                          # Single character detail view
    ├── style.css                             # Sci-fi responsive styles
    ├── app.js                                # Client logic and localStorage manager
    ├── detalle.js                            # Detail logic and favorites toggle
    └── .gitignore                            # Subproject git ignore rules
```

---

## 🛠️ Technology Stack & Dependencies

### Main Project
- **Backend**: Java 17, Spring Boot 3.2.11 (`web`, `data-jpa`, `postgresql`)
- **Database**: PostgreSQL 14+ (`localhost:5432/estudiantes_db`)
- **UI Responsiveness**: **jQuery 3.7.1** (via Official Google CDN)
- **Frontend Logic**: Native JavaScript (ES6+), Fetch API, DOM APIs
- **Presentation**: Semantic HTML5, CSS3 Grid, Flexbox, Custom Properties, Media Queries
- **Typography**: Google Fonts (*Inter*)

---

## 📐 Responsive Design Specifications & Breakpoints

| Breakpoint | Target Devices | Layout Behavior |
|---|---|---|
| `< 480px` | Small Smartphones | Single-column cards, full-width inputs, compact badges, 48px touch targets |
| `480px - 768px` | Large Smartphones / Phablets | Mobile hamburger menu active, collapsible filter panel, 1-2 column cards |
| `769px - 1024px`| Tablets / Small Laptops | Desktop navigation, full horizontal filter bar, 2-column card grid |
| `> 1024px` | Desktops / Large Screens | Standard 3-column card grid, expanded search placeholder, full modal width |

---

## ⚙️ Prerequisites

- **Java JDK**: Version 17 or higher.
- **Apache Maven**: Version 3.8 or higher.
- **PostgreSQL**: Running on port `5432`.
- **Modern Web Browser**: Chrome, Edge, Firefox, or Safari with Developer Tools.

---

## 🚀 Installation & Setup

### Step 1: Clone Repository & Switch Branch
```bash
git clone <repository-url>
cd miniproyecto_plan_b
git checkout feature/WEB-7-jquery-responsiveness-main-project
```

### Step 2: PostgreSQL Database Setup
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

## 💻 Execution Guide (How to Run the Project)

### Running the Spring Boot Backend
From the root directory (`miniproyecto_plan_b`):
```bash
mvn spring-boot:run
```
The REST API will be available at: [http://localhost:8080/api/estudiantes](http://localhost:8080/api/estudiantes)

---

### Running the Responsive Frontend
- **Option 1 (VS Code Live Server - Recommended)**:
  Right-click `frontend/index.html` and click **"Open with Live Server"**.
- **Option 2 (Static Local Server)**:
  ```bash
  npx serve frontend
  ```
- **Option 3 (Direct)**:
  Open `frontend/index.html` directly in your browser.

---

### Testing Responsive Features in DevTools
1. In your browser (Google Chrome or Microsoft Edge), press <kbd>F12</kbd> or <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>I</kbd>.
2. Toggle the Device Toolbar by pressing <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>M</kbd>.
3. Select various device presets:
   - **iPhone SE (375 x 667)**: Verify the hamburger icon morphs to an "X" when clicked, the compact placeholder displays, and the collapsible filter panel opens cleanly.
   - **iPad Mini (768 x 1024)**: Test the boundary breakpoint (`768px`).
   - **Desktop (1280 x 800)**: Verify the hamburger button disappears, the standard navbar displays, and the full search placeholder returns.
4. Scroll down on the catalog to test the **floating scroll-to-top button** fade-in and smooth scroll behavior.

---

## 📡 API & Endpoint Specifications

### Student Management REST API (`http://localhost:8080/api/estudiantes`)

| Method | Endpoint | Query / Path Parameters | Description |
|---|---|---|---|
| `GET` | `/api/estudiantes` | `buscar`, `curso`, `page`, `size`, `sort` | Paginated and filtered student list evaluated server-side |
| `GET` | `/api/estudiantes/todos` | None | Returns all student records without pagination |
| `GET` | `/api/estudiantes/cursos` | None | Returns distinct list of registered courses |
| `GET` | `/api/estudiantes/sugerencias` | `q` (query string) | Up to 5 fast autocomplete suggestions |
| `GET` | `/api/estudiantes/{id}` | `id` (Long) | Fetches single student record |
| `POST` | `/api/estudiantes` | Body JSON | Creates a new student record after strict validation |
| `PUT` | `/api/estudiantes/{id}` | `id` (Long), Body JSON | Updates an existing student's data |
| `DELETE`| `/api/estudiantes/{id}` | `id` (Long) | Deletes a student record permanently |

---

## 🛡️ Error Handling & Validation Rules

- **Client & Server Validation**: Names (3-100 characters, letters only), RFC-compliant email with unique database constraint, course required (3-100 characters), description up to 500 characters with live character counter.
- **Mobile Graceful Degradation**: If JavaScript or jQuery CDN is delayed, default CSS media queries preserve basic layout usability.

---

## ❓ Troubleshooting & FAQ

### 1. Does jQuery interfere with Vanilla JS event listeners in `app.js`?
**No.** `responsive.js` uses namespaced jQuery selectors focused exclusively on mobile UI toggles, scroll thresholds, and viewport state classes. Core data management remains fully handled by `app.js`.

### 2. What happens if the jQuery CDN fails to load?
`frontend/index.html` references the official Google CDN jQuery 3.7.1 over HTTPS. All standard CSS media queries remain functional as a CSS fallback.

### 3. How do I verify the mobile hamburger menu?
Open DevTools, set the width to less than 768px, and click the hamburger icon in the top right corner of the navigation bar.

---

## 👥 Authors & Credits

- **Developer**: Rodrigo Brayan Sango
- **Course**: Web Programming - Seventh Semester
- **Institution**: Universidad Central del Ecuador (UCE)
- **External Resources**:
  - [jQuery 3.7.1](https://jquery.com/)
  - [DiceBear Avatars](https://www.dicebear.com/)
  - [Unsplash](https://unsplash.com/)
