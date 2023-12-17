import json
from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer

from .crud import (create_read_receipt, delete_chat_session, get_user_chat_ids, get_chat_messages,
                   create_message, get_user_chats, create_chat_session, get_user_contacts_ids,
                   get_user_online_status, get_unread_messages_count, retrieve_chat, retrieve_message)


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user = self.scope['user']
        self.chat_session = await database_sync_to_async(
            create_chat_session)(self.user)

        self.chats_list_ids = await database_sync_to_async(get_user_chat_ids)(
            self.user)

        self.contacts_list_ids = await database_sync_to_async(
            get_user_contacts_ids)(self.user)

        # groups to receive chat messages
        for chat_id in self.chats_list_ids:
            await self.channel_layer.group_add(
                f'chat_{chat_id}', self.channel_name)

        # groups to receive contacts online statuses
        for contact_id in self.contacts_list_ids:
            # send message that current user is online
            action = {
                'type': 'user.online',
                'payload': await database_sync_to_async(
                    get_user_online_status)(self.user)
            }
            if contact_id != self.user.id:
                await self.channel_layer.group_send(
                    f'user_status_{self.user.id}', action)
            await self.channel_layer.group_add(
                f'user_status_{contact_id}', self.channel_name)

        await self.accept()

    async def disconnect(self, close_code):
        await database_sync_to_async(delete_chat_session)(self.chat_session)
        for chat_id in self.chats_list_ids:
            await self.channel_layer.group_discard(
                f'chat_{chat_id}', self.channel_name)

        for contact_id in self.contacts_list_ids:
            await self.channel_layer.group_discard(
                f'user_status_{contact_id}', self.channel_name)
            action = {
                'type': 'user.online',
                'payload': await database_sync_to_async(
                    get_user_online_status)(self.user)
            }
            if contact_id != self.user.id:
                await self.channel_layer.group_send(
                    f'user_status_{self.user.id}', action)

    async def receive(self, text_data):
        action_json = json.loads(text_data)
        await self.receive_dispatch(action_json)

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

    async def receive_dispatch(self, action):
        action_type = action['type']
        if action_type == 'send.message':
            chat_id = action['payload']['chat_id']
            message = await database_sync_to_async(create_message)(
                self.user.id, chat_id, action['payload']['text']
            )
            action['payload'] = message
            await self.channel_layer.group_send(f'chat_{chat_id}', action)
            return
        elif action_type == 'fetch.messages':
            chat_id = action['payload']
            chat_messages = await database_sync_to_async(
                get_chat_messages)(chat_id, user=self.user)
            await self.send(text_data=json.dumps({
                'event': action_type,
                'payload': chat_messages
            }))
            return
        elif action_type == 'get.chats':
            chats = await database_sync_to_async(get_user_chats)(self.user)
            await self.send(text_data=json.dumps({
                'event': action_type,
                'payload': chats
            }))
            return
        elif action_type == 'message.read':
            message_id = action['payload']
            read_receipt = await database_sync_to_async(create_read_receipt)(
                self.user, message_id
            )
            action['payload'] = read_receipt
            await self.channel_layer.group_send(
                f'chat_{read_receipt["chat_id"]}', action)
            return
        elif action_type == 'update.chat':
            chat_id = action['payload']
            await self.channel_layer.group_send(
                f'chat_{chat_id}', action)
            return

        raise ValueError(f'Uknown action type: {action_type}')
