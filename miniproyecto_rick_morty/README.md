# 🛸 Portal Rick & Morty - Explorador Web Client-Side

Aplicación web interactiva y **100% estática (Client-Side)** desarrollada con **HTML5, CSS3 y Vanilla JavaScript puro**, diseñada para consultar y explorar personajes y episodios del universo de *Rick and Morty* mediante el consumo directo de su API pública oficial ([rickandmortyapi.com](https://rickandmortyapi.com/)) y almacenamiento de favoritos en el navegador mediante **`localStorage`**.

---

## ⚡ Características Principales

1. **Arquitectura 100% Client-Side (Sin Servidor ni Base de Datos)**:
   - Sin dependencias de Node.js, Express, Java ni bases de datos externas.
   - Peticiones asíncronas directas al navegador con `fetch` y `async/await`.
   - Lista para desplegarse de inmediato en cualquier servicio de hosting estático (GitHub Pages, Vercel, Netlify, Cloudflare Pages).

2. **Persistencia Local con `localStorage`**:
   - Guarda y elimina personajes favoritos directamente en el almacenamiento local del navegador (`localStorage`).
   - Sincronización en tiempo real entre la vista del catálogo, la vista de detalle y la pestaña dedicada **"Mis Favoritos"**.
   - Acceso instantáneo y offline a tus personajes guardados previamente.

3. **Búsqueda Interactiva con Delay de 4.0 Segundos**:
   - Tiempo de espera estricto de 4.0 segundos (`DELAY_MS = 4000`) mientras el usuario escribe en el catálogo para optimizar el consumo de la API.
   - **Spinner animado circular fluido** que rota de forma natural durante la espera.
   - Soporte de tecla <kbd>Enter</kbd> para ejecutar la consulta de manera inmediata sin esperar los 4 segundos.

4. **Filtros Combinados y Paginación Dinámica**:
   - Filtrado simultáneo por **Estado** (*Vivo*, *Muerto*, *Desconocido*) y **Género** (*Femenino*, *Masculino*, *Sin género*, *Desconocido*).
   - Botón de limpieza rápida de filtros.
   - Paginación dinámica en vivo con botones de página anterior/siguiente y conteo total.

5. **Ficha Técnica y Detalle de Episodios**:
   - Vista individual detallada (`detalle.html`) con especificaciones completas: especie, sub-tipo, origen y ubicación actual.
   - Desglose estructurado de todos los episodios en los que participa el personaje con sus respectivos códigos de emisión (ej. `S01E01`), títulos y fechas de emisión.

6. **Diseño Visual de Alta Fidelidad**:
   - Sistema responsivo con **CSS Grid** y **Flexbox** optimizado para móviles, tablets y escritorios.
   - Paleta de colores oscura inspirada en ciencia ficción con acentos cian y esmeralda.
   - Tipografía moderna *Inter* de Google Fonts y notificaciones flotantes (Toasts).

---

## 🎯 Los 3 Endpoints Oficiales Consumidos

La aplicación consume exclusivamente **3 endpoints oficiales** directamente desde el navegador:

| # | Endpoint Oficial | Método HTTP | Uso en la Aplicación |
|---|---|:---:|---|
| **1** | `https://rickandmortyapi.com/api/character/?name=...&status=...&gender=...&page=...` | `GET` | **Catálogo General y Búsqueda**: Filtrado por nombre, estado, género y paginación en vivo. |
| **2** | `https://rickandmortyapi.com/api/character/{id}` | `GET` | **Ficha Técnica Individual**: Detalle completo del personaje por identificador único. |
| **3** | `https://rickandmortyapi.com/api/episode/{ids}` | `GET` | **Historial de Episodios**: Consulta de nombres, códigos de temporada y fechas de emisión. |

---

## 💾 Gestión de Favoritos con `localStorage`

La persistencia de favoritos se gestiona bajo la clave `'rick_morty_favoritos'`:

* **Guardar:** Al presionar la estrella (☆), el personaje se almacena como objeto JSON en el arreglo local y el botón pasa a estado activo (★).
* **Eliminar:** Al presionar nuevamente la estrella activa (★), el personaje se remueve del arreglo en `localStorage`.
* **Pestaña "Mis Favoritos":** Lee la colección almacenada localmente y permite buscar o filtrar dentro de tus favoritos de forma instantánea sin peticiones de red.

---

## 📁 Estructura del Proyecto

```text
miniproyecto_rick_morty/
├── index.html       # Catálogo principal, buscador con delay 4s, filtros y pestaña de favoritos
├── detalle.html     # Ficha técnica individual y desglose de episodios
├── style.css        # Sistema de estilos responsivo, modo oscuro y animaciones de spinners
├── app.js           # Lógica cliente: consumo del Endpoint 1, búsqueda, filtros y localStorage
├── detalle.js       # Lógica cliente: consumo de Endpoints 2 y 3, y alternador de favoritos
├── .gitignore       # Archivos y temporales ignorados por Git
├── .vscode/         # Configuración del espacio de trabajo en VS Code
└── README.md        # Documentación de la aplicación
```

---

## 🚀 Cómo Ejecutar la Aplicación

Al ser una aplicación 100% estática, no requiere instalación de dependencias (`npm install`), compilación ni servidores backend.

### Opción 1: Con la extensión Live Server de VS Code (Recomendada)
1. Abre la carpeta del proyecto en Visual Studio Code.
2. Haz clic derecho sobre el archivo [`index.html`](file:///c:/Users/braya/Documents/Septimo/Programción%20Web/miniproyecto_rick_morty/index.html).
3. Selecciona **"Open with Live Server"**.

### Opción 2: Abrir directamente en el navegador
1. Haz doble clic en el archivo [`index.html`](file:///c:/Users/braya/Documents/Septimo/Programción%20Web/miniproyecto_rick_morty/index.html) desde tu explorador de archivos de Windows.
2. La aplicación cargará directamente en tu navegador predeterminado (Chrome, Edge, Firefox, etc.).

### Opción 3: Servidor estático por terminal
Si cuentas con Node.js instalado y deseas servirlo por HTTP local:
```bash
npx serve .
```
O con Python:
```bash
python -m http.server 3000
```
Y abre [http://localhost:3000](http://localhost:3000) en tu navegador.

---

## 📄 Licencia

Desarrollado como proyecto para Programación Web. Datos e imágenes provistos por la [API pública de Rick and Morty](https://rickandmortyapi.com/).
