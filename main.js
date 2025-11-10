// ===== VARIABLES GLOBALES =====
const langToggleBtn = document.getElementById('langToggle');
const htmlEl = document.documentElement;
let translations = {}; // Objeto para guardar las traducciones cargadas

// ===== LÓGICA DE TRADUCCIÓN (NUEVA) =====

// 1. Cargar el archivo JSON del idioma
async function loadLanguage(lang) {
  try {
    const response = await fetch(`locales/${lang}.json`);
    if (!response.ok) {
      throw new Error(`Failed to load ${lang}.json`);
    }
    translations = await response.json();
    applyTranslations(lang);
  } catch (error) {
    console.error(error);
    // Cargar idioma de respaldo (inglés) en caso de error
    if (lang !== 'en') {
      loadLanguage('en');
    }
  }
}

// 2. Aplicar las traducciones al DOM
function applyTranslations(lang) {
  // Actualiza el atributo <html lang="">
  htmlEl.setAttribute('lang', lang);

  // Actualiza todos los elementos con 'data-lang-key'
  document.querySelectorAll('[data-lang-key]').forEach(el => {
    const key = el.getAttribute('data-lang-key');
    const translation = translations[key];

    if (translation) {
      // Maneja diferentes tipos de elementos
      const type = el.getAttribute('data-lang-type');

      if (type === 'innerHTML') {
        el.innerHTML = translation;
      } else if (el.hasAttribute('aria-label')) {
        el.setAttribute('aria-label', translation);
      } else if (el.tagName === 'META') {
        el.setAttribute('content', translation);
      } else {
        el.textContent = translation;
      }
    }
  });

  // --- Casos Especiales (Botones) ---

  // 3. Actualiza el botón de cambio de idioma
  langToggleBtn.textContent = translations.langToggleText;
  langToggleBtn.setAttribute('aria-label', translations.ariaLangToggle);

  // 4. Actualiza los botones de descarga de PDF (¡TU REQUISITO!)
  const pdfPath = translations.pdfPath;
  const pdfDownloadName = translations.pdfDownloadName;

  const downloadPdfBtn = document.getElementById('downloadPdfBtn');
  const printBtn = document.getElementById('printBtn');

  if (downloadPdfBtn) {
    downloadPdfBtn.href = pdfPath;
    downloadPdfBtn.download = pdfDownloadName;
  }
  if (printBtn) {
    printBtn.href = pdfPath;
    printBtn.download = pdfDownloadName;
  }

  // 5. Llama a feather.replace() DESPUÉS de actualizar el DOM
  // Esto asegura que los iconos cargados por JS también se rendericen
  if (typeof feather !== 'undefined') {
    feather.replace();
  }
}

// 6. Función para cambiar el idioma
function toggleLanguage() {
  const currentLang = htmlEl.getAttribute('lang') || 'es';
  const newLang = currentLang === 'es' ? 'en' : 'es';
  localStorage.setItem('lang', newLang);
  loadLanguage(newLang);
}

// ===== LÓGICA DE TEMA (Existente) =====

function applyTheme(isDark) {
  document.documentElement.classList.toggle('dark', isDark);
  document.documentElement.style.colorScheme = isDark ? 'dark' : 'light';
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
  updateThemeIcon(isDark);
}

function updateThemeIcon(isDark) {
  const btn = document.getElementById('themeToggle');
  if (!btn) return;
  const newAriaLabelKey = isDark ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro';
  // (El aria-label se actualiza desde el JSON, pero lo forzamos aquí por si acaso)
  btn.setAttribute('aria-label', newAriaLabelKey);
  btn.classList.toggle('theme-dark', isDark);
}

function toggleTheme() {
  const isDark = !document.documentElement.classList.contains('dark');
  applyTheme(isDark);
}

// ===== INICIALIZACIÓN AL CARGAR LA PÁGINA =====

document.addEventListener('DOMContentLoaded', () => {
  
  // 1. Inicializar Tema
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    applyTheme(savedTheme === 'dark');
  } else {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    applyTheme(prefersDark);
  }

  // 2. Inicializar Idioma
  const savedLang = localStorage.getItem('lang') || 'es';
  loadLanguage(savedLang); // Carga el idioma guardado (o 'es')

  // 3. Asignar Listeners a los botones
  const themeBtn = document.getElementById('themeToggle');
  if (themeBtn) {
    themeBtn.addEventListener('click', toggleTheme);
  }
  
  if (langToggleBtn) {
    langToggleBtn.addEventListener('click', toggleLanguage);
  }

  // Listener para cambio de tema del S.O.
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
      applyTheme(e.matches);
    }
  });

  // ===== Animaciones de Scroll (Existente) =====
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const els = document.querySelectorAll('.reveal');
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          io.unobserve(e.target);
        }
      });
    }, { 
      threshold: window.innerWidth < 768 ? 0.1 : 0.15,
      rootMargin: '0px 0px -50px 0px'
    });
    els.forEach(el => io.observe(el));
  } else {
    document.querySelectorAll('.reveal').forEach(el => {
      el.classList.add('visible');
    });
  }

  // ===== Scroll Suave (CORREGIDO) =====
  // Antes: 'a[href^="#"]' (seleccionaba todos, incluyendo los botones de PDF)
  // Ahora: 'a[href^="#"]:not([href="#"])' (selecciona solo anclas internas reales)
  document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const href = this.getAttribute('href');
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ===== Efectos Táctiles (Existente) =====
  const cards = document.querySelectorAll('.card');
  cards.forEach(card => {
    card.addEventListener('touchstart', () => {
      card.style.transform = 'translateY(-2px)';
    });
    card.addEventListener('touchend', () => {
      card.style.transform = 'translateY(0)';
    });
  });

  // ===== Header Pegajoso (Existente) =====
  const header = document.querySelector('header');
  if (header) {
    let lastScrollTop = 0;
    window.addEventListener('scroll', () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      if (scrollTop > 100) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
      lastScrollTop = scrollTop;
    }, { passive: true });
  }
});