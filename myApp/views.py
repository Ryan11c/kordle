from django.shortcuts import render
import requests

#Create your views here.
#Test home page rendering champion names, title, and png image
def home(request):
    api_url = "https://ddragon.leagueoflegends.com/cdn/15.1.1/data/en_US/champion.json"
    response = requests.get(api_url)
    if response.status_code == 200:
        champions_data = response.json()
        champions = [
            {   
                #Get the name through the key of the dictionary
                "name": name,
                #Get the champion title from the value of the dictionary
                "title": details["title"],
                #In the Data Dragon API for LoL champions, the images of the champions are located here:
                #We just have to pass in the name of the champion to get the image!
                "image": f"https://ddragon.leagueoflegends.com/cdn/15.1.1/img/champion/{name}.png"
            }
            for name, details in champions_data['data'].items()
        ]
    else:
        champions = []
    return render(request, 'home.html', {'champions': champions})

