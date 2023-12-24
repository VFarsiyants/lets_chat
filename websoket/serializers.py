import pytz
from django.utils.translation import gettext_lazy as _
from rest_framework.serializers import (
    BooleanField,
    CharField,
    IntegerField,
    ModelSerializer,
    SerializerMethodField,
)

from chat.models import Chat, Message, ReadRecept
from user.models import User


class UserInfoSerializer(ModelSerializer):

    user_contact_name = SerializerMethodField(label=_('User contact string'))
    avatar_url = SerializerMethodField(label=_('User avatar url'))

    class Meta:
        model = User
        fields = '__all__'

    def get_user_contact_name(self, obj):
        if obj.first_name and obj.last_name:
            return f'{obj.first_name} {obj.last_name}'
        return obj.email

    def get_avatar_url(self, obj):
        if obj.avatar:
            return obj.avatar.image.url
        return None


class ChatSerializer(ModelSerializer):
    class Meta:
        model = Chat
        fields = '__all__'

    chat_name = SerializerMethodField(label=_('Chat name'))
    last_message = SerializerMethodField(label=_('Last message'))
    last_message_time = SerializerMethodField(label=_('Last message time'))
    image_url = SerializerMethodField(label=_('Chat image'))
    is_online = SerializerMethodField(label=_('User online'))
    last_seen = SerializerMethodField(
        label=_('Last time when user was online for personal chats'))
    unread_count = IntegerField(label=_('Number of unread messages'))

    def get_email(self, obj):
        return obj.contact[0].email

    def get_chat_name(self, obj):
        if obj.chat_type == 'PE':
            firsname = obj.contact[0].first_name or ''
            lastname = obj.contact[0].last_name or ''
            if firsname or lastname:
                return ' '.join([firsname, lastname]).rstrip()
            return obj.contact[0].email
        return 'Not implemented'

    def get_last_message(self, obj):
        last_message = obj.chat_messages.order_by('-created_at').first()
        if last_message:
            return last_message.text
        else:
            return None

    def get_last_message_time(self, obj):
        last_message = obj.chat_messages.order_by('-created_at').first()
        if last_message:
            return str(last_message.created_at)
        else:
            return None

    def get_image_url(self, obj):
        if obj.chat_type == 'PE':
            avatar = obj.contact[0].avatar
            if avatar:
                return str(avatar.image.url)
            return None
        return 'Not implemented'

    def get_is_online(self, obj):
        if obj.chat_type == 'PE':
            return obj.contact[0].is_online
        return False

    def get_last_seen(self, obj):
        if obj.chat_type == 'PE':
            last_online_date = obj.contact[0].last_online_datetime \
                or obj.contact[0].last_login
            if last_online_date is None:
                return
            return str(last_online_date)
        return


class MessageSerializer(ModelSerializer):
    is_read = BooleanField(label=_('Is message read'),
                           required=False, allow_null=True)

    class Meta:
        model = Message
        fields = ['id', 'author_id', 'text',
                  'created_at', 'chat_id', 'is_read']


class UserOnlineInfoSerializer(ModelSerializer):

    last_seen = CharField(
        label=_('Last time when user was online'))

    is_online = BooleanField(
        source='is_user_online',
        label=_('User online status')
    )

    class Meta:
        model = User
        fields = ['id', 'last_seen', 'is_online']


class ReadReceiptSerializer(ModelSerializer):
    chat_id = IntegerField(source='message.chat.id', label=_('Chat id'))

    class Meta:
        model = ReadRecept
        fields = '__all__'
