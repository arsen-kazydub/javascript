# French Typographic Spacing

A pure JavaScript plugin that automatically inserts non-breaking spaces before punctuation marks
according to French typographic rules.

**Live Demo:** https://demo.arsen.pro/javascript/french-typographic-spacing/


## Screenshots

<kbd>
  <img src="screenshots/french-typographic-spacing.png"
       alt="Demo box showing a Latin placeholder text with a dropdown control above it
            to switch non-breaking space types (None, Narrow, Regular)">
</kbd>


## Features

* Automatic French typographic spacing
* Customizable
* Dependency-free
* Lightweight


## Technologies

* JavaScript (ES6+)


## How to Use

### Setup

Include `french-typographic-spacing.js`.


### Initialization

```js
const container = document.querySelector('.container');

// Default options
new FrenchTypographicSpacing(container);

// Custom options
new FrenchTypographicSpacing(container, {
  nbspType: 'narrow'
});
```


## Options

| Option              | Type                                      | Default                                                                                      | Description                                                                                                                                                                                                                       |
|---------------------|-------------------------------------------|----------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `nbspType`          | `'none'`<br />`'narrow'`<br />`'regular'` | `'regular'`                                                                                  | Type of non-breaking space to insert:<br />- `'none'`: Do not insert any non-breaking spaces and remove existing ones<br />- `'narrow'`: Insert narrow non-breaking spaces<br />- `'regular'`: Insert regular non-breaking spaces |
| `insertBeforeChars` | `string`                                  | `'?!:;%'`                                                                                    | Characters before which a non-breaking space should be inserted                                                                                                                                                                   |
| `skipTags`          | `string[]`                                | `'STYLE'`<br />`'SCRIPT'`<br />`'NOSCRIPT'`<br />`'IFRAME'`<br />`'INPUT'`<br />`'TEXTAREA'` | HTML tags to skip when processing                                                                                                                                                                                                 |