/**
 * @typedef {Object} ToggleTextOptions
 * @property {string} [breakPointSelector = 'p:nth-child(2)']
 * - CSS selector for the element before which a break point will be inserted
 * @property {string} [contentClass = 'toggle-text__content']
 * - CSS class for the content container
 * @property {string} [breakPointClass = 'toggle-text__break-point']
 * - CSS class for the inserted break point element
 * @property {string} [btnClass = 'toggle-text__btn']
 * - CSS class for the toggle button
 * @property {string} [btnTextExpand = 'Read More']
 * - Button text when content is collapsed
 * @property {string} [btnTextCollapse = 'Read Less']
 * - Button text when content is expanded
 * @property {number} [transitionDuration = 400]
 * - Duration of the height transition in milliseconds
 */

/**
 * Creates a new ToggleText instance
 * @param {HTMLElement} root - The root container element
 * @param {ToggleTextOptions} [options] - Custom configuration options
 * @throws {Error} If required elements (content or button) are missing inside the root
 */
class ToggleText {
  constructor(root, options = {}) {
    this.root = root;

    this.options = {
      // CSS selector and class names
      breakPointSelector : 'p:nth-child(2)',
      contentClass       : 'toggle-text__content',
      breakPointClass    : 'toggle-text__break-point',
      btnClass           : 'toggle-text__btn',

      // button text
      btnTextExpand      : 'Read More',
      btnTextCollapse    : 'Read Less',

      // animation
      transitionDuration : 400,

      ...options
    };

    this.content = this.root.querySelector('.' + this.options.contentClass);
    this.btn     = this.root.querySelector('.' + this.options.btnClass);

    if (!this.content || !this.btn) {
      throw new Error(`${this.constructor.name}: Missing required elements.`);
    }

    this.isOpen     = false;
    this.minHeight  = null;
    this.maxHeight  = null;
    this.breakPoint = null;

    this.init();
  }


  init() {
    this.createBreakPoint();
    this.setMinMaxHeight();
    this.toggleTransitions(true);
    this.toggleContent();

    this.btn.setAttribute('aria-expanded', this.isOpen);
    this.btn.addEventListener('click', this.handleBtnClick);

    window.addEventListener('resize', this.handleWindowResize);
  }


  // Creates a div element used as a break point
  createBreakPoint() {
    const anchorEl = this.content.querySelector(this.options.breakPointSelector);
    if (!anchorEl) {
      throw new Error(
        `${this.constructor.name}: ` +
        `Could not find an element "${this.options.breakPointSelector}" inside the content.`
      );
    }

    // insert a break point before the anchor element
    const breakPoint = document.createElement('div');
    breakPoint.classList.add(this.options.breakPointClass);
    this.content.insertBefore(breakPoint, anchorEl);

    this.breakPoint = breakPoint;
    return this.breakPoint;
  }


  // Measures the expanded and collapsed heights of the content
  setMinMaxHeight(preserveHeight = false) {
    const currentHeight = preserveHeight
      ? window.getComputedStyle(this.content).height
      : null;

    // expand the text container to measure its height
    this.content.style.height = 'auto';
    this.maxHeight = this.content.offsetHeight;

    // set the text container height; reflow occurs, and we can read the break point's offsetTop
    this.content.style.height = preserveHeight ? currentHeight: '0px';
    this.minHeight = this.breakPoint.offsetTop;
  }


  // Toggles CSS transitions for the text container
  toggleTransitions(enable) {
    // force reflow BEFORE changing the transition property
    this.content.offsetHeight;
    this.content.style.transition = (enable === true)
      ? `height ${this.options.transitionDuration}ms`
      : '';
  }


  // Changes the text container height
  toggleContent() {
    const height = this.isOpen ? this.maxHeight : this.minHeight;
    this.content.style.height = height + 'px';
  }


  handleBtnClick = () => {
    this.isOpen = !this.isOpen;

    // update the button
    const { btnTextCollapse, btnTextExpand } = this.options;
    this.btn.textContent = this.isOpen ? btnTextCollapse : btnTextExpand;
    this.btn.setAttribute('aria-expanded', this.isOpen);

    this.toggleContent();
  }


  // Debounced handler when the window stops resizing
  handleWindowResize = (() => {
    let timeout;
    return () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => this.updateContentHeight(), 100);
    };
  })();


  // Updates text container height smoothly, temporarily disabling transitions
  updateContentHeight = () => {
    this.toggleTransitions(false);
    this.setMinMaxHeight(true);
    this.toggleTransitions(true);
    this.toggleContent();
  }
}