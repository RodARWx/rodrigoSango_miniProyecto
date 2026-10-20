# 🛸 Rick & Morty Portal - Pure Client-Side Web Explorer

[![Vanilla JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![HTML5](https://img.shields.io/badge/HTML5-Semantic-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/)
[![CSS3](https://img.shields.io/badge/CSS3-Responsive_Grid_Flex-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/)
[![Storage: localStorage](https://img.shields.io/badge/Storage-localStorage-4CAF50?style=for-the-badge&logo=googlechrome&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
[![External API: Rick & Morty](https://img.shields.io/badge/API-The_Rick_%26_Morty_API-00B5CC?style=for-the-badge)](https://rickandmortyapi.com/)

---

## 📋 Table of Contents
1. [Project Overview & Architectural Shift](#-project-overview--architectural-shift)
2. [Objectives](#-objectives)
   - [General Objective](#general-objective)
   - [Specific Objectives](#specific-objectives)
3. [Scope of the System](#-scope-of-the-system)
   - [Core Features](#core-features)
   - [Boundaries & Constraints](#boundaries--constraints)
4. [Project Directory Structure](#-project-directory-structure)
5. [Technology Stack](#-technology-stack)
6. [The 3 Official Endpoints Consumed](#-the-3-official-endpoints-consumed)
7. [Client-Side Persistence (`localStorage`)](#-client-side-persistence-localstorage)
8. [Prerequisites](#-prerequisites)
9. [Execution Guide (How to Run the Application)](#-execution-guide-how-to-run-the-application)
10. [Error Handling & User Feedback](#-error-handling--user-feedback)
11. [Troubleshooting & FAQ](#-troubleshooting--faq)
12. [Authors & Credits](#-authors--credits)

---

## 📖 Project Overview & Architectural Shift

The **Rick & Morty Portal** is an interactive, **100% static client-side web application** built with semantic **HTML5**, modern **CSS3**, and pure **Vanilla ES6+ JavaScript**. It allows users to explore characters and episodes from the *Rick and Morty* universe by directly querying the official public REST API ([rickandmortyapi.com](https://rickandmortyapi.com/)) and persisting bookmarked favorites using browser-native **`localStorage`**.

### Architectural Focus: Pure Client-Side
- **Zero backend dependencies**: No Node.js, Express, Spring Boot, or external databases are required for this subproject.
- **Direct browser-to-API communication**: Native asynchronous `fetch` calls with `async/await` query the external API directly.
- **Native persistence**: Switched from PostgreSQL to browser **`localStorage`**, achieving instant sub-millisecond access, zero server setup, and seamless offline access to saved favorites.
- **Instant deployment**: Ready to deploy on any static hosting provider (GitHub Pages, Vercel, Netlify) or run locally by opening `index.html`.

---

## 🎯 Objectives

### General Objective
To provide a fast, responsive, and serverless client-side web application that directly consumes the public Rick & Morty REST API under strict resource constraints and manages local state persistence seamlessly.

### Specific Objectives
- **Pure Web Standards**: Implement all UI components, routing, and dynamic data binding using pure Vanilla JavaScript, without relying on third-party frameworks or bundlers.
- **Strict API Constraint Compliance**: Respect the architectural constraint of consuming **strictly three (3) official API endpoints**, orchestrating queries efficiently.
- **User Experience Optimization**: Implement an intentional 4.0-second debounced search timer accompanied by a fluid rotating circular CSS spinner and instant <kbd>Enter</kbd> trigger.
- **Efficient Client-Side Storage**: Build a resilient `localStorage` manager that serializes, synchronizes, and prevents duplicate bookmark entries.
- **Modern Responsive Design**: Craft a sci-fi dark aesthetic with high contrast, responsive CSS Grid/Flexbox layouts, and animated feedback toasts.

---

## 🔭 Scope of the System

### Core Features

#### 1. Interactive Catalog & Live Filters
- **Direct Catalog Querying**: Consumes Endpoint 1 to list characters with pagination.
- **Combined Filtering**: Real-time filtering by **Status** (*Alive*, *Dead*, *Unknown*) and **Gender** (*Female*, *Male*, *Genderless*, *Unknown*).
- **Fast Filter Reset**: One-click button (`btn-limpiar-filtros`) to reset all filters to default state.
- **Live Pagination**: Server-side pagination controls (Previous/Next) displaying current page and total records count.

#### 2. Search Engine with Strict 4.0s Delay & Spinner
- **Strict Delay**: Enforces a strict 4.0-second delay (`DELAY_MS = 4000`) while typing in the search input to prevent excessive API requests.
- **Natural Circular Rotating Spinner**: Fluid CSS keyframe animation (`spinner-rotatorio`) active during the 4-second wait, providing clear user feedback.
- **Immediate Execution**: Pressing <kbd>Enter</kbd> bypasses the 4-second timer to fetch results immediately.

#### 3. Character Technical Sheet & Episode Breakdown
- **Dynamic Detail View (`detalle.html`)**: Reads character ID from URL query parameters (`?id=...`) and consumes Endpoint 2.
- **Comprehensive Specs**: High-definition avatar, species, subtype, gender, origin dimension, current location, and alive/dead badge.
- **Multi-Episode Fetching**: Gathers episode IDs associated with the character and queries Endpoint 3 in a single batch request to display episode titles, season/episode codes (e.g., `S01E01`), and original air dates.

#### 4. Persistent Bookmarks ("My Favorites")
- **Dual-State Star Toggle**: Click the star icon (☆ / ★) on any card or detail page to add or remove favorites.
- **Dedicated Favorites Tab**: Displays all bookmarked characters loaded directly from `localStorage` without generating network traffic.
- **Real-Time Badge Sync**: Navbar counter dynamically updates when favorites are added or removed.

### Boundaries & Constraints
- Only the **3 authorized endpoints** from `rickandmortyapi.com` are accessed.
- Persistence is scoped to the client's browser; clearing browser data will reset saved favorites.
- No Node.js runtime, build step (`npm run build`), or backend database is required to run this project.

---

## 📁 Project Directory Structure

```text
miniproyecto_rick_morty/
├── index.html       # Main character catalog, delayed search bar, filters, and favorites tab
├── detalle.html     # Dedicated character technical sheet and episode listing view
├── style.css        # Responsive stylesheet (dark theme, CSS Grid, Flexbox, spinner animations)
├── app.js           # Client logic: Endpoint 1 consumption, 4.0s search timer, localStorage sync
├── detalle.js       # Client logic: Endpoints 2 & 3 consumption, episode parsing, favorite toggle
├── .gitignore       # Git ignore rules for system artifacts and editor caches
└── README.md        # Technical project documentation (English)
```

---

## 🛠️ Technology Stack

| Technology | Purpose |
|---|---|
| **HTML5** | Semantic structure (`<header>`, `<main>`, `<section>`, `<article>`, `<nav>`) |
| **CSS3** | Modern dark theme, CSS Custom Properties, CSS Grid, Flexbox, `@keyframes` |
| **JavaScript (ES6+)** | Asynchronous networking (`fetch`, `async/await`), DOM manipulation, URLSearchParams |
| **Web Storage API** | Browser-native `localStorage` for client-side persistence |
| **Google Fonts (Inter)** | Clean, modern typography |
| **The Rick & Morty API** | Official public data source ([rickandmortyapi.com](https://rickandmortyapi.com/)) |

---

## 🎯 The 3 Official Endpoints Consumed

The application strictly queries **only three (3) official endpoints** directly from client-side JavaScript:

| # | Endpoint URL | HTTP Method | Application Usage |
|---|---|:---:|---|
| **1** | `https://rickandmortyapi.com/api/character/?name={name}&status={status}&gender={gender}&page={page}` | `GET` | **Main Catalog & Search**: Queries characters with combined name, status, and gender filtering alongside live pagination. |
| **2** | `https://rickandmortyapi.com/api/character/{id}` | `GET` | **Character Profile**: Retrieves detailed attributes for a single character (species, origin, location, episode list). |
| **3** | `https://rickandmortyapi.com/api/episode/{ids}` | `GET` | **Episode History**: Fetches episode names, season codes (`SxxExx`), and air dates for all episodes featuring the selected character. |

---

## 💾 Client-Side Persistence (`localStorage`)

All bookmarked favorite characters are stored locally under the key:
```javascript
const STORAGE_KEY_FAVORITOS = 'rick_morty_favoritos';
```

### Stored Record Data Structure
Each bookmarked character is serialized as a JSON object:
```json
[
  {
    "id": 1,
    "name": "Rick Sanchez",
    "status": "Alive",
    "species": "Human",
    "gender": "Male",
    "image": "https://rickandmortyapi.com/api/character/avatar/1.jpeg",
    "origin": { "name": "Earth (C-137)" },
    "location": { "name": "Citadel of Ricks" }
  }
]
```

---

## ⚙️ Prerequisites

Because this project is completely static and serverless:
- **No Node.js or npm is required.**
- **No Java JDK or Maven is required.**
- **No PostgreSQL database service is required.**
- **Requirement**: Any modern web browser (Google Chrome, Mozilla Firefox, Microsoft Edge, Safari, Brave).

---

## 🚀 Execution Guide (How to Run the Application)

### Option 1: VS Code Live Server (Recommended)
1. Open the repository in Visual Studio Code.
2. Navigate to the `miniproyecto_rick_morty/` folder.
3. Right-click on [`index.html`](file:///c:/Users/braya/Documents/Septimo/Programción%20Web/miniproyecto_plan_b/miniproyecto_rick_morty/index.html) and select **"Open with Live Server"**.
4. The application will launch in your browser at `http://127.0.0.1:5500/index.html`.

---

### Option 2: Direct Browser Execution (Zero Setup)
1. In your operating system's file explorer, navigate to:
   ```text
   miniproyecto_plan_b/miniproyecto_rick_morty/
   ```
2. Double-click [`index.html`](file:///c:/Users/braya/Documents/Septimo/Programción%20Web/miniproyecto_plan_b/miniproyecto_rick_morty/index.html).
3. The application runs immediately in your default browser via the `file://` protocol.

---

### Option 3: Local HTTP Server via Terminal
- **Using Node.js (`npx serve`)**:
  ```bash
  cd miniproyecto_rick_morty
  npx serve .
  ```
- **Using Python 3**:
  ```bash
  cd miniproyecto_rick_morty
  python -m http.server 3000
  ```
Open your browser at [http://localhost:3000](http://localhost:3000).

---

## 🛡️ Error Handling & User Feedback

1. **404 Not Found (Search with No Results)**: Displays a styled empty-state card when search or filter criteria yield no characters.
2. **Network Failures**: Catches network errors with `try...catch` and displays non-blocking toast notifications.
3. **Empty Favorites State**: Intuitive guide when no favorites are saved yet.
4. **URL Parameter Validation**: Validates `?id=` parameter on `detalle.html`.

---

## ❓ Troubleshooting & FAQ

### 1. Do I need to run a PostgreSQL database or start a backend?
**No.** All backend and database components were eliminated as unnecessary. The application directly consumes the public API and saves data into `localStorage`.

### 2. Can I access my favorite characters on another browser or device?
Because data is stored in `localStorage`, saved favorites belong to the specific browser and profile where they were created.

### 3. Why does the search have a 4-second delay?
The 4.0-second timer (`DELAY_MS = 4000`) is a strict pedagogical requirement. Press <kbd>Enter</kbd> to execute immediately without waiting.

---

## 👥 Authors & Credits

- **Developer**: Rodrigo Brayan Sango
- **Course**: Web Programming - Seventh Semester
- **Institution**: Universidad Central del Ecuador (UCE)
- **External Data Source**: [The Rick and Morty API](https://rickandmortyapi.com/) created by Axel Fuhrmann.
