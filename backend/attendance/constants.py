from django.db import models

from django.utils.translation import gettext_lazy as _


class PeriodicityChoices(models.TextChoices):
    DAILY = "daily", _("Daily")
    WEEKLY = "weekly", _("Weekly")
    MONTHLY = "monthly", _("Monthly")
    YEARLY = "yearly", _("Yearly")


class AttendanceStatusChoices(models.TextChoices):
    ABSENT = "absent", _("Absent")
    PRESENT = "present", _("Present")
    EXCUSED = "excused", _("Excused")
