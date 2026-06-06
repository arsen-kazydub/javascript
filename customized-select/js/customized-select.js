/**
 * @typedef {Object} CustomizedSelectOptions
 * @property {string|number|null} [width = null]
 * - Custom width of the ui-select; accepts any valid CSS width; if null, auto-calculated
 * @property {number} [visibleOptions = 0]
 * - Maximum number of visible options before scrolling appears; if 0, all options are shown
 * @property {number} [baseZIndex = 100]
 * - Base z-index applied to each ui-select to appear above page content
 * @property {string} [wrapperClass = 'customized-select']
 * - CSS class for the wrapper element
 * @property {string} [wrapperSelectedClass = 'customized-select--selected']
 * - CSS class for the wrapper element applied when the ui-select is open
 * @property {string} [uiSelectClass = 'customized-select__ui']
 * - CSS class for the ui-select element
 * @property {string} [uiSelectValueClass = 'customized-select__ui-value']
 * - CSS class for the element showing the selected value
 * @property {string} [uiSelectArrowClass = 'customized-select__ui-arrow']
 * - CSS class for the dropdown arrow
 * @property {string} [uiOptionsListClass = 'customized-select__ui-options']
 * - CSS class for the options list container
 * @property {string} [uiOptionClass = 'customized-select__ui-option']
 * - CSS class for each option in the list
 * @property {string} [uiSelectedOptionClass = 'customized-select__ui-option--selected']
 * - CSS class for the currently selected option
 */

/**
 * Creates a new CustomizedSelect instance
 * @param {HTMLSelectElement} select - The native <select> element
 * @param {CustomizedSelectOptions} [options] - Custom configuration options
 */
class CustomizedSelect {

  // all class instances on the page
  static instances = [];

  // whether shared listeners have been attached
  static hasDocumentClickListener = false;
  static hasEscapeKeyListener     = false;

  // whether at least one instance is animating
  static hasAnimatingInstances = false;


  // Closes the active ui-select when clicking anywhere on the page
  static documentClickHandler(e) {
    CustomizedSelect.instances.forEach(instance => {
      if (instance.isOpen && !instance.wrapperEl.contains(e.target)) {
        instance.toggleUiOptions(false);
      }
    });
  }


  // Closes the active ui-select when pressing Escape
  static escapeKeyHandler(e) {
    if (e.key === 'Escape') {
      CustomizedSelect.instances.forEach(instance => {
        if (instance.isOpen) {
          instance.toggleUiOptions(false);
        }
      });
    }
  }


  constructor(select, options = {}) {
    this.select = select;
    if (!this.select) return;

    // add this instance to the static array
    CustomizedSelect.instances.push(this);

    // shared listeners for all instances
    if (!CustomizedSelect.hasDocumentClickListener) {
      document.addEventListener('click', CustomizedSelect.documentClickHandler);
      CustomizedSelect.hasDocumentClickListener = true;
    }
    if (!CustomizedSelect.hasEscapeKeyListener) {
      document.addEventListener('keydown', CustomizedSelect.escapeKeyHandler);
      CustomizedSelect.hasEscapeKeyListener = true;
    }

    this.options = {
      width                 : null,
      visibleOptions        : 0,
      baseZIndex            : 100,
      wrapperClass          : 'customized-select',
      wrapperSelectedClass  : 'customized-select--selected',
      uiSelectClass         : 'customized-select__ui',
      uiSelectValueClass    : 'customized-select__ui-value',
      uiSelectArrowClass    : 'customized-select__ui-arrow',
      uiOptionsListClass    : 'customized-select__ui-options',
      uiOptionClass         : 'customized-select__ui-option',
      uiSelectedOptionClass : 'customized-select__ui-option--selected',
      ...options
    };

    // helper class for measuring width and height of the options list
    this.uCalcDimensionsClass = 'u-calc-dimensions';

    this.wrapperEl            = null;
    this.uiSelect             = null;
    this.uiSelectValue        = null;
    this.uiSelectArrow        = null;
    this.uiOptionsList        = null;
    this.uiOptionsListHeight  = null;
    this.uiOptions            = null;
    this.uiSelectedOption     = null;
    this.isOpen               = false;
    this.isAnimated           = false;
    this.hasScrollableOptions = false;

    this.init();
  }


