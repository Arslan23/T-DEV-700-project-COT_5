# users - views.py
import logging

from rest_framework import generics, status
from rest_framework.response import Response
from users.models import User
from users.permissions import IsManagerOrCompanyAdmin
from users.serializers import RegisterSerializer

logger = logging.getLogger(__name__)


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [IsManagerOrCompanyAdmin]

    def create(self, request, *args, **kwargs):
        logger.info(f"User registration attempt by {request.user.email}")

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        logger.info(
            f"User {user.email} registered successfully by {request.user.email}"
        )

        return Response(
            {
                "user": RegisterSerializer(user).data,
            },
            status=status.HTTP_201_CREATED,
        )
