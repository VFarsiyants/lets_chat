from django.contrib import admin
from .models import User, UserChatSession


admin.site.register(User)
admin.site.register(UserChatSession)
