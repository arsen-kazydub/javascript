/**
 * @typedef {object} CustomizedScrollbarOptions
 *
 * @property {boolean} [showArrows=true]
 * - Enables scrollbar arrow buttons
 *
 * @property {string} [minHandleSize='20%']
 * - Minimum handle size as a percentage of the track
 *
 * @property {string} [maxHandleSize='100%']
 * - Maximum handle size as a percentage of the track
 *
 * @property {number} [wheelScrollStep=10]
 * - Scrolling distance per mouse wheel step (in pixels)
 *
 * @property {number} [scrollDuration=600]
 * - Maximum scrolling animation duration (in milliseconds)
 *
 * @property {object} [classes]
 * - CSS class names used by the plugin
 *
 * @property {string} [classes.horizontal='customized-scrollbar--horizontal']
 * - CSS class applied to the root element for horizontal scrolling
 *
 * @property {string} [classes.vertical='customized-scrollbar--vertical']
 * - CSS class applied to the root element for vertical scrolling
 *
 * @property {string} [classes.initialized='customized-scrollbar--initialized']
 * - CSS class applied to the root element after plugin initialization
 *
 * @property {string} [classes.noArrows='customized-scrollbar--no-arrows']
 * - CSS class applied to the root element when arrow buttons are disabled
 *
 * @property {string} [classes.container='customized-scrollbar__container']
 * - CSS class for the scrollable container
 *
 * @property {string} [classes.content='customized-scrollbar__content']
 * - CSS class for the scrollable content
 *
 * @property {string} [classes.track='customized-scrollbar__track']
 * - CSS class for the scrollbar track
 *
 * @property {string} [classes.handle='customized-scrollbar__handle']
 * - CSS class for the scrollbar handle
 *
 * @property {string} [classes.handleActive='customized-scrollbar__handle--active']
 * - CSS class applied while the handle is dragged
 *
 * @property {string} [classes.arrow='customized-scrollbar__arrow']
 * - CSS class for scrollbar arrow buttons
 *
 * @property {string} [classes.arrowActive='customized-scrollbar__arrow--active']
 * - CSS class applied while an arrow button is pressed
 *
 * @property {string} [classes.arrowStart='customized-scrollbar__arrow--start']
 * - CSS class for the left or top arrow button, depending on orientation
 *
 * @property {string} [classes.arrowEnd='customized-scrollbar__arrow--end']
 * - CSS class for the right or bottom arrow button, depending on orientation
 */

/**
 * Creates a fully customizable scrollbar with optional arrow buttons.
 *
 * Supports both horizontal and vertical scrolling, automatically adapts
 * to container resizing, and provides complete mouse, wheel, and keyboard
 * navigation with smooth GSAP-powered animations.
 *
 * @param {HTMLElement} root
 * - Root scrollbar element
 *
 * @param {CustomizedScrollbarOptions} [options]
 * - Custom configuration options
 */

class CustomizedScrollbar {
  constructor(root, options = {}) {
    if (!root) return;
    this.root = root;

    // Options
    const defaults = {
      showArrows      : true,
      minHandleSize   : '20%',
      maxHandleSize   : '100%',
      wheelScrollStep : 10,
      scrollDuration  : 600,
      classes: {
        horizontal    : 'customized-scrollbar--horizontal',
        vertical      : 'customized-scrollbar--vertical',
        initialized   : 'customized-scrollbar--initialized',
        noArrows      : 'customized-scrollbar--no-arrows',
        container     : 'customized-scrollbar__container',
        content       : 'customized-scrollbar__content',
        track         : 'customized-scrollbar__track',
        handle        : 'customized-scrollbar__handle',
        handleActive  : 'customized-scrollbar__handle--active',
        arrow         : 'customized-scrollbar__arrow',
        arrowActive   : 'customized-scrollbar__arrow--active',
        arrowStart    : 'customized-scrollbar__arrow--start',
        arrowEnd      : 'customized-scrollbar__arrow--end',
      },
    };

    this.options = {
      ...defaults,
      ...options,
      classes: {
        ...defaults.classes,
        ...(options.classes ?? {}),
      },
    };

    // Required DOM elements
    this.container = this.root.querySelector(`.${this.options.classes.container}`);
    this.content   = this.root.querySelector(`.${this.options.classes.content}`);

    if (!this.container || !this.content) {
      throw new Error(`${this.constructor.name}: Missing required elements.`);
    }

    // Scrollbar orientation
    if (this.root.classList.contains(this.options.classes.horizontal)) {
      this.isHorizontal = true;
    } else if (this.root.classList.contains(this.options.classes.vertical)) {
      this.isHorizontal = false;
    } else {
      throw new Error(`${this.constructor.name}: Missing scrollbar orientation class.`);
    }

    // Observer
    this.resizeObserver = null;
    this.enableResizeObserver(true);

    // Internal state
    this.minHandleSize         = parseInt(this.options.minHandleSize);
    this.maxHandleSize         = parseInt(this.options.maxHandleSize);

    this.track                 = null;
    this.handle                = null;
    this.arrowStart            = null;
    this.arrowEnd              = null;

    this.containerSize         = null;
    this.contentSize           = null;
    this.trackSize             = null;
    this.handleSize            = null;
    this.arrowSize             = 0;

    this.scrollRatio           = null;
    this.handleMaxPosition     = null;

    this.isHandlePressed       = false;
    this.handleStartPosition   = null;
    this.cursorStartCoordinate = null;

    this.activeArrow           = null;

    this.init();
  }


