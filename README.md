# 🎓 Monorepo: Web Programming Projects (Branch: `feature/WEB-7-WEB-8-jquery-responsiveness`)

[![Java 17](https://img.shields.io/badge/Java-17-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)](https://www.oracle.com/java/)
[![Spring Boot 3.2.11](https://img.shields.io/badge/Spring_Boot-3.2.11-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white)](https://spring.io/projects/spring-boot)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14+-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![jQuery 3.7.1](https://img.shields.io/badge/jQuery-3.7.1-0769AD?style=for-the-badge&logo=jquery&logoColor=white)](https://jquery.com/)
[![JavaScript Vanilla](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![HTML5 & CSS3](https://img.shields.io/badge/HTML5_%26_CSS3-Responsive-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/)
[![Combined Jira Tasks](https://img.shields.io/badge/Jira-WEB--7_%26_WEB--8:_Unified_jQuery_Responsiveness-blueviolet?style=for-the-badge)](https://sistemas-uce.atlassian.net/)

---

## 📋 Table of Contents
1. [Project Overview & Context](#-project-overview--context)
2. [Unified Feature Spotlight: Full-Stack jQuery Responsiveness (WEB-7 & WEB-8)](#-unified-feature-spotlight-full-stack-jquery-responsiveness-web-7--web-8)
   - [Part 1: Student Academic Management System (WEB-7)](#part-1-student-academic-management-system-web-7)
   - [Part 2: Rick & Morty Client Portal (WEB-8)](#part-2-rick--morty-client-portal-web-8)
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

This branch, **`feature/WEB-7-WEB-8-jquery-responsiveness`**, represents the consolidated merge of two foundational user experience milestones for the **Web Programming** course (Seventh Semester) at **Universidad Central del Ecuador (UCE)**:
- **WEB-7**: Implementation of jQuery-powered mobile responsiveness for the Main Student Academic Management System.
- **WEB-8**: Implementation of jQuery-powered mobile responsiveness for the Rick & Morty Exploration Portal.

By merging both feature branches, this repository achieves full, harmonious mobile adaptivity across all frontends in the monorepo while preserving backend performance and data integrity.

---

## 📱 Unified Feature Spotlight: Full-Stack jQuery Responsiveness (WEB-7 & WEB-8)

### Part 1: Student Academic Management System (WEB-7)
Implemented via [frontend/responsive.js](file:///c:/Users/braya/Documents/Septimo/Programción%20Web/miniproyecto_plan_b/frontend/responsive.js) and enhanced styles in [frontend/style.css](file:///c:/Users/braya/Documents/Septimo/Programción%20Web/miniproyecto_plan_b/frontend/style.css):
- **Mobile Animated Hamburger Drawer (`slideToggle`)**: Smooth 250ms expansion on viewports `<= 768px` with icon transformation into an "X" (`.abierto`). Auto-collapses on link clicks or clicking outside the navbar.
- **Collapsible Search & Filter Panel**: Mobile toggle button (`#btn-toggle-filtros`) with dynamic labels (`"Show Filters"` ↔ `"Hide Filters"`), animated chevron flip (`▼` ↔ `▲`), and `aria-expanded` attributes.
- **Floating Scroll-To-Top**: Fades in past a 280px vertical scroll threshold (`fadeIn(250)`) and triggers smooth animated scrolling (`scrollTop: 0`, 400ms).
- **Viewport State Engine (`adaptResolution`)**: Assigns `.modo-movil` or `.modo-escritorio` body classes and dynamically swaps search input placeholders between mobile and desktop viewports.

### Part 2: Rick & Morty Client Portal (WEB-8)
Implemented via [miniproyecto_rick_morty/responsive.js](file:///c:/Users/braya/Documents/Septimo/Programción%20Web/miniproyecto_plan_b/miniproyecto_rick_morty/responsive.js) and cyber-themed styles in [miniproyecto_rick_morty/style.css](file:///c:/Users/braya/Documents/Septimo/Programción%20Web/miniproyecto_plan_b/miniproyecto_rick_morty/style.css):
- **Cyber-Themed Mobile Hamburger Navigation**: Seamless responsive menu across both [`index.html`](file:///c:/Users/braya/Documents/Septimo/Programción%20Web/miniproyecto_plan_b/miniproyecto_rick_morty/index.html) and [`detalle.html`](file:///c:/Users/braya/Documents/Septimo/Programción%20Web/miniproyecto_plan_b/miniproyecto_rick_morty/detalle.html).
- **Collapsible Character Filter Bar**: Hides secondary status and gender filters on handheld devices to emphasize character cards.
- **Sci-Fi Floating Scroll-To-Top**: Floating glowing button for quick return to top of catalog.
- **Dynamic Search Placeholder**: Automatically switches between compact and detailed search guidance.

---

## 🎯 Objectives

### General Objective
To provide a cohesive, production-grade mobile responsive experience across all subprojects in the monorepo using jQuery 3.7.1, ensuring visual consistency, touch ergonomicity, and fluid UI animations.

### Specific Objectives
- **Harmonize Responsiveness Patterns**: Unify responsive UI behavior (hamburger menus, collapsible filter drawers, back-to-top floating actions) across both applications.
- **Clean Decoupling**: Ensure jQuery responsiveness controllers ([frontend/responsive.js](file:///c:/Users/braya/Documents/Septimo/Programción%20Web/miniproyecto_plan_b/frontend/responsive.js) and [miniproyecto_rick_morty/responsive.js](file:///c:/Users/braya/Documents/Septimo/Programción%20Web/miniproyecto_plan_b/miniproyecto_rick_morty/responsive.js)) operate cleanly without altering existing core application logic ([frontend/app.js](file:///c:/Users/braya/Documents/Septimo/Programción%20Web/miniproyecto_plan_b/frontend/app.js) and [miniproyecto_rick_morty/app.js](file:///c:/Users/braya/Documents/Septimo/Programción%20Web/miniproyecto_plan_b/miniproyecto_rick_morty/app.js)).
- **Optimize Touch Target Ergonomics**: Ensure all clickable controls meet accessibility standards (minimum 44x44px touch targets on mobile).
- **Maintain Architectural Precision**: Preserve enterprise-grade server-side architecture (Spring Boot + PostgreSQL) for academic records while keeping public API consumption (Rick & Morty) 100% client-side with `localStorage`.

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
- All frontend interactions use **Vanilla JavaScript (ES6+)** combined with **jQuery 3.7.1** for UI responsiveness.

---

## 📁 Monorepo Directory Structure

```text
miniproyecto_plan_b/ (Branch: feature/WEB-7-WEB-8-jquery-responsiveness)
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
├── frontend/                                 # 🌟 WEB-7: STUDENT SYSTEM (RESPONSIVE ENHANCED)
│   ├── index.html                            # SPA interface (Catalog, Registration, Edit Modal, jQuery CDN)
│   ├── style.css                             # Responsive CSS (Grid, Flexbox, hamburger animations, media queries)
│   ├── app.js                                # Core application logic (fetch, CRUD, debounce, catalog rendering)
│   └── responsive.js                         # 📱 WEB-7: jQuery responsiveness controller
│
└── miniproyecto_rick_morty/                  # 🌟 WEB-8: RICK & MORTY PORTAL (RESPONSIVE ENHANCED)
    ├── README.md                             # Subproject technical documentation
    ├── index.html                            # Character catalog with cyber hamburger & jQuery CDN
    ├── detalle.html                          # Single character detail view with responsive header & jQuery CDN
    ├── style.css                             # Cyber-themed responsive stylesheet
    ├── app.js                                # Client logic and localStorage favorites manager
    ├── detalle.js                            # Detail logic and episode breakdown
    ├── responsive.js                         # 📱 WEB-8: jQuery responsive controller
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
git checkout feature/WEB-7-WEB-8-jquery-responsiveness
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

### 1. Why are there two `responsive.js` files?
Each application has its own dedicated responsive controller ([frontend/responsive.js](file:///c:/Users/braya/Documents/Septimo/Programción%20Web/miniproyecto_plan_b/frontend/responsive.js) for Student Academic Management and [miniproyecto_rick_morty/responsive.js](file:///c:/Users/braya/Documents/Septimo/Programción%20Web/miniproyecto_plan_b/miniproyecto_rick_morty/responsive.js) for Rick & Morty) to guarantee complete decoupling and autonomous execution.

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
