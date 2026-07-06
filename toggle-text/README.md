# Toggle Text

A pure JavaScript plugin that creates collapsible text sections,
offering configurable break points and smooth height transitions.


## Preview

<kbd>
  <img src="screenshots/toggle-text.png"
       alt="Collapsible text block showing only the first paragraph
            with a 'Read More' button below to expand hidden content">
</kbd>

<div>&nbsp;</div>

**Live Demo:** https://demo.arsen.pro/javascript/toggle-text/


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

* JavaScript (ES6+)
* HTML5
* CSS3


## How to Use

1. Prepare your HTML markup as in the example below.
2. Include `toggle-text.css` and `toggle-text.js` in your page.
3. Initialize the plugin with default or custom options.

**Example**

```html
<div class="toggle-text">
  <div class="toggle-text__content">
    <!-- Your text here -->
  </div>
  <button type="button" class="btn btn-primary toggle-text__btn">Read More</button>
</div>
```


## Options

| Option               | Type     | Default                      | Description                                                              |
|----------------------|----------|------------------------------|--------------------------------------------------------------------------|
| `breakPointSelector` | `string` | `'p:nth-child(2)'`           | CSS selector for the element before which a break point will be inserted |
| `contentClass`       | `string` | `'toggle-text__content'`     | CSS class for the content container                                      |
| `breakPointClass`    | `string` | `'toggle-text__break-point'` | CSS class for the inserted break point element                           |
| `btnClass`           | `string` | `'toggle-text__btn'`         | CSS class for the toggle button                                          |
| `btnTextExpand`      | `string` | `'Read More'`                | Button text when content is collapsed                                    |
| `btnTextCollapse`    | `string` | `'Read Less'`                | Button text when content is expanded                                     |
| `transitionDuration` | `number` | `400`                        | Duration of the height transition in milliseconds                        |