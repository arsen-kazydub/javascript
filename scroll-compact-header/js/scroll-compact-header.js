document.addEventListener('DOMContentLoaded', () => {
  window.addEventListener('scroll', (() => {
    const header = document.getElementById('header');
    if (!header) return;
    return () => {
      header.classList.toggle('header-compact', window.scrollY > 0);
    }
  })());
});