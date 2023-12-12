from django.core.management.base import BaseCommand
from user.models import UserChatSession


class Command(BaseCommand):
    help = 'Delete all instances from the UserChatSession table'

    def handle(self, *args, **options):
        UserChatSession.objects.all().delete()
        self.stdout.write(self.style.SUCCESS(
            'Successfully deleted all sessions.'))
