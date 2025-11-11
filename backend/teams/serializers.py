# teams - serializers.py
from rest_framework import serializers
from .models import Team
from users.models import User


class UserMinimalSerializer(serializers.ModelSerializer):
    """Minimal user representation for nested serialization."""

    class Meta:
        model = User
        fields = ["id", "email", "firstname", "lastname", "fullname"]
        read_only_fields = ["id", "email", "firstname", "lastname", "fullname"]


class TeamListSerializer(serializers.ModelSerializer):
    """Serializer for team list view with minimal data."""

    manager_name = serializers.ReadOnlyField()
    member_count = serializers.ReadOnlyField()

    class Meta:
        model = Team
        fields = [
            "id",
            "name",
            "description",
            "manager",
            "manager_name",
            "member_count",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "created_at",
            "updated_at",
            "manager_name",
            "member_count",
        ]


class TeamDetailSerializer(serializers.ModelSerializer):
    """Serializer for team detail view with nested relations."""

    manager_detail = UserMinimalSerializer(source="manager", read_only=True)
    members_detail = UserMinimalSerializer(source="members", many=True, read_only=True)
    member_count = serializers.ReadOnlyField()

    class Meta:
        model = Team
        fields = [
            "id",
            "name",
            "description",
            "manager",
            "manager_detail",
            "members",
            "members_detail",
            "member_count",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "created_at",
            "updated_at",
            "manager_detail",
            "members_detail",
            "member_count",
        ]

    def validate_manager(self, value):
        """Validate that the manager has the manager role."""
        if value and not value.is_manager_or_company_admin:
            raise serializers.ValidationError(
                "The selected user does not have the manager role."
            )
        return value

    def validate_members(self, value):
        """Validate that regular users can only be in one team."""
        request = self.context.get("request")
        if not request:
            return value

        for member in value:
            # Admin and managers can be in multiple teams
            if member.is_manager_or_company_admin:
                continue

            # Check if user is already in another team (excluding current team being updated)
            existing_teams = member.teams.exclude(
                id=self.instance.id if self.instance else None
            )
            if existing_teams.exists():
                raise serializers.ValidationError(
                    f"User {member.email} is already in another team. "
                    f"Only admins and managers can be in multiple teams."
                )

        return value

    def validate(self, attrs):
        """Cross-field validation."""
        manager = attrs.get("manager")
        members = attrs.get("members", [])

        # Ensure manager is also in members if manager is set
        if manager and manager not in members:
            members.append(manager)
            attrs["members"] = members

        return attrs


class TeamSerializer(TeamDetailSerializer):
    """Main team serializer (alias for backward compatibility)."""

    pass
