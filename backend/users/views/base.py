# users - views.py
from django.utils.translation import gettext_lazy as _

from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from users.models import User
from users.permissions import UsersRoleBasedPermission
from users.serializers import (
    UserCreateSerializer,
    UserUpdateSerializer,
    UserListSerializer,
)


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    permission_classes = [UsersRoleBasedPermission]

    def get_serializer_class(self):
        """Serializer spécifique par action"""
        if self.action == "create":
            return UserCreateSerializer
        elif self.action in ["update", "partial_update"]:
            return UserUpdateSerializer
        return UserListSerializer

    @action(
        detail=False, methods=["get"], permission_classes=[permissions.IsAuthenticated]
    )
    def me(self, request):
        """Return current logged-in user"""
        if not request.user or request.user.is_anonymous:
            return Response(
                {"detail": _("Authentication credentials were not provided.")},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        serializer = self.get_serializer(request.user)
        return Response(serializer.data)

    # @action(detail=True, methods=["post"], permission_classes=[permissions.IsAuthenticated])
    # def reset_password(self, request, pk=None):
    #     user = self.get_object()
    #     password = request.data.get("password")
    #     user.set_password(password)
    #     user.save()
    #     return Response({"status": "password set"}, status=200)
