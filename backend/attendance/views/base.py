# attendance - views.py

from rest_framework import viewsets, generics, permissions

from attendance.models import Attendance
from attendance.serializers import AttendanceSerializer, AttendanceClocksSerializer


class AttendanceViewSet(viewsets.ModelViewSet):
    queryset = Attendance.objects.all()
    serializer_class = AttendanceSerializer


class AttendanceClocksView(generics.CreateAPIView):
    """
    POST /api/clocks/
    Allows the authenticated user to clock in or out.
    """

    serializer_class = AttendanceClocksSerializer
    permission_classes = [permissions.IsAuthenticated]
