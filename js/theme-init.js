const saved = localStorage.getItem('pokedex-theme');
if (saved === 'light') {
  document.documentElement.classList.add('light');
}
