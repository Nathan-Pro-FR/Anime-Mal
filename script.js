let appConfig = null;

async function loadDashboardData() {
  const statusDiv = document.getElementById("status");

  try {
    // 1. Charger la configuration
    const configResp = await fetch("./config.json");
    if (configResp.ok) {
      appConfig = await configResp.json();
      applyThemeConfig(appConfig.theme);
    }

    // 2. Charger les données MyAnimeList
    const dataResp = await fetch("./data/data.json");
    if (!dataResp.ok) throw new Error("Impossible de charger data/data.json");

    const data = await dataResp.json();
    const animelist = data.animelist || [];

    if (data.username) {
      document.getElementById("userSub").textContent = `Profil MyAnimeList de ${data.username}`;
    }

    if (statusDiv) statusDiv.textContent = "";

    // 3. Calculer les statistiques et générer l'affichage
    computeStats(animelist);
    renderStatusChart(animelist);
    renderGenreChart(animelist);
    renderFormatChart(animelist);
    renderAnimeCards(animelist);

  } catch (err) {
    if (statusDiv) statusDiv.textContent = "Erreur de chargement des données. Vérifie la présence de config.json et data/data.json.";
    console.error(err);
  }
}

// Applique les couleurs de thème définies dans config.json aux variables CSS
function applyThemeConfig(theme) {
  if (!theme) return;
  const root = document.documentElement;
  if (theme.bgColor) root.style.setProperty('--bg-color', theme.bgColor);
  if (theme.cardBg) root.style.setProperty('--card-bg', theme.cardBg);
  if (theme.accentCyan) root.style.setProperty('--accent-cyan', theme.accentCyan);
  if (theme.accentMagenta) root.style.setProperty('--accent-magenta', theme.accentMagenta);
  if (theme.textMain) root.style.setProperty('--text-main', theme.textMain);
  if (theme.textMuted) root.style.setProperty('--text-muted', theme.textMuted);
}

// Calcul des chiffres clés (épisodes, score, temps en jours / heures / minutes)
function computeStats(list) {
  let totalEps = 0;
  let totalScore = 0;
  let scoredCount = 0;
  let totalSeconds = 0;
  let completedCount = 0;
  let watchingCount = 0;

  list.forEach(item => {
    const status = item.list_status;
    const watchedEps = status.num_episodes_watched || 0;

    totalEps += watchedEps;

    if (status.status === "completed") completedCount++;
    if (status.status === "watching") watchingCount++;

    // Durée moyenne d'un épisode (en sec) ou 24 min par défaut
    const epDurationSeconds = item.node.average_episode_duration || (24 * 60);
    totalSeconds += watchedEps * epDurationSeconds;

    if (status.score > 0) {
      totalScore += status.score;
      scoredCount++;
    }
  });

  // Conversion en Jours, Heures et Minutes
  const totalMinutes = Math.floor(totalSeconds / 60);
  const days = Math.floor(totalMinutes / (24 * 60));
  const hours = Math.floor((totalMinutes % (24 * 60)) / 60);
  const minutes = totalMinutes % 60;

  // Mise à jour du HTML
  document.getElementById("totalAnime").textContent = list.length;
  document.getElementById("completedAnime").textContent = completedCount;
  document.getElementById("watchingAnime").textContent = watchingCount;
  document.getElementById("totalEps").textContent = totalEps;
  document.getElementById("totalTime").textContent = `${days}j ${hours}h ${minutes}m`;
  document.getElementById("meanScore").textContent = scoredCount > 0 ? (totalScore / scoredCount).toFixed(2) + " / 10" : "N/A";
}

// Graphique 1 : Répartition par Statut (En cours, Terminé, etc.)
function renderStatusChart(list) {
  const statusCounts = { watching: 0, completed: 0, on_hold: 0, dropped: 0, plan_to_watch: 0 };

  list.forEach(item => {
    const s = item.list_status.status;
    if (statusCounts[s] !== undefined) statusCounts[s]++;
  });

  const defaultColors = {
    watching: '#00f0ff',
    completed: '#ff007f',
    on_hold: '#ffd700',
    dropped: '#ff4d4d',
    plan_to_watch: '#a0aec0'
  };

  const userColors = (appConfig && appConfig.chartColors && appConfig.chartColors.status) 
    ? appConfig.chartColors.status 
    : {};

  const colors = [
    userColors.watching || defaultColors.watching,
    userColors.completed || defaultColors.completed,
    userColors.on_hold || defaultColors.on_hold,
    userColors.dropped || defaultColors.dropped,
    userColors.plan_to_watch || defaultColors.plan_to_watch
  ];

  const textColor = getComputedStyle(document.documentElement).getPropertyValue('--text-main').trim() || '#e2e8f0';

  const ctx = document.getElementById('statusChart').getContext('2d');
  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['En cours', 'Terminé', 'En pause', 'Abandonné', 'À voir'],
      datasets: [{
        data: [
          statusCounts.watching,
          statusCounts.completed,
          statusCounts.on_hold,
          statusCounts.dropped,
          statusCounts.plan_to_watch
        ],
        backgroundColor: colors
      }]
    },
    options: { plugins: { legend: { labels: { color: textColor } } } }
  });
}

