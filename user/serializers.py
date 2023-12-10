from rest_framework.serializers import ModelSerializer, CharField, EmailField
from rest_framework.validators import UniqueValidator
from django.utils.translation import gettext_lazy as _
from django.core.exceptions import ValidationError
import django.contrib.auth.password_validation as validators
from django.conf import settings

from .models import User


class UserRegisterSerializer(ModelSerializer):
    email = EmailField(
        validators=[UniqueValidator(
            queryset=User.objects.all(),
            message='Account linked to this email already exists')],
        label=_('Users\'s username')
    )

    password = CharField(label=_('Users\'s username'), write_only=True)

    def validate(self, data):
        if not settings.DEBUG:
            user = User(**data)
            password = data.get('password')
            errors = dict()
            try:
                validators.validate_password(password=password, user=user)

            except ValidationError as e:
                errors['password'] = list(e.messages)

            if errors:
                raise ValidationError(errors)

        return super(UserRegisterSerializer, self).validate(data)

    def create(self, validated_data):
        username = validated_data['email'].split('@')[0]
        user = User.objects.create_user(username, **validated_data)
        return user

    class Meta:
        model = User
        fields = ["email", "password"]
