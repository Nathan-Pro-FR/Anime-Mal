import os
import json
import requests

CLIENT_ID = os.environ.get("MAL_CLIENT_ID")
# Remplace par ton pseudo MyAnimeList exact
USERNAME = "TON_PSEUDO_MAL" 

BASE_URL = "https://api.myanimelist.net/v2"
HEADERS = {"X-MAL-CLIENT-ID": CLIENT_ID}

def get_user_animelist(username):
    url = f"{BASE_URL}/users/{username}/animelist"
    params = {
        "limit": 1000,
        "fields": "list_status,num_episodes,genres,mean,main_picture",
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
    
    os.makedirs("data", exist_ok=True)
    with open("data/data.json", "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
        
    print(f"Données de {USERNAME} récupérées ({len(animelist)} animes) !")
