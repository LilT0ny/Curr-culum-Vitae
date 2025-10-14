// ===== Theme toggle with enhanced visual feedback =====
(function initTheme() {
  const saved = localStorage.getItem('theme');
  if (saved) {
    applyTheme(saved === 'dark');
  } else {
    // Respeta las preferencias del sistema
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    applyTheme(prefersDark);
  }
})();

function applyTheme(isDark) {
  document.documentElement.classList.toggle('dark', isDark);
  document.documentElement.style.colorScheme = isDark ? 'dark' : 'light';
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
  updateThemeIcon(isDark);
  applyThemeColorMeta(); // <-- ¡nuevo!
}


function updateThemeIcon(isDark) {
  const btn = document.getElementById('themeToggle');
  if (!btn) return;
  
  btn.setAttribute('aria-label', isDark ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro');
  btn.classList.toggle('theme-dark', isDark);
}

function toggleTheme() {
  const isDark = !document.documentElement.classList.contains('dark');
  applyTheme(isDark);
}

// ===== Listen for system theme changes =====
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
  if (!localStorage.getItem('theme')) {
    applyTheme(e.matches);
  }
  applyThemeColorMeta(); // <-- asegura sincronización si cambia el SO
});


document.addEventListener('DOMContentLoaded', () => {
  // ===== Theme button with smooth transition =====
  const themeBtn = document.getElementById('themeToggle');
  if (themeBtn) {
    themeBtn.addEventListener('click', toggleTheme);
    themeBtn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleTheme();
      }
    });
  }

  // ===== Print button with feedback =====

  // ===== PDF link behaves like print button =====
const pdfLink = document.getElementById('downloadPdfBtn');
if (pdfLink) {
  pdfLink.addEventListener('click', (e) => {
    e.preventDefault();            // evita saltar a "#"
    pdfLink.classList.add('active'); // feedback visual, igual que el botón
    window.print();                // abre el diálogo de imprimir/guardar PDF
    setTimeout(() => pdfLink.classList.remove('active'), 300);
  });
}

  const printBtn = document.getElementById('printBtn');
  if (printBtn) {
    printBtn.addEventListener('click', () => {
      printBtn.classList.add('active');
      window.print();
      setTimeout(() => printBtn.classList.remove('active'), 300);
    });
  }

  // ===== Enhanced reveal on scroll =====
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
    // Si el usuario prefiere reducir movimiento, mostrar elementos inmediatamente
    document.querySelectorAll('.reveal').forEach(el => {
      el.classList.add('visible');
    });
  }

  // ===== Smooth scroll behavior =====
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href !== '#') {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });

  // ===== Add hover effects to cards on mobile =====
  const cards = document.querySelectorAll('.card');
  cards.forEach(card => {
    card.addEventListener('touchstart', () => {
      card.style.transform = 'translateY(-2px)';
    });
    card.addEventListener('touchend', () => {
      card.style.transform = 'translateY(0)';
    });
  });

  // ===== Dynamic header sticky on scroll =====
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

  applyThemeColorMeta();
});

// Sincroniza <meta name="theme-color"> con el tema actual
function applyThemeColorMeta() {
  // Elige los dos meta[name="theme-color"] que pusiste en index.html
  const metas = [...document.querySelectorAll('meta[name="theme-color"]')];
  if (!metas.length) return;

  // Encuentra cuál meta coincide con el media actual (o toma la primera)
  const active = metas.find(m => {
    const mq = m.getAttribute('media');
    return !mq || window.matchMedia(mq).matches;
  }) || metas[0];

  // Decide el color deseado según tu propio estado de tema
  const isDark = document.documentElement.classList.contains('dark');
  // Puedes reutilizar tus propios colores aquí:
  const light = '#7c3aed';
  const dark  = '#4c1d95';

  // Actualiza el contenido del meta activo
  active.setAttribute('content', isDark ? dark : light);
}
