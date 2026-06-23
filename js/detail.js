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

const statsFr = {
  'hp': 'PV',
  'attack': 'Attaque',
  'defense': 'Défense',
  'special-attack': 'Atk. Spé.',
  'special-defense': 'Déf. Spé.',
  'speed': 'Vitesse'
};

const typesColors = {
  normal: 'rgba(159, 161, 159, 0.5)',
  fire: 'rgba(230, 40, 41, 0.5)',
  water: 'rgba(41, 128, 239, 0.5)',
  grass: 'rgba(63, 161, 41, 0.5)',
  electric: 'rgba(250, 192, 0, 0.5)',
  ice: 'rgba(61, 206, 243, 0.5)',
  fighting: 'rgba(255, 128, 0, 0.5)',
  poison: 'rgba(145, 65, 203, 0.5)',
  ground: 'rgba(145, 81, 33, 0.5)',
  flying: 'rgba(129, 185, 239, 0.5)',
  psychic: 'rgba(239, 65, 121, 0.5)',
  bug: 'rgba(145, 161, 25, 0.5)',
  rock: 'rgba(175, 169, 129, 0.5)',
  ghost: 'rgba(112, 65, 112, 0.5)',
  dragon: 'rgba(80, 96, 225, 0.5)',
  dark: 'rgba(98, 77, 78, 0.5)',
  steel: 'rgba(96, 161, 184, 0.5)',
  fairy: 'rgba(239, 112, 239, 0.5)'
};

const loader = document.getElementById('loader');
const detailContent = document.getElementById('detail-content');

