import json
from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer

from .crud import (delete_chat_session, get_user_chat_ids, create_chat_session, 
                   get_user_contacts_ids,
                   get_unread_messages_count, retrieve_chat, retrieve_message)
from .groups import (add_to_chat_groups, add_to_user_online_status_groups, 
                     discard_chanel_from_chat_groups, discard_channel_from_user_statuses_group)
from .receive_handlers import (send_message_to_chat, send_chat_messages, 
                               send_chats, send_read_receipt, notify_update_chat)


class ChatConsumer(AsyncWebsocketConsumer):

    RECEIVE_ACTION_HANDLER_MAP = {
        'send.message': send_message_to_chat,
        'get.chats': send_chats,
        'fetch.messages': send_chat_messages,
        'message.read': send_read_receipt,
        'update.chat': notify_update_chat,
    }

    async def connect(self):
        self.user = self.scope['user']

        self.chat_session = await database_sync_to_async(
            create_chat_session)(self.user)

        self.chats_list_ids = await database_sync_to_async(get_user_chat_ids)(
            self.user)

        self.contacts_list_ids = await database_sync_to_async(
            get_user_contacts_ids)(self.user)

        # groups to receive chat messages
        await add_to_chat_groups(self.chats_list_ids, self.channel_name)

        # groups to receive contacts online statuses
        await add_to_user_online_status_groups(
            self.contacts_list_ids, self.channel_name, self.user
        )

        await self.accept()

    async def disconnect(self, close_code):
        await database_sync_to_async(delete_chat_session)(self.chat_session)

        await discard_chanel_from_chat_groups(
            self.chats_list_ids, self.channel_name)
        
        await discard_channel_from_user_statuses_group(
            self.contacts_list_ids, self.channel_name, self.user)

    async def receive(self, text_data):
        action_json = json.loads(text_data)
        action_type = action_json['type']
        await self.RECEIVE_ACTION_HANDLER_MAP[action_type](self, action_json)

    async def send_message(self, event):
        payload = event['payload']
        message = await database_sync_to_async(retrieve_message)(
            payload['chat_id'],
            payload['id'],
            user=self.user
        )
        await self.send(text_data=json.dumps({
            'event': 'new.message',
            'payload': message
        }))

    async def user_online(self, event):
        await self.send(text_data=json.dumps({
            'event': 'user.online',
            'payload': event['payload']
        }))

    async def message_read(self, event):
        unread_count = await database_sync_to_async(get_unread_messages_count)(
            self.user, event['payload']['chat_id']
        )
        event['payload']['total_unread_count'] = unread_count
        response_data = {
            'event': 'message.receipt',
            'payload': event['payload']
        }
        await self.send(text_data=json.dumps(response_data))

    async def update_chat(self, event):
        updated_chat = await database_sync_to_async(retrieve_chat)(
            self.user, event['payload']
        )
        event['payload'] = updated_chat
        response_data = {
            'event': 'refetch.chat',
            'payload':  event['payload']
        }
        await self.send(text_data=json.dumps(response_data))
