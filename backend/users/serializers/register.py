# users - serializers/register.py
import logging

from django.contrib.auth.models import Group
from django.utils.translation import gettext_lazy as _


from rest_framework import serializers

from users.models import User
from users.constants import UserGroupChoices

logger = logging.getLogger(__name__)


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True, required=True, style={"input_type": "password"}
    )
    password_confirm = serializers.CharField(
        write_only=True, required=True, style={"input_type": "password"}
    )

    class Meta:
        model = User
        fields = [
            "id",
            "email",
            "password",
            "password_confirm",
            "firstname",
            "lastname",
            "phone_number",
            "groups",
        ]
        read_only_fields = [
            "id",
        ]

    def validate(self, data):
        request = self.context["request"]

        logger.info(f"Validating registration data from user {request.user.email}")

        groups = data.pop("groups", None)
        employee_group = Group.objects.get(name=UserGroupChoices.EMPLOYEE)

        if not groups:
            groups = [employee_group]

        # Ensure a manager can only create an employee
        if request.user.is_manager and (
            len(groups) != 1 or groups[0] != employee_group
        ):
            logger.warning(
                f"Manager {request.user.email} attempted to assign invalid groups during user registration."
            )
            raise serializers.ValidationError(
                {"groups": _("Managers can only assign the Employee group.")}
            )

        # Check password confirmation
        if data["password"] != data["password_confirm"]:
            raise serializers.ValidationError(_("The password fields didn't match."))

        data["groups"] = groups
        return data

    def create(self, validated_data):
        request = self.context["request"]

        validated_data.pop("password_confirm")
        password = validated_data.pop("password")

        groups = validated_data.pop("groups", None)

        # Create user
        user = User.objects.create_user(password=password, **validated_data)
        user.groups.set(groups)

        logger.info(
            f"{request.user.email} successfully registered new user: {user.email} with groups {[g.name for g in groups]}"
        )

        return user
