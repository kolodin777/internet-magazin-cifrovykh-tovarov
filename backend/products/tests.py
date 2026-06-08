from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from .models import Category, Comment, Favorite, Product


class ProductInteractionTests(APITestCase):
    def setUp(self):
        self.user = get_user_model().objects.create_user(username='buyer', password='test-password')
        self.other_user = get_user_model().objects.create_user(username='other', password='test-password')
        self.category = Category.objects.create(title='Design', slug='design')
        self.product = Product.objects.create(
            title='UI kit',
            slug='ui-kit',
            description='Components',
            category=self.category,
            price='990.00',
            author=self.other_user,
        )

    def test_authenticated_user_can_toggle_favorite(self):
        self.client.force_authenticate(self.user)
        url = reverse('product-favorite', args=[self.product.id])

        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['is_favorite'])
        self.assertTrue(Favorite.objects.filter(user=self.user, product=self.product).exists())

        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertFalse(response.data['is_favorite'])
        self.assertFalse(Favorite.objects.filter(user=self.user, product=self.product).exists())

    def test_comment_api_assigns_authenticated_user(self):
        self.client.force_authenticate(self.user)
        response = self.client.post(
            reverse('comment-list'),
            {'product': self.product.id, 'text': 'Useful product'},
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        comment = Comment.objects.get()
        self.assertEqual(comment.user, self.user)
        self.assertEqual(response.data['username'], self.user.username)

    def test_only_comment_owner_or_admin_can_delete(self):
        comment = Comment.objects.create(product=self.product, user=self.other_user, text='Protected')
        self.client.force_authenticate(self.user)

        response = self.client.delete(reverse('comment-detail', args=[comment.id]))

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertTrue(Comment.objects.filter(id=comment.id).exists())

    def test_product_response_contains_interaction_state(self):
        Favorite.objects.create(user=self.user, product=self.product)
        Comment.objects.create(product=self.product, user=self.other_user, text='One')
        self.client.force_authenticate(self.user)

        response = self.client.get(reverse('product-detail', args=[self.product.id]))

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['is_favorite'])
        self.assertEqual(response.data['favorite_count'], 1)
        self.assertEqual(response.data['comment_count'], 1)
