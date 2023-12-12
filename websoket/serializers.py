from django.utils.translation import gettext_lazy as _
from rest_framework.serializers import ModelSerializer, SerializerMethodField, CharField

from chat.models import Chat


class ChatSerizlizer(ModelSerializer):
    class Meta:
        model = Chat
        fields = '__all__'

    user_id = SerializerMethodField(label=_('User id'))
    email = SerializerMethodField(label=_('Contact email'))
    first_name = SerializerMethodField(label=_('First name'))
    last_name = SerializerMethodField(label=_('Last name'))
    last_message = SerializerMethodField(label=_('Last message'))
    last_message_time = SerializerMethodField(label=_('Last message time'))
    image_url = SerializerMethodField(label=_('Chat image'))
    is_online = SerializerMethodField(label=_('User online'))

    def get_email(self, obj):
        return obj.contact[0].email

    def get_first_name(self, obj):
        return obj.contact[0].first_name

    def get_last_name(self, obj):
        return obj.contact[0].last_name

    def get_last_message(self, obj):
        return obj.chat_messages.order_by('-created_at').first().text

    def get_last_message_time(self, obj):
        return str(obj.chat_messages.order_by('-created_at').first().created_at)

    def get_image_url(self, obj):
        return str(obj.contact[0].avatar.image.url)

    def get_is_online(self, obj):
        return obj.contact[0].is_online

    def get_user_id(self, obj):
        return obj.contact[0].id
