from django.urls import reverse
from rest_framework import status

from .base import BaseTestCase


class RegisterViewTests(BaseTestCase):
    """Test user registration endpoint"""

    def setUp(self):
        self.register_url = reverse("register")
        self.data = {
            "email": "newuser@example.com",
            "password": "StrongPass123",
            "password_confirm": "StrongPass123",
            "firstname": "John",
            "lastname": "Doe",
            "phone_number": "987654321",
        }

        return super().setUp()

    def test_register_user_successfully(self):
        """Should create a new user and return access + refresh tokens"""

        self.client.force_authenticate(user=self.admin)
        response = self.client.post(self.register_url, self.data, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn("user", response.data)
        self.assertEqual(response.data["user"]["email"], self.data["email"])

    def test_register_user_requires_authentication(self):
        """Should require authentication to register a new user"""

        response = self.client.post(self.register_url, self.data, format="json")

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertIn("detail", response.data)

    def test_unauthorized_user_cannot_register_user(self):
        """Non-admin users should not be allowed to register new users"""

        self.client.force_authenticate(user=self.employee)
        response = self.client.post(self.register_url, self.data, format="json")

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertIn("detail", response.data)

    def test_register_with_password_mismatch(self):
        """Should return error if passwords do not match"""

        invalid_data = self.data.copy()
        invalid_data["password_confirm"] = "different123"

        self.client.force_authenticate(user=self.admin)
        response = self.client.post(self.register_url, invalid_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("non_field_errors", response.data)
