const API_URL = 'https://pokeapi.co/api/v2/pokemon';
const SPECIES_URL = 'https://pokeapi.co/api/v2/pokemon-species';

const typesFr = {
  normal: 'Normal',
  fire: 'Feu',
  water: 'Eau',
  grass: 'Plante',
  electric: 'Electrik',
  ice: 'Glace',
  fighting: 'Combat',
  poison: 'Poison',
  ground: 'Sol',
  flying: 'Vol',
  psychic: 'Psy',
  bug: 'Insecte',
  rock: 'Roche',
  ghost: 'Spectre',
  dragon: 'Dragon',
  dark: 'Tenebres',
  steel: 'Acier',
  fairy: 'Fee'
};

const typesColors = {
  normal: 'rgba(159, 161, 159, 0.6)',
  fire: 'rgba(230, 40, 41, 0.6)',
  water: 'rgba(41, 128, 239, 0.6)',
  grass: 'rgba(63, 161, 41, 0.6)',
  electric: 'rgba(250, 192, 0, 0.6)',
  ice: 'rgba(61, 206, 243, 0.6)',
  fighting: 'rgba(255, 128, 0, 0.6)',
  poison: 'rgba(145, 65, 203, 0.6)',
  ground: 'rgba(145, 81, 33, 0.6)',
  flying: 'rgba(129, 185, 239, 0.6)',
  psychic: 'rgba(239, 65, 121, 0.6)',
  bug: 'rgba(145, 161, 25, 0.6)',
  rock: 'rgba(175, 169, 129, 0.6)',
  ghost: 'rgba(112, 65, 112, 0.6)',
  dragon: 'rgba(80, 96, 225, 0.6)',
  dark: 'rgba(98, 77, 78, 0.6)',
  steel: 'rgba(96, 161, 184, 0.6)',
  fairy: 'rgba(239, 112, 239, 0.6)'
};

const grid = document.getElementById('pokemon-grid');
const loader = document.getElementById('loader');
const compteur = document.getElementById('pokemon-count');
const emptyState = document.getElementById('empty-state');
const searchInput = document.getElementById('search-input');
const resetBtn = document.getElementById('reset-btn');
const filterBtns = document.querySelectorAll('.filter-btn');
const navToggle = document.querySelector('.navbar__toggle');
const navLinks = document.querySelector('.navbar__links');

let listePokemon = [];
let filtre = 'all';
let recherche = '';

async function chargerPokemon() {
  loader.hidden = false;
  grid.hidden = true;

  try {
    const res = await fetch(API_URL + '?limit=151');
    const data = await res.json();
    const liste = data.results;

    for (let i = 0; i < liste.length; i++) {
      const resPokemon = await fetch(liste[i].url);
      const pokemon = await resPokemon.json();

      const resSpecies = await fetch(SPECIES_URL + '/' + pokemon.id);
      const species = await resSpecies.json();

      let nomFr = pokemon.name;
      for (let j = 0; j < species.names.length; j++) {
        if (species.names[j].language.name === 'fr') {
          nomFr = species.names[j].name;
          break;
        }
      }

      pokemon.nomFr = nomFr;
      listePokemon.push(pokemon);
    }

    afficherGrille(listePokemon, true);

  } catch(e) {
    grid.innerHTML = '<p class="empty-state__text">Erreur de connexion 😢</p>';
  }

  loader.hidden = true;
  grid.hidden = false;
}

function afficherGrille(liste, anime) {
  grid.innerHTML = '';
  emptyState.hidden = true;

  if (liste.length === 0) {
    emptyState.hidden = false;
    compteur.textContent = '0 Pokémon affiché';
    return;
  }

  if (anime) {
    for (let i = 0; i < liste.length; i++) {
      setTimeout(function(p) {
        return function() {
          grid.appendChild(creerCarte(p));
        };
      }(liste[i]), i * 30);
    }
  } else {
    for (let i = 0; i < liste.length; i++) {
      grid.appendChild(creerCarte(liste[i]));
    }
  }

  const nb = liste.length;
  compteur.textContent = nb + ' Pokémon affiché' + (nb > 1 ? 's' : '');
}

function creerCarte(pokemon) {
  const card = document.createElement('article');
  card.classList.add('card');
  card.setAttribute('tabindex', '0');
  card.setAttribute('role', 'button');
  card.setAttribute('aria-label', 'Voir les détails de ' + pokemon.nomFr);

  const types = pokemon.types.map(function(t) { return t.type.name; });
  const numero = String(pokemon.id).padStart(3, '0');
  const image = pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default;
  const couleur = typesColors[types[0]] || 'rgba(255,255,255,0.1)';

  let badgesTypes = '';
  for (let i = 0; i < types.length; i++) {
    const t = types[i];
    badgesTypes += '<span class="type-badge type-badge--' + t + '">' + (typesFr[t] || t) + '</span>';
  }

  card.innerHTML = '<div class="card__bg" style="background: radial-gradient(circle at 60% 30%, ' + couleur + ', transparent)"></div>'
    + '<span class="card__number">#' + numero + '</span>'
    + '<div class="card__image-wrap"><img class="card__image" src="' + image + '" alt="' + pokemon.nomFr + '" loading="lazy" width="90" height="90"></div>'
    + '<h2 class="card__name">' + pokemon.nomFr + '</h2>'
    + '<div class="card__types">' + badgesTypes + '</div>';

  card.addEventListener('click', function() {
    window.location.href = 'pages/detail.html?id=' + pokemon.id;
  });

  card.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      window.location.href = 'pages/detail.html?id=' + pokemon.id;
    }
  });

  return card;
}

function filtrer() {
  const resultat = [];

  for (let i = 0; i < listePokemon.length; i++) {
    const pokemon = listePokemon[i];
    const types = pokemon.types.map(function(t) { return t.type.name; });

    const okType = filtre === 'all' || types.indexOf(filtre) !== -1;
    const okRecherche = pokemon.name.indexOf(recherche) !== -1
      || pokemon.nomFr.toLowerCase().indexOf(recherche) !== -1
      || String(pokemon.id).indexOf(recherche) !== -1;

    if (okType && okRecherche) {
      resultat.push(pokemon);
    }
  }

  afficherGrille(resultat, false);
}

for (let i = 0; i < filterBtns.length; i++) {
  filterBtns[i].addEventListener('click', function() {
    for (let j = 0; j < filterBtns.length; j++) {
      filterBtns[j].classList.remove('filter-btn--active');
    }
    this.classList.add('filter-btn--active');
    filtre = this.dataset.type;
    filtrer();
  });
}

searchInput.addEventListener('input', function() {
  recherche = searchInput.value.toLowerCase().trim();
  filtrer();
});

resetBtn.addEventListener('click', function() {
  searchInput.value = '';
  recherche = '';
  filtre = 'all';
  for (let i = 0; i < filterBtns.length; i++) {
    filterBtns[i].classList.remove('filter-btn--active');
  }
  filterBtns[0].classList.add('filter-btn--active');
  filtrer();
});

if (navToggle) {
  navToggle.addEventListener('click', function() {
    const ouvert = navLinks.classList.toggle('navbar__links--open');
    navToggle.setAttribute('aria-expanded', ouvert);
  });
}

chargerPokemon();
