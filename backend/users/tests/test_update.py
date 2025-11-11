from django.urls import reverse
from django.contrib.auth.models import Group
from rest_framework import status
from users.constants import UserGroupChoices

from .base import BaseTestCase


class UserUpdateTests(BaseTestCase):
    """Test updating users"""

    def test_user_can_update_self(self):
        """User should be able to update their own profile"""

        self.client.force_authenticate(user=self.employee)
        url = reverse("user-detail", args=[self.employee.id])
        data = {"firstname": "UpdatedName"}
        response = self.client.patch(url, data, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.employee.refresh_from_db()
        self.assertEqual(self.employee.firstname, "UpdatedName")

    def test_user_cannot_change_group(self):
        """User should not be able to change their own group"""

        self.client.force_authenticate(user=self.employee)
        url = reverse("user-detail", args=[self.employee.id])
        group = Group.objects.get(name=UserGroupChoices.MANAGER)

        response = self.client.patch(url, {"groups": [group.id]}, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("groups", response.data)