  init() {
    if (this.isCustomized()) return;
    this.createWrapper();
    this.createUiSelect();
    this.setWidth();
    this.setUiOptionsHeight();
    this.updateZIndex();

    [this.uiSelectValue, this.uiSelectArrow].forEach(el => {
      el.addEventListener('click', () => this.toggleUiOptions());
    });

    this.uiOptions.forEach(el => {
      el.addEventListener('click', e => this.updateSelectAndUiSelect(e));
    });

    this.select.addEventListener('change', e => this.updateUiSelect(e));

    this.select.addEventListener('keydown', e => this.handleKeyboardEvents(e));
  }


  isCustomized() {
    return this.select.parentNode.classList.contains(this.options.wrapperClass);
  }


  createWrapper() {
    this.wrapperEl = Object.assign(document.createElement('div'), {
      className: this.options.wrapperClass
    });
    this.select.parentNode.insertBefore(this.wrapperEl, this.select);
    this.wrapperEl.append(this.select);
  }


  createUiSelect() {
    // ui-select wrapper
    this.uiSelect = Object.assign(document.createElement('div'), {
      className: this.options.uiSelectClass
    });

    // element for displaying the currently selected option
    this.uiSelectValue = Object.assign(document.createElement('div'), {
      className: this.options.uiSelectValueClass,
      textContent: this.select.querySelector('option:checked')?.textContent || ''
    });

    // decorative dropdown arrow
    this.uiSelectArrow = Object.assign(document.createElement('div'), {
      className: this.options.uiSelectArrowClass
    });

    // options container
    this.uiOptionsList = Object.assign(document.createElement('ul'), {
      className: this.options.uiOptionsListClass,
      tabIndex: -1
    });

    this.uiSelect.append(
      this.uiSelectValue,
      this.uiSelectArrow,
      this.uiOptionsList
    );

    this.select.querySelectorAll('option').forEach(option => {
      const li = document.createElement('li');

      const cssClasses = [
        this.options.uiOptionClass,
        option.selected ? this.options.uiSelectedOptionClass : ''
      ].filter(Boolean).join(' ');

      li.textContent = option.textContent;
      li.className = cssClasses;
      li.dataset.value = option.value;

      if (option.selected) {
        this.uiSelectedOption = li;
      }

      this.uiOptionsList.append(li);
    });

    this.uiOptions = this.uiOptionsList.querySelectorAll('li');

    this.wrapperEl.append(this.uiSelect);
  }


  setWidth() {
    let width;
    if (typeof this.options.width === 'string') {
      width = this.options.width;
    } else if (typeof this.options.width === 'number') {
      width = this.options.width + 'px';
    } else {
      width = this.getAutoWidth();
    }
    this.wrapperEl.style.width = width;
  }


  // Calculates minimum space (option text + arrow + horizontal borders)
  getAutoWidth() {
    this.uiOptionsList.classList.add(this.uCalcDimensionsClass);
    const optionsWidth = this.uiOptionsList.offsetWidth;
    this.uiOptionsList.classList.remove(this.uCalcDimensionsClass);

    const arrowWidth = this.uiSelectArrow.clientWidth;

    const styles = getComputedStyle(this.uiSelect);
    const borderLeft = parseFloat(styles.borderLeftWidth) || 0;
    const borderRight = parseFloat(styles.borderRightWidth) || 0;
    const bordersWidth = borderLeft + borderRight;

    return `${optionsWidth + arrowWidth + bordersWidth}px`;
  }


  setUiOptionsHeight() {
    const maxVisible = this.options.visibleOptions;
    if (maxVisible < 0) return;

    // a single option height
    this.uiOptionsList.classList.add(this.uCalcDimensionsClass);
    const optionHeight = this.uiOptions[0].offsetHeight;
    this.uiOptionsList.classList.remove(this.uCalcDimensionsClass);

    // limit maximum visible options
    if (maxVisible > 0 && this.uiOptions.length > maxVisible) {
      this.hasScrollableOptions = true;
      this.uiOptionsList.style.overflowY = 'auto';
      this.uiOptionsListHeight = optionHeight * maxVisible;
    }
    // or display all options
    else {
      this.uiOptionsListHeight = optionHeight * this.uiOptions.length;
    }
  }


  // Sets z-index for each ui-select on the page
  updateZIndex() {
    CustomizedSelect.instances.slice().reverse().forEach((instance, idx) => {
      if (instance.wrapperEl) {
        instance.wrapperEl.style.zIndex = this.options.baseZIndex + idx;
      }
    });
  }


