// Generates and appends option elements for a select.
// For Year and Day selects, option text equals its value;
// for Month select, option text is the full month name.
function createSelectOptions(select, start, end, pad = false, isMonth = false) {
  const step = start <= end ? 1 : -1;

  for (let i = start; step > 0 ? i <= end : i >= end; i += step) {
    const option = document.createElement('option');

    const value = pad
      ? i.toString().padStart(2, '0')
      : i.toString();

    option.value = value;

    option.textContent = isMonth
      ? new Date(2000, i - 1).toLocaleDateString('en-US', { month: 'long' })
      : value;

    select.appendChild(option);
  }
}


document.addEventListener('DOMContentLoaded', () => {
  const yearSelect  = document.getElementById('date-year');
  const monthSelect = document.getElementById('date-month');
  const daySelect   = document.getElementById('date-day');

  // create options for all select fields
  const curYear = new Date().getFullYear();
  createSelectOptions(yearSelect, curYear, curYear - 60);
  createSelectOptions(monthSelect, 1, 12, true, true);
  createSelectOptions(daySelect, 1, 31, true);

  // select a demo date (as if fetched from the database)
  yearSelect.value  = '2024';
  monthSelect.value = '03';
  daySelect.value   = '31';

  // initialization
  const root = document.getElementById('date-picker');
  new MultiSelectDatePicker(root, { /* options */ });
});