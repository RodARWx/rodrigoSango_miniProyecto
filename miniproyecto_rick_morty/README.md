# 🛸 Rick & Morty Portal - Responsive Client-Side Explorer (WEB-6 & WEB-8)

[![jQuery 3.7.1](https://img.shields.io/badge/jQuery-3.7.1-0769AD?style=for-the-badge&logo=jquery&logoColor=white)](https://jquery.com/)
[![Vanilla JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![HTML5](https://img.shields.io/badge/HTML5-Semantic-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/)
[![CSS3 Responsive](https://img.shields.io/badge/CSS3-Mobile_Responsive-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/)
[![Storage: localStorage](https://img.shields.io/badge/Storage-localStorage-4CAF50?style=for-the-badge&logo=googlechrome&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
[![Documentation: English](https://img.shields.io/badge/Docs_%26_Comments-English_(WEB--6)-success?style=for-the-badge)](https://sistemas-uce.atlassian.net/browse/WEB-6)
[![Chained API Join](https://img.shields.io/badge/Jira_Task-WEB--9:_Chained_API_Join-blueviolet?style=for-the-badge)](https://sistemas-uce.atlassian.net/browse/WEB-9)
[![Modular Architecture](https://img.shields.io/badge/Jira_Task-WEB--11:_Modular_Architecture-0052CC?style=for-the-badge)](https://sistemas-uce.atlassian.net/browse/WEB-11)
[![UI Renderers & Toast](https://img.shields.io/badge/Jira_Task-WEB--12:_UI_Renderers_%26_Toast-0052CC?style=for-the-badge)](https://sistemas-uce.atlassian.net/browse/WEB-12)
[![Catalog Controller](https://img.shields.io/badge/Jira_Task-WEB--13:_Catalog_Controller-0052CC?style=for-the-badge)](https://sistemas-uce.atlassian.net/browse/WEB-13)

---

## 📋 Table of Contents
1. [Project Overview & Context](#-project-overview--context)
2. [Feature Spotlight: English Documentation, Responsiveness & Chained API Join](#-feature-spotlight-english-documentation-responsiveness--chained-api-join)
3. [Objectives](#-objectives)
   - [General Objective](#general-objective)
   - [Specific Objectives](#specific-objectives)
4. [Scope of the System](#-scope-of-the-system)
   - [Core Features](#core-features)
   - [Boundaries & Constraints](#boundaries--constraints)
5. [Project Directory Structure](#-project-directory-structure)
6. [Technology Stack](#-technology-stack)
7. [Chained Multi-Service API Specifications (WEB-9)](#-chained-multi-service-api-specifications-web-9)
8. [Modular Architecture & Shared ES Modules (WEB-11)](#-modular-architecture--shared-es-modules-web-11)
9. [Responsive Design Specifications & Breakpoints](#-responsive-design-specifications--breakpoints)
10. [Client-Side Persistence (`localStorage`)](#-client-side-persistence-localstorage)
11. [Prerequisites](#-prerequisites)
12. [Execution Guide (How to Run the Application)](#-execution-guide-how-to-run-the-application)
    - [Running with Live Server](#running-with-live-server)
    - [Direct Browser Execution](#direct-browser-execution)
    - [Testing Mobile Responsiveness in DevTools](#testing-mobile-responsiveness-in-devtools)
12. [Error Handling & User Feedback](#-error-handling--user-feedback)
13. [Troubleshooting & FAQ](#-troubleshooting--faq)
14. [Authors & Credits](#-authors--credits)

---

## 📖 Project Overview & Context

The **Rick & Morty Portal** is an interactive, **100% static client-side web application** built with semantic **HTML5**, modern **CSS3**, **Vanilla ES6+ JavaScript**, and enhanced with **jQuery 3.7.1** for fluid mobile responsiveness.

The application allows users to explore characters and episodes from the *Rick and Morty* universe by directly querying the official public REST API ([rickandmortyapi.com](https://rickandmortyapi.com/)) from the browser, persisting bookmarked favorite characters inside native **`localStorage`**.

---

## 🌟 Feature Spotlight: English Documentation, Responsiveness & Chained API Join

### 1. Monorepo-Wide English Translation (WEB-6)
All technical documentation, code comments, inline docstrings, and UI messaging across the subproject have been standardized into professional English.

### 2. Cyber-Themed Mobile Responsiveness (WEB-8)
- **Mobile Hamburger Navigation (`slideToggle`)**: Smooth 250ms slide menu on viewports `<= 768px`.
- **Collapsible Filter Panel**: Expandable status and gender filters on mobile viewports.
- **Floating Scroll-To-Top Button**: Smooth animated scrolling to the top (`scrollTop: 0`).

### 3. Chained Multi-Service Join (WEB-9)
Implements an end-to-end chained pipeline linking the **three core services** of the Rick & Morty API in a join-like operation:
1. **Character Service (`GET /api/character/{id}`)**: Queries individual character specs and extracts foreign relational references (`location.url` and `episode[]`).
2. **Location Service (`GET /api/location/{id}`)**: Chained from `character.location.url`, querying detailed planetary data: planet name, classification type, dimension, and known resident count.
3. **Episode Service (`GET /api/episode/{ids}`)**: Chained from `character.episode`, performing a batch query for episode titles, season codes (`SxxExx`), and original air dates.
4. **Visual Pipeline Indicator**: A reactive UI header displays the 3-step pipeline state (`Character ➔ Location ➔ Episode`) in real time.

---

## 🎯 Objectives

### General Objective
To provide a fast, responsive, fully internationalized client-side web application that directly consumes the public Rick & Morty REST API under strict resource constraints and manages local state persistence seamlessly.

### Specific Objectives
- **Internationalize Codebase (WEB-6)**: Adopt industry-standard English commenting and documentation across all modules to improve maintainability and professional presentation.
- **Integrate jQuery 3.7.1 via CDN**: Implement UI helper routines without conflicting with the native `fetch` data-fetching pipeline.
- **Strict API Constraint Compliance**: Respect the architectural constraint of consuming **strictly three (3) official API endpoints**, orchestrating queries efficiently.
- **User Experience Optimization**: Implement an intentional 4.0-second debounced search timer accompanied by a fluid rotating circular CSS spinner and instant <kbd>Enter</kbd> trigger.
- **Efficient Client-Side Storage**: Build a resilient `localStorage` manager that serializes, synchronizes, and prevents duplicate bookmark entries.

---

## 🔭 Scope of the System

### Core Features

#### 1. Responsive Character Catalog & Filtering
- Queries Endpoint 1 to display paginated character cards.
- Multi-criteria filtering by **Status** (*Alive*, *Dead*, *Unknown*) and **Gender** (*Female*, *Male*, *Genderless*, *Unknown*).
- Collapsible filter panel on mobile viewports (`<= 768px`).

#### 2. Search Engine with 4.0s Delay & Animated Spinner
- Pedagogical 4.0-second timer (`DELAY_MS = 4000`) with a rotating circular CSS spinner.
- Pressing <kbd>Enter</kbd> triggers immediate search without delay.
- Dynamic input placeholder switching between mobile and desktop screens.

#### 3. Character Profile & Episode History (`detalle.html`)
- Dedicated technical sheet consuming Endpoints 2 and 3.
- Responsive layout with high-definition character photo, traits, and complete episode listing.
- Responsive navigation with back-to-catalog button and favorite star toggle.

#### 4. Persistent Bookmarks ("My Favorites")
- One-click favorite bookmarking persisted in `localStorage`.
- Dedicated tab to browse, search, and manage saved characters with zero network overhead.

### Boundaries & Constraints
- Only the **3 authorized endpoints** from `rickandmortyapi.com` are queried.
- Data persistence is localized to the user's browser `localStorage`.
- No backend server or database is required for this subproject.

---

## 📁 Project Directory Structure

```text
miniproyecto_rick_morty/
├── js/
│   ├── api/
│   │   └── rickMortyApi.js       # Pure ES module HTTP client (Character, Location, Episode APIs)
│   ├── storage/
│   │   └── favoritesStorage.js   # Decoupled localStorage persistence & bookmark normalizer
│   ├── ui/
│   │   ├── renderers.js          # Pure UI template renderers (cards, pagination, empty/error states)
│   │   └── toast.js              # Standalone notification dispatcher (success, warning, error, info)
│   └── utils/
│       └── throttle.js           # Functional rate limiters (throttleLeading, throttle, debounce)
├── index.html       # Main character catalog with mobile hamburger, collapsible filters & jQuery CDN
├── detalle.html     # Character profile view with mobile responsive header & jQuery CDN
├── style.css        # Responsive stylesheet (dark sci-fi theme, hamburger icon, media queries)
├── app.js           # Modular catalog controller (ES Module - WEB-13, SRP state & event orchestrator)
├── detalle.js       # Profile logic (Endpoints 2 & 3 consumption, episode parsing, favorite toggle)
├── responsive.js    # jQuery responsive controller (hamburger, filter toggle, scroll-to-top)
├── .gitignore       # Git ignore rules for system artifacts
└── README.md        # Technical project documentation (English)
```

---

## 🛠️ Technology Stack

| Technology | Purpose |
|---|---|
| **jQuery 3.7.1** | Mobile hamburger animation, collapsible filters, smooth scroll-to-top, viewport adaptivity |
| **Vanilla JavaScript (ES6+)** | API networking (`fetch`, `async/await`), DOM manipulation, URLSearchParams, ES Modules |
| **HTML5** | Semantic web structure (`<header>`, `<main>`, `<section>`, `<article>`, `<nav>`) |
| **CSS3** | Sci-fi dark palette, CSS Grid, Flexbox, custom properties, `@keyframes` |
| **Web Storage API** | Browser-native `localStorage` for offline favorite characters |
| **Google Fonts (Inter)** | Modern typography |
| **The Rick & Morty API** | Public official data source ([rickandmortyapi.com](https://rickandmortyapi.com/)) |

## 🎯 Chained Multi-Service API Specifications (WEB-9)

The application combines and orchestrates the **three official resources** of the Rick & Morty API in a chained relational workflow:

| # | Service & Endpoint | HTTP Method | Chained Pipeline Role |
|---|---|:---:|---|
| **1** | **Character Service**<br>`https://rickandmortyapi.com/api/character/{id}` | `GET` | **Entry Service**: Baseline character traits, portrait, origin metadata, and relational URLs (`location.url`, `episode[]`). |
| **2** | **Location Service**<br>`https://rickandmortyapi.com/api/location/{id}` | `GET` | **Chained Join 1**: Resolved from `character.location.url` to extract planet name, classification type, dimension, and resident count. |
| **3** | **Episode Service**<br>`https://rickandmortyapi.com/api/episode/{ids}` | `GET` | **Chained Join 2**: Resolved from `character.episode` to perform a batch query for episode titles, season codes (`SxxExx`), and air dates. |

> [!NOTE]
> The catalog view also uses `GET /api/character/?name=...&status=...` to list and filter characters with debounced search.

### ⚡ Rate Limiting & Performance Optimization (Throttle & Debounce)

| Mechanism | Target Component | Threshold / Cadence | Technical Purpose |
|---|---|:---:|---|
| **Debounce** | `#input-busqueda` | 4000 ms (4.0s) | Waits for typing cessation with an animated spinner before querying the Character API. |
| **Throttle** | `window.on('scroll')` | 150 ms | Regulates floating scroll-to-top button threshold checks, preserving smooth 60fps scrolling. |
| **Throttle** | `window.on('resize')` | 100 ms | Regulates mobile/desktop viewport mode adaptation without CPU spiking. |
| **Leading Throttle** | `btnPaginaAnterior`, `btnPaginaSiguiente` | 450 ms | Prevents API request flooding from rapid clicks on catalog pagination. |
| **Leading Throttle** | Card & Detail Favorite buttons | 350–400 ms | Prevents double-click race conditions and duplicate writes to `localStorage`. |

---

## 🧱 Modular Architecture & Controllers (WEB-11, WEB-12 & WEB-13)

In **WEB-11, WEB-12 & WEB-13**, monolithic script responsibilities were extracted into dedicated, reusable **ES6 pure modules** and lightweight controllers to satisfy the **Single Responsibility Principle (SRP)** and eliminate code duplication (DRY):

| Module / Controller | Location | Primary Responsibilities | Zero-DOM Contract |
|---|---|---|:---:|
| **Storage Service** | `js/storage/favoritesStorage.js` | • Centralizes `localStorage` reading/writing under `rick_morty_favoritos`.<br>• Normalizes character attributes across schemas (`nombre`/`name`, `estado`/`status`, etc.).<br>• Exposes `getFavorites()`, `saveFavorites()`, `toggleFavorite()`, `isFavorite()`, `getFavoriteIds()`, `clearFavorites()`. | ✅ Yes |
| **API Client** | `js/api/rickMortyApi.js` | • Encapsulates HTTP networking via native `fetch`.<br>• Standardizes query parameter construction via `URLSearchParams`.<br>• Uniform error handling and 404 normalization for empty filter results.<br>• Normalizes single vs batch episode responses into consistent Arrays.<br>• Exposes `getCharacters()`, `getCharacterById()`, `getLocation()`, `getEpisodes()`. | ✅ Yes |
| **Functional Utils** | `js/utils/throttle.js` | • `throttleLeading(func, cooldownMs)`: Leading-edge throttle for interactive UI buttons.<br>• `throttle(func, limitMs)`: Interval throttle for high-frequency viewport & scroll events.<br>• `debounce(func, delayMs)`: Inactivity delay limiter with `.cancel()` capability. | ✅ Yes |
| **UI Renderers** | `js/ui/renderers.js` | • `createCharacterCardHtml(character, isFavorite)`: Pure sanitized markup generation for catalog cards.<br>• `createCharacterCardElement(character, isFav, handlers)`: DOM card element factory.<br>• `renderPaginationControls(page, total, count)`: Calculates boundary states & button disabled flags.<br>• `renderEmptyState(msg, opts)` & `renderErrorState(msg, backLink)`: Standardized feedback builders.<br>• `renderEpisodeItemHtml(ep)` & `renderCharacterProfile(...)`: Technical specs & chained pipeline presentation. | ✅ Pure Data In / Pure Markup Out |
| **Toast Notifications** | `js/ui/toast.js` | • Standalone, reusable floating notification dispatcher.<br>• Supports multiple severity levels: `success`/`exito`, `warning`/`advertencia`, `eliminar`, `error`, `info`.<br>• Self-mounts dynamically to `#toast-contenedor` or creates it on demand.<br>• Handles entry and exit fade animations automatically. | ✅ Decoupled Dispatcher |
| **Catalog Controller** | `app.js` | • Coordinates catalog view lifecycle, tab navigation, and pagination boundaries.<br>• Enforces 4.0s pedagogical debounced search with spinner and instant <kbd>Enter</kbd> trigger.<br>• Zero embedded `fetch` or direct `localStorage` access (delegates to ES modules). | 🔄 View Controller (SRP) |

---

## 📐 Responsive Design Specifications & Breakpoints

| Breakpoint | Target Devices | Responsive Behavior |
|---|---|---|
| `< 480px` | Small Smartphones | Single-column card grid, compact search placeholder, full-width buttons |
| `480px - 768px` | Large Smartphones / Tablets | Mobile hamburger menu active, collapsible filter panel, 1-2 column cards |
| `> 768px` | Desktops / Laptops | Standard horizontal navigation, inline filter bar, 3-column card grid, full placeholder |

---

## 💾 Client-Side Persistence (`localStorage`)

Favorites are stored under the key:
```javascript
const STORAGE_KEY_FAVORITOS = 'rick_morty_favoritos';
```
Each entry stores: `id`, `name`, `status`, `species`, `gender`, `image`, `origin`, and `location`.

---

## ⚙️ Prerequisites

Because this application is 100% client-side:
- **No Node.js or npm is required.**
- **No Java JDK or Maven is required.**
- **No PostgreSQL database is required.**
- **Requirement**: Any modern web browser (Chrome, Firefox, Edge, Safari).

---

## 🚀 Execution Guide (How to Run the Application)

### Running with Live Server
1. Open the repository in Visual Studio Code.
2. Navigate to `miniproyecto_rick_morty/`.
3. Right-click on [`index.html`](file:///c:/Users/braya/Documents/Septimo/Programción%20Web/miniproyecto_plan_b/miniproyecto_rick_morty/index.html) and select **"Open with Live Server"**.

---

### Direct Browser Execution
1. Open your operating system's file manager and locate `miniproyecto_rick_morty/`.
2. Double-click [`index.html`](file:///c:/Users/braya/Documents/Septimo/Programción%20Web/miniproyecto_plan_b/miniproyecto_rick_morty/index.html).

---

### Testing Mobile Responsiveness in DevTools
1. Press <kbd>F12</kbd> or <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>I</kbd> in your browser.
2. Toggle the Device Toolbar (<kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>M</kbd>).
3. Test with device profiles:
   - **Mobile (<= 768px)**:
     - Click the cyber hamburger button in the top right to verify smooth `slideToggle` navigation.
     - Click **"Show Filters"** above the catalog to test the collapsible filters panel.
     - Check the compact search input placeholder.
   - **Scroll & Scroll-to-Top**:
     - Scroll down through the catalog to see the floating scroll-to-top button fade in.
     - Click it to verify smooth animated scrolling to the top.
   - **Desktop (> 768px)**:
     - Expand window width to confirm the hamburger hides and the desktop layout restores seamlessly.

---

## 🛡️ Error Handling & User Feedback

1. **404 Not Found (No Results)**: Displays an informative empty-state card encouraging the user to try different terms.
2. **Network Failures**: Catches API fetch errors with `try...catch` and displays floating toast notifications.
3. **Empty Favorites State**: Guided call-to-action inviting users to bookmark characters with the star button.

---

## ❓ Troubleshooting & FAQ

### 1. Are all comments and docs in English?
**Yes.** Under Jira task WEB-6, all source files in this project adhere to standard English conventions.

### 2. Does jQuery slow down the API calls?
**No.** jQuery is solely used for DOM presentation helpers (hamburger menu, collapsible filters, and smooth scroll). Networking is handled natively via ES6+ `fetch`.

### 3. Can I use the mobile menu on `detalle.html`?
**Yes.** The `responsive.js` controller is linked on both `index.html` and `detalle.html`, providing a consistent mobile experience across all views.

---

## 👥 Authors & Credits

- **Developer**: Rodrigo Brayan Sango
- **Course**: Web Programming - Seventh Semester
- **Institution**: Universidad Central del Ecuador (UCE)
- **External Data Source**: [The Rick and Morty API](https://rickandmortyapi.com/)
- **Libraries**: [jQuery 3.7.1](https://jquery.com/)
