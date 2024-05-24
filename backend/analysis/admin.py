from django.contrib import admin
from .models import (
    InstagramProfile,
    InstagramPost,
    InstagramImage,
    InstagramComment,
    LoadingStatus,
)

admin.site.register(InstagramProfile)
admin.site.register(InstagramPost)
admin.site.register(InstagramImage)
admin.site.register(InstagramComment)
admin.site.register(LoadingStatus)