// Graphique 2 : Top 5 Genres
function renderGenreChart(list) {
  const genreCounts = {};

  list.forEach(item => {
    const genres = item.node.genres || [];
    genres.forEach(g => {
      genreCounts[g.name] = (genreCounts[g.name] || 0) + 1;
    });
  });

  const sortedGenres = Object.entries(genreCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const barColor = (appConfig && appConfig.chartColors && appConfig.chartColors.genres) 
    ? appConfig.chartColors.genres 
    : '#00f0ff';

  const textColor = getComputedStyle(document.documentElement).getPropertyValue('--text-main').trim() || '#e2e8f0';

  const ctx = document.getElementById('genreChart').getContext('2d');
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: sortedGenres.map(g => g[0]),
      datasets: [{
        label: "Nombre d'animes",
        data: sortedGenres.map(g => g[1]),
        backgroundColor: barColor
      }]
    },
    options: {
      scales: {
        y: { ticks: { color: textColor } },
        x: { ticks: { color: textColor } }
      },
      plugins: { legend: { labels: { color: textColor } } }
    }
  });
}

// Graphique 3 : Formats (TV, Movie, OVA...)
function renderFormatChart(list) {
  const formatCounts = {};

  list.forEach(item => {
    const format = (item.node.media_type || "other").toLowerCase();
    formatCounts[format] = (formatCounts[format] || 0) + 1;
  });

  const defaultFormatColors = {
    tv: '#00f0ff',
    movie: '#ff007f',
    ova: '#ffd700',
    ona: '#00ff88',
    special: '#9900ff',
    music: '#ff9900',
    other: '#a0aec0'
  };

  const userFormatColors = (appConfig && appConfig.chartColors && appConfig.chartColors.formats) 
    ? appConfig.chartColors.formats 
    : {};

  const labels = Object.keys(formatCounts).map(fmt => fmt.toUpperCase());
  const dataValues = Object.values(formatCounts);

  const colors = Object.keys(formatCounts).map(fmt => {
    return userFormatColors[fmt] || defaultFormatColors[fmt] || defaultFormatColors.other;
  });

  const textColor = getComputedStyle(document.documentElement).getPropertyValue('--text-main').trim() || '#e2e8f0';

  const ctx = document.getElementById('formatChart').getContext('2d');
  new Chart(ctx, {
    type: 'polarArea',
    data: {
      labels: labels,
      datasets: [{
        data: dataValues,
        backgroundColor: colors
      }]
    },
    options: {
      plugins: { legend: { labels: { color: textColor } } },
      scales: { r: { grid: { color: 'rgba(255,255,255,0.1)' }, ticks: { display: false } } }
    }
  });
}

// Rendu de la grille des cartes d'animes
function renderAnimeCards(items) {
  const resultsGrid = document.getElementById("resultsGrid");
  if (!resultsGrid) return;

  if (items.length === 0) {
    resultsGrid.innerHTML = "<p style='grid-column: 1/-1; text-align: center;'>Aucun anime trouvé dans votre liste.</p>";
    return;
  }

  resultsGrid.innerHTML = items.map(item => {
    const anime = item.node;
    const userScore = item.list_status.score ? `★ ${item.list_status.score}/10` : "Non noté";
    const epsWatched = `${item.list_status.num_episodes_watched} eps vus`;
    const format = anime.media_type ? anime.media_type.toUpperCase() : "TV";
    const imgUrl = anime.main_picture ? anime.main_picture.medium : "";

    return `
      <div class="card">
        <img src="${imgUrl}" alt="${anime.title}">
        <div class="card-info">
          <div class="card-type">${format}</div>
          <div class="card-title">${anime.title}</div>
          <div class="card-meta">
            <span class="score">${userScore}</span>
            <span>${epsWatched}</span>
          </div>
        </div>
      </div>
    `;
  }).join("");
}

