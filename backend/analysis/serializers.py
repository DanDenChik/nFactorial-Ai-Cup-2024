from rest_framework import serializers
from .models import InstagramProfile, InstagramPost, InstagramImage


class InstagramImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = InstagramImage
        fields = ["image_url"]


class InstagramPostSerializer(serializers.ModelSerializer):
    images = InstagramImageSerializer(many=True, read_only=True)

    class Meta:
        model = InstagramPost
        fields = ["date", "likes", "comments_count", "images"]


class InstagramProfileSerializer(serializers.ModelSerializer):
    posts = InstagramPostSerializer(many=True, read_only=True)

    class Meta:
        model = InstagramProfile
        fields = ["username", "bio", "followers", "following", "posts"]
