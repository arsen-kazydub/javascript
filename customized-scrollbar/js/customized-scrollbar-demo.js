document.addEventListener('DOMContentLoaded', () => {

  // Demo width slider
  const demoSlider   = document.getElementById('demo-width');
  const demoExamples = document.getElementById('demo-examples');

  demoSlider.addEventListener('input', () => {
    demoExamples.style.width = `${demoSlider.value}%`;
  });

  // Customized Scrollbar initialization
  const verticalScrollbar   = document.querySelector('.customized-scrollbar--vertical');
  const horizontalScrollbar = document.querySelector('.customized-scrollbar--horizontal');

  new CustomizedScrollbar(verticalScrollbar);
  new CustomizedScrollbar(horizontalScrollbar, { showArrows: false });
});