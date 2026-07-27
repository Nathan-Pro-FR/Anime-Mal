async function loadDashboardData() {
  const statusDiv = document.getElementById("status");

  try {
    const response = await fetch("./data/data.json");
    if (!response.ok) throw new Error("Impossible de charger les données");
    
    const data = await response.json();
    const animelist = data.animelist || [];
    
    if (data.username) {
      document.getElementById("userSub").textContent = `Profil MyAnimeList de ${data.username}`;
    }

    statusDiv.textContent = "";

    // 1. Calculer les statistiques
    computeStats(animelist);

    // 2. Générer les graphiques Chart.js
    renderStatusChart(animelist);
    renderGenreChart(animelist);

    // 3. Afficher la liste
    renderAnimeCards(animelist);

  } catch (err) {
    statusDiv.textContent = "Erreur de chargement. Vérifie que le fichier data/data.json est bien généré.";
    console.error(err);
  }
}

function computeStats(list) {
  let totalEps = 0;
  let totalScore = 0;
  let scoredCount = 0;

  list.forEach(item => {
    const status = item.list_status;
    totalEps += status.num_episodes_watched || 0;
    
    if (status.score > 0) {
      totalScore += status.score;
      scoredCount++;
    }
  });

  document.getElementById("totalAnime").textContent = list.length;
  document.getElementById("totalEps").textContent = totalEps;
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

  // Trier les genres par nombre
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

function renderAnimeCards(items) {
  const resultsGrid = document.getElementById("resultsGrid");
  
  resultsGrid.innerHTML = items.map(item => {
    const anime = item.node;
    const userScore = item.list_status.score ? `Note: ${item.list_status.score}/10` : "Non noté";
    const epsWatched = `${item.list_status.num_episodes_watched} eps vus`;
    const imgUrl = anime.main_picture ? anime.main_picture.medium : "";

    return `
      <div class="card">
        <img src="${imgUrl}" alt="${anime.title}">
        <div class="card-info">
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
