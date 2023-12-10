from datetime import datetime

from user.models import User
from chat.models import Message, Chat


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
