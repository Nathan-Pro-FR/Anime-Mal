<div align="center">
<H1>📊 MALDashboard</H1>

![Aperçu du site](lien-de-ton-image.png)
**Un tableau de bord moderne, rapide et entièrement personnalisable pour afficher les statistiques de ton compte MyAnimeList.**

[![Site Web](https://img.shields.io/badge/🌐_Voir_le_site-MALDashboard-00f0ff?style=for-the-badge&logo=githubpages&logoColor=white)](https://nathan-pro-fr.github.io/Anime-Mal/)
[![GitHub Repo](https://img.shields.io/badge/Code_Source-GitHub-ff007f?style=for-the-badge&logo=github)](https://github.com/Nathan-pro-fr/Anime-Mal)
[![License](https://img.shields.io/badge/Licence-MIT-ffd700?style=for-the-badge)](LICENSE)
<br/>

```text
 __  __          _     _____            _     _                 _ 
|  \/  |   /\   | |   |  __ \          | |   | |               | |
| \  / |  /  \  | |   | |  | | __ _ ___| |__ | |__   ___   __ _| |
| |\/| | / /\ \ | |   | |  | |/ _` / __| '_ \| '_ \ / _ \ / _` | |
| |  | |/ ____ \| |___| |__| | (_| \__ \ | | | |_) | (_) | (_| |_|
|_|  |_/_/    \_\_____|_____/ \__,_|___/_| |_|_.__/ \___/ \__,_(_)
```
</div>

---

## ⚡ Fonctionnalités

- ⏱️ **Temps de visionnage exact** : Calcul automatique du temps passé à regarder des animes (Jours / Heures / Minutes).
- 📈 **Graphiques interactifs** : Visualisation par statut (*En cours*, *Terminé*, etc.), top 5 genres et répartition par formats.
- 🎨 **100% Personnalisable** : Change les couleurs, le thème et le pseudo MyAnimeList directement via un fichier de configuration, **sans toucher au code**.
- 🔄 **Mise à jour automatique** : Récupération quotidienne des données MyAnimeList via GitHub Actions.

---

## 🎨 Comment personnaliser le site (Sans savoir coder !)

Tu n'as **pas besoin de connaissances en programmation** pour adapter le site à ton profil ! Tout se gère depuis le fichier **`config.json`**.

### 🛠️ Étapes simples
1. Clique sur le fichier **`config.json`** dans la liste des fichiers en haut.
2. Clique sur l'icône de crayon ✏️ *(en haut à droite)* pour modifier le fichier.
3. Modifie tes informations et tes couleurs (voir guide ci-dessous).
4. Clique sur le bouton vert **Commit changes...** pour enregistrer.

---

## ⚙️ Explication de `config.json`

```json
{
  "username": "Neku_lax",
  "theme": {
    "bgColor": "#0b0e14",
    "cardBg": "#151922",
    "accentCyan": "#00f0ff",
    "accentMagenta": "#ff007f",
    "textMain": "#e2e8f0",
    "textMuted": "#94a3b8"
  },
  "chartColors": {
    "status": {
      "watching": "#00f0ff",
      "completed": "#ff007f",
      "on_hold": "#ffd700",
      "dropped": "#ff4d4d",
      "plan_to_watch": "#a0aec0"
    },
    "genres": "#00f0ff",
    "formats": {
      "tv": "#00f0ff",
      "movie": "#ff007f",
      "ova": "#ffd700",
      "ona": "#00ff88",
      "special": "#9900ff",
      "music": "#ff9900",
      "other": "#a0aec0"
    }
  }
}

```

### 👤 **Pseudo MyAnimeList**

Remplace `"Neku_lax"` par ton pseudo MAL :

> `"username": "TonPseudoMAL"`

---

### 🎨 **Guide des Couleurs du Thème**

| Paramètre | Description | Exemple Visuel |
| --- | --- | --- |
| **`bgColor`** | Couleur de fond globale de la page | `⬛ #0b0e14` |
| **`cardBg`** | Couleur de fond des blocs et cartes d'animes | `⬛ #151922` |
| **`accentCyan`** | Couleur d'accentuation principale (titres, chiffres importants) | `🟦 #00f0ff` |
| **`accentMagenta`** | Couleur d'accentuation secondaire (bordures au survol, éléments clés) | `🟥 #ff007f` |
| **`textMain`** | Couleur du texte principal | `⬜ #e2e8f0` |
| **`textMuted`** | Couleur des sous-titres et détails secondaires | `🩶 #94a3b8` |

> [!TIP]
>  💡 *Trouve facilement le code d'une couleur sur [htmlcolorcodes.com*](https://htmlcolorcodes.com/fr/)

---

### 📊 **Guide des Couleurs des Statuts (Graphique 1)**

| Statut | Catégorie | Couleur par défaut |
| --- | --- | --- |
| **`watching`** | Animes en cours de visionnage | `🟦 #00f0ff` |
| **`completed`** | Animes terminés | `🟥 #ff007f` |
| **`on_hold`** | Animes mis en pause | `🟨 #ffd700` |
| **`dropped`** | Animes abandonnés | `🟥 #ff4d4d` |
| **`plan_to_watch`** | Animes prévus à voir | `🩶 #a0aec0` |

---

### 📺 **Guide des Couleurs des Formats (Graphique 3)**

| Format | Type de média | Couleur par défaut |
| --- | --- | --- |
| **`tv`** | Séries TV | `🟦 #00f0ff` |
| **`movie`** | Films d'animation | `🟥 #ff007f` |
| **`ova`** | OAV (Original Video Animation) | `🟨 #ffd700` |
| **`ona`** | ONA (Web / Streaming) | `🟩 #00ff88` |
| **`special`** | Épisodes Spéciaux | `🟪 #9900ff` |
| **`music`** | Clips vidéos / Animes musicaux | `🟧 #ff9900` |
| **`other`** | Autre format | `🩶 #a0aec0` |

---

DÉVELOPPÉ AVEC ❤️ POUR LES FANS D'ANIMES • ACCÉDER À **[MALDashboard](https://nathan-pro-fr.github.io/Anime-Mal/)**
