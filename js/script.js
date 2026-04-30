// ============================================================
// script.js — Page principale du Pokédex
// Compétences démontrées :
//   - fetch + async/await (communication asynchrone)
//   - Manipulation DOM (sélecteurs, création d'éléments)
//   - Événements (click, input, keypress)
//   - Timers (setTimeout pour les animations décalées)
// ============================================================

// ---- CONSTANTES API ----
const API_BASE   = 'https://pokeapi.co/api/v2';
const TOTAL_POKEMON = 151; // Génération 1

// ---- SÉLECTEURS DOM ----
const grid        = document.getElementById('pokemon-grid');
const loader      = document.getElementById('loader');
const countEl     = document.getElementById('pokemon-count');
const emptyState  = document.getElementById('empty-state');
const searchInput = document.getElementById('search-input');
const resetBtn    = document.getElementById('reset-btn');
const filterBtns  = document.querySelectorAll('.filter-btn');
const navToggle   = document.querySelector('.navbar__toggle');
const navLinks    = document.querySelector('.navbar__links');

// ---- STATE ----
let allPokemon     = [];   // liste complète chargée une seule fois
let filteredPokemon = [];  // liste après filtres
let activeType     = 'all';
let searchQuery    = '';

// ============================================================
// SON — Généré via Web Audio API
// Safari exige que l'AudioContext soit créé ET resume()
// directement dans le gestionnaire de clic (pas en dehors)
// ============================================================
function playClickSound() {
  try {
    // Création dans le handler de clic = compatible Safari
    const ctx = new (window.AudioContext || window.webkitAudioContext)();

    ctx.resume().then(() => {
      const now = ctx.currentTime;

      // Note 1 : montée rapide style 8-bit
      const osc1  = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.type = 'square';
      osc1.frequency.setValueAtTime(440, now);
      osc1.frequency.exponentialRampToValueAtTime(880, now + 0.08);
      gain1.gain.setValueAtTime(0.12, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
      osc1.start(now);
      osc1.stop(now + 0.14);

      // Note 2 : confirmation
      const osc2  = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.type = 'square';
      osc2.frequency.setValueAtTime(1320, now + 0.12);
      gain2.gain.setValueAtTime(0.08, now + 0.12);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.24);
      osc2.start(now + 0.12);
      osc2.stop(now + 0.24);
    });
  } catch (e) {
    // Web Audio non supporté — silencieux
  }
}

// ============================================================
// FETCH — Récupérer tous les Pokémon de gen 1
// ============================================================
async function fetchAllPokemon() {
  showLoader(true);

  try {
    // 1. Récupère la liste des 151 Pokémon
    const listRes  = await fetch(`${API_BASE}/pokemon?limit=${TOTAL_POKEMON}&offset=0`);
    const listData = await listRes.json();

    // 2. Récupère détails + species en parallèle pour chaque Pokémon
    //    species contient le nom français dans data.names
    const promises = listData.results.map(async (p) => {
      const [pokemon, species] = await Promise.all([
        fetch(p.url).then(r => r.json()),
        fetch(`${API_BASE}/pokemon-species/${p.url.split('/').filter(Boolean).pop()}`).then(r => r.json())
      ]);
      // Injecte le nom FR directement sur l'objet pokemon
      const frName = species.names?.find(n => n.language.name === 'fr');
      pokemon.nameFr = frName?.name || capitalize(pokemon.name);
      return pokemon;
    });

    allPokemon = await Promise.all(promises);

    filteredPokemon = [...allPokemon];
    renderGrid(filteredPokemon, true); // true = animation décalée au 1er chargement

  } catch (err) {
    console.error('Erreur lors du chargement du Pokédex :', err);
    grid.innerHTML = `<p class="empty-state__text">Erreur de connexion à PokéAPI 😢</p>`;
  } finally {
    showLoader(false);
  }
}

// ============================================================
// AFFICHAGE — Créer les cartes Pokémon
// isInitialLoad : true = animation décalée (chargement initial)
//                 false = rendu immédiat (filtres/recherche)
// ============================================================
function renderGrid(pokemonList, isInitialLoad = false) {
  // Fixer la hauteur du conteneur avant de vider pour éviter le saut de page
  grid.style.minHeight = grid.offsetHeight + 'px';
  grid.innerHTML = '';
  emptyState.hidden = true;

  if (pokemonList.length === 0) {
    grid.style.minHeight = '';
    emptyState.hidden = false;
    updateCount(0);
    return;
  }

  if (isInitialLoad) {
    // Chargement initial : animation d'apparition décalée (timer — compétence requise)
    pokemonList.forEach((pokemon, index) => {
      setTimeout(() => {
        const card = createCard(pokemon);
        grid.appendChild(card);
        // Libérer la hauteur fixe une fois la dernière carte insérée
        if (index === pokemonList.length - 1) {
          setTimeout(() => { grid.style.minHeight = ''; }, 50);
        }
      }, index * 25);
    });
  } else {
    // Filtres / recherche : rendu immédiat sans saut de page
    const fragment = document.createDocumentFragment();
    pokemonList.forEach(pokemon => {
      fragment.appendChild(createCard(pokemon));
    });
    grid.appendChild(fragment);
    grid.style.minHeight = '';
  }

  updateCount(pokemonList.length);
}

