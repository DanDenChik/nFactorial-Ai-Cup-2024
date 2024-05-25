from django.db import models


class InstagramProfile(models.Model):
    username = models.CharField(max_length=100, unique=True)
    bio = models.TextField(blank=True, null=True)
    followers = models.IntegerField()
    following = models.IntegerField()


class InstagramPost(models.Model):
    profile = models.ForeignKey(InstagramProfile, on_delete=models.CASCADE)
    date = models.DateTimeField()
    caption = models.TextField()
    likes = models.IntegerField()
    comments_count = models.IntegerField()


class InstagramImage(models.Model):
    post = models.ForeignKey(InstagramPost, on_delete=models.CASCADE)
    image_url = models.URLField()


class InstagramComment(models.Model):
    post = models.ForeignKey(InstagramPost, on_delete=models.CASCADE)
    text = models.TextField()
    likes = models.IntegerField()


class LoadingStatus(models.Model):
    username = models.CharField(max_length=100)
    status = models.CharField(max_length=20, default="pending")
    progress = models.IntegerField(default=0)
    total = models.IntegerField(default=0)

    def __str__(self):
        return f"Loading status for {self.username}"
