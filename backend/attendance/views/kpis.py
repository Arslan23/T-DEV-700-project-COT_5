# attendance/views/kpis.py
from rest_framework import generics
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from attendance.constants import PeriodicityChoices
from attendance.serializers import BestPerformersSerializer
from attendance.utils.kpi_helpers import (
    compute_user_kpis,
    compute_team_kpis,
    compute_work_hours,
    get_best_performers,
)
from users.permissions import IsCompanyAdmin, IsSelfOrManagerOrCompanyAdmin
from teams.models import Team

User = get_user_model()


class UserKPIsView(generics.GenericAPIView):
    """
    GET /api/kpis/<user_id>/?periodicity=monthly
    Returns KPI metrics for a specific user.
    """

    permission_classes = [IsSelfOrManagerOrCompanyAdmin]

    def get(self, request, user_id):
        periodicity = request.query_params.get(
            "periodicity", PeriodicityChoices.MONTHLY.value
        )
        user = User.objects.get(id=user_id)
        data = compute_user_kpis(user, periodicity)
        return Response(data)


class UserWorkHoursView(generics.GenericAPIView):
    """
    GET /api/workhours/<user_id>/?periodicity=weekly
    Returns total worked hours per day/month for graphs.
    """

    permission_classes = [IsSelfOrManagerOrCompanyAdmin]

    def get(self, request, user_id):
        periodicity = request.query_params.get(
            "periodicity", PeriodicityChoices.WEEKLY.value
        )
        user = User.objects.get(id=user_id)
        data = compute_work_hours(user, periodicity)
        return Response(data)


class BestPerformersView(generics.GenericAPIView):
    """
    GET /api/best-performers/?periodicity=monthly&count=3
    Returns top N best performers based on worked hours.
    """

    permission_classes = [IsCompanyAdmin]
    serializer_class = BestPerformersSerializer
    queryset = []

    def get(self, request):
        serializer = self.get_serializer(data=request.query_params)
        serializer.is_valid(raise_exception=True)

        data = serializer.to_representation(instance=None)
        return Response(data)


class TeamKPIsView(generics.GenericAPIView):
    """
    GET /api/teams/<team_id>/kpis/?periodicity=monthly
    Returns KPI metrics aggregated for a given team.
    """

    permission_classes = [IsCompanyAdmin]

    def get(self, request, team_id):
        periodicity = request.query_params.get("periodicity", "monthly")
        team = Team.objects.get(id=team_id)
        data = compute_team_kpis(team, periodicity)
        return Response(data)


class TeamBestPerformersView(generics.GenericAPIView):
    """
    GET /api/teams/<team_id>/best-performers/?periodicity=monthly&count=3
    Returns best performers (top N) within a team.
    """

    permission_classes = [IsCompanyAdmin]

    def get(self, request, team_id):
        periodicity = request.query_params.get("periodicity", "monthly")
        count = int(request.query_params.get("count", 3))
        team = Team.objects.get(id=team_id)
        data = get_best_performers(team, periodicity, count)
        return Response(data)
