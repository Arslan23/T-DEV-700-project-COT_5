from django.db import models
from django.utils.translation import gettext_lazy as _


class UserGroupChoices(models.TextChoices):
    EMPLOYEE = "employee", _("Employee")
    MANAGER = "manager", _("Manager")
    COMPANY_ADMIN = "company_admin", _("Aministrator")
