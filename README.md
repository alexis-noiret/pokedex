> 🎮 Application web dynamique connectée à une API publique — projet pédagogique Bloc 2 RNCP Niveau 5

# 🔴 PokéDex — Application Web Front-End

![HTML5](https://img.shields.io/badge/Language-HTML5-e34f26)
![SASS](https://img.shields.io/badge/Style-SASS%2FSCSS-cc6699)
![JavaScript](https://img.shields.io/badge/Language-JavaScript%20ES6+-f7df1e)
![API](https://img.shields.io/badge/API-PokéAPI-ef5350)
![WCAG](https://img.shields.io/badge/Accessibilité-WCAG%20AA-4caf50)
![Status](https://img.shields.io/badge/Project-Examen%20Bloc%202-blue)

## 📌 Présentation

Ce Pokédex est un projet pédagogique réalisé dans le cadre du titre RNCP **Développeur Web Full Stack Niveau 5 (Bac+2)** — Bloc 2 : *Développer des interfaces Frontend pour un site ou une application Web/Web Mobile*, à **La Plateforme**.

Il affiche les **151 Pokémon de la première génération** en consommant l'API publique **PokéAPI**, sans clé d'authentification. L'application est entièrement dynamique, responsive et accessible.

🎯 Objectif : démontrer la maîtrise du développement front-end (HTML sémantique, SASS, JavaScript ES6+, communication asynchrone, accessibilité WCAG AA).

---

## 🎨 Maquettes & Wireframes

| Document | Contenu |
|----------|---------|
| [📄 Voir les maquettes & wireframes](./design/pokedex-maquettes-wireframes.pdf) | Maquette accueil (dark/light), page détail (desktop/mobile), wireframes niveaux de gris |

Les maquettes haute fidélité et wireframes basse fidélité couvrent :
- **Maquette Accueil** — Desktop 1440px (mode sombre) & Mobile 390px (mode clair)
- **Maquette Détail** — Desktop 1440px (mode sombre) & Mobile 390px (mode clair)
- **Wireframes** — Accueil & Détail, Desktop & Mobile 390px, niveaux de gris

---

## ⚙️ Fonctionnalités

### 🃏 Grille de Pokémon

* Affichage dynamique des 151 Pokémon via `fetch` + `async/await`
* Animation d'apparition décalée au chargement (`setTimeout`)
* Couleur de fond adaptée au type principal de chaque Pokémon

### 🔍 Recherche & Filtres

* Recherche en temps réel (nom FR, nom EN, numéro)
* Filtres par type (Feu, Eau, Plante, Électrik, Psy, Normal)
* État vide avec bouton de réinitialisation

### 📄 Page de détail

* Navigation via `URLSearchParams` (`detail.html?id=25`)
* Stats avec barres animées progressivement (`setTimeout`)
* Sprites rétro, talents, mensurations, description FR
* Données espèce (catégorie, génération) depuis `pokemon-species`

### 🌙 Mode sombre / Mode clair

* Thème persisté en `localStorage`
* Script inline anti-flash dans le `<head>`
* Respect des préférences système (`prefers-color-scheme`)

### ♿ Accessibilité WCAG AA

* `lang="fr"` sur `<html>`, `meta viewport`
* `alt` sur toutes les images, `aria-live`, `aria-label`
* Navigation clavier complète (`tabindex`, `keypress`, focus visible)
* `role="progressbar"` sur les barres de stats

### 🔊 Audio

* Son 8-bit généré via **Web Audio API** au clic sur une carte
* Élément `<audio>` intégré dans le HTML (requis par le référentiel)

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
│   ├── script.js           → JS page principale (fetch, DOM, events)
│   ├── detail.js           → JS page de détail
│   └── theme.js            → Gestion mode sombre / clair
│
├── pages/
│   ├── detail.html         → Page de détail d'un Pokémon
│   └── about.html          → Page À propos / tech stack
│
├── design/
│   └── pokedex-maquettes-wireframes.pdf  → Maquettes & wireframes
│
└── docs/
    ├── accueil.png         → Capture page d'accueil
    ├── accueil2.png        → Capture grille filtrée
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
| **Web Audio API** | Son 8-bit généré dynamiquement |
| **WCAG AA** | Accessibilité complète |
| **BEM** | Convention de nommage CSS |

---

## 🚀 Installation & lancement

### Prérequis

* Node.js installé
* Navigateur moderne

### Installation

```bash
# Cloner le dépôt
git clone https://github.com/alexis-noiret/pokedex-bloc2.git
cd pokedex-bloc2

# Installer les dépendances
npm install
```

### Compilation SASS

```bash
# Compiler une fois
npm run sass:build

# Compiler automatiquement à chaque modification
npm run sass
```

### Lancement

Ouvrir `index.html` dans un navigateur (Live Server recommandé).

---

## ✅ Compétences Bloc 2 démontrées

### Découpage maquette → HTML sémantique

Balises `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>` avec hiérarchie de titres `<h1>` → `<h2>`. Structure argumentée et cohérente.

### Actifs audio/vidéo

Élément `<audio>` intégré dans le HTML. Son généré dynamiquement via Web Audio API.

### Police importée

Google Fonts : **Silkscreen** (display/titres) + **DM Sans** (corps du texte).

### Responsive Mobile-first

Media queries ordonnées du mobile vers le desktop :

* Mobile : `grid-template-columns: repeat(2, 1fr)`
* Tablette (≥ 480px) : `repeat(3, 1fr)`
* Tablette large (≥ 768px) : `repeat(4, 1fr)`
* Desktop (≥ 1024px) : `repeat(6, 1fr)`

### Préprocesseur SASS

* Variables (`$color-bg`, `$font-display`, `$radius-md`…)
* Nesting BEM (`.card { &__name {} &:hover {} }`)
* Boucle `@each` pour les couleurs de types
* Mixins (`@mixin flex-center`, `@mixin card-base`, `@mixin sr-only`)

### Manipulation DOM

* `document.getElementById()`, `querySelectorAll()`
* `document.createElement()`, `appendChild()`
* `addEventListener()` (click, input, keypress)
* `setTimeout()` pour les animations décalées

### Communication asynchrone avec un serveur

* `fetch()` + `async/await` vers PokéAPI
* `Promise.all()` pour les requêtes parallèles
* `URLSearchParams` pour passer l'ID via l'URL
* Gestion des erreurs avec `try/catch`

### Accessibilité WCAG AA

* `lang="fr"` sur `<html>`, `meta viewport`
* `alt` sur toutes les images
* `aria-live="polite"`, `aria-label`, `role="progressbar"`
* `tabindex="0"` + `keypress` sur les cartes
* Focus visible (outline 3px)
* Compatible validation W3C

---

## 🌐 API utilisée

**PokéAPI** — https://pokeapi.co

* Gratuite, sans clé, sans authentification
* REST, réponses JSON
* Endpoints utilisés :
  + `GET /pokemon?limit=151&offset=0` → liste génération 1
  + `GET /pokemon/{id}` → stats, types, sprites, talents
  + `GET /pokemon-species/{id}` → description FR et données espèce

---

## 📸 Aperçu

### 🏠 Page d'accueil — Grille des Pokémon

![Accueil](./docs/accueil.png)

### 🔍 Page de détail

![Détail Pokémon](./docs/accueil2.png)

### 📄 Grille filtrée

![Grille filtrée](./docs/detail.png)

### ℹ️ Page À propos

![À propos](./docs/about.png)

---

## 👨‍💻 Auteur

**Alexis Noiret**
🎓 Étudiant en Bachelor IT — La Plateforme
🔗 GitHub : https://github.com/alexis-noiret

---

## 🎓 Contexte pédagogique

Projet réalisé dans le cadre du **Titre RNCP N°37273 — Développeur Web Full Stack — Niveau 5 (Bac+2)**
**Bloc 2 :** Développer des interfaces Frontend pour un site ou une application Web/Web Mobile
**École :** La Plateforme — La grande école du numérique pour tous

---

## ⚠️ Disclaimer

Projet réalisé à des fins pédagogiques. Pokémon © Nintendo / Game Freak. Données fournies par PokéAPI.
