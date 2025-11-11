from django.db import models
from django.contrib.auth.models import (
    AbstractBaseUser,
    BaseUserManager,
    PermissionsMixin,
)
from django.utils.translation import gettext_lazy as _
from django.utils import timezone

from shortuuid.django_fields import ShortUUIDField

import uuid

from .constants import UserGroupChoices


class BaseModel(models.Model):
    """Base model for all models in the project."""

    id = ShortUUIDField(primary_key=True, editable=False)
    created_at = models.DateTimeField(auto_now_add=True, verbose_name=_("Created at"))
    updated_at = models.DateTimeField(auto_now=True, verbose_name=_("Updated at"))

    class Meta:
        abstract = True
        ordering = ["-created_at"]


class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError(_("The email address is required."))

        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("is_admin", True)

        return self.create_user(email, password, **extra_fields)

    def with_groups(self):
        return self.prefetch_related("groups")


class User(AbstractBaseUser, BaseModel, PermissionsMixin):
    class Meta:
        verbose_name = _("User")
        verbose_name_plural = _("Users")
        ordering = ["firstname"]

    USERNAME_FIELD = "email"
    objects = UserManager()

    email = models.EmailField(
        max_length=100,
        unique=True,
        error_messages={"unique": _("A user with that email already exists.")},
    )
    phone_number = models.CharField(
        max_length=30,
        verbose_name=_("Phone number"),
        blank=True,
        null=True,
    )
    firstname = models.CharField(
        null=True,
        blank=True,
        max_length=255,
    )
    lastname = models.CharField(
        null=True,
        blank=True,
        max_length=255,
    )
    is_active = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    is_admin = models.BooleanField(default=False)

    @property
    def fullname(self) -> str:
        if not (self.firstname or self.lastname):
            return

        return f"{self.firstname} {self.lastname}".strip()

    def _is_in_group(self, group_name: str) -> bool:
        """
        Return True if the user belongs to the given group name.
        """
        return any(group.name == group_name for group in self.groups.all())

    @property
    def is_employee(self) -> bool:
        return self._is_in_group(UserGroupChoices.EMPLOYEE.value)

    @property
    def is_manager(self) -> bool:
        return self._is_in_group(UserGroupChoices.MANAGER.value)

    @property
    def is_company_admin(self) -> bool:
        return self._is_in_group(UserGroupChoices.COMPANY_ADMIN.value)

    @property
    def is_manager_or_company_admin(self) -> bool:
        return self.is_manager or self.is_company_admin

    def __str__(self):
        if not self.is_authenticated:
            return "AnonymousUser"
        if self.fullname:
            return self.fullname
        if self.email:
            return self.email
        return self.id


class LoginOTP(BaseModel):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    code = models.CharField(max_length=6)
    expires_at = models.DateTimeField()
    is_used = models.BooleanField(default=False)
    session_token = models.UUIDField(
        default=uuid.uuid4, unique=True
    )  # To track OTP sessions

    def is_valid(self):
        return not self.is_used and timezone.now() < self.expires_at
