/**
 * @typedef {Object} FrenchTypographicSpacingOptions
 * @property {'none'|'narrow'|'regular'} [nbspType = 'regular']
 * - Type of non-breaking space to insert
 *   - 'none'    : Do not insert any non-breaking spaces and remove existing ones
 *   - 'narrow'  : Insert narrow non-breaking spaces
 *   - 'regular' : Insert regular non-breaking spaces
 * @property {string} [insertBeforeChars = '?!:;%']
 * - Characters before which a non-breaking space should be inserted
 * @property {string[]} [skipTags = ['STYLE', 'SCRIPT', 'NOSCRIPT', 'IFRAME', 'INPUT', 'TEXTAREA']]
 * - HTML tags to skip when processing
 */

/**
 * Adds non-breaking spaces before punctuation marks on French pages.
 * @param {HTMLElement} root - The root container element whose text nodes will be processed
 * @param {FrenchTypographicSpacingOptions} [options] - Custom configuration options
 */
class FrenchTypographicSpacing {
  constructor(root, options = {}) {
    this.root = root;
    if (!this.root || !this.root.childNodes) return;

    this.options = {
      nbspType          : 'regular',
      insertBeforeChars : '?!:;%',
      skipTags          : ['STYLE', 'SCRIPT', 'NOSCRIPT', 'IFRAME', 'INPUT', 'TEXTAREA'],
      ...options
    };

    this.nbspChars = {
      'none'    : '',
      'narrow'  : '\u202F',
      'regular' : '\u00A0',
    }

    this.nbspChar = this.nbspChars[this.options.nbspType];

    const spaceChars = `[\\s${this.nbspChars.narrow}${this.nbspChars.regular}]`;
    this.hasSpaceRegex = new RegExp(`${spaceChars}+([${this.options.insertBeforeChars}])`, 'g');

    this.noSpaceRegex = new RegExp(`(\\S)([${this.options.insertBeforeChars}])`, 'g');

    this.init();
  }


  init() {
    this.root.childNodes.forEach(el => this.processNode(el));
  }


  processNode(node) {
    if (this.isElementNode(node)) {
      node.childNodes.forEach(el => this.processNode(el));
    }
    else if (this.isTextNode(node)) {
      this.updateTextNode(node);
    }
  }


  isElementNode(node) {
    return node.nodeType === Node.ELEMENT_NODE &&
      !this.options.skipTags.includes(node.tagName);
  }


  isTextNode(node) {
    return node.nodeType === Node.TEXT_NODE;
  }


  updateTextNode(node) {
    node.textContent = node.textContent
      // normalize existing spaces
      .replace(this.hasSpaceRegex, this.nbspChar + '$1')
      // insert missing spaces where needed
      .replace(this.noSpaceRegex, '$1' + this.nbspChar + '$2')
  }
}