  // ==================== PUBLIC API ==================== //

  destroy() {
    this.destroyScrollbar();
    this.enableResizeObserver(false);
  }


  // ==================== OBSERVER ==================== //

  enableResizeObserver(enable) {
    if (enable) {
      if (this.resizeObserver !== null) return;

      this.resizeObserver = new ResizeObserver(this.init);
      this.resizeObserver.observe(this.container);
      this.resizeObserver.observe(this.content);
    }
    else {
      this.resizeObserver?.disconnect();
      this.resizeObserver = null;
    }
  }


  // ==================== LIFECYCLE ==================== //

  init = () => {
    const needed = this.isScrollbarNeeded();
    const exists = this.track !== null;

    if (needed && !exists) {
      this.createScrollbar();
      this.updateScrollbar();
    }
    else if (needed && exists) {
      this.updateScrollbar();
    }
    else if (!needed && exists) {
      this.destroyScrollbar();
    }
  }


  isScrollbarNeeded() {
    if (this.isHorizontal) {
      this.contentSize   = this.content.offsetWidth;
      this.containerSize = this.container.offsetWidth;
    } else {
      this.contentSize   = this.content.offsetHeight;
      this.containerSize = this.container.offsetHeight;
    }
    return this.contentSize > this.containerSize;
  }


  createScrollbar() {
    this.createScrollbarElements();
    this.setupScrollbarLayout();

    this.enableKeyboardNavigation(true);

    this.root.addEventListener('wheel', this.scrollWithWheel);
    this.track.addEventListener('click', this.scrollToTrackPoint);

    this.handle.addEventListener('click', this.stopPropagation);
    this.handle.addEventListener('mousedown', this.startHandleScrolling);

    if (this.options.showArrows) {
      this.arrowStart.addEventListener('mousedown', this.startArrowScrolling);
      this.arrowEnd.addEventListener('mousedown', this.startArrowScrolling);
    }
  }


  updateScrollbar() {
    this.setupTrack();
    this.setupHandle();
    this.calculateScrollRatio();

    // after resize, the handle size changes, and its position may no longer be valid
    const position = this.clamp(this.getHandlePosition(), 0, this.handleMaxPosition);
    this.scrollTo(position);
  }


  destroyScrollbar() {
    this.stopAnimation();

    this.enableKeyboardNavigation(false);

    this.root.removeEventListener('wheel', this.scrollWithWheel);

    // track and handle
    this.track.remove();
    this.track  = null;
    this.handle = null;

    // arrows
    if (this.options.showArrows) {
      this.arrowStart.remove();
      this.arrowEnd.remove();

      this.arrowStart = null;
      this.arrowEnd   = null;
    }

    // restore DOM
    this.root.classList.remove(
      this.options.classes.initialized,
      this.options.classes.noArrows
    );

    if (this.isHorizontal) {
      this.container.style.marginBottom = '';
      this.content.style.left = '';
    } else {
      this.container.style.marginRight = '';
      this.content.style.top = '';
    }
  }


  // ==================== INITIALIZATION ==================== //

  createScrollbarElements() {
    this.track = this.createElement(
      this.root,
      `.${this.options.classes.track}`,
      `<div class="${this.options.classes.track}"></div>`
    );

    this.handle = this.createElement(
      this.track,
      `.${this.options.classes.handle}`,
      `<div class="${this.options.classes.handle}"></div>`
    );

    if (this.options.showArrows) {
      this.arrowStart = this.createElement(
        this.root,
        `.${this.options.classes.arrowStart}`,
        `<div class="${this.options.classes.arrow} ${this.options.classes.arrowStart}"></div>`
      );

      this.arrowEnd = this.createElement(
        this.root,
        `.${this.options.classes.arrowEnd}`,
        `<div class="${this.options.classes.arrow} ${this.options.classes.arrowEnd}"></div>`
      );
    }
  }


