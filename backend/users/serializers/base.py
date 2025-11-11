# users - serializers.py
import logging

from django.contrib.auth.models import Group
from django.utils.translation import gettext_lazy as _


from rest_framework import serializers

from users.models import User
from users.constants import UserGroupChoices

logger = logging.getLogger(__name__)


class BaseUserSerializer(serializers.ModelSerializer):
    role = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            "id",
            "email",
            "firstname",
            "lastname",
            "phone_number",
            "role",
            "groups",
            "is_active",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "role",
            "created_at",
            "updated_at",
            "is_active",
        ]

    def get_role(self, obj):
        if obj.groups.exists():
            return obj.groups.first().name
        return


class UserCreateSerializer(BaseUserSerializer):
    def create(self, validated_data):
        groups = validated_data.pop("groups", None)
        if not groups:
            groups = [Group.objects.get(name=UserGroupChoices.EMPLOYEE)]

        user = User(**validated_data)
        user.save()
        user.groups.set(groups)
        return user


class UserUpdateSerializer(BaseUserSerializer):
    """Allows updating user info and groups"""

    class Meta(BaseUserSerializer.Meta):
        read_only_fields = ["email"] + [
            field for field in BaseUserSerializer.Meta.read_only_fields
        ]

    def update(self, instance, validated_data):
        request = self.context["request"]

        groups = validated_data.pop("groups", None)
        user = super().update(instance, validated_data)

        if groups and not request.user.is_manager_or_company_admin:
            raise serializers.ValidationError(
                {"groups": _("You do not have permission to change groups.")}
            )

        if not groups:
            groups = [Group.objects.get(name=UserGroupChoices.EMPLOYEE)]

        user.groups.set(groups)
        return user


class UserListSerializer(BaseUserSerializer):
    """Read only, no password"""

    class Meta(BaseUserSerializer.Meta):
        fields = [
            field for field in BaseUserSerializer.Meta.fields if field != "groups"
        ]
