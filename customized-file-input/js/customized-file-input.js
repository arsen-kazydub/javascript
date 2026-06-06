/**
 * @typedef {Object} CustomizedFileInputOptions
 * @property {string} [wrapperClass = 'customized-file-input']
 * - CSS class for the wrapper element containing the file input and decorative elements
 * @property {string} [fakeInputClass = 'customized-file-input__fake-input']
 * - CSS class for the fake input where the selected file name is displayed
 * @property {string} [fakeBtnClass = 'customized-file-input__fake-btn']
 * - CSS class for the fake button
 * @property {string} [fakeBtnText = 'Browse']
 * - Text displayed inside the fake button
 */

/**
 * Creates a new CustomizedFileInput instance
 * @param {HTMLInputElement} fileInput - The native <input type="file"> element
 * @param {CustomizedFileInputOptions} [options] - Custom configuration options
 */
class CustomizedFileInput {
  constructor(fileInput, options = {}) {
    this.fileInput = fileInput;
    if (!this.fileInput) return;

    this.options = {
      wrapperClass   : 'customized-file-input',
      fakeInputClass : 'customized-file-input__fake-input',
      fakeBtnClass   : 'customized-file-input__fake-btn',
      fakeBtnText    : 'Browse',
      ...options
    };

    this.wrapperEl = null;
    this.fakeInput = null;

    this.init();
  }


  init() {
    if (this.isCustomized()) return;
    this.createWrapper();
    this.createFakeInput();
    this.fileInput.addEventListener('change', () => this.changeHandler());
  }


  isCustomized() {
    return this.fileInput.parentNode.classList.contains(this.options.wrapperClass);
  }


  createWrapper() {
    this.wrapperEl = Object.assign(document.createElement('div'), {
      className: this.options.wrapperClass
    });
    this.fileInput.parentNode.insertBefore(this.wrapperEl, this.fileInput);
    this.wrapperEl.append(this.fileInput);
  }


  createFakeInput() {
    this.fakeInput = document.createElement('div');
    this.fakeInput.className = this.options.fakeInputClass;

    const fakeBtn = document.createElement('div');
    fakeBtn.className = this.options.fakeBtnClass;
    fakeBtn.textContent = this.options.fakeBtnText;

    this.wrapperEl.append(this.fakeInput, fakeBtn);
  }


  changeHandler() {
    let value = this.fileInput.value;
    if (value.lastIndexOf('\\') !== -1) {
      value = value.substring(value.lastIndexOf('\\') + 1);
    }
    this.fakeInput.textContent = value;
  }
}