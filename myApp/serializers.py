from rest_framework import serializers

class IdolSerializer(serializers.Serializer):
    name = serializers.CharField()
    group = serializers.CharField()
    birthday = serializers.CharField()
    height = serializers.CharField()
    gender = serializers.CharField()
    company = serializers.CharField()
    nationality = serializers.CharField()
    image = serializers.SerializerMethodField()
    def get_image(self, obj):
        return f"images/idol/{obj['name'].replace(' ', '_').lower()}.jpg"