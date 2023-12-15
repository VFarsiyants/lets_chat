from datetime import datetime

from django.db.models import Prefetch

from user.models import User, UserChatSession
from chat.models import Message
from .serializers import ChatSerializer, MessageSerializer


def get_user_chat_ids(user: User):
    return list(user.user_chats.all().values_list('id', flat=True))


def get_user_contacts_ids(user: User):
    chats = user.user_chats.filter(chat_type='PE')
    contacts = User.objects.filter(
        user_chats__in=chats
    ).distinct('id').values_list('id', flat=True)
    return list(contacts)


def create_message(author_id, chat_id, message_text):
    message = Message.objects.create(
        created_at=datetime.now(),
        chat_id=chat_id,
        text=message_text,
        author_id=author_id,
    )
    return MessageSerializer(message).data


def get_chat_messages(chat_id):
    messages = Message.objects.filter(chat_id=chat_id)
    data = MessageSerializer(messages, many=True).data
    return data


def get_user_chats(user: User):

    chats = user.user_chats.prefetch_related(
        Prefetch(
            'chat_participants',
            User.objects.exclude(id=user.id)[:1],
            to_attr='contact'
        )
    )

    data = ChatSerializer(chats, many=True).data

    return data


def create_chat_session(user: User):
    return UserChatSession.objects.create(user=user)


def delete_chat_session(session: UserChatSession):
    session.delete()


def get_user_online_status(user: User):
    return user.is_online