function createCard(pokemon) {
  const card = document.createElement('article');
  card.classList.add('card');
  card.setAttribute('tabindex', '0');  // accessibilité clavier
  card.setAttribute('role', 'button');
  card.setAttribute('aria-label', `Voir les détails de ${pokemon.nameFr}`);

  const types   = pokemon.types.map(t => t.type.name);
  const number  = String(pokemon.id).padStart(3, '0');
  const sprite  = pokemon.sprites.other['official-artwork'].front_default
                || pokemon.sprites.front_default;

  // Couleur de fond selon le type principal
  const mainType    = types[0];
  const typeColors  = getTypeColor(mainType);

  card.innerHTML = `
    <div class="card__bg" style="background: radial-gradient(circle at 60% 30%, ${typeColors}, transparent)"></div>
    <span class="card__number">#${number}</span>
    <div class="card__image-wrap">
      <img
        class="card__image"
        src="${sprite}"
        alt="${pokemon.nameFr}"
        loading="lazy"
        width="90"
        height="90"
      >
    </div>
    <h2 class="card__name">${pokemon.nameFr}</h2>
    <div class="card__types">
      ${types.map(t => `<span class="type-badge type-badge--${t}">${t}</span>`).join('')}
    </div>
  `;

  // Événement clic → son + page de détail (délai 250ms pour laisser le son jouer)
  card.addEventListener('click', () => {
    playClickSound();
    setTimeout(() => navigateToDetail(pokemon.id), 250);
  });

  // Événement clavier (accessibilité WCAG)
  card.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      navigateToDetail(pokemon.id);
    }
  });

  return card;
}

// ============================================================
// NAVIGATION → page de détail avec paramètre URL
// ============================================================
function navigateToDetail(id) {
  window.location.href = `pages/detail.html?id=${id}`;
}

// ============================================================
// FILTRES PAR TYPE
// ============================================================
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    // Mise à jour de l'état actif
    filterBtns.forEach(b => b.classList.remove('filter-btn--active'));
    btn.classList.add('filter-btn--active');

    activeType = btn.dataset.type;
    applyFilters();
  });
});

// ============================================================
// RECHERCHE (événement input)
// ============================================================
searchInput.addEventListener('input', (e) => {
  searchQuery = e.target.value.toLowerCase().trim();
  applyFilters();
});

// ============================================================
// APPLICATION DES FILTRES (type + recherche)
// ============================================================
function applyFilters() {
  filteredPokemon = allPokemon.filter(pokemon => {
    const types   = pokemon.types.map(t => t.type.name);
    const matchType   = activeType === 'all' || types.includes(activeType);
    const matchSearch = pokemon.name.includes(searchQuery)
                     || pokemon.nameFr.toLowerCase().includes(searchQuery)
                     || String(pokemon.id).includes(searchQuery);
    return matchType && matchSearch;
  });

  renderGrid(filteredPokemon);
}

// Réinitialisation depuis le bouton "empty state"
resetBtn.addEventListener('click', () => {
  searchInput.value = '';
  searchQuery = '';
  activeType  = 'all';
  filterBtns.forEach(b => b.classList.remove('filter-btn--active'));
  filterBtns[0].classList.add('filter-btn--active');
  applyFilters();
});

// ============================================================
// MENU MOBILE (événement click + aria)
// ============================================================
if (navToggle) {
  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('navbar__links--open');
    navToggle.setAttribute('aria-expanded', isOpen);
  });
}

// ============================================================
// UTILITAIRES
// ============================================================
function showLoader(show) {
  loader.hidden  = !show;
  grid.hidden    = show;
}

function updateCount(count) {
  countEl.textContent = `${count} Pokémon affiché${count > 1 ? 's' : ''}`;
}

// Couleurs hex pour le fond des cartes (dégradé)
function getTypeColor(type) {
  const colors = {
    normal  : 'rgba(159, 161, 159, 0.6)',
    fire    : 'rgba(230, 40, 41, 0.6)',
    water   : 'rgba(41, 128, 239, 0.6)',
    grass   : 'rgba(63, 161, 41, 0.6)',
    electric: 'rgba(250, 192, 0, 0.6)',
    ice     : 'rgba(61, 206, 243, 0.6)',
    fighting: 'rgba(255, 128, 0, 0.6)',
    poison  : 'rgba(145, 65, 203, 0.6)',
    ground  : 'rgba(145, 81, 33, 0.6)',
    flying  : 'rgba(129, 185, 239, 0.6)',
    psychic : 'rgba(239, 65, 121, 0.6)',
    bug     : 'rgba(145, 161, 25, 0.6)',
    rock    : 'rgba(175, 169, 129, 0.6)',
    ghost   : 'rgba(112, 65, 112, 0.6)',
    dragon  : 'rgba(80, 96, 225, 0.6)',
    dark    : 'rgba(98, 77, 78, 0.6)',
    steel   : 'rgba(96, 161, 184, 0.6)',
    fairy   : 'rgba(239, 112, 239, 0.6)',
  };
  return colors[type] || 'rgba(255,255,255,0.1)';
}

// ============================================================
// INITIALISATION
// ============================================================
fetchAllPokemon();
