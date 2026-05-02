// ============================================================
// detail.js — Page de détail d'un Pokémon
// Récupère l'id depuis les paramètres URL, fetch les données,
// affiche les stats, types, sprites, talents
// ============================================================

const API_BASE = 'https://pokeapi.co/api/v2';

// ---- SÉLECTEURS DOM ----
const loader        = document.getElementById('loader');
const detailContent = document.getElementById('detail-content');

// ---- NOMS EN FRANÇAIS DES STATS ----
const statNames = {
  'hp'              : 'PV',
  'attack'          : 'Attaque',
  'defense'         : 'Défense',
  'special-attack'  : 'Atk. Spé.',
  'special-defense' : 'Déf. Spé.',
  'speed'           : 'Vitesse',
};

// ============================================================
// FETCH — Récupérer les données du Pokémon
// ============================================================
async function fetchPokemonDetail() {
  // Récupération de l'id depuis l'URL : detail.html?id=25
  const params = new URLSearchParams(window.location.search);
  const id     = params.get('id');

  if (!id) {
    showError('Identifiant Pokémon manquant dans l\'URL.');
    return;
  }

  try {
    // Requête asynchrone vers PokéAPI
    const res     = await fetch(`${API_BASE}/pokemon/${id}`);
    if (!res.ok) throw new Error(`Pokémon introuvable (code ${res.status})`);
    const pokemon = await res.json();

    // Requête pour les données de l'espèce (pour la description)
    const speciesRes  = await fetch(`${API_BASE}/pokemon-species/${id}`);
    const speciesData = await speciesRes.json();

    renderDetail(pokemon, speciesData);

  } catch (err) {
    console.error('Erreur chargement détail :', err);
    showError('Impossible de charger ce Pokémon. Vérifie ta connexion.');
  }
}

// ============================================================
// AFFICHAGE — Remplir la page de détail
// ============================================================
function renderDetail(pokemon, species) {
  const types        = pokemon.types.map(t => t.type.name);
  const number       = String(pokemon.id).padStart(3, '0');
  const mainType     = types[0];
  const officialArt  = pokemon.sprites.other['official-artwork'].front_default;
  const description  = getDescription(species);
  const typeColor    = getTypeColor(mainType);

  // Nom français depuis les données species
  const frName = species.names?.find(n => n.language.name === 'fr');
  const nameFr = frName?.name || capitalize(pokemon.name);

  // Mise à jour du titre de la page (timer pour laisser le temps au DOM)
  setTimeout(() => {
    document.title = `${nameFr} — PokéDex`;
  }, 100);

  detailContent.innerHTML = `
    <!-- SECTION PRINCIPALE -->
    <div class="detail__hero">
      <div class="detail__image-wrap">
        <div class="detail__image-bg" style="background: radial-gradient(circle, ${typeColor}, transparent)"></div>
        <img
          class="detail__image"
          src="${officialArt}"
          alt="Illustration officielle de ${nameFr}"
          width="200"
          height="200"
        >
      </div>

      <div class="detail__info">
        <p class="detail__number">#${number}</p>
        <h1 class="detail__name">${nameFr}</h1>

        <div class="detail__types">
          ${types.map(t => `<span class="detail__type detail__type--${t}">${t}</span>`).join('')}
        </div>

        <p style="color: var(--color-text-muted, #7a8099); font-size: 0.9rem; line-height: 1.7; margin-bottom: 1.5rem; max-width: 420px;">
          ${description}
        </p>

        <!-- STATS -->
        <div class="detail__stats" role="list" aria-label="Statistiques de base">
          ${pokemon.stats.map(stat => renderStat(stat)).join('')}
        </div>
      </div>
    </div>

    <!-- SECTION SECONDAIRE -->
    <div class="detail__grid">

      <!-- Talents -->
      <div class="detail__section">
        <h2 class="detail__section-title">Talents</h2>
        <div class="detail__abilities">
          ${pokemon.abilities.map(a => `
            <span class="detail__ability">
              ${capitalize(a.ability.name.replace('-', ' '))}
              ${a.is_hidden ? '<em style="font-size:0.7rem; opacity:0.6"> (caché)</em>' : ''}
            </span>
          `).join('')}
        </div>
      </div>

      <!-- Mensurations -->
      <div class="detail__section">
        <h2 class="detail__section-title">Mensurations</h2>
        <div class="detail__measures">
          <div class="detail__measure">
            <span>Taille</span>
            <strong>${(pokemon.height / 10).toFixed(1)} m</strong>
          </div>
          <div class="detail__measure">
            <span>Poids</span>
            <strong>${(pokemon.weight / 10).toFixed(1)} kg</strong>
          </div>
          <div class="detail__measure">
            <span>Exp. de base</span>
            <strong>${pokemon.base_experience ?? '—'}</strong>
          </div>
        </div>
      </div>

      <!-- Sprites rétro -->
      <div class="detail__section">
        <h2 class="detail__section-title">Sprites rétro</h2>
        <div class="detail__sprites">
          ${renderSprite(pokemon.sprites.front_default, 'Face')}
          ${renderSprite(pokemon.sprites.back_default, 'Dos')}
          ${pokemon.sprites.front_shiny
            ? renderSprite(pokemon.sprites.front_shiny, '✨ Shiny')
            : ''}
        </div>
      </div>

      <!-- Infos espèce -->
      <div class="detail__section">
        <h2 class="detail__section-title">Espèce</h2>
        <div class="detail__measures">
          <div class="detail__measure">
            <span>Catégorie</span>
            <strong>${getGenus(species)}</strong>
          </div>
          <div class="detail__measure">
            <span>Génération</span>
            <strong>${capitalize(species.generation?.name?.replace('generation-', 'Gen ') || '—')}</strong>
          </div>
        </div>
      </div>

    </div>
  `;

  // Afficher le contenu, cacher le loader
  loader.hidden        = true;
  detailContent.hidden = false;

  // Animation des barres de stats (timer)
  setTimeout(() => animateStatBars(), 400);
}

