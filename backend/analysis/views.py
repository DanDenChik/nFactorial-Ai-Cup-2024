from rest_framework import viewsets, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.shortcuts import get_object_or_404, render
from .models import InstagramProfile, InstagramPost, InstagramImage, InstagramComment
from .serializers import InstagramProfileSerializer
from .tasks import fetch_instagram_data_task
from celery.result import AsyncResult
import openai
from .analyze_func import analyze_posts, analyze_comments, analyze_post_times
import instaloader
import constants

openai.api_key = constants.OPEN_AI_KEY


class InstagramProfileViewSet(viewsets.ModelViewSet):
    queryset = InstagramProfile.objects.all()
    serializer_class = InstagramProfileSerializer


@api_view(["POST"])
def fetch_instagram_data(request):
    username = request.data.get("username")
    if not username:
        return Response(
            {"error": "Username is required"}, status=status.HTTP_400_BAD_REQUEST
        )

    task = fetch_instagram_data_task.delay(username)

    return Response({"task_id": task.id, "status": "Task started"})


@api_view(["GET"])
def get_task_status(request, task_id):
    task_result = AsyncResult(task_id)
    if task_result.state == "PENDING":
        response = {"state": task_result.state, "status": "Pending..."}
    elif task_result.state != "FAILURE":
        response = {
            "state": task_result.state,
            "progress": task_result.info.get("progress", 0),
            "status": task_result.info.get("status", ""),
        }
    else:
        response = {
            "state": task_result.state,
            "status": str(task_result.info),
        }
    return Response(response)


@api_view(["POST"])
def analyze_instagram_data(request):
    username = request.data.get("username")
    profile = get_object_or_404(InstagramProfile, username=username)

    posts_analysis = analyze_posts(profile)
    comments_analysis = analyze_comments(posts_analysis)
    post_times_image = analyze_post_times(posts_analysis)

    prompt = f"Instagram data analysis for {username}:\n\n"
    prompt += "Posts Analysis:\n"
    for post in posts_analysis:
        prompt += f"Date: {post['date']}, Caption: {post['caption']}, Likes: {post['likes']}\n"
        prompt += f"{post['image_analysis']}\n\n"

    prompt += "Comments Analysis:\n"
    for post in comments_analysis:
        prompt += f"Date: {post['date']}, Caption: {post['caption']}, Likes: {post['likes']}\n"
        prompt += f"Sentiments: {post['sentiment']}\n\n"

    prompt += "Posting Times Analysis: See attached graph for details.\n"

    # response = openai.Completion.create(
    #     engine="text-davinci-003",
    #     prompt=prompt,
    #     max_tokens=150
    # )

    # recommendations = response.choices[0].text.strip()
    return Response(
        {
            "posts_analysis": posts_analysis,
            "comments_analysis": comments_analysis,
            "post_times_image": post_times_image,
            #'recommendations': recommendations
        }
    )


def index(request):
    return render(request, "analysis/index.html")
