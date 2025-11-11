from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RegisterView, UserViewSet, LoginInitView, LoginVerifyView

router = DefaultRouter()
router.register(r"users", UserViewSet, basename="user")

urlpatterns = [
    path("", include(router.urls)),
    path("auth/register/", RegisterView.as_view(), name="register"),
    path("login/init/", LoginInitView.as_view(), name="login_init"),
    path("login/verify/", LoginVerifyView.as_view(), name="login_verify"),
]
