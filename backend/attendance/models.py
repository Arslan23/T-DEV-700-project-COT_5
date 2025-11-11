from django.conf import settings
from django.db import models
from django.utils.translation import gettext_lazy as _

from users.models import BaseModel, User

from django.db import models
from django.db.models import (
    F,
    Case,
    When,
    Value,
    ExpressionWrapper,
    FloatField,
    CharField,
)
from django.db.models.functions import Extract, TruncDate

from attendance.constants import AttendanceStatusChoices


class AttendanceQuerySet(models.QuerySet):
    def with_worked_seconds(self):
        """
        Annotates each record with worked_seconds (in seconds),
        safely handling null or missing check-in/out.
        """
        return self.annotate(
            worked_seconds=Case(
                When(
                    check_in__isnull=False,
                    check_out__isnull=False,
                    then=ExpressionWrapper(
                        # EXTRACT(epoch FROM interval) returns seconds as float
                        models.functions.Extract(
                            ExpressionWrapper(
                                F("check_out") - F("check_in"),
                                output_field=models.DurationField(),
                            ),
                            "epoch",
                        ),
                        output_field=FloatField(),
                    ),
                ),
                default=Value(0.0),
                output_field=FloatField(),
            )
        )

    def with_extra_seconds(self):
        """
        Annotates each record with extra_seconds (in seconds)
        """
        expected_work_seconds = (
            settings.CHECK_OUT_HOUR - settings.CHECK_IN_HOUR
        ) * 3600

        return self.with_worked_seconds().annotate(
            extra_seconds=F("worked_seconds") - Value(expected_work_seconds)
        )

    def with_delay_seconds(self):
        """
        Annotates each record with delay_seconds (in seconds),
        calculating delay based on CHECK_IN_HOUR from settings.
        """
        check_in_hour = settings.CHECK_IN_HOUR

        return self.annotate(
            delay_seconds=Case(
                When(
                    check_in__isnull=False,
                    then=ExpressionWrapper(
                        Extract(
                            ExpressionWrapper(
                                F("check_in") - TruncDate(F("check_in")),
                                output_field=models.DurationField(),
                            ),
                            "epoch",
                        )
                        - Value(check_in_hour * 3600),
                        output_field=FloatField(),
                    ),
                ),
                default=Value(0.0),
                output_field=FloatField(),
            )
        )

    def with_status(self):
        """
        Annotates each record with attendance status:
        - 'present' if user checked in
        - 'absent' if no check_in
        - 'excused' if marked excused
        """
        return self.annotate(
            status=Case(
                When(
                    is_excused=True, then=Value(AttendanceStatusChoices.EXCUSED.value)
                ),
                When(
                    check_in__isnull=False,
                    then=Value(AttendanceStatusChoices.PRESENT.value),
                ),
                default=Value(AttendanceStatusChoices.ABSENT.value),
                output_field=CharField(max_length=20),
            )
        )


class AttendanceManager(models.Manager):
    def get_queryset(self):
        return AttendanceQuerySet(self.model, using=self._db)

    def with_worked_seconds(self):
        return self.get_queryset().with_worked_seconds()

    def with_extra_seconds(self):
        return self.get_queryset().with_extra_seconds()

    def with_delay_seconds(self):
        return self.get_queryset().with_delay_seconds()

    def with_status(self):
        return self.get_queryset().with_status()


class Attendance(BaseModel):
    """Model to track user attendance per day."""

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["user", "day"], name="unique_user_day_attendance"
            )
        ]
        ordering = ["-day"]

    objects = AttendanceManager()

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="attendances")
    day = models.DateField()  # the calendar day
    check_in = models.DateTimeField(null=True, blank=True)
    check_out = models.DateTimeField(null=True, blank=True)
    is_excused = models.BooleanField(
        default=False,
        help_text=_("Indicates if the absence for this day is excused."),
    )
    excuse_reason = models.TextField(
        null=True,
        blank=True,
        help_text=_("Reason for excused absence, if applicable."),
    )

    def __str__(self):
        return f"{self.user} - {self.day}"

    @property
    def is_absent(self) -> bool:
        return not self.check_in and not self.check_out

    @property
    def is_delayed(self) -> bool:
        if not self.check_in:
            return False

        return self.check_in.hour >= settings.CHECK_IN_HOUR
