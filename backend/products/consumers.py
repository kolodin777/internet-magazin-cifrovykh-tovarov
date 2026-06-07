from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncJsonWebsocketConsumer

from .models import Comment, Product


class ProductCommentConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        if not self.scope['user'].is_authenticated:
            await self.close(code=4401)
            return

        self.product_id = self.scope['url_route']['kwargs']['product_id']
        self.group_name = f'product_comments_{self.product_id}'
        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        if hasattr(self, 'group_name'):
            await self.channel_layer.group_discard(self.group_name, self.channel_name)

    async def receive_json(self, content, **kwargs):
        if content.get('type') != 'comment':
            return

        text = content.get('text', '').strip()
        if not text or len(text) > 1000:
            await self.send_json({
                'type': 'error',
                'message': 'Комментарий должен содержать от 1 до 1000 символов.',
            })
            return

        comment = await self.create_comment(text)
        comment['client_id'] = content.get('client_id')
        await self.channel_layer.group_send(
            self.group_name,
            {'type': 'comment.created', 'comment': comment},
        )

    async def comment_created(self, event):
        await self.send_json({'type': 'comment', 'comment': event['comment']})

    @database_sync_to_async
    def create_comment(self, text):
        product = Product.objects.get(pk=self.product_id, is_active=True)
        comment = Comment.objects.create(product=product, user=self.scope['user'], text=text)
        return {
            'id': comment.id,
            'product': product.id,
            'username': self.scope['user'].username,
            'text': comment.text,
            'created_at': comment.created_at.isoformat(),
        }