  setupScrollbarLayout() {
    this.root.classList.add(this.options.classes.initialized);

    if (!this.options.showArrows) {
      this.root.classList.add(this.options.classes.noArrows);
    }

    if (this.isHorizontal) {
      this.container.style.marginBottom = `${this.track.offsetHeight}px`;
    } else {
      this.container.style.marginRight = `${this.track.offsetWidth}px`;
    }

    if (this.options.showArrows) {
      this.arrowSize = this.isHorizontal
        ? this.arrowStart.offsetWidth
        : this.arrowStart.offsetHeight;
    }
  }


  setupTrack() {
    if (this.isHorizontal) {
      if (this.options.showArrows) {
        Object.assign(this.track.style, {
          left  : `${this.arrowSize}px`,
          right : `${this.arrowSize}px`,
        });
      }
      this.trackSize = this.track.clientWidth;
    }
    else {
      if (this.options.showArrows) {
        Object.assign(this.track.style, {
          top    : `${this.arrowSize}px`,
          bottom : `${this.arrowSize}px`,
        });
      }
      this.trackSize = this.track.clientHeight;
    }
  }


  setupHandle() {
    const handleSize = Math.floor(this.containerSize / this.contentSize * 100);
    this.handleSize = this.clamp(handleSize, this.minHandleSize, this.maxHandleSize);

    if (this.isHorizontal) {
      this.handle.style.width = `${this.handleSize}%`;
    } else {
      this.handle.style.height = `${this.handleSize}%`;
    }

    this.handleMaxPosition = this.trackSize - this.getHandleSize();
  }


  calculateScrollRatio() {
    const invisibleContentSize = this.contentSize - this.containerSize;
    this.scrollRatio = invisibleContentSize / this.handleMaxPosition;
  }


  // ==================== HANDLE INTERACTION ==================== //

  startHandleScrolling = (event) => {
    event.preventDefault();
    this.stopAnimation();

    this.isHandlePressed = true;
    this.toggleHandleActiveClass(true);

    this.handleStartPosition = this.getHandlePosition();
    this.cursorStartCoordinate = this.getCursorCoordinate(event);

    document.addEventListener('mousemove', this.moveHandleScrolling);
    document.addEventListener('mouseup', this.endHandleScrolling);
  }


  moveHandleScrolling = (event) => {
    if (!this.isHandlePressed) return;

    const currentCoordinate = this.getCursorCoordinate(event);
    const distance = currentCoordinate - this.cursorStartCoordinate;
    const position = this.handleStartPosition + distance;

    this.scrollTo(position);
  }


  endHandleScrolling = () => {
    this.isHandlePressed = false;
    this.toggleHandleActiveClass(false);

    document.removeEventListener('mousemove', this.moveHandleScrolling);
    document.removeEventListener('mouseup', this.endHandleScrolling);
  }


  stopPropagation = (event) => {
    event.stopPropagation();
  }


  // ==================== ARROW INTERACTION ==================== //

  startArrowScrolling = (event) => {
    this.stopAnimation();

    this.activeArrow = event.currentTarget;
    this.toggleArrowActiveClass(this.activeArrow, true);

    const isArrowStart = this.activeArrow === this.arrowStart;
    const targetPosition = isArrowStart ? 0 : this.handleMaxPosition;
    this.scrollTo(targetPosition, true);

    document.addEventListener('mouseup', this.endArrowScrolling);
  }


  endArrowScrolling = () => {
    this.stopAnimation();

    this.toggleArrowActiveClass(this.activeArrow, false);
    this.activeArrow = null;

    document.removeEventListener('mouseup', this.endArrowScrolling);
  }


  // ==================== TRACK INTERACTION ==================== //

  scrollToTrackPoint = (event) => {
    const trackRect = this.track.getBoundingClientRect();
    const clickPosition = this.isHorizontal
      ? event.clientX - trackRect.left
      : event.clientY - trackRect.top;
    const targetPosition = clickPosition - this.getHandleSize() / 2;

    this.scrollTo(targetPosition, true);
  }


  // ==================== WHEEL INTERACTION ==================== //

