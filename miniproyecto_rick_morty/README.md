# 🛸 Rick & Morty Portal - Responsive Client-Side Explorer (WEB-6 & WEB-8)

[![jQuery 3.7.1](https://img.shields.io/badge/jQuery-3.7.1-0769AD?style=for-the-badge&logo=jquery&logoColor=white)](https://jquery.com/)
[![Vanilla JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![HTML5](https://img.shields.io/badge/HTML5-Semantic-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/)
[![CSS3 Responsive](https://img.shields.io/badge/CSS3-Mobile_Responsive-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/)
[![Storage: localStorage](https://img.shields.io/badge/Storage-localStorage-4CAF50?style=for-the-badge&logo=googlechrome&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
[![Documentation: English](https://img.shields.io/badge/Docs_%26_Comments-English_(WEB--6)-success?style=for-the-badge)](https://sistemas-uce.atlassian.net/browse/WEB-6)

---

## 📋 Table of Contents
1. [Project Overview & Context](#-project-overview--context)
2. [Feature Spotlight: English Documentation & jQuery Responsiveness](#-feature-spotlight-english-documentation--jquery-responsiveness)
3. [Objectives](#-objectives)
   - [General Objective](#general-objective)
   - [Specific Objectives](#specific-objectives)
4. [Scope of the System](#-scope-of-the-system)
   - [Core Features](#core-features)
   - [Boundaries & Constraints](#boundaries--constraints)
5. [Project Directory Structure](#-project-directory-structure)
6. [Technology Stack](#-technology-stack)
7. [The 3 Official Endpoints Consumed](#-the-3-official-endpoints-consumed)
8. [Responsive Design Specifications & Breakpoints](#-responsive-design-specifications--breakpoints)
9. [Client-Side Persistence (`localStorage`)](#-client-side-persistence-localstorage)
10. [Prerequisites](#-prerequisites)
11. [Execution Guide (How to Run the Application)](#-execution-guide-how-to-run-the-application)
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

## 🌟 Feature Spotlight: English Documentation & jQuery Responsiveness

### 1. Monorepo-Wide English Translation (WEB-6)
As part of Jira task **WEB-6**, all technical documentation, code comments, inline docstrings, and UI messaging across the subproject have been standardized into professional English:
- **Client Scripts**: Every function and event handler in [`app.js`](file:///c:/Users/braya/Documents/Septimo/Programción%20Web/miniproyecto_plan_b/miniproyecto_rick_morty/app.js), [`detalle.js`](file:///c:/Users/braya/Documents/Septimo/Programción%20Web/miniproyecto_plan_b/miniproyecto_rick_morty/detalle.js), and [`responsive.js`](file:///c:/Users/braya/Documents/Septimo/Programción%20Web/miniproyecto_plan_b/miniproyecto_rick_morty/responsive.js) is thoroughly documented with English JSDoc annotations.
- **UI & Accessibility Labels**: `aria-label`, placeholder attributes, empty-state text, and status toasts provide clear English feedback.

### 2. Cyber-Themed Mobile Responsiveness (WEB-8)
- **Mobile Hamburger Navigation (`slideToggle`)**: Smooth 250ms slide menu on viewports `<= 768px`, morphing into an animated glowing "X" icon. Auto-closes on tab selection or clicks outside the navbar.
- **Collapsible Filter Panel**: Expandable status and gender filters on mobile viewports (`#btn-toggle-filtros`) with dynamic label toggles (`"Show Filters"` ↔ `"Hide Filters"`).
- **Floating Scroll-To-Top Button**: Monitored scroll threshold (> 280px) triggering smooth animated scrolling to the top (`scrollTop: 0`).
- **Dynamic Search Placeholder**: Automatically switches between compact placeholder on mobile and detailed search instructions on desktop.

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
├── index.html       # Main character catalog with mobile hamburger, collapsible filters & jQuery CDN
├── detalle.html     # Character profile view with mobile responsive header & jQuery CDN
├── style.css        # Responsive stylesheet (dark sci-fi theme, hamburger icon, media queries)
├── app.js           # Core client logic (API queries, 4.0s delay search, localStorage favorites)
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
| **Vanilla JavaScript (ES6+)** | API networking (`fetch`, `async/await`), DOM manipulation, URLSearchParams |
| **HTML5** | Semantic web structure (`<header>`, `<main>`, `<section>`, `<article>`, `<nav>`) |
| **CSS3** | Sci-fi dark palette, CSS Grid, Flexbox, custom properties, `@keyframes` |
| **Web Storage API** | Browser-native `localStorage` for offline favorite characters |
| **Google Fonts (Inter)** | Modern typography |
| **The Rick & Morty API** | Public official data source ([rickandmortyapi.com](https://rickandmortyapi.com/)) |

---

## 🎯 The 3 Official Endpoints Consumed

| # | Endpoint URL | HTTP Method | Application Usage |
|---|---|:---:|---|
| **1** | `https://rickandmortyapi.com/api/character/?name={name}&status={status}&gender={gender}&page={page}` | `GET` | **Catalog & Filtering**: Queries characters with combined name, status, and gender parameters. |
| **2** | `https://rickandmortyapi.com/api/character/{id}` | `GET` | **Character Profile**: Retrieves individual character specs (origin, species, status, episode list). |
| **3** | `https://rickandmortyapi.com/api/episode/{ids}` | `GET` | **Episode Details**: Fetches titles, episode codes (`SxxExx`), and air dates for all appearances. |

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
