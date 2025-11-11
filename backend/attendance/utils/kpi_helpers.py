# attendance/utils/kpi_helpers.py
from datetime import timedelta
from django.utils import timezone
#from django.utils.translation import gettext_lazy as _

from attendance.constants import PeriodicityChoices, AttendanceStatusChoices
from attendance.models import Attendance
from django.db.models import Sum


def get_period_range(periodicity: str):
    """
    Returns a tuple (filter_start, filter_end) for the given periodicity.
    - filter_start: first day of the week/month/year
    - filter_end: current datetime
    """
    now = timezone.now()

    if periodicity == PeriodicityChoices.WEEKLY.value:
        # ISO weekday: Monday=1, Sunday=7
        filter_start = now - timedelta(days=now.isoweekday() - 1)
        filter_start = filter_start.replace(hour=0, minute=0, second=0, microsecond=0)

    elif periodicity == PeriodicityChoices.MONTHLY.value:
        filter_start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)

    elif periodicity == PeriodicityChoices.YEARLY.value:
        filter_start = now.replace(month=1, day=1, hour=0, minute=0, second=0, microsecond=0)

    else:
        raise ValueError("Invalid periodicity (must be weekly, monthly, or yearly)")

    return filter_start, now


def compute_user_kpis(user, periodicity: str):
    filter_start, filter_end = get_period_range(periodicity)

    attendances = (
        Attendance.objects.with_extra_seconds()
        .with_delay_seconds()
        .with_status()
        .filter(user=user, day__range=(filter_start, filter_end))
    )

    total_days = attendances.count() or 1
    delays = attendances.filter(delay_seconds__gt=0)
    additional_hours = attendances.filter(extra_seconds__gt=0)
    absences = attendances.filter(status=AttendanceStatusChoices.ABSENT.value)

    return {
        "delays": {
            "rate": round((delays.count() / total_days) * 100, 2),
            "hours": delays.aggregate(Sum("delay_seconds"))["delay_seconds__sum"] or 0,
        },
        "additional_hours": {
            "rate": round((additional_hours.count() / total_days) * 100, 2),
            "hours": additional_hours.aggregate(Sum("extra_seconds"))[
                "extra_seconds__sum"
            ]
            or 0,
        },
        "absences": {
            "total": absences.count(),
        },
    }


def compute_work_hours(user, periodicity: str):
    filter_start, filter_end = get_period_range(periodicity)
    attendances = Attendance.objects.with_worked_seconds().filter(
        user=user, day__range=(filter_start, filter_end)
    )

    data = {}
    for a in attendances:
        worked_hours = a.worked_seconds / 3600
        key = a.day.strftime("%Y-%m-%d")
        data[key] = worked_hours

    return {"user": user.id, "periodicity": periodicity, "hours_per_day": data}


def compute_team_kpis(team, periodicity: str):
    """
    Aggregate KPIs for all team members combined.
    """
    filter_start, filter_end = get_period_range(periodicity)
    attendances = Attendance.objects.filter(user__team=team, day__range=(filter_start, filter_end))

    total_days = attendances.count() or 1
    delays = attendances.filter(delay_seconds__gt=0)
    additional_hours = attendances.filter(extra_seconds__gt=0)
    absences = attendances.filter(status="ABSENT")

    return {
        "team": team.id,
        "team_name": team.name,
        "members_count": team.members.count(),
        "delays": {
            "rate": round((delays.count() / total_days) * 100, 2),
            "hours": delays.aggregate(Sum("delay_seconds"))["delay_seconds__sum"] or 0,
        },
        "additional_hours": {
            "rate": round((additional_hours.count() / total_days) * 100, 2),
            "hours": additional_hours.aggregate(Sum("extra_seconds"))[
                "extra_seconds__sum"
            ]
            or 0,
        },
        "absence": {"total": absences.count()},
    }


def get_best_performers(periodicity: str, count=3, team=None):
    """
    Returns top performers based on worked hours.
    If a team is provided, restricts to that team.
    """
    filter_start, filter_end = get_period_range(periodicity)

    filters = {"day__range": (filter_start, filter_end)}
    if team:
        filters["user__team"] = team

    attendances = (
        Attendance.objects.with_worked_seconds()
        .filter(**filters)
        .values("user")
        .annotate(total_worked_seconds=Sum("worked_seconds"))
        .order_by("-total_worked_seconds")[:count]
    )

    return list(attendances)
