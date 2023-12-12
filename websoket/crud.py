from datetime import datetime

from django.db.models import OuterRef, Subquery, Prefetch

from user.models import User
from chat.models import Message, Chat
from .serializers import ChatSerizlizer


def get_user_chat_ids(user: User):
    return list(user.user_chats.all().values_list('id', flat=True))


def create_message(author_id, chat_id, message_text):
    message = Message.objects.create(
        created_at=datetime.now(),
        chat_id=chat_id,
        text=message_text,
        author_id=author_id,
    )
    return message


def get_chat_messages(chat_id):
    return list(Message.objects.filter(chat_id=chat_id))


def get_user_chats(user: User):
    # chats = user.user_chats.annotate(
    #     email=_get_personal_chat_subq(user, 'email'),
    #     firstname=_get_personal_chat_subq(user, 'firstname'),
    #     lastname=_get_personal_chat_subq(user, 'lastname'),
    #     last_message=
    # )

    chats = user.user_chats.prefetch_related(
        Prefetch(
            'chat_participants',
            User.objects.exclude(id=user.id)[:1],
            to_attr='contact'
        )
    )

    data = ChatSerizlizer(chats, many=True).data

    return data
