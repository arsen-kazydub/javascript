/**
 * @typedef {Object} MultiSelectDatePickerOptions
 * @property {string} [yearSelector = '#date-year']   - CSS selector for the year select
 * @property {string} [monthSelector = '#date-month'] - CSS selector for the month select
 * @property {string} [daySelector = '#date-day']     - CSS selector for the day select
 */

/**
 * Creates a new MultiSelectDatePicker instance
 * @param {HTMLElement} root - The root container holding the year, month, and day selects
 * @param {MultiSelectDatePickerOptions} [options] - Custom configuration options
 * @throws {Error} If any required elements are not found
 */
class MultiSelectDatePicker {
  constructor(root, options = {}) {
    this.root = root;

    this.options = {
      yearSelector  : '#date-year',
      monthSelector : '#date-month',
      daySelector   : '#date-day',
      ...options
    };

    this.yearSelect  = this.root.querySelector(this.options.yearSelector);
    this.monthSelect = this.root.querySelector(this.options.monthSelector);
    this.daySelect   = this.root.querySelector(this.options.daySelector);

    if (!this.yearSelect || !this.monthSelect || !this.daySelect) {
      throw new Error(`${this.constructor.name}: Missing required elements.`);
    }

    this.selects = [this.yearSelect, this.monthSelect, this.daySelect];
    this.shortMonths = ['02', '04', '06', '09', '11'];

    this.init();
  }


  init() {
    this.selects.forEach(el => {
      el.addEventListener('change', e => this.handleChange(e));
    });
    this.disableInvalidOptions();
  }


  // Handles a change by updating the other two selects
  handleChange(e) {
    const changedSelect = e.currentTarget;
    const targetSelects = this.selects.filter(s => s !== changedSelect);
    targetSelects.forEach(select => this.updateOptions(select));
  }


  // Triggers a change event to initialize disabled state of invalid options
  disableInvalidOptions() {
    this.selects.forEach(select => {
      if (select.value) {
        select.dispatchEvent(new Event('change'));
      }
    });
  }


  // Disables invalid options for the given select
  updateOptions(select) {
    const options = select.querySelectorAll('option:not(:first-child)');
    options.forEach(option => {
      const { year, month, day } = this.getOptionValues(select, option);
      option.disabled = this.shouldDisableOption(select, year, month, day);
    });
  }


  // Builds a year/month/day object where the iterated select uses the dynamic option.value,
  // while the values of the other 2 selects remain unchanged
  getOptionValues(select, option) {
    return {
      year  : (select === this.yearSelect)  ? option.value : this.yearSelect.value,
      month : (select === this.monthSelect) ? option.value : this.monthSelect.value,
      day   : (select === this.daySelect)   ? option.value : this.daySelect.value
    };
  }


  // Determines whether an option should be disabled based on year/month/day
  shouldDisableOption(select, year, month, day) {
    const isFeb29NotLeap   = day === '29' && month === '02' && !this.isLeapYear(year);
    const isFeb30          = day === '30' && month === '02';
    const is31InShortMonth = day === '31' && this.isShortMonth(month);

    // Year select is affected only when Feb 29 falls in a non-leap year
    if (select === this.yearSelect) return isFeb29NotLeap;

    // Month and Day selects are affected by all invalid date cases
    return isFeb29NotLeap || isFeb30 || is31InShortMonth;
  }


  // Returns true if the year is a leap year
  isLeapYear(year) {
    const y = Number(year);
    return ((y % 4 === 0) && (y % 100 !== 0)) || (y % 400 === 0);
  }


  // Returns true if the month has fewer than 31 days
  isShortMonth(month) {
    return this.shortMonths.includes(month);
  }
}