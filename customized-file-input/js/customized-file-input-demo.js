document.addEventListener('DOMContentLoaded', () => {
  document
    .querySelectorAll('.customized-file-input-demo input[type="file"]')
    .forEach(el => new CustomizedFileInput(el));
});