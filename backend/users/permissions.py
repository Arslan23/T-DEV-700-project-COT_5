from rest_framework import permissions


class IsCompanyAdmin(permissions.BasePermission):
    """Allows access only to company admins."""

    def has_permission(self, request, view):
        user = request.user
        return user.is_authenticated and user.is_company_admin


class IsManagerOrCompanyAdmin(permissions.BasePermission):
    """Allows access to managers and company admins."""

    def has_permission(self, request, view):
        user = request.user
        return user.is_authenticated and user.is_manager_or_company_admin


class IsSelfOrManagerOrCompanyAdmin(permissions.BasePermission):
    """
    Allows access if the user is:
    - Themselves (user.id == target_id)
    - A manager (user.is_manager)
    - A company admin (user.is_company_admin)
    """

    def has_permission(self, request, view):
        user = request.user
        target_id = view.kwargs.get("user_id")

        if not user.is_authenticated:
            return False

        if user.is_manager_or_company_admin:
            return True

        return str(user.id) == str(target_id)


class UsersRoleBasedPermission(permissions.BasePermission):
    """
    - Company admins: full access on users endpoints
    - Managers: can list, retrieve, update users
    - Users: can only view or edit their own profile
    """

    def has_permission(self, request, view):
        user = request.user

        if not user or not user.is_authenticated:
            return False

        # Company admin allowed
        if user.is_company_admin:
            return True

        # Managers can list or view users
        if user.is_manager:
            return view.action in ["list", "retrieve", "update", "partial_update"]

        # Regular users can only retrieve/update themselves
        return view.action in ["update", "partial_update", "me"]

    def has_object_permission(self, request, view, obj):
        user = request.user

        if not user or not user.is_authenticated:
            return False

        if user.is_company_admin:
            return True

        if user.is_manager and obj.is_employee:
            manager_teams = user.managed_teams
            user_teams = obj.teams

            if not manager_teams or not user_teams:
                return False

            manager_team_ids = set(manager_teams.values_list("id", flat=True))
            user_team_ids = set(user_teams.values_list("id", flat=True))

            # Check intersection
            return bool(manager_team_ids & user_team_ids)

        # Allow self access
        return obj == user
