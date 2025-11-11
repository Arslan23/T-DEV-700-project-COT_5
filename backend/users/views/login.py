# users/views/login_verify.py
import logging

from rest_framework import generics, status
from rest_framework.response import Response
from users.serializers import LoginInitSerializer, LoginVerifySerializer


logger = logging.getLogger(__name__)


class LoginInitView(generics.GenericAPIView):
    serializer_class = LoginInitSerializer
    permission_classes = []
    authentication_classes = []

    def post(self, request):
        serializer = self.get_serializer(
            data=request.data, context={"request": request}
        )
        serializer.is_valid(raise_exception=True)
        data = serializer.save()
        return Response(data, status=status.HTTP_200_OK)


class LoginVerifyView(generics.GenericAPIView):
    serializer_class = LoginVerifySerializer
    permission_classes = []
    authentication_classes = []

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.save()
        return Response(data, status=status.HTTP_200_OK)
