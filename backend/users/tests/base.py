from django.urls import reverse
from django.contrib.auth.models import Group
from rest_framework.test import APIClient, APITestCase
from users.models import User
from users.constants import UserGroupChoices


class BaseTestCase(APITestCase):
    """Base setup for user-related test cases"""

    fixtures = ["groups.json"]

    def setUp(self):
        self.client = APIClient()

        self.users_url = reverse("user-list")

        # Create sample users
        self.admin = User.objects.create_superuser(
            email="admin@example.com",
            password="adminpass",
            firstname="Admin",
            lastname="Doe",
            is_active=True,
        )
        company_admin_group = Group.objects.get(name=UserGroupChoices.COMPANY_ADMIN)
        self.admin.groups.add(company_admin_group)

        self.employee = User.objects.create_user(
            email="employee@example.com",
            password="password123",
            firstname="Employee",
            lastname="Doe",
            is_active=True,
        )
        employee_group = Group.objects.get(name=UserGroupChoices.EMPLOYEE)
        self.employee.groups.add(employee_group)

        self.manager = User.objects.create_user(
            email="manager@example.com",
            password="password123",
            firstname="Manager",
            lastname="Doe",
            is_active=True,
        )
        manager_group = Group.objects.get(name=UserGroupChoices.MANAGER)
        self.manager.groups.add(manager_group)