async function chargerDetail() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');

  if (!id) {
    afficherErreur('Pokémon introuvable.');
    return;
  }

  try {
    const resPokemon = await fetch(API_URL + '/' + id);
    const pokemon = await resPokemon.json();

    const resSpecies = await fetch(SPECIES_URL + '/' + id);
    const species = await resSpecies.json();

    let nomFr = pokemon.name;
    for (let i = 0; i < species.names.length; i++) {
      if (species.names[i].language.name === 'fr') {
        nomFr = species.names[i].name;
        break;
      }
    }

    let description = '';
    for (let i = 0; i < species.flavor_text_entries.length; i++) {
      if (species.flavor_text_entries[i].language.name === 'fr') {
        description = species.flavor_text_entries[i].flavor_text;
        break;
      }
    }
    description = description.replace(/\f/g, ' ').replace(/\n/g, ' ');

    let categorie = '';
    for (let i = 0; i < species.genera.length; i++) {
      if (species.genera[i].language.name === 'fr') {
        categorie = species.genera[i].genus;
        break;
      }
    }

    const generation = species.generation.name.replace('generation-', 'Gen ');
    const types = pokemon.types.map(function(t) { return t.type.name; });
    const numero = String(pokemon.id).padStart(3, '0');
    const sprite = pokemon.sprites.other['official-artwork'].front_default;
    const couleur = typesColors[types[0]] || 'rgba(255,255,255,0.1)';

    let badgesTypes = '';
    for (let i = 0; i < types.length; i++) {
      badgesTypes += '<span class="detail__type detail__type--' + types[i] + '">' + (typesFr[types[i]] || types[i]) + '</span>';
    }

    let statsHtml = '';
    for (let i = 0; i < pokemon.stats.length; i++) {
      const stat = pokemon.stats[i];
      const nom = statsFr[stat.stat.name] || stat.stat.name;
      const valeur = stat.base_stat;
      const pct = Math.round((valeur / 255) * 100);
      statsHtml += '<div class="detail__stat" role="listitem">'
        + '<span class="detail__stat-label">' + nom + '</span>'
        + '<span class="detail__stat-value">' + valeur + '</span>'
        + '<div class="detail__stat-bar" role="progressbar" aria-valuenow="' + valeur + '" aria-valuemin="0" aria-valuemax="255">'
        + '<div class="detail__stat-fill" data-width="' + pct + '%" style="width: 0%"></div>'
        + '</div></div>';
    }

    let talentsHtml = '';
    for (let i = 0; i < pokemon.abilities.length; i++) {
      const a = pokemon.abilities[i];
      const cache = a.is_hidden ? ' <em style="font-size:0.7rem; opacity:0.6">(caché)</em>' : '';
      talentsHtml += '<span class="detail__ability">' + a.ability.name.replace('-', ' ') + cache + '</span>';
    }

    document.title = nomFr + ' — PokéDex';

    detailContent.innerHTML = '<div class="detail__hero">'
      + '<div class="detail__image-wrap">'
      + '<div class="detail__image-bg" style="background: radial-gradient(circle, ' + couleur + ', transparent)"></div>'
      + '<img class="detail__image" src="' + sprite + '" alt="' + nomFr + '" width="200" height="200">'
      + '</div>'
      + '<div class="detail__info">'
      + '<p class="detail__number">#' + numero + '</p>'
      + '<h1 class="detail__name">' + nomFr + '</h1>'
      + '<div class="detail__types">' + badgesTypes + '</div>'
      + '<p style="color: var(--color-text-muted, #7a8099); font-size: 0.9rem; line-height: 1.7; margin-bottom: 1.5rem; max-width: 420px;">' + description + '</p>'
      + '<div class="detail__stats" role="list" aria-label="Statistiques de base">' + statsHtml + '</div>'
      + '</div></div>'
      + '<div class="detail__grid">'
      + '<div class="detail__section"><h2 class="detail__section-title">Talents</h2><div class="detail__abilities">' + talentsHtml + '</div></div>'
      + '<div class="detail__section"><h2 class="detail__section-title">Mensurations</h2><div class="detail__measures">'
      + '<div class="detail__measure"><span>Taille</span><strong>' + (pokemon.height / 10).toFixed(1) + ' m</strong></div>'
      + '<div class="detail__measure"><span>Poids</span><strong>' + (pokemon.weight / 10).toFixed(1) + ' kg</strong></div>'
      + '</div></div>'
      + '<div class="detail__section"><h2 class="detail__section-title">Sprites rétro</h2><div class="detail__sprites">'
      + '<div class="detail__sprite-wrap"><img src="' + pokemon.sprites.front_default + '" alt="Face" width="80" height="80" loading="lazy"><span>Face</span></div>'
      + '<div class="detail__sprite-wrap"><img src="' + pokemon.sprites.back_default + '" alt="Dos" width="80" height="80" loading="lazy"><span>Dos</span></div>'
      + '<div class="detail__sprite-wrap"><img src="' + pokemon.sprites.front_shiny + '" alt="Shiny" width="80" height="80" loading="lazy"><span>✨ Shiny</span></div>'
      + '</div></div>'
      + '<div class="detail__section"><h2 class="detail__section-title">Espèce</h2><div class="detail__measures">'
      + '<div class="detail__measure"><span>Catégorie</span><strong>' + categorie + '</strong></div>'
      + '<div class="detail__measure"><span>Génération</span><strong>' + generation + '</strong></div>'
      + '</div></div></div>';

    loader.hidden = true;
    detailContent.hidden = false;

    setTimeout(function() {
      const barres = document.querySelectorAll('.detail__stat-fill');
      for (let i = 0; i < barres.length; i++) {
        setTimeout(function(barre) {
          return function() {
            barre.style.width = barre.dataset.width;
          };
        }(barres[i]), i * 120);
      }
    }, 400);

  } catch(e) {
    afficherErreur('Impossible de charger ce Pokémon.');
  }
}

function afficherErreur(msg) {
  loader.hidden = true;
  detailContent.hidden = false;
  detailContent.innerHTML = '<p style="color: #7a8099; text-align:center; padding: 5rem 0;">' + msg + '</p>';
}

chargerDetail();
