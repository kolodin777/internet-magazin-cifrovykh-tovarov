from urllib.parse import parse_qs

from channels.db import database_sync_to_async
from django.contrib.auth import get_user_model
from django.contrib.auth.models import AnonymousUser
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from rest_framework_simplejwt.tokens import AccessToken


@database_sync_to_async
def get_user(token):
    User = get_user_model()
    try:
        validated_token = AccessToken(token)
        return User.objects.get(id=validated_token['user_id'])
    except (InvalidToken, TokenError, KeyError, User.DoesNotExist):
        return AnonymousUser()


class JWTAuthMiddleware:
    def __init__(self, app):
        self.app = app

    async def __call__(self, scope, receive, send):
        query_string = parse_qs(scope['query_string'].decode())
        token = query_string.get('token', [None])[0]
        scope['user'] = await get_user(token) if token else AnonymousUser()
        return await self.app(scope, receive, send)
