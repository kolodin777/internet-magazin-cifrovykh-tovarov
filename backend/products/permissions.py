from rest_framework import permissions


class IsAdminOrReadOnly(permissions.BasePermission):
    """Разрешение: только администраторы могут создавать/редактировать/удалять товары"""

    def has_permission(self, request, view):
        # Чтение (GET) доступно всем
        if request.method in permissions.SAFE_METHODS:
            return True

        return request.user and request.user.is_staff