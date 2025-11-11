# teams - views.py
from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q

from .models import Team
from .serializers import TeamListSerializer, TeamDetailSerializer
from .permissions import IsAdminOrManagerReadOnly, IsTeamManagerOrAdmin


class TeamViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Team management with granular permissions.

    Permissions:
    - Admin: Full CRUD access
    - Manager: Read + Update (no create/delete)
    - Employee: Read only their teams
    """

    permission_classes = [IsAdminOrManagerReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["name", "description"]
    ordering_fields = ["name", "created_at", "updated_at"]
    ordering = ["-created_at"]

    def get_queryset(self):
        """Optimize queries and filter based on user role."""
        queryset = Team.objects

        user = self.request.user
        if not user or not user.is_authenticated:
            return queryset.none()

        # Admin sees all teams
        if user.is_company_admin:
            return queryset

        # Manager sees teams they manage or are member of
        if user.is_manager:
            return queryset.filter(Q(manager=user) | Q(members=user)).distinct()

        # Employees see only teams they are member of
        return queryset.filter(members=user).distinct()

    def get_serializer_class(self):
        """Use different serializers for list vs detail views."""
        if self.action == "list":
            return TeamListSerializer
        return TeamDetailSerializer

    @action(detail=False, methods=["get"])
    def my_teams(self, request):
        """Get all teams where the current user is a member."""
        teams = self.get_queryset().filter(members=request.user)
        serializer = TeamListSerializer(teams, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=["get"])
    def managed_teams(self, request):
        """Get all teams managed by the current user."""
        if not request.user.is_manager and not request.user.is_company_admin:
            return Response(
                {"detail": "Only managers can access this endpoint."},
                status=status.HTTP_403_FORBIDDEN,
            )

        teams = self.get_queryset().filter(manager=request.user)
        serializer = TeamListSerializer(teams, many=True)
        return Response(serializer.data)

    @action(
        detail=True,
        methods=["post"],
        permission_classes=[IsTeamManagerOrAdmin],
    )
    def add_member(self, request, pk=None):
        """Add a member to the team."""
        # NOTE : Customize this serializer. It should'nt expose fields name and description
        team = self.get_object()
        user_id = request.data.get("user_id")

        if not user_id:
            return Response(
                {"detail": "user_id is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            from users.models import User

            user = User.objects.get(id=user_id)

            # Check if user can be in multiple teams
            if not (user.is_company_admin or user.is_manager):
                if user.teams.exists():
                    return Response(
                        {
                            "detail": f"User {user.email} is already in another team. "
                            "Only admins and managers can be in multiple teams."
                        },
                        status=status.HTTP_400_BAD_REQUEST,
                    )

            team.members.add(user)
            serializer = TeamDetailSerializer(team)
            return Response(serializer.data)

        except User.DoesNotExist:
            return Response(
                {"detail": "User not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

    @action(
        detail=True,
        methods=["post"],
        permission_classes=[IsTeamManagerOrAdmin],
    )
    def remove_member(self, request, pk=None):
        """Remove a member from the team."""
        team = self.get_object()
        user_id = request.data.get("user_id")

        if not user_id:
            return Response(
                {"detail": "user_id is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            from users.models import User

            user = User.objects.get(id=user_id)

            # Prevent removing the manager
            if team.manager == user:
                return Response(
                    {"detail": "Cannot remove the team manager from the team."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            team.members.remove(user)
            serializer = TeamDetailSerializer(team)
            return Response(serializer.data)

        except User.DoesNotExist:
            return Response(
                {"detail": "User not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

    @action(detail=True, methods=["get"])
    def members(self, request, pk=None):
        """Get detailed list of team members."""
        team = self.get_object()
        from .serializers import UserMinimalSerializer

        members = team.members.all()
        serializer = UserMinimalSerializer(members, many=True)
        return Response(serializer.data)
