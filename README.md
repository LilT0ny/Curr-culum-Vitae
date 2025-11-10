# Mi Currículum Interactivo (v2)

Este es el código fuente de mi portafolio/CV personal en línea. Originalmente un sitio estático simple, ha sido refactorizado para incluir características avanzadas como un sistema de temas (claro/oscuro) y un sistema de internacionalización (i18n) para cambiar entre español e inglés.

[![Captura de mi CV](/assets/FinishCV.png)](https://lilt0ny.github.io/AnthonyGomez-CurriCulumVitae/)

---

## 🚀 Características Principales

Este proyecto no es solo un HTML estático; incluye varias características implementadas con JavaScript moderno:

* **Tema Claro / Oscuro:** Un interruptor de tema (Sol/Luna con iconos SVG) que guarda la preferencia del usuario en `localStorage`.
* **Bilingüe (i18n):**
    * Soporte completo para **Español** e **Inglés**.
    * El contenido de texto se carga dinámicamente desde archivos `locales/es.json` y `locales/en.json` usando la API `fetch()`.
    * Recuerda la preferencia de idioma del usuario en `localStorage`.
* **Descarga de PDF Dinámico:**
    * El botón de descarga de PDF no es una simple impresión de la página web.
    * Descarga un archivo `cv_es.pdf` o `cv_en.pdf` (creados profesionalmente en LaTeX) **dependiendo del idioma seleccionado** en la interfaz.
* **Diseño Limpio y Moderno:**
    * Utiliza una paleta de colores corporativa y limpia (blancos, azules y grises oscuros).
    * Usa las fuentes `Montserrat` (para títulos) y `Lato` (para cuerpo de texto) para máxima legibilidad.
* **Iconografía SVG:**
    * Utiliza [Feather Icons](https://feathericons.com/) para todos los iconos de la interfaz (enlaces, botones de tema, etc.), reemplazando los emojis para un look más profesional.
* **Animaciones Sutiles:**
    * Los elementos de las secciones aparecen con un suave "fade in" al hacer scroll, implementado con `IntersectionObserver`.

---

## 🛠️ Stack Tecnológico

* **HTML5** (Semántico)
* **CSS3** (Variables CSS, Grid, Flexbox)
* **JavaScript (ES6+)** (async/await, `fetch`, `localStorage`, `IntersectionObserver`)
* **Feather Icons** (Para iconos SVG)
* **LaTeX** (Usado por separado para generar los archivos `.pdf` finales)

---