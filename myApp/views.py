from django.shortcuts import render, redirect
import requests, os, json, random
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import ChampionSerializer
from.models import Profile
from django.contrib.auth import authenticate, login, logout
from django.contrib import messages


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
                    "resource": local_data.get("resource", "unknown"),
                    "attackType": local_data.get("attackType", "unknown"),
                    "releaseDate": local_data.get("releaseDate", "unknown"),
                    "region": local_data.get("region", "unknown"),
                    "lane": local_data.get("lane", "unknown"),
                    "genre": local_data.get("genre", "unknown"),
                })
            champions.append(champion_info)

        if champions:
            random_champion = random.choice(champions)
    else:
        # Just in case API fails, we just clear the list
        champions = [] 
        random_champion = {"Failed to load champions data :("}

    return render(request, 'home.html', {'champions': champions, 'random_champion': random_champion})


#This class is basically the same as the function above but it is a class-based API view. 
#Handles HTTP GET requests to return random LoL champion data from the local JSON data and fetched API data.
class ChampionAPIView(APIView):
    def get(self, request):
        champions_data = load_champion_data()
        champions_dict = {champ["id"]: champ for champ in champions_data}
        #Fetch champions from API.
        api_url = "https://ddragon.leagueoflegends.com/cdn/15.1.1/data/en_US/champion.json"
        response = requests.get(api_url)

        if response.status_code == 200:
            champions_data = response.json()
            champions = []
            for name, details in champions_data['data'].items():
                champion_info = {
                    "name": name,
                    "title": details["title"],
                    "id": details["id"],
                    "image": f"https://ddragon.leagueoflegends.com/cdn/15.1.1/img/champion/{name}.png"
                }
                #Add local data from my json file
                if details["id"] in champions_dict:
                    local_data = champions_dict[details["id"]]
                    champion_info.update({
                        "gender": local_data.get("gender", "unknown"),
                        "resource": local_data.get("resource", "unknown"),
                        "attackType": local_data.get("attackType", "unknown"),
                        "releaseDate": local_data.get("releaseDate", "unknown"),
                        "region": local_data.get("region", "unknown"),
                        "lane": local_data.get("lane", "unknown"),
                        "genre": local_data.get("genre", "unknown"),
                    })
                champions.append(champion_info)

            #Select a random champion
            if champions:
                random_champion = random.choice(champions)
            #Serialize the selected champion's data to JSON format!!!!!!!!!!!!
            serializer = ChampionSerializer(random_champion).data
            #Serialize the whole champion list
            serialized_champions = ChampionSerializer(champions, many=True).data
            return Response(
                {
                    "random_champion": serializer,
                    "champion_list": serialized_champions
                },
                status=status.HTTP_200_OK
            )
        #Just in case API fails, we have an error catch
        return Response({"error": "Failed to fetch data from API"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    

#Show the user profiles in the html page
def profile_list(request):
    if request.user.is_authenticated:
        profiles = Profile.objects.exclude(user=request.user)
    else:
        profiles = Profile.objects.all() 
    return render(request, 'profile_list.html', {"profiles": profiles})


#The about page where I will put the description
def about(request):
    return render(request, 'about.html')


#Login page for the application. Get the username and password from the login html
def login_user(request):
    if request.method == "POST":
        username = request.POST['username']
        password = request.POST['password']
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            messages.success(request, ("You have been logged in."))
            return redirect('home')
        else:
            messages.success(request, ("There was an error logging in. Please try again."))
            return redirect('login')
    else:
        return render(request, "login.html", {})
    


#Just using django's built in logout feature. Super duper easy
def logout_user(request):
    logout(request)
    messages.success(request, ("You have been logged out."))
    return redirect('home')
