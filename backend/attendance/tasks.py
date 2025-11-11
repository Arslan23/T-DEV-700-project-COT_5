# attendance/tasks.py
import logging
from celery import shared_task
from django.utils import timezone
from .models import Attendance

from users.models import User

logger = logging.getLogger(__name__)


@shared_task(bind=True)
def create_daily_attendance_records(self):
    """
    Create an attendance record for each active user for today.
    """

    today = timezone.localdate()
    weekday = today.weekday()  # 0 = Monday, 6 = Sunday

    if weekday > 4:  # Skip Saturday and Sunday
        logging.warning(f"Skipping attendance creation on weekend: {today}")
        return f"No attendance created, today is weekend ({today})"

    logging.info(f"Running create_daily_attendance_records task for {today}")

    active_users = User.objects.filter(is_active=True)
    existing_attendances = Attendance.objects.filter(user__in=active_users, day=today)
    existing_user_ids = set(existing_attendances.values_list("user_id", flat=True))

    to_create = [
        Attendance(user=user, day=today)
        for user in active_users
        if user.id not in existing_user_ids
    ]

    Attendance.objects.bulk_create(to_create)

    created_count = len(to_create)
    if created_count:
        logging.info(f"Created {created_count} attendance records for {today}")
    else:
        logging.warning(f"Attendance records already existed for all users on {today}")

    return f"Attendance task finished: {created_count} created"
