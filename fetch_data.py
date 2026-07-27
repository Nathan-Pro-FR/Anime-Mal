import os
import json
import requests

CLIENT_ID = os.environ.get("MAL_CLIENT_ID")
USERNAME = "TON_PSEUDO_MAL"  # <-- Mets ton pseudo MAL ici

BASE_URL = "https://api.myanimelist.net/v2"
HEADERS = {"X-MAL-CLIENT-ID": CLIENT_ID}

def get_user_animelist(username):
    url = f"{BASE_URL}/users/{username}/animelist"
    params = {
        "limit": 1000,
        "fields": "list_status,num_episodes,genres,mean,main_picture,average_episode_duration",
        "sort": "list_score"
    }
    
    response = requests.get(url, headers=HEADERS, params=params)
    if response.status_code == 200:
        return response.json().get("data", [])
    else:
        print(f"Erreur API ({response.status_code}): {response.text}")
        return []

if __name__ == "__main__":
    animelist = get_user_animelist(USERNAME)
    
    data = {
        "username": USERNAME,
        "animelist": animelist
    }
    
    # Création du dossier /data s'il n'existe pas
    os.makedirs("data", exist_ok=True)
    
    with open("data/data.json", "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
        
    print(f"Données de {USERNAME} récupérées ({len(animelist)} animes) et sauvegardées dans data/data.json !")