  // Toggles ui-options. Argument 'state' (optional): true = open, false = close
  toggleUiOptions(state) {
    state = (state === undefined) ? !this.isOpen : state;
    const isOpening = state === true;

    // block opening if already opened, and closing if already closed
    if ((isOpening && this.isOpen) || (!isOpening && !this.isOpen)) return;

    // block interactions with the ui-select while it is animating
    if (this.isAnimated) return;

    // block opening (but not closing) while any other select is animating
    if (isOpening && CustomizedSelect.hasAnimatingInstances) return;

    this.isAnimated = true;
    CustomizedSelect.hasAnimatingInstances = true;
    this.isOpen = state;

    this.wrapperEl.classList.toggle(this.options.wrapperSelectedClass, this.isOpen);

    const uiSelectHeight = parseFloat(getComputedStyle(this.uiSelect).height) || 0;

    // called after animation is complete
    const callback = (e) => {
      if (e.propertyName === 'height') {
        if (!this.isOpen) {
          this.uiOptionsList.style.display = 'none';
        }
        // remove the listener and unlock interactions
        this.uiOptionsList.removeEventListener('transitionend', callback);
        this.isAnimated = false;
        CustomizedSelect.hasAnimatingInstances = false;
      }
    };

    if (this.isOpen) {
      // <select> must remain focused to support keyboard accessibility
      if (document.activeElement !== this.select) {
        this.waitNextFrame(() => this.select.focus());
      }

      // step 1 - show options
      this.uiOptionsList.style.display = 'block';

      // step 2 - increase options and parent container height
      this.waitNextFrame(() => {
        this.uiOptionsList.style.height = this.uiOptionsListHeight + 'px';
        this.uiSelect.style.height = (uiSelectHeight + this.uiOptionsListHeight) + 'px';
        if (this.hasScrollableOptions) {
          this.uiSelectedOption.scrollIntoView({ block: 'nearest' });
        }
      });

      this.uiOptionsList.addEventListener('transitionend', callback);
    } else {
      // step 1 - decrease options and parent container height
      this.uiOptionsList.style.height = '0px';
      this.uiSelect.style.height = (uiSelectHeight - this.uiOptionsListHeight) + 'px';

      // step 2 - hide options
      this.uiOptionsList.addEventListener('transitionend', callback);
    }
  }


  waitNextFrame(callback) {
    requestAnimationFrame(() => {
      setTimeout(callback, 0);
    });
  }


  // When ui-select value changes
  updateSelectAndUiSelect(e) {
    if (this.isAnimated) return;

    const uiOption = e.currentTarget;
    if (uiOption === this.uiSelectedOption) return;

    const value = uiOption.dataset.value;

    this.toggleUiOptionItemSelectedClass(uiOption);

    // hide ui-options
    this.toggleUiOptions(false);

    // update ui-select
    this.uiSelectValue.textContent = value;
    this.wrapperEl.classList.remove(this.options.wrapperSelectedClass);

    // update <select> and trigger the change event
    this.select.value = value;
    this.select.dispatchEvent(new Event('change', { bubbles: true }));
  }


  // When <select> value changes
  updateUiSelect(e) {
    const value = e.currentTarget.value;

    const uiOption = this.getUiOptionByValue(value);
    if (uiOption === this.uiSelectedOption) return;

    this.toggleUiOptionItemSelectedClass(uiOption);

    this.uiSelectValue.textContent = value;
  }


  toggleUiOptionItemSelectedClass(uiOption) {
    this.uiSelectedOption.classList.remove(this.options.uiSelectedOptionClass);
    uiOption.classList.add(this.options.uiSelectedOptionClass);
    this.uiSelectedOption = uiOption;
    this.uiSelectedOption.scrollIntoView({ block: 'nearest' });
  }


  getUiOptionByValue(value) {
    return Array.from(this.uiOptions).find(el => el.dataset.value === value);
  }


  handleKeyboardEvents(e) {
    // prevent any keyboard action during animation
    if (this.isAnimated) {
      e.preventDefault();
      return;
    }
    // toggle ui-options
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      this.toggleUiOptions();
    }
    // hide ui-options when user tabs away
    else if (e.key === 'Tab') {
      if (this.isOpen) {
        this.toggleUiOptions(false);
      }
    }
  }
}