// ============================================================
// RENDU D'UNE STAT
// ============================================================
function renderStat(stat) {
  const name     = statNames[stat.stat.name] || stat.stat.name;
  const value    = stat.base_stat;
  const maxValue = 255;
  const percent  = Math.round((value / maxValue) * 100);

  return `
    <div class="detail__stat" role="listitem">
      <span class="detail__stat-label">${name}</span>
      <span class="detail__stat-value">${value}</span>
      <div class="detail__stat-bar" role="progressbar" aria-valuenow="${value}" aria-valuemin="0" aria-valuemax="${maxValue}" aria-label="${name}">
        <div class="detail__stat-fill" data-width="${percent}%" style="width: 0%"></div>
      </div>
    </div>
  `;
}

// ============================================================
// ANIMATION DES BARRES (timer — compétence requise)
// ============================================================
function animateStatBars() {
  document.querySelectorAll('.detail__stat-fill').forEach((bar, index) => {
    setTimeout(() => {
      bar.style.width = bar.dataset.width;
    }, index * 120);
  });
}

// ============================================================
// RENDU D'UN SPRITE
// ============================================================
function renderSprite(src, label) {
  if (!src) return '';
  return `
    <div class="detail__sprite-wrap">
      <img src="${src}" alt="${label}" width="80" height="80" loading="lazy">
      <span>${label}</span>
    </div>
  `;
}

// ============================================================
// UTILITAIRES
// ============================================================
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Récupère la description FR (ou EN) depuis les données d'espèce
function getDescription(species) {
  const frEntry = species.flavor_text_entries?.find(e => e.language.name === 'fr');
  const enEntry = species.flavor_text_entries?.find(e => e.language.name === 'en');
  const raw = (frEntry || enEntry)?.flavor_text || 'Aucune description disponible.';
  // Nettoyage des caractères spéciaux des textes PokéAPI
  return raw.replace(/\f/g, ' ').replace(/\n/g, ' ').replace(/\u00ad/g, '');
}

// Récupère le genre (ex: "Pokémon Électrique")
function getGenus(species) {
  const fr = species.genera?.find(g => g.language.name === 'fr');
  const en = species.genera?.find(g => g.language.name === 'en');
  return (fr || en)?.genus || '—';
}

// Couleur hex du type principal (pour le fond)
function getTypeColor(type) {
  const colors = {
    normal  : 'rgba(159, 161, 159, 0.5)',
    fire    : 'rgba(230, 40, 41, 0.5)',
    water   : 'rgba(41, 128, 239, 0.5)',
    grass   : 'rgba(63, 161, 41, 0.5)',
    electric: 'rgba(250, 192, 0, 0.5)',
    ice     : 'rgba(61, 206, 243, 0.5)',
    fighting: 'rgba(255, 128, 0, 0.5)',
    poison  : 'rgba(145, 65, 203, 0.5)',
    ground  : 'rgba(145, 81, 33, 0.5)',
    flying  : 'rgba(129, 185, 239, 0.5)',
    psychic : 'rgba(239, 65, 121, 0.5)',
    bug     : 'rgba(145, 161, 25, 0.5)',
    rock    : 'rgba(175, 169, 129, 0.5)',
    ghost   : 'rgba(112, 65, 112, 0.5)',
    dragon  : 'rgba(80, 96, 225, 0.5)',
    dark    : 'rgba(98, 77, 78, 0.5)',
    steel   : 'rgba(96, 161, 184, 0.5)',
    fairy   : 'rgba(239, 112, 239, 0.5)',
  };
  return colors[type] || 'rgba(255,255,255,0.1)';
}

function showError(message) {
  loader.hidden = true;
  detailContent.hidden = false;
  detailContent.innerHTML = `<p style="color: #7a8099; text-align:center; padding: 5rem 0;">${message}</p>`;
}

// ============================================================
// INITIALISATION
// ============================================================
fetchPokemonDetail();
