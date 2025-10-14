// ===== Theme toggle (respects system by default) =====
(function initTheme() {
  const saved = localStorage.getItem('theme');
  if (saved) {
    const dark = saved === 'dark';
    document.documentElement.classList.toggle('dark', dark);
    document.documentElement.style.colorScheme = dark ? 'dark' : 'light';
  }
})();

function toggleTheme(){
  const dark = document.documentElement.classList.toggle('dark');
  document.documentElement.style.colorScheme = dark ? 'dark' : 'light';
  localStorage.setItem('theme', dark ? 'dark' : 'light');
}

document.addEventListener('DOMContentLoaded', () => {
  // Hook up theme button
  const themeBtn = document.getElementById('themeToggle');
  if (themeBtn) themeBtn.addEventListener('click', toggleTheme);

  // Print button
  const printBtn = document.getElementById('printBtn');
  if (printBtn) printBtn.addEventListener('click', () => window.print());

  // ===== Reveal on scroll =====
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const els = document.querySelectorAll('.reveal');
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.15 });
    els.forEach(el => io.observe(el));
  }
});