// --- FONCTION INTEGRATION IA GEMINI ---

async function runGeminiAnalysis() {
  const resultDiv = document.getElementById("aiResult");
  const btn = document.getElementById("geminiBtn");

  // 1. Récupérer ou demander la clé API Gemini
  let apiKey = localStorage.getItem("GEMINI_API_KEY");
  if (!apiKey) {
    apiKey = prompt("Entre ta clé API Google Gemini (gratuite sur Google AI Studio) :");
    if (!apiKey) return;
    localStorage.setItem("GEMINI_API_KEY", apiKey.trim());
  }

  resultDiv.textContent = "🧠 Gemini analyse tes goûts d'otaku en profondeur... Patientez...";
  btn.disabled = true;

  try {
    // 2. Charger les données du fichier JSON local
    const dataResp = await fetch("./data/data.json");
    if (!dataResp.ok) throw new Error("Impossible de lire data/data.json");

    const data = await dataResp.json();
    const animelist = data.animelist || [];

    // Formater le résumé avec un dictionnaire explicatif clair
    const userSummary = animelist.map(item => {
      const title = item.node.title;
      const score = item.list_status.score > 0 ? `${item.list_status.score}/10` : 'Non noté (score 0)';
      const status = item.list_status.status;
      const episodesWatched = item.list_status.num_episodes_watched || 0;

      return `- Titre: "${title}" | Note attribuée: ${score} | Statut d'avancement: ${status} | Épisodes vus: ${episodesWatched}`;
    }).join("\n");

    const promptText = `
Voici la liste des animes enregistrés par l'utilisateur "${data.username || 'Otaku'}".

--- EXPLICATION DES DONNÉES DU FICHIER ---
- "Statut d'avancement" :
  • "completed" = Anime terminé.
  • "watching" = Anime en cours de visionnage.
  • "on_hold" = Anime mis en pause.
  • "dropped" = Anime abandonné en cours de route.
  • "plan_to_watch" = Anime prévu à voir (pas encore commencé).
- "Note attribuée" : Note sur 10. Si "Non noté", l'utilisateur ne lui a pas encore donné de note.
------------------------------------------

DONNÉES DE L'UTILISATEUR :
${userSummary}

INSTRUCTIONS DE L'ANALYSE :
En te basant sur ces choix, réalise une analyse complète de son profil otaku en 4 points :

1. 🎯 **Ce qu'il aime particulièrement** : Analyse les animes avec de hautes notes ou le statut "completed" (thèmes, genres, styles).
2. 🚫 **Ce qu'il n'aime pas ou évite** : Repère les animes avec de basses notes, ceux au statut "dropped" (abandonnés), ou les genres absents.
3. 👤 **Son Personnage Totem** : Choisis un personnage célèbre d'anime qui correspond parfaitement à sa personnalité de spectateur / ses goûts, et explique pourquoi avec humour.
4. 🍿 **3 Recommandations Sur-Mesure** : Propose 3 animes qu'il n'a PAS encore vus dans sa liste, avec 1 phrase explicative personnalisée pour chaque.

Sois dynamique, drôle, et utilise des emojis !
`;

    // 3. Appel à l'API Gemini 3.6 Flash
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: promptText }]
          }
        ]
      })
    });

    const resData = await response.json();

    if (resData.error) {
      throw new Error(resData.error.message || "Erreur de l'API Gemini");
    }

    // Affichage de la réponse formatée
    const aiAnswer = resData.candidates[0].content.parts[0].text;
    resultDiv.innerHTML = formatMarkdownText(aiAnswer);

  } catch (err) {
    console.error(err);
    resultDiv.textContent = "❌ Erreur : " + err.message;
    // Si la clé est mauvaise, on la supprime pour pouvoir la saisir de nouveau
    if (err.message.includes("API key") || err.message.includes("400") || err.message.includes("404")) {
      localStorage.removeItem("GEMINI_API_KEY");
    }
  } finally {
    btn.disabled = false;
  }
}

// Fonction utilitaire pour formater le texte Markdown en HTML basique
function formatMarkdownText(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/^\*\s(.*)$/gm, '• $1')
    .replace(/\n/g, '<br>');
}

document.addEventListener("DOMContentLoaded", loadDashboardData);
