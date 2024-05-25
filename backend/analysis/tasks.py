from huey.contrib.djhuey import db_task
from .models import InstagramProfile, InstagramPost, InstagramImage, InstagramComment
import instaloader
import logging
import time

logger = logging.getLogger(__name__)


@db_task()
def fetch_instagram_data_task(username):
    logger.info(f"Starting task for username: {username}")
    loader = instaloader.Instaloader()
    try:
        profile = instaloader.Profile.from_username(loader.context, username)
    except instaloader.exceptions.ProfileNotExistsException:
        logger.error("Profile does not exist")
        return {"error": "Profile does not exist"}
    except instaloader.exceptions.ConnectionException:
        logger.error("Connection error")
        return {"error": "Connection error"}
    except instaloader.exceptions.PrivateProfileNotFollowedException:
        logger.error("Profile is private")
        return {"error": "Profile is private"}

    profile_obj, created = InstagramProfile.objects.update_or_create(
        username=username,
        defaults={
            "bio": profile.biography,
            "followers": profile.followers,
            "following": profile.followees,
        },
    )

    for post in profile.get_posts():
        try:
            sidecar_nodes = list(
                post.get_sidecar_nodes()
            ) 
            post_data = {
                "date": post.date,
                "likes": post.likes,
                "comments_count": post.comments,
                "image": (
                    post.url if not sidecar_nodes else sidecar_nodes[0].display_url
                ),
            }
        except instaloader.exceptions.ConnectionException as e:
            if "429" in str(e):
                logger.warning("Rate limit exceeded. Waiting before retrying...")
                time.sleep(600)  # Wait for 10 minutes before retrying
            else:
                raise e

        post_obj, created = InstagramPost.objects.update_or_create(
            profile=profile_obj,
            date=post_data["date"],
            defaults={
                "likes": post_data["likes"],
                "comments_count": post_data["comments_count"],
            },
        )

        InstagramImage.objects.update_or_create(
            post=post_obj,
            defaults={
                "image_url": post_data["image"],
            },
        )

    logger.info("Task completed successfully")
    return {"status": "success"}
