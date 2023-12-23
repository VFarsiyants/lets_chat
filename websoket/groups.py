from channels.layers import get_channel_layer
from channels.db import database_sync_to_async

from .crud import get_user_online_status
from user.models import User


channel_layer = get_channel_layer()


async def add_to_chat_groups(chat_ids: list[int], channel_name):
    for chat_id in chat_ids:
        await channel_layer.group_add(f'chat_{chat_id}', channel_name)


async def add_to_user_online_status_groups(
        contacts_list_ids: list[int], channel_name, user: User):
    for contact_id in contacts_list_ids:
        # send message that current user is online
        action = {
            'type': 'user.online',
            'payload': await database_sync_to_async(
                get_user_online_status)(user)
        }
        if contact_id != user.id:
            await channel_layer.group_send(
                f'user_status_{user.id}', action)
        await channel_layer.group_add(
            f'user_status_{contact_id}', channel_name)
        

async def discard_chanel_from_chat_groups(
        chats_list_ids: list[int], channel_name):
    for chat_id in chats_list_ids:
        await channel_layer.group_discard(f'chat_{chat_id}', channel_name)


async def discard_channel_from_user_statuses_group(
        contacts_list_ids: list[int], channel_name, user: User):
    for contact_id in contacts_list_ids:
        await channel_layer.group_discard(
            f'user_status_{contact_id}', channel_name)
        action = {
            'type': 'user.online',
            'payload': await database_sync_to_async(
                get_user_online_status)(user)
        }
        if contact_id != user.id:
            await channel_layer.group_send(
                f'user_status_{user.id}', action)

