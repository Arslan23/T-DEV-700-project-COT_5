from rest_framework import status
from users.models import User

from .base import BaseTestCase


class UserCreateTests(BaseTestCase):
    """Test creating users through the ViewSet"""

    def test_admin_can_create_user(self):
        """Admin should be able to create a new user"""

        self.client.force_authenticate(user=self.admin)
        data = {
            "email": "created@example.com",
            "firstname": "Created",
            "lastname": "User",
            "phone_number": "222333444",
        }
        response = self.client.post(self.users_url, data, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(User.objects.filter(email="created@example.com").exists())

    def test_employee_cannot_create_user(self):
        """Employee should not be allowed to create other users"""

        self.client.force_authenticate(user=self.employee)
        data = {"email": "nope@example.com"}
        response = self.client.post(self.users_url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
