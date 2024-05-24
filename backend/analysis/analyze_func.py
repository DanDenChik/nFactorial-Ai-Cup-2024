import matplotlib.pyplot as plt
import numpy as np
from textblob import TextBlob
from deep_translator import GoogleTranslator
from .models import InstagramProfile
import os

translator = GoogleTranslator(source="auto", target="en")


def translate_to_english(text):
    result = translator.translate(text)
    return result


def analyze_sentiment(text):
    translated_text = translate_to_english(text)
    blob = TextBlob(translated_text)
    if blob.sentiment.polarity > 0:
        return "positive"
    elif blob.sentiment.polarity < 0:
        return "negative"
    else:
        return "neutral"


def analyze_posts(profile):
    posts = profile.posts.all()
    results = []
    for post in posts:
        image_analysis = "Images: " + ", ".join(
            [img.image_url for img in post.images.all()]
        )
        results.append(
            {
                "date": post.date,
                "caption": post.caption,
                "likes": post.likes,
                "comments_count": post.comments_count,
                "comments": [comment.text for comment in post.comments.all()],
                "image_analysis": image_analysis,
            }
        )
    return results


def analyze_comments(posts):
    comment_analysis = []
    for post in posts:
        sentiments = [analyze_sentiment(comment) for comment in post["comments"]]
        sentiment_counts = {
            "positive": sentiments.count("positive"),
            "negative": sentiments.count("negative"),
            "neutral": sentiments.count("neutral"),
        }
        comment_analysis.append(
            {
                "date": post["date"],
                "caption": post["caption"],
                "likes": post["likes"],
                "sentiment": sentiment_counts,
            }
        )
    return comment_analysis


def analyze_post_times(posts):
    times = [post["date"].hour for post in posts]
    output_dir = 'analysis/static/analysis'
    os.makedirs(output_dir, exist_ok=True)
    output_path = os.path.join(output_dir, 'posting_times_distribution.png')

    plt.hist(times, bins=np.arange(25) - 0.5, edgecolor="black")
    plt.xlabel("Hour of the Day")
    plt.ylabel("Number of Posts")
    plt.title("Posting Times Distribution")
    plt.grid(True)
    plt.savefig("output_path")
    return output_path
