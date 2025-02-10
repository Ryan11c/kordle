from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save

# Create your models here.
class Champion(models.Model):
    name = models.CharField(max_length=50)
    icon = models.URLField()
    gender = models.CharField(max_length=10)
    position = models.CharField(max_length=20)
    species = models.CharField(max_length=50)
    resource = models.CharField(max_length=20)
    range_type = models.CharField(max_length=20)
    region = models.CharField(max_length=50)
    release_year = models.IntegerField()

#Create a user model profile that stores the amount of wins they have
class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    wins = models.PositiveIntegerField(default=0)
    date_modified = models.DateTimeField(User, auto_now=True)
    def __str__(self):
        return f"{self.user.username} - Wins: {self.wins}"

#Create profile when new user signs up
def create_profile(sender, instance, created, **kwargs):
    if created:
        user_profile = Profile(user=instance)
        user_profile.save()

post_save.connect(create_profile, sender=User)