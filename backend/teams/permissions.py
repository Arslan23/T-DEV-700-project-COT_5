# teams - permissions.py
from rest_framework import permissions


class IsAdminOrManagerReadOnly(permissions.BasePermission):
    """
    Custom permission for Teams:
    - Admin: full access (CRUD)
    - Manager: read, update (no create/delete)
    - Employee: read only
    """

    def has_permission(self, request, view):
        user = request.user

        # Unauthenticated users have no access
        if not user or not user.is_authenticated:
            return False

        # Admin has full access
        if user.is_company_admin:
            return True

        # Manager can read and update (but not create or delete)
        if user.is_manager:
            return view.action not in ["create", "destroy"]

        # Employees can only read
        if user.is_employee:
            return view.action in ["list", "retrieve"]

        return False

    def has_object_permission(self, request, view, obj):
        user = request.user

        # Unauthenticated users have no access
        if not user or not user.is_authenticated:
            return False

        # Admin has full access
        if user.is_company_admin:
            return True

        # Manager can read and update teams they manage or are member of
        if user.is_manager:
            if view.action in ["destroy"]:
                return False
            return obj.manager == user or user in obj.members.all()

        # Employees can only read teams they are member of
        if user.is_employee:
            return view.action in ["retrieve"] and user in obj.members.all()

        return False


class IsTeamManagerOrAdmin(permissions.BasePermission):
    """
    Permission for team-specific actions (add/remove members, etc.)
    - Admin: full access
    - Team Manager: full access to their teams
    - Others: no access
    """

    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        # Admin has full access
        if request.user.is_company_admin:
            return True

        # Team manager has access to their teams
        if request.user.is_manager and obj.manager == request.user:
            return True

        return False
