from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import (
    AttendanceClocksView,
    AttendanceViewSet,
    UserKPIsView,
    UserWorkHoursView,
    BestPerformersView,
    TeamKPIsView,
    TeamBestPerformersView,
)

router = DefaultRouter()
router.register(r"attendance", AttendanceViewSet, basename="attendance")

urlpatterns = [
    # NOTE : do not expose attendance CRUD endpoints
    # path("", include(router.urls)),
    path("clocks/", AttendanceClocksView.as_view(), name="clocks"),
    # KPIS
    path("kpis/users/<str:user_id>/", UserKPIsView.as_view(), name="user_kpis"),
    path(
        "kpis/workhours/<str:user_id>/",
        UserWorkHoursView.as_view(),
        name="user_workhours",
    ),
    path("kpis/best-performers/", BestPerformersView.as_view(), name="best_performers"),
    path("kpis/teams/<str:team_id>/", TeamKPIsView.as_view(), name="team_kpis"),
    path(
        "kpis/teams/<str:team_id>/best-performers/",
        TeamBestPerformersView.as_view(),
        name="team_best_performers",
    ),
]
