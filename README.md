# Academic Monorepo Project

A comprehensive web monorepo featuring two decoupled applications designed for Web Programming (Programación Web):

1. **Student Management System (`/frontend` & `/src`)**: Full-stack application utilizing Spring Boot, Spring Data JPA, PostgreSQL, and a responsive vanilla JavaScript client enhanced with jQuery.
2. **Rick and Morty Explorer (`/miniproyecto_rick_morty`)**: Client-side single-page application integrating with the public Rick and Morty REST API, featuring interactive search, character catalogs, detailed profiles, and mobile-first jQuery adaptivity.

---

## Repository Structure

```text
├── frontend/                     # Student Management frontend application
│   ├── index.html                # Single-page interface (SPA tabs, modal, grids)
│   ├── style.css                 # CSS Grid, Flexbox, custom properties, and media queries
│   ├── app.js                    # Core logic: REST API integration, live validation, autocomplete
│   └── responsive.js             # jQuery-powered responsive behavior & mobile navigation (WEB-7)
├── miniproyecto_rick_morty/      # Rick and Morty API Explorer
│   ├── index.html                # Main character catalog and search view
│   ├── detalle.html              # Character details and episode showcase view
│   ├── style.css                 # Sci-fi themed responsive stylesheet
│   ├── app.js                    # Catalog logic: REST API fetching, debounce, pagination
│   ├── detalle.js                # Detail view logic: character and episode parsing
│   ├── responsive.js             # jQuery-powered responsive behavior (WEB-8)
│   └── README.md                 # Dedicated Rick and Morty documentation
├── src/                          # Backend Spring Boot application
│   └── main/java/com/uce/estudiantes/
│       ├── EstudiantesApplication.java   # Spring Boot entry point
│       ├── controller/                   # REST API controllers
│       ├── model/                        # JPA entity definitions
│       └── repository/                   # Spring Data JPA repositories
├── pom.xml                       # Maven configuration and dependencies
├── seed.sql                      # Mock database seed script
└── application.properties        # Backend server and database configuration
```

---

## 1. Student Management System

### Technologies
- **Backend**: Java 17, Spring Boot 3.2.x, Spring Data JPA, Hibernate, PostgreSQL
- **Frontend**: HTML5, Vanilla CSS3 (CSS Grid & Flexbox), Vanilla JavaScript (ES6+), jQuery 3.7.1
- **Icons & Avatars**: DiceBear API / Unsplash

### Core Features
- **Full CRUD Support**: Create, Read, Update, and Delete student records with optimistic and synchronized updates.
- **Real-Time Autocomplete & Search**: Instant 0ms local suggestion cache enriched with concurrent server queries.
- **Server-Side Pagination & Sorting**: High-performance pagination with dynamic page sizes and sorting criteria.
- **Strict Client-Side Validation**: Immediate feedback on name, email format, course, and optional avatar URLs.
- **jQuery Mobile Responsiveness**:
  - Hamburger navigation drawer.
  - Collapsible filter controls.
  - Floating smooth scroll-to-top button.
  - Dynamic viewport detection and placeholder adaptivity.

### Running the Student Management System
1. **Start PostgreSQL**:
   Ensure PostgreSQL is running locally on port `5432` with a database named `estudiantes_db`.
   ```bash
   # Run the provided batch file or start PostgreSQL via your service manager
   ./iniciar-postgres.bat
   ```
2. **Launch the Spring Boot API**:
   ```bash
   ./mvnw spring-boot:run
   ```
   The backend API will be available at `http://localhost:8080/api/estudiantes`.
3. **Open the Frontend**:
   Serve `frontend/index.html` via any static file server or open directly in a modern web browser.

---

## 2. Rick & Morty API Explorer

### Technologies
- **Frontend**: HTML5 Semantic markup, Modern CSS3 with sci-fi design system, JavaScript ES6+, jQuery 3.7.1
- **External API**: [The Rick and Morty API](https://rickandmortyapi.com/)

### Core Features
- **Dynamic Catalog**: Grid of character cards displaying portrait, status indicator, species, and last known location.
- **Live Search & Status Filters**: Instant filtering by name, alive/dead/unknown status, and species.
- **Character Detail View**: Full character metadata, first appearance, and paginated episode appearances.
- **jQuery Responsive Adaptivity**:
  - Animated mobile hamburger menu.
  - Collapsible filter drawer.
  - Dynamic placeholders and back-to-top floating button.

### Running the Rick & Morty Explorer
Open `miniproyecto_rick_morty/index.html` in any modern web browser or run with a local development server (e.g., Live Server, `npx serve miniproyecto_rick_morty`).

---

## Git Workflow & Conventions
- **Feature Branches**: Named according to Jira tasks (e.g., `feature/WEB-7-WEB-8-jquery-responsiveness`, `feature/WEB-6-translate-documentation-comments-to-english`).
- **Code Comments & Documentation**: Maintained in English across all modules as specified in Jira task `WEB-6`.
