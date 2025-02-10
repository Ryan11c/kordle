from django.db import models
from django.contrib.auth.models import User

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

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    wins = models.PositiveIntegerField(default=0)  # Store number of wins
    def __str__(self):
        return f"{self.user.username} - Wins: {self.wins}"
