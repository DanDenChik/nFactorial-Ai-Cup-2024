from rest_framework import serializers
from .models import InstagramProfile, InstagramPost, InstagramImage

class InstagramImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = InstagramImage
        fields = '__all__'

class InstagramPostSerializer(serializers.ModelSerializer):
    images = InstagramImageSerializer(many=True, read_only=True)

    class Meta:
        model = InstagramPost
        fields = '__all__'

class InstagramProfileSerializer(serializers.ModelSerializer):
    posts = InstagramPostSerializer(many=True, read_only=True)

    class Meta:
        model = InstagramProfile
        fields = '__all__'

