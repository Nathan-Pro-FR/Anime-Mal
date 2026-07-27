import os
import json
import requests

CLIENT_ID = os.environ.get("MAL_CLIENT_ID")
BASE_URL = "https://api.myanimelist.net/v2"

headers = {
    "X-MAL-CLIENT-ID": CLIENT_ID
}

def get_top_anime():
    url = f"{BASE_URL}/anime/ranking?ranking_type=airing&limit=24&fields=id,title,main_picture,mean,num_episodes,genres"
    res = requests.get(url, headers=headers)
    if res.status_code == 200:
        return res.json().get("data", [])
    print(f"Erreur API: {res.status_code}")
    return []

if __name__ == "__main__":
    data = {
        "top_airing": get_top_anime()
    }
    
    # Crée le dossier 'data' s'il n'existe pas encore
    os.makedirs("data", exist_ok=True)
    
    # Sauvegarde dans data/data.json
    with open("data/data.json", "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
        
    print("Fichier data/data.json généré avec succès !")
