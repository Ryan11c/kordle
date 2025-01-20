from django.shortcuts import render
import requests
import os
import json, random


#Helper function to load the JSON file
def load_champion_data():
    #Load the JSON file containing additional champion data.
    #I got this from github by the user "Kerrders". Thank you it was very helpful!
    #Additonal data I used was the champion gender, attackType, releaseDate, region, and lane.
    json_file_path = os.path.join(os.path.dirname(__file__), "champion_data.json")
    with open(json_file_path, "r", encoding="utf-8") as file:
        champion_data = json.load(file)
    return champion_data


#Test home page rendering champion names, title, and png image
def home(request):
    #Load additional data from the local JSON file
    champions_data = load_champion_data()
    #Convert the local data to a dictionary for quick lookup
    champions_dict = {champ["id"]: champ for champ in champions_data}
    api_url = "https://ddragon.leagueoflegends.com/cdn/15.1.1/data/en_US/champion.json"
    response = requests.get(api_url)

    if response.status_code == 200:
        champions_data = response.json()
        champions = []
        random_champion = None
        #Iterate through the API and fetch data
        for name, details in champions_data['data'].items():
            champion_info = {
                "name": name,
                "title": details["title"],
                "id": details["id"],
                #In the Data Dragon API for LoL champions, the images of the champions are located here:
                #We just have to pass in the name of the champion to get the image!
                "image": f"https://ddragon.leagueoflegends.com/cdn/15.1.1/img/champion/{name}.png"
            }
            #Add additional data if available in the local JSON file
            if details["id"] in champions_dict:
                local_data = champions_dict[details["id"]]
                champion_info.update({
                    "gender": local_data.get("gender", "unknown"),
                    "attackType": local_data.get("attackType", "unknown"),
                    "releaseDate": local_data.get("releaseDate", "unknown"),
                    "region": local_data.get("region", "unknown"),
                    "lane": local_data.get("lane", "unknown")
                })
            else:
                #Default values if no data
                champion_info.update({
                    "gender": "unknown",
                    "attackType": "unknown",
                    "releaseDate": "unknown",
                    "region": "unknown",
                    "lane": "unknown"
                })
            champions.append(champion_info)

        if champions:
            random_champion = random.choice(champions)
    else:
        # Just in case API fails, we just clear the list
        champions = [] 
        random_champion = {"Failed to load champions data :("}

    return render(request, 'home.html', {'champions': champions, 'random_champion': random_champion})