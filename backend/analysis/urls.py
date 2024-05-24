from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import InstagramProfileViewSet, fetch_instagram_data, analyze_instagram_data, index, get_task_status

router = DefaultRouter()
router.register(r'profiles', InstagramProfileViewSet)

urlpatterns = [
    path('', index, name='index'),
    path('api/', include(router.urls)),
    path('fetch/', fetch_instagram_data, name='fetch_instagram_data'),
    path('analyze/', analyze_instagram_data, name='analyze_instagram_data'),
    path('status/<str:task_id>/', get_task_status),
]
