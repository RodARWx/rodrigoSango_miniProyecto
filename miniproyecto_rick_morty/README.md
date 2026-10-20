# 🛸 Rick & Morty Portal - Client-Side Web Explorer

An interactive, **100% static (Client-Side)** web application built with **HTML5, CSS3, and modern Vanilla JavaScript**, designed to browse and discover characters and episodes from the *Rick and Morty* universe by directly consuming its official public API ([rickandmortyapi.com](https://rickandmortyapi.com/)) and managing favorite characters via browser **`localStorage`**.

---

## ⚡ Key Features

1. **100% Client-Side Architecture (Serverless & Database-Free)**:
   - No runtime dependencies on Node.js, Express, Java, or external databases.
   - Direct asynchronous HTTP requests using browser `fetch` and `async/await`.
   - Ready for instant deployment on static hosting platforms (GitHub Pages, Vercel, Netlify, Cloudflare Pages).

2. **Local Persistence with `localStorage`**:
   - Save and remove favorite characters directly in the browser's persistent storage.
   - Real-time synchronization across the catalog view, character detail view, and dedicated **"My Favorites"** tab.
   - Instant offline access to previously saved characters.

3. **Interactive Search with 4.0-Second Delay**:
   - Strict 4.0-second debounced delay (`DELAY_MS = 4000`) while typing to optimize API request frequency.
   - **Smooth rotating animated spinner** providing continuous visual feedback during the search delay.
   - <kbd>Enter</kbd> key shortcut to bypass the timer and execute the search query immediately.

4. **Combined Filters & Dynamic Pagination**:
   - Simultaneous filtering by **Status** (*Alive*, *Dead*, *Unknown*) and **Gender** (*Female*, *Male*, *Genderless*, *Unknown*).
   - Instant one-click filter reset button.
   - Dynamic live pagination controls with Previous/Next buttons and total count metrics.

5. **Technical Profile & Episode Breakdown**:
   - Dedicated detailed view (`detalle.html`) displaying full character specifications: species, sub-species, origin, and current location.
   - Structured list of all episodes featuring the character, including season codes (e.g., `S01E01`), episode titles, and original air dates.

6. **High-Fidelity Visual Design**:
   - Responsive layout powered by **CSS Grid** and **Flexbox**, tailored for mobile phones, tablets, and desktops.
   - Cyberpunk/Sci-Fi inspired dark theme with cyan and emerald accents.
   - Modern *Inter* typography from Google Fonts and non-intrusive floating toast notifications.

---

## 🎯 Official Endpoints Consumed

The application communicates exclusively with **3 official public endpoints** directly from the client browser:

| # | Endpoint URL | HTTP Method | Application Usage |
|---|---|:---:|---|
| **1** | `https://rickandmortyapi.com/api/character/?name=...&status=...&gender=...&page=...` | `GET` | **General Catalog & Search**: Filter by name, status, gender, and live page index. |
| **2** | `https://rickandmortyapi.com/api/character/{id}` | `GET` | **Individual Profile**: Comprehensive character attributes by unique ID. |
| **3** | `https://rickandmortyapi.com/api/episode/{ids}` | `GET` | **Episode History**: Fetches episode titles, season codes, and air dates. |

---

## 💾 Favorites Management via `localStorage`

Favorites persistence operates under the storage key `'rick_morty_favoritos'`:

* **Save:** Clicking the star icon (☆) stores the character object as JSON in local storage and transitions the button to an active state (★).
* **Remove:** Clicking an active star icon (★) removes the corresponding item from `localStorage`.
* **"My Favorites" Tab:** Reads the locally stored array and provides instant searching and filtering without making network requests.

---

## 📁 Project Structure

```text
miniproyecto_rick_morty/
├── index.html       # Main character catalog, 4s-delay search, filters, and favorites tab
├── detalle.html     # Detailed character specifications and episode history
├── style.css        # Responsive styling system, dark mode palette, and spinner animations
├── app.js           # Client logic: Endpoint 1 consumption, search, filters, and localStorage
├── detalle.js       # Client logic: Endpoints 2 & 3 consumption, and favorites toggle
├── responsive.js    # jQuery-based mobile responsiveness controller (WEB-8)
├── .gitignore       # Git ignored files and directories
├── .vscode/         # VS Code workspace preferences
└── README.md        # Project documentation
```

---

## 🚀 Running the Application

As a 100% static web application, no dependencies (`npm install`), compilation steps, or backend servers are required.

### Option 1: Live Server Extension for VS Code (Recommended)
1. Open the project folder in Visual Studio Code.
2. Right-click on [`index.html`](index.html).
3. Select **"Open with Live Server"**.

### Option 2: Open Directly in Your Browser
1. Double-click [`index.html`](index.html) from your Windows File Explorer.
2. The application will immediately run in your default web browser (Chrome, Edge, Firefox, etc.).

### Option 3: Local HTTP Static Server via Terminal
Using Node.js:
```bash
npx serve .
```
Or using Python:
```bash
python -m http.server 3000
```
Then navigate to [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📄 License

Developed as an academic project for Web Programming. Data and visual assets provided by the [Rick and Morty Public API](https://rickandmortyapi.com/).
