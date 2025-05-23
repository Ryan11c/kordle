from django.shortcuts import render, redirect
import requests, os, json, random
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import IdolSerializer
from.models import Profile, RequestLog, ActiveUserLog
from django.contrib.auth import authenticate, login, logout
from django.contrib import messages
from .forms import UpdateUserForm, SignUpForm, UploadProfile
from .forms import SignUpForm
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from django.views.decorators.cache import cache_page
from django.views.decorators.csrf import csrf_protect
from django.contrib.admin.views.decorators import staff_member_required
from django.contrib.auth.models import User
from django.db.models.functions import TruncDate
from django.db.models import Count, Sum
from django.core.paginator import Paginator
from rest_framework.throttling import AnonRateThrottle, UserRateThrottle


#Homepage view
def home(request):
    return render(request, 'home.html')
    

#Show the user profiles in the html page
#followed this documentation: https://docs.djangoproject.com/en/5.1/topics/pagination/
def profile_list(request):
    profiles = Profile.objects.all()
    paginator = Paginator(profiles, 10)
    page_number = request.GET.get("page")
    page_obj = paginator.get_page(page_number)
    return render(request, "profile_list.html", {"page_obj": page_obj})


#The about page where I will put the description
def about(request):
    return render(request, 'about.html')


#Login page for the application. Get the username and password from the login html
def login_user(request):
    if request.method == "POST":
        username = request.POST.get('username', '')
        password = request.POST.get('password', '')
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            messages.success(request, ("You have been logged in."))
            return redirect('home')
        else:
            messages.error(request, ("Incorrect username or password. Please try again."))
            return redirect('login')
    else:
        return render(request, "login.html", {})


#Just using django's built in logout feature. Super duper easy
@login_required
def logout_user(request):
    logout(request)
    messages.success(request, ("You have been logged out."))
    return redirect('home')


def register_user(request):
    form = SignUpForm()
    if request.method == "POST":
        form = SignUpForm(request.POST)
        if form.is_valid():
            form.save()
            username = form.cleaned_data['username']
            password = form.cleaned_data['password1']
            user = authenticate(username=username, password=password)
            login(request, user)
            messages.success(request, ("You have successfully registered."))
            return redirect('home')
        
    return render(request, "register.html", {'form': form})


#For updating a specific profile. The form will be the UpdateUserForm.
def update_user(request):
    if not request.user.is_authenticated:
        messages.error(request, "You must be logged in to edit your profile.")
        return redirect('login')
    #Set current user
    current_user = request.user  
    profile_user = Profile.objects.get(user__id=request.user.id)
    profile_form = UploadProfile(request.POST or None, request.FILES or None, instance=profile_user)
    user_form = UpdateUserForm(request.POST or None, request.FILES or None, instance=current_user)
    if request.method == "POST" and user_form.is_valid() and profile_form.is_valid():
        user_form.save()
        profile_form.save()
        messages.success(request, "Successfully updated your profile.")
        return redirect('home')

    return render(request, "update_user.html", {'user_form': user_form, 'profile_form': profile_form})


@csrf_protect 
def increment_wins(request):
    if not request.user.is_authenticated:
        #Just in case a user not logged in somehow reaches this view we can BLOCK them
        return JsonResponse({"success": False, "error": "User not logged in"}, status=401)
    if request.method == "POST":
        profile = Profile.objects.get(user=request.user)
        profile.wins += 1
        profile.save()
        return JsonResponse({"success": True, "wins": profile.wins})
    return JsonResponse({"success": False, "error": "Invalid request"}, status=400)


def statistics(request):
     #This will pass the profile into the html by the amount of wins they have. It will be in descending order
     #This is because we are using for loop to display pfp
    profiles = Profile.objects.order_by('-wins')[:10]
    return render(request, "statistics.html", {'profiles': profiles})


#Function to load local JSON data for kpop idols
def load_idol_data():
    file_path = os.path.join(os.path.dirname(__file__), "kpop_data.json")
    with open(file_path, "r", encoding="utf-8") as file:
        return json.load(file)


class IdolAPIView(APIView):
    def get(self, request):
        #rate limits for api usage. Protects against DDoS attacks and brute-force attempts or bots
        throttle_classes = [AnonRateThrottle, UserRateThrottle] 
        #allow only admins to see browsable API
        if "text/html" in request.META.get("HTTP_ACCEPT", "") and not request.user.is_staff:
            return JsonResponse({"error": "Not staff"}, status=403)
        #Load idols from local JSON
        idols = load_idol_data()  
        if not idols:
            return Response({"error": "No data"}, status=status.HTTP_404_NOT_FOUND)
        for idol in idols:
            idol["image"] = f"image/{idol['name'].replace(' ', '_').lower()}.jpg"
            
        #Pick a random idol from the list
        random_idol = random.choice(idols)
        #Serialize the data
        random_idol_serialized = IdolSerializer(random_idol).data
        serialized_idols = IdolSerializer(idols, many=True).data

        return Response({"random_idol": random_idol_serialized, "idol_list": serialized_idols},status=status.HTTP_200_OK)
    

#API for signups chart. Just followed a tutorial nothing special
#cache for 5 minutes
@cache_page(60 * 5)  
def signup_chart_data(request):
    signups = (User.objects.annotate(date=TruncDate("date_joined")) .values("date") .annotate(count=Count("id")) .order_by("date"))
    labels = [signup["date"].strftime("%Y-%m-%d") for signup in signups]
    values = [signup["count"] for signup in signups]
    return JsonResponse({"labels": labels, "values": values})


#requests per day chart
#cache for 5 minutes
@cache_page(60 * 5)
def requests_chart_data(request):
    requests_per_day = RequestLog.objects.values("date").annotate(total_requests=Sum("count")).order_by("date")
    active_users_per_day = ActiveUserLog.objects.values("date").annotate(total_users=Count("ip_address")).order_by("date")
    #building active users as a list we can check
    active_users_list = list(active_users_per_day)
    labels = []
    request_values = []
    active_user_values = []
    active_id = 0
    for i in requests_per_day:
        request_date = i["date"]
        labels.append(request_date.strftime("%m/%d"))
        request_values.append(i["total_requests"])
        #the default is 0 active users
        total_users = 0
        #matching active users if date aligns
        if active_id < len(active_users_list) and active_users_list[active_id]["date"] == request_date:
            total_users = active_users_list[active_id]["total_users"]
            active_id += 1
        active_user_values.append(total_users)
    return JsonResponse({"labels": labels, "values": request_values, "active_user_values": active_user_values})
