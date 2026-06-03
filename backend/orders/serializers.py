from rest_framework import serializers
from .models import Order
from products.serializers import ProductListSerializer

class OrderSerializer(serializers.ModelSerializer):
    product_detail = ProductListSerializer(source='product', read_only=True)

    class Meta:
        model = Order
        fields = ['id', 'product', 'product_detail', 'purchased_at']
        read_only_fields = ['user', 'purchased_at']