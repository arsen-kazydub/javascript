document.addEventListener('DOMContentLoaded', () => {
  const root = document.getElementById('mortgage-calculator');
  if (!root) return;

  new MortgageCalculator(root, {
    price: 500000,
    maxPrice: 1000000,
  });
});