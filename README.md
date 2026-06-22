# 🔴 PokéDex — Application Web Front-End

![HTML5](https://img.shields.io/badge/Language-HTML5-e34f26)
![SASS](https://img.shields.io/badge/Style-SASS%2FSCSS-cc6699)
![JavaScript](https://img.shields.io/badge/Language-JavaScript%20ES6+-f7df1e)
![API](https://img.shields.io/badge/API-PokéAPI-ef5350)
![WCAG](https://img.shields.io/badge/Accessibilité-WCAG%20AA-4caf50)
![Status](https://img.shields.io/badge/Project-Examen%20Bloc%202-blue)

## 📌 Présentation

Ce Pokédex est un projet pédagogique réalisé dans le cadre du titre RNCP **Développeur Web Front-End — Bloc 2** : *Développer des interfaces Frontend pour un site ou une application Web/Web Mobile*, à **La Plateforme**.

Il affiche les **151 Pokémon de la première génération** en consommant l'API publique **PokéAPI**, sans clé d'authentification. L'application est entièrement dynamique, responsive et accessible.

🎯 Objectif : démontrer la maîtrise du développement front-end (HTML sémantique, SASS, JavaScript ES6+, communication asynchrone, accessibilité WCAG AA).

---

## 🎨 Maquettes & Wireframes

### Maquettes haute fidélité

![Maquette accueil](./design/maquette%20pokedex.png)
![Maquette variantes desktop & mobile](./design/maquette%20pokedex2.png)

### Wireframes basse fidélité

![Wireframe](./design/wireframe%20pokedex.png)

Les maquettes couvrent :
- **Accueil** — Desktop 1440px (mode sombre) & Mobile 390px (mode clair)
- **Détail** — Desktop 1440px (mode sombre) & Mobile 390px (mode clair)
- **Wireframes** — Accueil & Détail, Desktop & Mobile, niveaux de gris

---

## ⚙️ Fonctionnalités

### 🃏 Grille de Pokémon

- Affichage dynamique des 151 Pokémon via `fetch` + `async/await`
- Animation d'apparition décalée au chargement (`setTimeout`)
- Couleur de fond adaptée au type principal de chaque Pokémon
- Noms français récupérés depuis l'endpoint `pokemon-species`

### 🔍 Recherche & Filtres

- Recherche en temps réel (nom FR, nom EN, numéro)
- Filtres par type : Tous / Feu / Eau / Plante / Électrik / Psy / Normal
- Compteur dynamique de Pokémon affichés (`aria-live`)
- État vide avec bouton de réinitialisation

### 📄 Page de détail

- Navigation via `URLSearchParams` (`detail.html?id=25`)
- Stats avec barres animées progressivement (`setTimeout`)
- Sprites rétro (face, dos, shiny ✨)
- Talents, mensurations (taille/poids), description FR
- Données espèce (catégorie, génération) depuis `pokemon-species`

### 🌙 Mode sombre / Mode clair

- Thème par défaut : sombre
- Persistance en `localStorage`
- Script inline anti-flash dans le `<head>` de chaque page
- Bouton toggle ☀️ / 🌙 avec `aria-label` mis à jour

### ♿ Accessibilité WCAG AA

- `lang="fr"` sur `<html>`, `meta viewport`
- `alt` sur toutes les images, `aria-live`, `aria-label`, `aria-expanded`
- Navigation clavier complète (`tabindex`, `keypress`, focus visible)
- `role="progressbar"` sur les barres de stats

---

## 📂 Structure du projet

```
pokedex/
│
├── index.html              → Page principale (grille de cartes)
├── style.css               → CSS compilé depuis SASS
├── package.json            → Config Node.js (scripts SASS)
├── README.md               → Ce fichier
│
├── sass/
│   └── style.scss          → Source SASS (variables, nesting, mixins)
│
├── js/
│   ├── script.js           → JS page principale (fetch, DOM, filtres)
│   ├── detail.js           → JS page de détail
│   └── theme.js            → Gestion mode sombre / clair
│
├── pages/
│   ├── detail.html         → Page de détail d'un Pokémon
│   └── about.html          → Page À propos
│
├── design/
│   ├── maquette pokedex.png
│   ├── maquette pokedex2.png
│   └── wireframe pokedex.png
│
└── docs/
    ├── accueil.png         → Capture page d'accueil
    ├── listing.png        → Capture grille filtrée
    ├── detail.png          → Capture page de détail
    └── about.png           → Capture page À propos
```

---

## 🛠️ Technologies utilisées

| Technologie | Rôle |
| --- | --- |
| **HTML5 sémantique** | Structure (`header`, `nav`, `main`, `section`, `article`, `footer`) |
| **SASS / SCSS** | Variables, nesting BEM, mixins, boucle `@each`, compilation |
| **CSS Grid + Flexbox** | Layout responsive mobile-first |
| **JavaScript ES6+** | Fetch, async/await, DOM, events, timers, URLSearchParams |
| **PokéAPI** | Source de données JSON (REST publique, sans clé) |
| **Google Fonts** | Silkscreen (titres) + DM Sans (corps) |
| **WCAG AA** | Accessibilité complète |
| **BEM** | Convention de nommage CSS |

---

## 🚀 Installation & lancement

### Prérequis

- Node.js installé
- Navigateur moderne

### Installation

```bash
git clone https://github.com/alexis-noiret/pokedex.git
cd pokedex
npm install
```

### Compilation SASS

```bash
npm run sass:build
npm run sass
```

### Lancement

Ouvrir `index.html` dans un navigateur (Live Server recommandé).

---

## ✅ Compétences Bloc 2 démontrées

### Découpage maquette → HTML sémantique

Balises `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>` avec hiérarchie de titres `<h1>` → `<h2>`. Structure argumentée et cohérente.

### Police importée

Google Fonts : **Silkscreen** (display/titres) + **DM Sans** (corps du texte).

### Responsive Mobile-first

Media queries ordonnées du mobile vers le desktop :

- Mobile : `grid-template-columns: repeat(2, 1fr)`
- Tablette (≥ 480px) : `repeat(3, 1fr)`
- Tablette large (≥ 768px) : `repeat(4, 1fr)`
- Desktop (≥ 1024px) : `repeat(6, 1fr)`

### Préprocesseur SASS

- Variables (`$color-bg`, `$font-display`, `$radius-md`…)
- Nesting BEM (`.card { &__name {} &:hover {} }`)
- Boucle `@each` pour les couleurs de types
- Mixins (`@mixin flex-center`, `@mixin card-base`, `@mixin sr-only`)

### Manipulation DOM

- `document.getElementById()`, `querySelectorAll()`
- `document.createElement()`, `appendChild()`
- `addEventListener()` (click, input, keypress)
- `setTimeout()` pour les animations décalées

### Communication asynchrone avec un serveur

- `fetch()` + `async/await` vers PokéAPI
- `URLSearchParams` pour passer l'ID via l'URL
- Gestion des erreurs avec `try/catch`

### Accessibilité WCAG AA

- `lang="fr"` sur `<html>`, `meta viewport`
- `alt` sur toutes les images
- `aria-live="polite"`, `aria-label`, `aria-expanded`, `role="progressbar"`
- `tabindex="0"` + `keypress` sur les cartes
- Focus visible (outline 3px)

---

## 🌐 API utilisée

**PokéAPI** — https://pokeapi.co

- Gratuite, sans clé, sans authentification
- REST, réponses JSON
- Endpoints utilisés :
  - `GET /pokemon?limit=151` → liste génération 1
  - `GET /pokemon/{id}` → stats, types, sprites, talents
  - `GET /pokemon-species/{id}` → description FR et données espèce

---

## 📸 Aperçu

### 🏠 Page d'accueil

![Accueil](./docs/accueil.png)

### 📋 Grille filtrée

![Grille filtrée](./docs/listing.png)

### 🔍 Page de détail

![Détail Pokémon](./docs/detail.png)

### ℹ️ Page À propos

![À propos](./docs/about.png)

---

## 👨‍💻 Auteur

**Alexis Noiret**
🎓 Étudiant en Bachelor IT Cybersécurité — La Plateforme, Cannes
🔗 GitHub : https://github.com/alexis-noiret
🌐 Portfolio : https://alexis-noiret.students-laplateforme.io

---

## 🎓 Contexte pédagogique

Projet réalisé dans le cadre du **Titre RNCP N°37273 — Développeur Web Front-End — Niveau 5 (Bac+2)**
**Bloc 2 :** Développer des interfaces Frontend pour un site ou une application Web/Web Mobile
**École :** La Plateforme — La grande école du numérique pour tous, Cannes

---

## ⚠️ Disclaimer

Projet réalisé à des fins pédagogiques. Pokémon © Nintendo / Game Freak. Données fournies par PokéAPI.
