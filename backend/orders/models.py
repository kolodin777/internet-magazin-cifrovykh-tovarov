from django.db import models
from django.conf import settings
from products.models import Product

class Order(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, verbose_name='Пользователь')
    product = models.ForeignKey(Product, on_delete=models.CASCADE, verbose_name='Товар')
    purchased_at = models.DateTimeField(auto_now_add=True, verbose_name='Дата покупки')

    class Meta:
        verbose_name = 'Заказ'
        verbose_name_plural = 'Заказы'
        unique_together = ('user', 'product')  # Защита от повторной покупки

    def __str__(self):
        return f"{self.user.username} - {self.product.title}"