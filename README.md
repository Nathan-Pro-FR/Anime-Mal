# 📊 Mon Dashboard MyAnimeList (MAL)

Un tableau de bord moderne, rapide et automatique pour afficher les statistiques et les animes de ton compte MyAnimeList.

---

## 🎨 Comment personnaliser le site (Sans coder !)

Tu n'as **pas besoin de connaître la programmation** pour personnaliser ce site ! Tout se fait en modifiant un seul petit fichier nommé **`config.json`**.

### 1️⃣ Ouvrir le fichier de configuration
1. Dans la liste des fichiers en haut de cette page, clique sur le fichier **`config.json`**.
2. Clique sur l'icône de crayon ✏️ (en haut à droite) pour modifier le fichier.

---

### 2️⃣ Ce que tu peux modifier

Voici à quoi ressemble le fichier et ce que tu peux changer :

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

#### 👤 **Ton Pseudo MyAnimeList**

Remplace `"Neku_lax"` par ton propre nom d'utilisateur MAL entre les guillemets :

> `"username": "TonPseudoMAL"`

#### 🎨 **Les Couleurs du Site**

Tu peux changer toutes les couleurs en remplaçant les codes de couleur (ex: `#00f0ff`).

> [!TIP]
> *Pour choisir facilement une couleur et obtenir son code, utilise le site gratuit : [htmlcolorcodes.com](https://htmlcolorcodes.com/fr/)*

| Paramètre | Description |
| --- | --- |
| **`bgColor`** | Couleur de fond du site |
| **`cardBg`** | Couleur des cartes et blocs |
| **`accentCyan`** | Couleur principale des titres et des chiffres |
| **`accentMagenta`** | Couleur des bordures au survol |

#### 📊 **Les Couleurs des Graphiques**

Tu peux modifier la liste des couleurs des anneaux et barres des graphiques en changeant les codes dans `status`, `genres` et `formats`.

---

### 3️⃣ Enregistrer tes changements

1. Une fois tes modifications terminées, clique sur le bouton vert **Commit changes...** en haut à droite.
2. Attends 1 à 2 minutes que le site se mette à jour automatiquement ! 🚀
