from django.conf import settings
from django.utils import timezone
from django.urls import reverse

from freezegun import freeze_time

from attendance.models import Attendance
from rest_framework import status

from users.tests import BaseTestCase

CHECK_IN_START_HOUR = settings.CHECK_IN_START_HOUR
CHECK_OUT_START_HOUR = settings.CHECK_OUT_START_HOUR

VALID_CLOCK_IN_TIME = f"2025-10-21 {CHECK_IN_START_HOUR}:00:00"
VALID_CLOCK_OUT_TIME = f"2025-10-21 {CHECK_OUT_START_HOUR}:00:00"


class AttendanceClocksTests(BaseTestCase):
    """
    Test suite for AttendanceClocksView and AttendanceClocksSerializer.
    """

    def setUp(self):
        super().setUp()
        self.clocks_url = reverse("clocks")

    def test_unauthenticated_user_cannot_clock(self):
        """Ensure unauthenticated users cannot access the clocks endpoint"""

        response = self.client.post(self.clocks_url, {"is_check_in_action": True})
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    @freeze_time(VALID_CLOCK_IN_TIME)
    def test_authenticated_user_can_check_in(self):
        """Ensure authenticated user can successfully check in"""

        self.client.force_authenticate(user=self.employee)
        response = self.client.post(self.clocks_url, {"is_check_in_action": True})
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        # Check message and data consistency
        data = response.json()

        self.assertIn("message", data)
        self.assertIn("attendance", data)
        self.assertIsNotNone(data["attendance"]["check_in"])
        self.assertIsNone(data["attendance"]["check_out"])
        self.assertEqual(data["message"], "Check-in time successfully recorded.")
        self.assertTrue(data["is_check_in_action"])

        # Database check
        attendance = Attendance.objects.get(
            user=self.employee, day=timezone.now().date()
        )
        self.assertIsNotNone(attendance.check_in)
        self.assertIsNone(attendance.check_out)

    @freeze_time(VALID_CLOCK_IN_TIME)
    def test_user_cannot_check_in_twice(self):
        """Ensure a user cannot perform multiple check-ins for the same day"""

        self.client.force_authenticate(user=self.employee)
        self.client.post(self.clocks_url, {"is_check_in_action": True})  # first OK
        response = self.client.post(
            self.clocks_url, {"is_check_in_action": True}
        )  # second KO

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("Check-in has already been recorded", str(response.data))

    def test_user_cannot_check_out_without_check_in(self):
        """Ensure user cannot check out before checking in"""
        self.client.force_authenticate(user=self.employee)
        response = self.client.post(self.clocks_url, {"is_check_in_action": False})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("must check in before checking out", str(response.data).lower())

    @freeze_time(VALID_CLOCK_OUT_TIME)
    def test_authenticated_user_can_check_out(self):
        """Ensure user can check out successfully after a valid check-in"""

        time_now = timezone.now()
        today = time_now.date()

        # Manual attendance creation to simulate prior check-in
        Attendance.objects.get_or_create(
            user=self.employee, day=today, check_in=time_now
        )

        # Check-out action
        self.client.force_authenticate(user=self.employee)

        response = self.client.post(self.clocks_url, {"is_check_in_action": False})

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        data = response.json()
        self.assertIsNotNone(data["attendance"]["check_out"])
        self.assertEqual(data["message"], "Check-out time successfully recorded.")
        self.assertFalse(data["is_check_in_action"])

        # Database verification
        attendance = Attendance.objects.get(user=self.employee, day=today)
        self.assertIsNotNone(attendance.check_out)

    @freeze_time(VALID_CLOCK_OUT_TIME)
    def test_user_cannot_check_out_twice(self):
        """Ensure user cannot perform multiple check-outs in one day"""

        time_now = timezone.now()
        today = time_now.date()

        # Manual attendance creation to simulate prior check-in
        Attendance.objects.get_or_create(
            user=self.employee, day=today, check_in=time_now
        )

        # Check-out action
        self.client.force_authenticate(user=self.employee)

        # first check-out
        self.client.post(self.clocks_url, {"is_check_in_action": False})

        # second check-out
        response = self.client.post(self.clocks_url, {"is_check_in_action": False})

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("Check-out has already been recorded", str(response.data))

    def test_user_cannot_check_out_without_a_previous_check_in(self):
        """Ensure user cannot check out without a prior check-in"""

        self.client.force_authenticate(user=self.employee)
        response = self.client.post(self.clocks_url, {"is_check_in_action": False})

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("must check in before checking out", str(response.data).lower())

    @freeze_time(VALID_CLOCK_IN_TIME)
    def test_new_attendance_created_when_missing(self):
        """
        If a cron job hasn't pre-created attendance,
        ensure a new record is created automatically on first clock.
        """

        self.client.force_authenticate(user=self.employee)
        Attendance.objects.filter(user=self.employee).delete()

        response = self.client.post(self.clocks_url, {"is_check_in_action": True})
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        attendance_exists = Attendance.objects.filter(
            user=self.employee, day=timezone.now().date()
        ).exists()
        self.assertTrue(attendance_exists)

    @freeze_time(VALID_CLOCK_IN_TIME)
    def test_admin_can_clock_too(self):
        """Admins can also perform attendance actions"""

        self.client.force_authenticate(user=self.admin)
        response = self.client.post(self.clocks_url, {"is_check_in_action": True})

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn("Check-in time successfully recorded", response.json()["message"])

    # NOTE : add unit tests attempting to clock in and clock out in invalid time range
    # NOTE : add unit tests attempting to clock in and clock out to fare from the company location
