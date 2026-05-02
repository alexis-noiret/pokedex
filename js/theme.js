// ============================================================
// theme.js — Gestion du mode sombre / mode clair
// Compétences : DOM, événements, localStorage (persistance)
//
// Note : le thème est pré-appliqué dans un <script> inline dans
// le <head> pour éviter le flash au changement de page.
// Ce fichier gère uniquement l'interactivité du bouton toggle.
// ============================================================

(function () {
  const STORAGE_KEY = 'pokedex-theme';
  const html        = document.documentElement;

  // ---- Activer les transitions CSS seulement après le premier rendu ----
  // (évite le flash de transition au chargement de page)
  function enableTransitions() {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        html.classList.add('theme-ready');
      });
    });
  }

  // ---- Lire le thème sauvegardé ----
  function getSavedTheme() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return saved;
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }

  // ---- Appliquer le thème ----
  function applyTheme(theme) {
    if (theme === 'light') {
      html.classList.add('light');
    } else {
      html.classList.remove('light');
    }
    updateToggleButton(theme);
    localStorage.setItem(STORAGE_KEY, theme);
  }

  // ---- Mettre à jour le bouton ----
  function updateToggleButton(theme) {
    const btn = document.getElementById('theme-toggle');
    if (!btn) return;

    if (theme === 'light') {
      btn.textContent = '🌙';
      btn.setAttribute('aria-label', 'Passer en mode sombre');
      btn.title = 'Mode sombre';
    } else {
      btn.textContent = '☀️';
      btn.setAttribute('aria-label', 'Passer en mode clair');
      btn.title = 'Mode clair';
    }
  }

  // ---- Basculer ----
  function toggleTheme() {
    const current = html.classList.contains('light') ? 'light' : 'dark';
    applyTheme(current === 'light' ? 'dark' : 'light');
  }

  // ---- Initialisation ----
  function init() {
    // Synchroniser le bouton avec le thème déjà appliqué par le script inline
    updateToggleButton(getSavedTheme());

    // Activer les transitions après le premier rendu (double rAF = après le paint)
    enableTransitions();

    // Attacher l'événement sur le bouton
    const btn = document.getElementById('theme-toggle');
    if (btn) {
      btn.addEventListener('click', toggleTheme);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
