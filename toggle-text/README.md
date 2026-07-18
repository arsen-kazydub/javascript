# Toggle Text

A pure JavaScript plugin that creates collapsible text sections,
offering configurable break points and smooth height transitions.

**Live Demo:** https://demo.arsen.pro/javascript/toggle-text/


## Screenshots

<kbd>
  <img src="screenshots/toggle-text.png"
       alt="Collapsible text block showing only the first paragraph
            with a 'Read More' button below to expand hidden content">
</kbd>


## Features

* Smooth height transitions
* Customizable
* Keyboard accessible
* Responsive layout
* Semantic markup
* Dependency-free
* Lightweight
* Translatable


## Technologies

* JavaScript
* HTML
* CSS


## How to Use

### Setup

Include `toggle-text.css` and `toggle-text.js`.


### Markup

```html
<div class="toggle-text">
  <div class="toggle-text__content">
    <!-- Your text -->
  </div>
  <button type="button" class="btn btn-primary toggle-text__btn">Read More</button>
</div>
```


### Initialization

```js
const container = document.querySelector('.toggle-text');

// Default options
new ToggleText(container);

// Custom options
new ToggleText(container, {
  btnTextExpand: 'Lire plus',
  btnTextCollapse: 'Lire moins'
});
```


## Options

| Option               | Type     | Default                      | Description                                                              |
|----------------------|----------|------------------------------|--------------------------------------------------------------------------|
| `breakPointSelector` | `string` | `'p:nth-child(2)'`           | CSS selector for the element before which a break point will be inserted |
| `btnTextExpand`      | `string` | `'Read More'`                | Button text when content is collapsed                                    |
| `btnTextCollapse`    | `string` | `'Read Less'`                | Button text when content is expanded                                     |
| `transitionDuration` | `number` | `400`                        | Duration of the height transition, in milliseconds                       |
| `classes`            | `object` | `{...}`                      | CSS class names                                                          |
| `classes.content`    | `string` | `'toggle-text__content'`     | CSS class for the content container                                      |
| `classes.breakPoint` | `string` | `'toggle-text__break-point'` | CSS class for the inserted break point element                           |
| `classes.btn`        | `string` | `'toggle-text__btn'`         | CSS class for the toggle button                                          |