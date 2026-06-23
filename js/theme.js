document.addEventListener('DOMContentLoaded', function() {

  const bouton = document.getElementById('theme-toggle');
  let themeSauvegarde = localStorage.getItem('pokedex-theme');

  if (themeSauvegarde === null) {
    themeSauvegarde = 'dark';
  }

  appliquerTheme(themeSauvegarde);

  if (bouton) {
    bouton.addEventListener('click', function() {
      const themeActuel = localStorage.getItem('pokedex-theme');

      if (themeActuel === 'light') {
        appliquerTheme('dark');
      } else {
        appliquerTheme('light');
      }
    });
  }

});

function appliquerTheme(theme) {
  const bouton = document.getElementById('theme-toggle');

  if (theme === 'light') {
    document.documentElement.classList.add('light');
    if (bouton) {
      bouton.textContent = '🌙';
      bouton.setAttribute('aria-label', 'Passer en mode sombre');
    }
  } else {
    document.documentElement.classList.remove('light');
    if (bouton) {
      bouton.textContent = '☀️';
      bouton.setAttribute('aria-label', 'Passer en mode clair');
    }
  }

  localStorage.setItem('pokedex-theme', theme);
}
