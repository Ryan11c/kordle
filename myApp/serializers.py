from rest_framework import serializers

class ChampionSerializer(serializers.Serializer):
    name = serializers.CharField()
    title = serializers.CharField()
    id = serializers.CharField()
    image = serializers.URLField()
    gender = serializers.CharField()
    attackType = serializers.CharField()
    releaseDate = serializers.CharField()
    region = serializers.CharField()
    lane = serializers.CharField()
    genre = serializers.CharField()
    resource = serializers.CharField()