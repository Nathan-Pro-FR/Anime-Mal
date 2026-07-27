async function loadDashboardData() {
  const statusDiv = document.getElementById("status");

  try {
    const response = await fetch("./data/data.json");
    if (!response.ok) throw new Error("Impossible de charger data/data.json");
    
    const data = await response.json();
    const animelist = data.animelist || [];
    
    if (data.username) {
      document.getElementById("userSub").textContent = `Profil MyAnimeList de ${data.username}`;
    }

    statusDiv.textContent = "";

    // 1. Calculer les statistiques (temps en j/h/m & statuts)
    computeStats(animelist);

    // 2. Générer les 3 graphiques Chart.js
    renderStatusChart(animelist);
    renderGenreChart(animelist);
    renderFormatChart(animelist);

    // 3. Afficher les cartes d'animes
    renderAnimeCards(animelist);

  } catch (err) {
    statusDiv.textContent = "Erreur de chargement des données. Vérifie que data/data.json existe.";
    console.error(err);
  }
}

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
    
    // Compter les statuts
    if (status.status === "completed") completedCount++;
    if (status.status === "watching") watchingCount++;

    // Calcul de la durée (secondes)
    const epDurationSeconds = item.node.average_episode_duration || (24 * 60);
    totalSeconds += watchedEps * epDurationSeconds;

    if (status.score > 0) {
      totalScore += status.score;
      scoredCount++;
    }
  });

  // Convertit les secondes en Jours, Heures ET Minutes
  const totalMinutes = Math.floor(totalSeconds / 60);
  const days = Math.floor(totalMinutes / (24 * 60));
  const hours = Math.floor((totalMinutes % (24 * 60)) / 60);
  const minutes = totalMinutes % 60;

  // Mise à jour de l'affichage HTML
  document.getElementById("totalAnime").textContent = list.length;
  document.getElementById("completedAnime").textContent = completedCount;
  document.getElementById("watchingAnime").textContent = watchingCount;
  document.getElementById("totalEps").textContent = totalEps;
  document.getElementById("totalTime").textContent = `${days}j ${hours}h ${minutes}m`;
  document.getElementById("meanScore").textContent = scoredCount > 0 ? (totalScore / scoredCount).toFixed(2) + " / 10" : "N/A";
}

function renderStatusChart(list) {
  const statusCounts = { watching: 0, completed: 0, on_hold: 0, dropped: 0, plan_to_watch: 0 };

  list.forEach(item => {
    const s = item.list_status.status;
    if (statusCounts[s] !== undefined) statusCounts[s]++;
  });

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
        backgroundColor: ['#00f0ff', '#ff007f', '#ffd700', '#ff4d4d', '#a0aec0']
      }]
    },
    options: { plugins: { legend: { labels: { color: '#e2e8f0' } } } }
  });
}

function renderGenreChart(list) {
  const genreCounts = {};

  list.forEach(item => {
    const genres = item.node.genres || [];
    genres.forEach(g => {
      genreCounts[g.name] = (genreCounts[g.name] || 0) + 1;
    });
  });

  const sortedGenres = Object.entries(genreCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);

  const ctx = document.getElementById('genreChart').getContext('2d');
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: sortedGenres.map(g => g[0]),
      datasets: [{
        label: "Nombre d'animes",
        data: sortedGenres.map(g => g[1]),
        backgroundColor: '#00f0ff'
      }]
    },
    options: {
      scales: {
        y: { ticks: { color: '#e2e8f0' } },
        x: { ticks: { color: '#e2e8f0' } }
      },
      plugins: { legend: { labels: { color: '#e2e8f0' } } }
    }
  });
}

function renderFormatChart(list) {
  const formatCounts = {};

  list.forEach(item => {
    const format = (item.node.media_type || "Inconnu").toUpperCase();
    formatCounts[format] = (formatCounts[format] || 0) + 1;
  });

  const ctx = document.getElementById('formatChart').getContext('2d');
  new Chart(ctx, {
    type: 'polarArea',
    data: {
      labels: Object.keys(formatCounts),
      datasets: [{
        data: Object.values(formatCounts),
        backgroundColor: ['#00f0ff', '#ff007f', '#ffd700', '#00ff88', '#9900ff', '#ff9900']
      }]
    },
    options: {
      plugins: { legend: { labels: { color: '#e2e8f0' } } },
      scales: { r: { grid: { color: 'rgba(255,255,255,0.1)' }, ticks: { display: false } } }
    }
  });
}

function renderAnimeCards(items) {
  const resultsGrid = document.getElementById("resultsGrid");
  
  if (items.length === 0) {
    resultsGrid.innerHTML = "<p style='grid-column: 1/-1; text-align: center;'>Aucun anime trouvé.</p>";
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

document.addEventListener("DOMContentLoaded", loadDashboardData);