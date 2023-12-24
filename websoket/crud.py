from datetime import datetime

from django.db.models import (
    BooleanField,
    Case,
    F,
    Func,
    IntegerField,
    OuterRef,
    Prefetch,
    Q,
    Subquery,
    Value,
    When,
)
from django.db.models.expressions import Exists, Star, Value

from chat.models import Message, ReadRecept
from user.models import User, UserChatSession

from .serializers import (
    ChatSerializer,
    MessageSerializer,
    ReadReceiptSerializer,
    UserInfoSerializer,
    UserOnlineInfoSerializer,
)


async def get_user_chat_ids(user: User):
    return [chat.id async for chat in user.user_chats.all()]


def get_user_info(user: User):
    return UserInfoSerializer(user).data


async def get_user_contacts_ids(user: User):
    chats = user.user_chats.filter(chat_type='PE')
    contacts = [user.id async for user in User.objects.filter(user_chats__in=chats).distinct('id')]
    return list(contacts)


async def create_message(author_id, chat_id, message_text):
    message = await Message.objects.acreate(
        created_at=datetime.now(),
        chat_id=chat_id,
        text=message_text,
        author_id=author_id,
    )
    return MessageSerializer(message).data


def get_chat_messages_queryset(chat_id, user=None):
    messages = Message.objects.filter(chat_id=chat_id).order_by('created_at')

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


async def retrieve_message(chat_id, message_id, user=None):
    messages = get_chat_messages_queryset(chat_id, user=user)
    message = await messages.aget(id=message_id)
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


async def get_unread_messages_count(user, chat_id):
    return await Message.objects.filter(
        chat_id=chat_id
    ).exclude(
        Q(author=user) | Q(receipt__reader=user),
    ).acount()


async def create_chat_session(user: User):
    return await UserChatSession.objects.acreate(user=user)


async def delete_chat_session(session: UserChatSession):
    user = session.user
    user.last_online_datetime = datetime.now()
    await user.asave()
    await session.adelete()


async def get_user_online_status(user: User):
    user = await User.objects.annotate(
        is_user_online=Exists(
            UserChatSession.objects.filter(user_id=OuterRef('id'))
        )
    ).annotate(
        last_seen=Case(When(is_user_online=True, then=Value(None)),
                       When(Q(last_online_datetime__isnull=False),
                            then=F('last_online_datetime')),
                       When(Q(last_login__isnull=False), then=F('last_login')),
                       default=Value(None))
    ).aget(id=user.id)
    return UserOnlineInfoSerializer(user).data


def create_read_receipt(user: User, message_id):
    read_receipt, _ = ReadRecept.objects.get_or_create(
        message_id=message_id,
        reader=user,
    )

    return ReadReceiptSerializer(read_receipt).data
