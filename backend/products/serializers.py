from rest_framework import serializers
from .models import Category, Comment, Favorite, Product


class CategorySerializer(serializers.ModelSerializer):
    product_count = serializers.IntegerField(source='product_set.count', read_only=True)

    class Meta:
        model = Category
        fields = ['id', 'title', 'slug', 'product_count']


class ProductListSerializer(serializers.ModelSerializer):
    category_title = serializers.CharField(source='category.title', read_only=True)
    author_name = serializers.CharField(source='author.username', read_only=True)
    favorite_count = serializers.IntegerField(read_only=True)
    comment_count = serializers.IntegerField(read_only=True)
    is_favorite = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            'id', 'title', 'slug', 'price', 'category_title', 'author_name',
            'downloads', 'favorite_count', 'comment_count', 'is_favorite', 'created_at',
        ]

    def get_is_favorite(self, obj):
        request = self.context.get('request')
        if not request or not request.user.is_authenticated:
            return False
        return Favorite.objects.filter(user=request.user, product=obj).exists()


class ProductDetailSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    author = serializers.StringRelatedField(read_only=True)
    favorite_count = serializers.IntegerField(read_only=True)
    comment_count = serializers.IntegerField(read_only=True)
    is_favorite = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = '__all__'

    def get_is_favorite(self, obj):
        request = self.context.get('request')
        if not request or not request.user.is_authenticated:
            return False
        return Favorite.objects.filter(user=request.user, product=obj).exists()


class ProductCreateUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ['title', 'slug', 'description', 'price', 'file', 'category', 'is_active']

    def validate_title(self, value):
        # Убираем кавычки из названия при создании/редактировании
        return value.replace('"', '').replace("'", '').strip()


class CommentSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = Comment
        fields = ['id', 'product', 'username', 'text', 'created_at']
        read_only_fields = ['id', 'username', 'created_at']
