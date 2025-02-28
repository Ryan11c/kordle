"""
URL configuration for lolwordle project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from . import views
from .views import ChampionAPIView
urlpatterns = [
   path('', views.home, name='home'),
   path('api/champion/', ChampionAPIView.as_view(), name='champion-api'),
   path('profile_list/', views.profile_list, name='profile_list'),
   path('about/', views.about, name='about'),
   path('login/', views.login_user, name='login'),
   path('logout/', views.logout_user, name='logout'),
   path('register/', views.register_user, name='register'),
   path('update_user/', views.update_user, name='update_user'),
   path('increment_wins/', views.increment_wins, name='increment_wins'),
   path('statistics/', views.statistics, name='statistics'),
]
