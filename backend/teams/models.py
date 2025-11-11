from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _

from django.db import models

from users.models import BaseModel, User


class TeamManager(models.Manager):
    """Custom manager for Team model with query optimizations."""

    def get_queryset(self):
        """Prefetch manager and members to avoid N+1 queries."""
        return super().get_queryset().select_related("manager").prefetch_related("members")


class Team(BaseModel):
    class Meta:
        verbose_name = _("Team")
        verbose_name_plural = _("Teams")
        ordering = ["name"]

    objects = TeamManager()

    name = models.CharField(max_length=150, unique=True)
    description = models.TextField(blank=True, null=True)
    members = models.ManyToManyField(User, related_name="teams", blank=True)
    manager = models.ForeignKey(
        User,
        null=True,
        blank=True,
        related_name="managed_teams",
        on_delete=models.SET_NULL,
    )

    def __str__(self):
        return self.name

    @property
    def member_count(self) -> int:
        """Return the number of members in the team."""
        return self.members.count()

    @property
    def manager_name(self) -> str:
        """Return the manager's full name or email."""
        if not self.manager:
            return None
        return str(self.manager)

    def clean(self):
        """Custom validation for Team model."""
        super().clean()

        # Validate that manager has the 'manager' group if set
        if self.manager and not self.manager.is_manager_or_company_admin:
            raise ValidationError(
                {"manager": "The selected user does not have the manager role."}
            )
