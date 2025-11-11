from rest_framework import status

from .base import BaseTestCase


class UserListTests(BaseTestCase):
    """Test listing users and permissions"""

    def test_admin_can_list_users(self):
        """Admin should be able to list all users"""

        self.client.force_authenticate(user=self.admin)
        response = self.client.get(self.users_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data), 2)

    def test_manager_can_list_users(self):
        """Admin should be able to list all users"""

        self.client.force_authenticate(user=self.manager)
        response = self.client.get(self.users_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data), 2)

    def test_unauthorized_user_cannot_list_users(self):
        """Employee should not have permission to list users"""

        self.client.force_authenticate(user=self.employee)
        response = self.client.get(self.users_url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_authorized_user_can_list_user_details(self):
        """Authorized user should be able to retrieve a single user"""

        self.client.force_authenticate(user=self.admin)

        retrieve_user_url = f"{self.users_url}{self.employee.id}/"
        response = self.client.get(retrieve_user_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["email"], self.employee.email)
        self.assertEqual(response.data["firstname"], self.employee.firstname)
        self.assertEqual(response.data["lastname"], self.employee.lastname)
        # self.assertEqual(response.data['groups'], self.employee.groups.values_list('id', flat=True))

    def test_unauthorized_user_cannot_retrieve_user(self):
        """Unauthorized user cannot retrieve a single user"""

        self.client.force_authenticate(user=self.employee)

        retrieve_user_url = f"{self.users_url}{self.employee.id}/"
        response = self.client.get(retrieve_user_url)

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