  scrollWithWheel = (event) => {
    event.preventDefault();
    this.stopAnimation();

    // wheel scrolling always uses deltaY, regardless of scrollbar orientation
    const step = event.deltaY > 0
      ? this.options.wheelScrollStep
      : -this.options.wheelScrollStep;

    this.scrollBy(step);
  }


  // ==================== KEYBOARD INTERACTION ==================== //

  enableKeyboardNavigation(enable) {
    if (enable) {
      this.container.tabIndex = 0;
      this.container.addEventListener('keydown', this.scrollWithKeyboard);
    } else {
      this.container.removeAttribute('tabindex');
      this.container.removeEventListener('keydown', this.scrollWithKeyboard);
    }
  }


  scrollWithKeyboard = (event) => {
    const handlePosition = this.getHandlePosition();
    const wheelStep = this.options.wheelScrollStep;

    // convert one visible page of content into handle movement
    const pageStep = this.containerSize / this.scrollRatio;

    // Arrow keys
    const isArrowLeft  = event.key  === 'ArrowLeft';
    const isArrowRight = event.key  === 'ArrowRight';
    const isArrowUp    = event.key  === 'ArrowUp';
    const isArrowDown  = event.key  === 'ArrowDown';
    // Page keys
    const isPageUp     = event.key  === 'PageUp';
    const isPageDown   = event.key  === 'PageDown';
    // Space
    const isShiftSpace = event.code === 'Space' && event.shiftKey;
    const isSpace      = event.code === 'Space' && !event.shiftKey;
    // Navigation
    const isHome       = event.key  === 'Home';
    const isEnd        = event.key  === 'End';

    let target = null;

    if (this.isHorizontal) {
      if (isArrowLeft)  target = handlePosition - wheelStep;
      if (isArrowRight) target = handlePosition + wheelStep;
    } else {
      if (isArrowUp)    target = handlePosition - wheelStep;
      if (isArrowDown)  target = handlePosition + wheelStep;
    }

    if (isPageUp)       target = handlePosition - pageStep;
    if (isPageDown)     target = handlePosition + pageStep;

    if (isShiftSpace)   target = handlePosition - pageStep;
    if (isSpace)        target = handlePosition + pageStep;

    if (isHome)         target = 0;
    if (isEnd)          target = this.handleMaxPosition;

    if (target !== null) {
      event.preventDefault();
      this.stopAnimation();
      this.scrollTo(target, true);
    }
  }


  // ==================== SCROLLING ==================== //

  scrollTo(position, animate = false) {
    this.stopAnimation();

    const cssProperty = this.isHorizontal ? 'left' : 'top';
    const handleNewPosition = this.clamp(position, 0, this.handleMaxPosition);
    const contentNewPosition = -handleNewPosition * this.scrollRatio;

    if (!animate) {
      this.handle.style[cssProperty] = `${handleNewPosition}px`;
      this.content.style[cssProperty] = `${contentNewPosition}px`;
    }
    else {
      const handleCurrentPosition = this.getHandlePosition();
      const duration = this.calculateDuration(handleCurrentPosition, handleNewPosition);
      const options = { duration, ease: 'none' };

      gsap.to(this.handle, {
        [cssProperty]: handleNewPosition,
        ...options
      });

      gsap.to(this.content, {
        [cssProperty]: contentNewPosition,
        ...options
      });
    }
  }


  scrollBy(distance) {
    this.scrollTo(this.getHandlePosition() + distance);
  }


  stopAnimation() {
    gsap.killTweensOf([this.handle, this.content]);
  }


  // ==================== HELPERS ==================== //

  // Creates a scrollbar element if it doesn't exist
  createElement(parent, selector, html) {
    let element = parent.querySelector(selector);

    if (!element) {
      parent.insertAdjacentHTML('beforeend', html);
      element = parent.querySelector(selector);
    }

    return element;
  }


  getHandlePosition() {
    return this.isHorizontal
      ? this.handle.offsetLeft
      : this.handle.offsetTop;
  }


  getHandleSize() {
    return this.trackSize * this.handleSize / 100;
  }


  getCursorCoordinate(event) {
    return this.isHorizontal
      ? event.pageX
      : event.pageY;
  }


  calculateDuration(startPosition, endPosition) {
    const distance = Math.abs(startPosition - endPosition);
    const ratio = distance / this.trackSize;
    return this.options.scrollDuration * ratio / 1000;
  }


  toggleHandleActiveClass(isActive) {
    this.handle.classList.toggle(this.options.classes.handleActive, isActive);
  }


  toggleArrowActiveClass(arrow, isActive) {
    arrow.classList.toggle(this.options.classes.arrowActive, isActive);
  }


  clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }
}