document.addEventListener('DOMContentLoaded', () => {
  // example of a French page detection
  // if (document.documentElement.lang === 'fr-FR' || location.pathname.includes('/fr/')) {}

  const select = document.getElementById('nbsp-type');
  if (!select) return;

  // we can process the whole page or specific elements like in this demo
  const frenchText = document.querySelectorAll('.poem');
  if (!frenchText.length) return;

  select.addEventListener('change', () => {
    frenchText.forEach(container => {
      new FrenchTypographicSpacing(container, {
        nbspType: select.value
      });
    });
  });
});