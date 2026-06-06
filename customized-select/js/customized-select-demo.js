document.addEventListener('DOMContentLoaded', () => {

  // Create options for the Country select box
  (function() {
    const select = document.getElementById('user-country');
    const fragment = document.createDocumentFragment();

    const countries = [
      'Austria',  'Belgium',     'Bulgaria', 'Croatia',  'Cyprus',    'Czech Republic',
      'Denmark',  'Estonia',     'Finland',  'France',   'Germany',   'Greece',
      'Hungary',  'Ireland',     'Italy',    'Latvia',   'Lithuania', 'Luxembourg',
      'Malta',    'Netherlands', 'Poland',   'Portugal', 'Romania',   'Slovakia',
      'Slovenia', 'Spain',       'Sweden'
    ];

    for (const country of countries) {
      const option = document.createElement('option');
      option.textContent = country;
      fragment.appendChild(option);
    }

    select.appendChild(fragment);
  })();


  // Create options for the Age select box
  (function() {
    const select = document.getElementById('user-age');
    const fragment = document.createDocumentFragment();

    const year = new Date().getFullYear();
    const yearFrom = year - 10;
    const yearTo = year - 100;

    for (let i = yearFrom; i >= yearTo; i--) {
      const option = document.createElement('option');
      option.textContent = String(i);
      fragment.appendChild(option);
    }

    select.appendChild(fragment);
  })();


  document
    .querySelectorAll('select')
    .forEach(el => new CustomizedSelect(el, {
      width: '100%', visibleOptions: 6
    }));

});