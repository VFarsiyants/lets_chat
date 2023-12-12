# chat/consumers.py
import json
from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer

from .crud import get_user_chat_ids, get_chat_messages, create_message, get_user_chats


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user = self.scope['user']
        self.user_group_name = f"user_{self.user.id}"

        self.chats_list_ids = await database_sync_to_async(get_user_chat_ids)(
            self.user)

        await self.channel_layer.group_add(
            self.user_group_name, self.channel_name)

        for chat_id in self.chats_list_ids:
            await self.channel_layer.group_add(
                f'chat_{chat_id}', self.channel_name)

        await self.accept()
        await self.send(text_data=json.dumps({'user_id': self.user.email}))

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.user_group_name, self.channel_name)
        for chat_id in self.chats_list_ids:
            await self.channel_layer.group_discard(
                f'chat_{chat_id}', self.channel_name)

    async def receive(self, text_data):
        action_json = json.loads(text_data)
        await self.receive_dispatch(action_json)

    async def send_message(self, event):
        payload = event['payload']
        await self.send(text_data=json.dumps(payload))

    async def receive_dispatch(self, action):
        action_type = action['type']
        if action_type == 'send.message':
            chat_id = action['payload']['chat_id']
            await database_sync_to_async(create_message)(
                self.user.id, chat_id, action['payload']['text']
            )
            await self.channel_layer.group_send(f'chat_{chat_id}', action)
            return
        elif action_type == 'fetch.messages':
            chat_id = action['payload']
            chat_messages = await database_sync_to_async(
                get_chat_messages)(chat_id)
            messages = [{
                'author_id': message.author_id,
                'text': message.text,
                'datetime': str(message.created_at)
            } for message in chat_messages]
            await self.send(text_data=json.dumps(messages))
            return
        elif action_type == 'get.chats':
            chats = await database_sync_to_async(get_user_chats)(self.user)
            await self.send(text_data=json.dumps({
                'type': action_type,
                'payload': chats
            }))
            return

        raise ValueError(f'Uknown action type: {action_type}')
