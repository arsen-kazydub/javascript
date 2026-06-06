document.addEventListener('DOMContentLoaded', () => {
  const toggleTextSections = document.querySelectorAll('.toggle-text');
  if (!toggleTextSections.length) return;

  // Example of dynamic French translation
  // (we still need to update the initial state of the button in HTML)
  const isFrench = location.pathname.includes('/fr/');
  const btnTextTranslations = isFrench
    ? {
      btnTextExpand: 'Lire plus',
      btnTextCollapse: 'Lire moins',
    }
    : {};

  toggleTextSections.forEach(section => {
    new ToggleText(section, {
      // merge the translations and other options into one object
      ...btnTextTranslations,
      // other options
    });
  });
});