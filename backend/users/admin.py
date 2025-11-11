from django.contrib import admin
from .models import User


class UserAdmin(admin.ModelAdmin):
    list_display = [
        "email",
        "firstname",
        "lastname",
        "phone_number",
        "is_admin",
        "created_at",
    ]
    fieldsets = [
        (
            "Personal info",
            {
                "fields": [
                    "firstname",
                    "lastname",
                    "email",
                    "groups",
                    "phone_number",
                ]
            },
        ),
        ("Permissions", {"fields": ["is_admin", "is_staff"]}),
        # (None, {"fields": ["password"]}),
    ]


admin.site.register(User, UserAdmin)
