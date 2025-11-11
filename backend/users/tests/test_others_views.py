from django.urls import reverse
from rest_framework import status

from .base import BaseTestCase


class CurrentUserTests(BaseTestCase):
    """Test the /users/me endpoint"""

    def setUp(self):
        self.me_url = reverse("user-me")

        return super().setUp()

    def test_authenticated_user_can_access_me(self):
        """Authenticated users should receive their profile data"""
        self.client.force_authenticate(user=self.employee)
        response = self.client.get(self.me_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["email"], self.employee.email)

    def test_unauthenticated_user_cannot_access_me(self):
        """Unauthenticated users should receive 401"""
        response = self.client.get(self.me_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertIn("detail", response.data)
