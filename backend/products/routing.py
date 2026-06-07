from django.urls import path

from .consumers import ProductCommentConsumer


websocket_urlpatterns = [
    path('ws/products/<int:product_id>/comments/', ProductCommentConsumer.as_asgi()),
]
