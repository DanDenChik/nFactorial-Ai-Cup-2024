from django.db import models
from django.utils.translation import gettext_lazy as _


class InstagramProfile(models.Model):
    username = models.CharField(max_length=100, unique=True)
    followers = models.IntegerField()
    following = models.IntegerField()

    def __str__(self):
        return self.username

class InstagramPost(models.Model):
    profile = models.ForeignKey(InstagramProfile, on_delete=models.CASCADE, related_name='posts')
    date = models.DateTimeField()
    caption = models.TextField(null=True, blank=True)
    likes = models.IntegerField()
    comments_count = models.IntegerField()

    def __str__(self):
        return f"Post on {self.date} by {self.profile.username}"

class InstagramImage(models.Model):
    post = models.ForeignKey(InstagramPost, on_delete=models.CASCADE, related_name='images')
    image_url = models.URLField()

    def __str__(self):
        return f"Image for post {self.post.id}"

class InstagramComment(models.Model):
    post = models.ForeignKey(InstagramPost, on_delete=models.CASCADE, related_name='comments')
    text = models.TextField()
    sentiment = models.CharField(max_length=10, default='neutral')

    def __str__(self):
        return f"Comment on {self.post.id}"

class LoadingStatus(models.Model):
    username = models.CharField(max_length=100)
    status = models.CharField(max_length=20, default='pending')
    progress = models.IntegerField(default=0)
    total = models.IntegerField(default=0)

    def __str__(self):
        return f"Loading status for {self.username}"
