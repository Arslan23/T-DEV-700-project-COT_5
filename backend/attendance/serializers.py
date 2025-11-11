# attendance - serializers.py
from django.conf import settings
from django.utils import timezone
from django.utils.translation import gettext_lazy as _

from rest_framework import serializers
from attendance.constants import PeriodicityChoices
from attendance.models import Attendance
from attendance.utils.base import get_distance_m
from attendance.utils.kpi_helpers import get_best_performers

from users.models import User
from users.serializers import UserUpdateSerializer

import logging


logger = logging.getLogger(__name__)

CHECK_IN_START_HOUR = settings.CHECK_IN_START_HOUR
CHECK_IN_END_HOUR = settings.CHECK_IN_END_HOUR
CHECK_OUT_START_HOUR = settings.CHECK_OUT_START_HOUR
CHECK_OUT_END_HOUR = settings.CHECK_OUT_END_HOUR

COMPANY_LATITUDE = settings.COMPANY_LATITUDE
COMPANY_LONGITUDE = settings.COMPANY_LONGITUDE
ATTENDANCE_LOCATION_RADIUS = settings.ATTENDANCE_LOCATION_RADIUS


class AttendanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Attendance
        fields = ["id", "day", "user", "check_in", "check_out", "created_at"]
        read_only_fields = ["id", "day", "created_at"]


class AttendanceClocksSerializer(serializers.ModelSerializer):
    """
    Serializer used for clock-in / clock-out actions.
    """

    is_check_in_action = serializers.BooleanField(
        write_only=True,
        required=True,
        help_text="True for check-in, False for check-out",
    )

    latitude = serializers.FloatField(write_only=True, required=False)
    longitude = serializers.FloatField(write_only=True, required=False)

    class Meta:
        model = Attendance
        fields = AttendanceSerializer.Meta.fields + [
            "is_check_in_action",
            "latitude",
            "longitude",
        ]
        read_only_fields = ["id", "user", "day", "created_at", "check_in", "check_out"]

    def validate(self, attrs):
        user = self.context["request"].user
        now = timezone.localtime()
        today = now.date()
        current_hour = now.hour

        attendance, creation = Attendance.objects.get_or_create(user=user, day=today)

        if creation:
            logging.warning(
                f"A new attendance was just created for user {user.email} on {today} "
                "— but it should have already existed if the cron job was running properly."
            )

        is_check_in_action = attrs["is_check_in_action"]

        # Determine action validity (hour, order, duplication)
        if is_check_in_action:
            if attendance.check_in:
                raise serializers.ValidationError(
                    _("Check-in has already been recorded for today.")
                )
            if not (CHECK_IN_START_HOUR <= current_hour <= CHECK_IN_END_HOUR):
                raise serializers.ValidationError(
                    _(
                        "Check-in is only allowed between"
                        f"{CHECK_IN_START_HOUR}:00 and {CHECK_IN_END_HOUR}:00."
                    )
                )
        else:
            if not attendance.check_in:
                raise serializers.ValidationError(
                    _("You must check in before checking out.")
                )
            if attendance.check_out:
                raise serializers.ValidationError(
                    _("Check-out has already been recorded for today.")
                )
            if not (CHECK_OUT_START_HOUR <= current_hour <= CHECK_OUT_END_HOUR):
                raise serializers.ValidationError(
                    _(
                        "Check-out is only allowed between "
                        f"{CHECK_OUT_START_HOUR}:00 and {CHECK_OUT_END_HOUR}:00."
                    )
                )

        # Validate location if provided
        if "latitude" in attrs and "longitude" in attrs:
            distance_to_company = get_distance_m(
                attrs["latitude"],
                attrs["longitude"],
                COMPANY_LATITUDE,
                COMPANY_LONGITUDE,
            )
            if distance_to_company > ATTENDANCE_LOCATION_RADIUS:
                raise serializers.ValidationError(
                    _(
                        "You are too far from the company location to perform this action."
                    )
                )

        attrs["attendance"] = attendance
        return attrs

    def create(self, validated_data):
        attendance = validated_data["attendance"]
        is_check_in_action = validated_data["is_check_in_action"]

        if is_check_in_action:
            attendance.check_in = timezone.now()
            message = _("Check-in time successfully recorded.")
        else:
            attendance.check_out = timezone.now()
            message = _("Check-out time successfully recorded.")

        attendance.save()
        self.context["message"] = message
        self.context["is_check_in_action"] = is_check_in_action
        return attendance

    def to_representation(self, instance):
        """
        Customizes the response to include the success message
        and attendance data in one JSON object.
        """
        data = super().to_representation(instance)
        return {
            "message": self.context.get("message", ""),
            "is_check_in_action": self.context.get("is_check_in_action", ""),
            "attendance": data,
        }


class BestPerformersSerializer(serializers.Serializer):
    """
    Serializer that handles:
    1. Input validation of query parameters (periodicity and count)
    2. Fetching top performers using get_best_performers()
    3. Formatting the output in a consistent structure:
       {
           "user": <serialized user>,
           "total_worked_seconds": <float>
       }
    """

    periodicity = serializers.ChoiceField(
        choices=PeriodicityChoices,
        default=PeriodicityChoices.MONTHLY.value,
        required=False,
        help_text=_("Time period over which to aggregate worked hours."),
    )
    count = serializers.IntegerField(
        default=3,
        min_value=1,
        max_value=10,
        required=False,
        help_text=_("Number of top performers to return."),
    )

    user = UserUpdateSerializer(read_only=True)
    total_worked_seconds = serializers.FloatField(read_only=True)

    def to_representation(self, instance=None):
        periodicity = self.validated_data.get(
            "periodicity", PeriodicityChoices.MONTHLY.value
        )
        count = self.validated_data.get("count", 3)

        performers = get_best_performers(periodicity, count)

        return [
            {
                "total_worked_seconds": float(p["total_worked_seconds"]),
                "user": UserUpdateSerializer(User.objects.get(id=p["user"])).data,
            }
            for p in performers
        ]
