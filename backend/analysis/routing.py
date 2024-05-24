from django.urls import path
from . import consumers

websocket_urlpatterns = [
    path(
        "ws/instagram_status/<str:username>/",
        consumers.InstagramStatusConsumer.as_asgi(),
    ),
]
