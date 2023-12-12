from django.db import models
from django.utils.translation import gettext_lazy as _


class Image(models.Model):

    default = models.BooleanField(
        default=False, verbose_name=_('Is photo default'))

    image = models.ImageField(upload_to="avatars")

    class Meta:
        verbose_name = "User's image"
        verbose_name_plural = "Users' images"

    def __str__(self) -> str:
        return self.image.name
