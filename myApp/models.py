from django.db import models

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