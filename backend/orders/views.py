from django.http import HttpResponse
from django.shortcuts import get_object_or_404
from django.utils.text import slugify
from rest_framework import permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from products.models import Product
from .models import Order
from .serializers import OrderSerializer


class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user)

    def create(self, request, *args, **kwargs):
        product_id = request.data.get('product')
        product = get_object_or_404(Product, pk=product_id, is_active=True)

        if Order.objects.filter(user=request.user, product=product).exists():
            return Response(
                {'error': 'Вы уже приобрели этот товар'},
                status=status.HTTP_400_BAD_REQUEST
            )

        order = Order.objects.create(user=request.user, product=product)
        serializer = self.get_serializer(order)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['get'])
    def my_orders(self, request):
        orders = self.get_queryset()
        serializer = self.get_serializer(orders, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def download(self, request, pk=None):
        order = get_object_or_404(Order, pk=pk, user=request.user)
        product = order.product

        product.downloads += 1
        product.save(update_fields=['downloads'])

        filename_base = slugify(product.title) or f'product-{product.id}'
        filename = f'{filename_base}.txt'
        content = (
            f'Название: {product.title}\n'
            f'Цена: {product.price}\n'
            f'Категория: {product.category.title}\n'
            f'Автор: {product.author.username if product.author else ""}\n\n'
            f'Описание:\n{product.description}\n'
        )

        response = HttpResponse(content, content_type='text/plain; charset=utf-8')
        response['Content-Disposition'] = f'attachment; filename="{filename}"'
        return response
