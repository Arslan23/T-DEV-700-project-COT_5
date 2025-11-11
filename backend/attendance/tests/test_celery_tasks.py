from django.test import TestCase
from django.utils import timezone

from freezegun import freeze_time

from attendance.models import Attendance
from attendance.tasks import create_daily_attendance_records
from users.models import User


@freeze_time("2025-10-21 00:00:00")
class AttendanceTasksTests(TestCase):
    """Tests for the create_daily_attendance_records Celery task."""

    def setUp(self):
        # Active user
        self.active_user = User.objects.create_user(
            email="active@example.com", password="pass", is_active=True
        )
        # Inactive user
        self.inactive_user = User.objects.create_user(
            email="inactive@example.com", password="pass"
        )

    def test_celery_task_creates_attendances_for_active_users_only(self):
        """Task should create attendance records for active users only."""

        today = timezone.localdate()

        # Run task
        result = create_daily_attendance_records()

        # Check that attendance exists for active user
        self.assertTrue(
            Attendance.objects.filter(user=self.active_user, day=today).exists()
        )

        # Ensure no attendance created for inactive user
        self.assertFalse(
            Attendance.objects.filter(user=self.inactive_user, day=today).exists()
        )

        # Check the result message contains correct info
        self.assertIn("Attendance task finished: 1 created", result)

    def test_celery_task_runs_without_errors_and_returns_message(self):
        """Task should return a string message and not raise exceptions."""

        result = create_daily_attendance_records()
        self.assertIsInstance(result, str)
        self.assertIn("Attendance task finished: 1 created", result)
