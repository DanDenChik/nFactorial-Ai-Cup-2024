from celery import shared_task
from .models import InstagramProfile, InstagramPost, InstagramImage, InstagramComment
import instaloader
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
import logging

logger = logging.getLogger(__name__)


@shared_task(bind=True)
def fetch_instagram_data_task(self, username):
    logger.info(f"Starting task for username: {username}")
    loader = instaloader.Instaloader()
    try:
        profile = instaloader.Profile.from_username(loader.context, username)
    except instaloader.exceptions.ProfileNotExistsException:
        self.update_state(state="FAILURE", meta={"error": "Profile does not exist"})
        logger.error("Profile does not exist")
        return {"error": "Profile does not exist"}
    except instaloader.exceptions.ConnectionException:
        self.update_state(state="FAILURE", meta={"error": "Connection error"})
        logger.error("Connection error")
        return {"error": "Connection error"}
    except instaloader.exceptions.PrivateProfileNotFollowedException:
        self.update_state(state="FAILURE", meta={"error": "Profile is private"})
        logger.error("Profile is private")
        return {"error": "Profile is private"}

    total_posts = profile.mediacount
    post_count = 0

    for post in profile.get_posts():
        post_data = {
            "date": post.date,
            "caption": post.caption,
            "likes": post.likes,
            "comments_count": post.comments,
            "comments": [comment.text for comment in post.get_comments()],
            "images": (
                [node.display_url for node in post.get_sidecar_nodes()]
                if post.typename == "GraphSidecar"
                else [post.url]
            ),
        }

        profile_obj, created = InstagramProfile.objects.update_or_create(
            username=username,
            defaults={
                "followers": profile.followers,
                "following": profile.followees,
            },
        )

        post_obj, created = InstagramPost.objects.update_or_create(
            profile=profile_obj,
            date=post_data["date"],
            defaults={
                "caption": post_data["caption"],
                "likes": post_data["likes"],
                "comments_count": post_data["comments_count"],
            },
        )
        for image_url in post_data["images"]:
            InstagramImage.objects.update_or_create(
                post=post_obj,
                defaults={
                    "image_url": image_url,
                },
            )
        for comment_text in post_data["comments"]:
            InstagramComment.objects.update_or_create(
                post=post_obj,
                defaults={
                    "text": comment_text,
                },
            )

        post_count += 1
        progress = (post_count / total_posts) * 100
        logger.info(f"Progress: {progress}%")

        self.update_state(state="PROGRESS", meta={"progress": progress})

        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            username, {"type": "send_status", "message": {"progress": progress}}
        )

    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(
        username,
        {"type": "send_status", "message": {"progress": 100, "status": "completed"}},
    )

    self.update_state(state="SUCCESS", meta={"status": "completed"})
    logger.info("Task completed successfully")
    return {"status": "success"}
