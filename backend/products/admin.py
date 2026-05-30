from django.contrib import admin
from .models import Category, Comment, Favorite, Product


@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ('id', 'product', 'user', 'created_at')
    search_fields = ('text', 'user__username', 'product__title')


@admin.register(Favorite)
class FavoriteAdmin(admin.ModelAdmin):
    list_display = ('id', 'product', 'user', 'created_at')


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'slug')
    search_fields = ('title',)
    prepopulated_fields = {'slug': ('title',)}


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'price', 'get_category', 'author', 'is_active', 'downloads')
    list_display_links = ('id', 'title')
    search_fields = ('title', 'description')
    list_editable = ('is_active',)
    list_filter = ('is_active', 'author')
    prepopulated_fields = {'slug': ('title',)}

    def get_category(self, obj):
        return obj.category.title

    get_category.short_description = 'Категория'
