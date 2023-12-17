from datetime import datetime

from django.db.models import (
    Prefetch, Subquery, OuterRef, Func, IntegerField, Q,
    Case, When, Value, BooleanField)
from django.db.models.expressions import Star, Exists

from user.models import User, UserChatSession
from chat.models import Message, ReadRecept
from .serializers import (
    ChatSerializer, MessageSerializer, UserOnlineInfoSerializer,
    ReadReceiptSerializer)


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


def get_chat_messages_queryset(chat_id, user=None):
    messages = Message.objects.filter(chat_id=chat_id)

    if user:
        is_read_q = Exists(ReadRecept.objects.filter(
            message_id=OuterRef('id'),
            reader=user
        ).exclude(message__author=user))
        messages = messages.annotate(
            is_read=Case(
                When(author=user, then=Value(None)),
                default=is_read_q,
                output_field=BooleanField(null=True)
            )
        )

    return messages


def get_chat_messages(chat_id, user=None):
    messages = get_chat_messages_queryset(chat_id, user=user)
    data = MessageSerializer(messages, many=True).data
    return data


def retrieve_message(chat_id, message_id, user=None):
    messages = get_chat_messages_queryset(chat_id, user=user)
    message = messages.get(id=message_id)
    return MessageSerializer(message).data


def get_chats_queryset(user: User):
    chats = user.user_chats.prefetch_related(
        Prefetch(
            'chat_participants',
            User.objects.exclude(id=user.id)[:1],
            to_attr='contact'
        )
    )

    unread_count_q = Subquery(
        Message.objects.filter(
            chat_id=OuterRef('id')
        ).exclude(
            Q(author=user) | Q(receipt__reader=user),
        ).annotate(
            count=Func(Star(), function='COUNT', output_field=IntegerField())
        ).values('count'),
        output_field=IntegerField()
    )

    chats = chats.annotate(
        unread_count=unread_count_q
    )

    return chats


def get_user_chats(user: User):

    chats = get_chats_queryset(user)

    data = ChatSerializer(
        chats, many=True).data

    return data


def retrieve_chat(user: User, chat_id):
    chats = get_chats_queryset(user)
    chat = chats.get(id=chat_id)
    return ChatSerializer(chat).data


def get_unread_messages_count(user, chat_id):
    return Message.objects.filter(
        chat_id=chat_id
    ).exclude(
        Q(author=user) | Q(receipt__reader=user),
    ).count()


def create_chat_session(user: User):
    return UserChatSession.objects.create(user=user)


def delete_chat_session(session: UserChatSession):
    user = session.user
    user.last_online_datetime = datetime.now()
    user.save()
    session.delete()


def get_user_online_status(user: User):
    return UserOnlineInfoSerializer(user).data


def create_read_receipt(user: User, message_id):
    read_receipt, _ = ReadRecept.objects.get_or_create(
        message_id=message_id,
        reader=user,
    )

    return ReadReceiptSerializer(read_receipt).data
