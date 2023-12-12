from django.db import models
from django.utils.translation import gettext_lazy as _


class Chat(models.Model):
    CHAT_TYPE_CHOICES = [
        ('PE', 'Personal'),
        ('GR', 'Group'),
        ('CH', 'Channel'),
        ('BT', 'Bot')
    ]

    chat_participants = models.ManyToManyField(
        'user.User', related_name='user_chats',
        verbose_name=_('Participants of the chat')
    )

    chat_type = models.CharField(
        max_length=2, choices=CHAT_TYPE_CHOICES, default='PE')

    class Meta:
        verbose_name = "Chat"
        verbose_name_plural = "Chats"

    def __str__(self) -> str:
        participants = self.chat_participants.all()
        participants_str = ' and '.join(str(user) for user in participants[:2])
        print(participants_str)
        if self.chat_participants.count() > 2:
            return f'{participants_str} and others'
        return participants_str


class Message(models.Model):
    created_at = models.DateTimeField(
        auto_now=True, verbose_name=_('Message creation datetime'))
    chat = models.ForeignKey(
        Chat, on_delete=models.CASCADE, related_name='chat_messages',
        verbose_name=_('Chat'))
    text = models.TextField(verbose_name=_('Message text'))
    author = models.ForeignKey(
        'user.User', on_delete=models.CASCADE,
        verbose_name=_('Message author'))

    def __str__(self) -> str:
        return f'{self.created_at} - {self.author} - {self.text}'

    class Meta:
        verbose_name = "Message"
        verbose_name_plural = "Messages"
