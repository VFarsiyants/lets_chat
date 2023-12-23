import json

from channels.layers import get_channel_layer
from channels.db import database_sync_to_async

from .crud import (create_message, get_chat_messages, get_user_chats, 
                   create_read_receipt, get_user_info)


channel_layer = get_channel_layer()


async def send_message_to_chat(consumer, action, *args, **kwargs):
    chat_id = action['payload']['chat_id']
    message = await database_sync_to_async(create_message)(
        consumer.user.id, chat_id, action['payload']['text']
    )
    action['payload'] = message
    await channel_layer.group_send(f'chat_{chat_id}', action)


async def send_chats(consumer, *args, **kwargs):
    chats = await database_sync_to_async(get_user_chats)(consumer.user)
    await consumer.send(text_data=json.dumps({
        'event': 'get.chats',
        'payload': chats
    }))


async def send_chat_messages(consumer, action, *args, **kwargs):
    chat_id = action['payload']
    chat_messages = await database_sync_to_async(
        get_chat_messages)(chat_id, user=consumer.user)
    await consumer.send(text_data=json.dumps({
        'event': 'fetch.messages',
        'payload': chat_messages
    }))


async def send_read_receipt(consumer, action, *args, **kwargs):
    message_id = action['payload']
    read_receipt = await database_sync_to_async(create_read_receipt)(
        consumer.user, message_id
    )
    action['payload'] = read_receipt
    await channel_layer.group_send(
        f'chat_{read_receipt["chat_id"]}', action)


async def notify_update_chat(consumer, action, *args, **kwargs):
    chat_id = action['payload']
    if not chat_id in consumer.chats_list_ids:
        consumer.send(text_data=json.dumps({
        'event': 'update.chat',
        'payload': 'unknown chat id'
    }))
    await channel_layer.group_send(
        f'chat_{chat_id}', action)
    

async def send_current_user_info(consumer, *args, **kwargs):
    current_user_data = await database_sync_to_async(get_user_info)(
            consumer.user)
    await consumer.send(text_data=json.dumps({
        'event': 'current.user',
        'payload': current_user_data
    }))
