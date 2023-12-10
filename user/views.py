from django.db import transaction
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.status import HTTP_201_CREATED
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from .serializers import UserRegisterSerializer


@api_view(['post'])
@transaction.atomic
def register(request):
    srlz = UserRegisterSerializer(data=request.data)
    srlz.is_valid(raise_exception=True)
    user = srlz.save()
    token = TokenObtainPairSerializer.get_token(user)
    data = {}
    data['user'] = srlz.data
    data["refresh"] = str(token)
    data["access"] = str(token.access_token)
    return Response(data, status=HTTP_201_CREATED)
