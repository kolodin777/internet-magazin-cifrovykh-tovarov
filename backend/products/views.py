from rest_framework import viewsets, permissions, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Count, Q
from django.shortcuts import get_object_or_404
from .models import Category, Comment, Favorite, Product
from .serializers import CategorySerializer, ProductListSerializer, ProductDetailSerializer, \
    ProductCreateUpdateSerializer, CommentSerializer
from .pagination import ProductPagination


class IsAdminOrReadOnly(permissions.BasePermission):
    """Только администраторы могут создавать, редактировать и удалять товары"""

    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user and request.user.is_staff


class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet для категорий (только чтение)"""
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.AllowAny]


class ProductViewSet(viewsets.ModelViewSet):
    """ViewSet для товаров с поиском, фильтрацией по категории и цене"""
    queryset = Product.objects.filter(is_active=True)
    serializer_class = ProductDetailSerializer
    ordering_fields = ['price', 'created_at', 'downloads']
    permission_classes = [IsAdminOrReadOnly]
    pagination_class = ProductPagination

    def get_queryset(self):
        """
        Фильтрация товаров:
        - Поиск по названию и описанию (регистронезависимый)
        - Фильтр по категории
        - Фильтр по цене (от и до)
        """
        queryset = Product.objects.filter(is_active=True).select_related('category', 'author').annotate(
            favorite_count=Count('favorites', distinct=True),
            comment_count=Count('comments', distinct=True),
        )

        # Поиск по названию и описанию
        search = self.request.query_params.get('search', None)
        if search:
            search = search.strip().strip('"').strip("'").lower()
            queryset = queryset.filter(
                Q(title__icontains=search) |
                Q(description__icontains=search)
            )

        # Фильтр по категории
        category_id = self.request.query_params.get('category', None)
        if category_id:
            queryset = queryset.filter(category_id=category_id)

        # Фильтр по цене (от)
        price_min = self.request.query_params.get('price_min', None)
        if price_min:
            try:
                price_min = float(price_min)
                queryset = queryset.filter(price__gte=price_min)
            except ValueError:
                pass

        # Фильтр по цене (до)
        price_max = self.request.query_params.get('price_max', None)
        if price_max:
            try:
                price_max = float(price_max)
                queryset = queryset.filter(price__lte=price_max)
            except ValueError:
                pass

        return queryset

    def get_serializer_class(self):
        if self.action == 'list':
            return ProductListSerializer
        elif self.action in ['create', 'update', 'partial_update']:
            return ProductCreateUpdateSerializer
        return ProductDetailSerializer

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

    @action(detail=True, methods=['post'])
    def increment_views(self, request, pk=None):
        product = self.get_object()
        product.downloads += 1
        product.save(update_fields=['downloads'])
        return Response({'downloads': product.downloads})

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def favorite(self, request, pk=None):
        product = self.get_object()
        favorite, created = Favorite.objects.get_or_create(user=request.user, product=product)
        if not created:
            favorite.delete()

        return Response({
            'is_favorite': created,
            'favorite_count': product.favorites.count(),
        })

    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def favorites(self, request):
        products = self.get_queryset().filter(favorites__user=request.user)
        page = self.paginate_queryset(products)
        serializer = ProductListSerializer(
            page if page is not None else products,
            many=True,
            context={'request': request},
        )
        if page is not None:
            return self.get_paginated_response(serializer.data)
        return Response(serializer.data)


class IsCommentOwnerOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user.is_staff or obj.user_id == request.user.id


class CommentViewSet(viewsets.ModelViewSet):
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsCommentOwnerOrReadOnly]
    pagination_class = ProductPagination
    http_method_names = ['get', 'post', 'delete', 'head', 'options']

    def get_queryset(self):
        queryset = Comment.objects.select_related('user', 'product')
        product_id = self.request.query_params.get('product')
        if product_id:
            queryset = queryset.filter(product_id=product_id)
        return queryset

    def perform_create(self, serializer):
        product = get_object_or_404(Product, pk=self.request.data.get('product'), is_active=True)
        serializer.save(user=self.request.user, product=product)
