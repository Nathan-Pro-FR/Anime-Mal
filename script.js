let allAnime = [];

async function loadAnimeData() {
  const statusDiv = document.getElementById("status");

  try {
    const response = await fetch("./data/data.json");
    if (!response.ok) throw new Error("Fichier data.json non trouvé dans /data");
    
    const data = await response.json();
    allAnime = data.top_airing || [];
    
    statusDiv.textContent = "";
    renderAnimeCards(allAnime);
  } catch (err) {
    statusDiv.textContent = "Les données sont en cours d'initialisation par GitHub Actions...";
    console.error(err);
  }
}

function renderAnimeCards(items) {
  const resultsGrid = document.getElementById("resultsGrid");
  
  if (items.length === 0) {
    resultsGrid.innerHTML = "<p style='grid-column: 1/-1; text-align: center;'>Aucun anime trouvé.</p>";
    return;
  }

  resultsGrid.innerHTML = items.map(item => {
    const anime = item.node;
    const score = anime.mean ? `★ ${anime.mean}` : "N/A";
    const eps = anime.num_episodes ? `${anime.num_episodes} eps` : "? eps";
    const imgUrl = anime.main_picture ? anime.main_picture.medium : "";

    return `
      <div class="card">
        <img src="${imgUrl}" alt="${anime.title}">
        <div class="card-info">
          <div class="card-title">${anime.title}</div>
          <div class="card-meta">
            <span class="score">${score}</span>
            <span>${eps}</span>
          </div>
        </div>
      </div>
    `;
  }).join("");
}

// Filtrage instantané
document.getElementById("filterInput").addEventListener("input", (e) => {
  const query = e.target.value.toLowerCase();
  const filtered = allAnime.filter(item => 
    item.node.title.toLowerCase().includes(query)
  );
  renderAnimeCards(filtered);
});

document.addEventListener("DOMContentLoaded", loadAnimeData);
