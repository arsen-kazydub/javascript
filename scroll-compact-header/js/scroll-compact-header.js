/**
 * @typedef {Object} ScrollCompactHeaderOptions
 *
 * @property {string} [compactClass='header-compact']
 * - CSS class applied to the header when the page is scrolled
 */

/**
 * Creates a new ScrollCompactHeader instance.
 *
 * Toggles a CSS class on the header based on the page scroll position.
 *
 * @param {HTMLElement} root
 * - Header element
 *
 * @param {ScrollCompactHeaderOptions} [options]
 * - Custom configuration options
 */

class ScrollCompactHeader {
  constructor(root, options = {}) {
    this.root = root;
    if (!this.root) return;

    this.options = {
      compactClass: 'header-compact',
      ...options,
    };

    this.init();
  }


  init() {
    window.addEventListener('scroll', () => this.toggleCompactState());

    // run once immediately in case the page is already scrolled
    this.toggleCompactState();
  }


  toggleCompactState() {
    this.root.classList.toggle(
      this.options.compactClass,
      window.scrollY > 0
    );
  }
}