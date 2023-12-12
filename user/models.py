from tabnanny import verbose
from django.db import models
from django.contrib.auth.models import AbstractUser
from django.contrib.auth.validators import UnicodeUsernameValidator
from django.utils.translation import gettext_lazy as _


class User(AbstractUser):
    username_validator = UnicodeUsernameValidator()
    email = models.EmailField(_("email address"), unique=True)
    username = models.CharField(
        _("username"),
        max_length=150,
        unique=True,
        blank=True,
        null=True,
        help_text=_(
            "Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only."
        ),
        validators=[username_validator],
        error_messages={
            "unique": _("A user with that username already exists."),
        },
    )

    avatar = models.ForeignKey(
        'file.Image', null=True, blank=True,
        verbose_name=_('User avatar'),
        on_delete=models.SET_NULL
    )

    last_online_datetime = models.DateTimeField(
        null=True, blank=True,
        verbose_name=_('Last online datetime')
    )

    is_online = models.BooleanField(
        default=False, verbose_name=_('Is user online'))

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]

    def __str__(self) -> str:
        return f'{self.email}'

    class Meta:
        verbose_name = "User"
        verbose_name_plural = "Users"
