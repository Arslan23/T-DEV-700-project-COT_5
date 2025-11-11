# users - serializers.py
import logging

from django.contrib.auth import authenticate
from django.utils.translation import gettext_lazy as _


from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken

from users.models import LoginOTP
from users.serializers.register import RegisterSerializer
from users.utils import generate_and_send_otp

logger = logging.getLogger(__name__)


class LoginInitSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        request = self.context.get("request")
        email = attrs.get("email")
        password = attrs.get("password")

        logger.info(f"Login attempt for {email}")

        user = authenticate(request, email=email, password=password)
        if not user:
            logger.warning(f"Failed login for {email}: invalid credentials")
            raise serializers.ValidationError({"detail": _("Invalid credentials.")})

        attrs["user"] = user
        return attrs

    def create(self, validated_data):
        user = validated_data["user"]
        otp = generate_and_send_otp(user)

        logger.info(f"OTP sent to {user.email} (session_token={otp.session_token})")

        return {
            "detail": _("OTP sent to your email."),
            "session_token": str(otp.session_token),
        }


class LoginVerifySerializer(serializers.Serializer):
    email = serializers.EmailField()
    otp = serializers.CharField(max_length=6)
    session_token = serializers.UUIDField()

    def validate(self, attrs):
        email = attrs.get("email")
        otp_code = attrs.get("otp")
        session_token = attrs.get("session_token")

        try:
            otp = LoginOTP.objects.select_related("user").get(
                user__email=email, session_token=session_token
            )
        except LoginOTP.DoesNotExist:
            raise serializers.ValidationError({"detail": _("Invalid session.")})

        if not otp.is_valid():
            raise serializers.ValidationError(
                {"detail": _("OTP expired or already used.")}
            )

        if otp.code != otp_code:
            raise serializers.ValidationError({"detail": _("Incorrect OTP.")})

        attrs["otp"] = otp
        return attrs

    def create(self, validated_data):
        otp = validated_data["otp"]
        otp.is_used = True
        otp.save()

        refresh = RefreshToken.for_user(otp.user)

        if not otp.user.is_active:
            otp.user.is_active = True
            otp.user.save()

        logger.info(f"Login success for {otp.user.email} via OTP")

        return {
            "user": RegisterSerializer(otp.user).data,
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "detail": _("Login successful."),
        }
