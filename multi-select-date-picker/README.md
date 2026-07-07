# Multi-Select Date Picker

A pure JavaScript plugin for selecting a date using three synchronized `select` boxes
(year, month, day). Prevents selecting invalid dates.

**Live Demo:** https://demo.arsen.pro/javascript/multi-select-date-picker/


## Screenshots

<kbd>
  <img src="screenshots/multi-select-date-picker.png"
       alt="Multi-select date picker with year, month, and day dropdowns
            that automatically disable invalid dates depending on month length
            and leap year rules">
</kbd>


## Features

* Customizable
* Keyboard accessible
* Dependency-free
* Lightweight


## Technologies

* JavaScript (ES6+)
* HTML5


## How to Use

1. Add three `select` boxes to your form.
2. Include `multi-select-date-picker.js` in your page.
3. Initialize the plugin with default or custom options.


## Options

| Option          | Type     | Default         | Description                       |
|-----------------|----------|-----------------|-----------------------------------|
| `yearSelector`  | `string` | `'#date-year'`  | CSS selector for the year select  |
| `monthSelector` | `string` | `'#date-month'` | CSS selector for the month select |
| `daySelector`   | `string` | `'#date-day'`   | CSS selector for the day select   |