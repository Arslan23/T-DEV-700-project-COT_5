import os
from pathlib import Path
import logging
from datetime import timedelta
from celery.schedules import crontab

# from django.utils.translation import gettext_lazy as _


from .celery import *  # noqa

logger = logging.getLogger(__name__)


try:
    from .local_settings import *  # noqa
except ImportError:
    logger.error("No local_settings.py, the application will not run")

    from .local_settings_template import *  # noqa


BASE_DIR = Path(__file__).resolve().parent.parent
SITE_NAME = os.getenv("SITE_NAME", "Time Manager App")


# Production security
if not DEBUG:
    SECURE_SSL_REDIRECT = os.environ.get('SECURE_SSL_REDIRECT', 'True') == 'True'
    SESSION_COOKIE_SECURE = os.environ.get('SESSION_COOKIE_SECURE', 'True') == 'True'
    CSRF_COOKIE_SECURE = os.environ.get('CSRF_COOKIE_SECURE', 'True') == 'True'
    SECURE_BROWSER_XSS_FILTER = True
    SECURE_CONTENT_TYPE_NOSNIFF = True
    X_FRAME_OPTIONS = 'DENY'



# Application definition
INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    # Third-party apps
    "rest_framework",
    "drf_spectacular",
    "corsheaders",
    "users",
    "teams",
    "attendance",
]

AUTH_USER_MODEL = "users.User"

REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework_simplejwt.authentication.JWTAuthentication",
        # optionally add session authentication for the browsable API
        "rest_framework.authentication.SessionAuthentication",
    ),
    "DEFAULT_PERMISSION_CLASSES": (
        # "rest_framework.permissions.IsAuthenticated",
        "rest_framework.permissions.AllowAny",
    ),
    "DEFAULT_SCHEMA_CLASS": "drf_spectacular.openapi.AutoSchema",
}

SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=60),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=7),
    "AUTH_HEADER_TYPES": ("Bearer",),
}

SPECTACULAR_SETTINGS = {
    "TITLE": "Time Manager API",
    "DESCRIPTION": "API for employee attendance, teams and KPIs",
    "VERSION": "0.1.0",
}

MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "core.urls"

# Allowed hosts
DEFAULT_ALLOWED_HOSTS = "127.0.0.1,localhost"

ALLOWED_HOSTS = os.getenv("ALLOWED_HOSTS", DEFAULT_ALLOWED_HOSTS)
ALLOWED_HOSTS = [h.strip() for h in ALLOWED_HOSTS.split(",") if h.strip()]

# CORS allowed hosts
DEFAULT_CORS_ALLOWED_HOSTS = "http://127.0.0.1:3000,http://localhost:3000"

#FIXME : The variable is not read from the .env file 
CORS_ALLOWED_ORIGINS = os.getenv("CORS_ALLOWED_ORIGINS", DEFAULT_CORS_ALLOWED_HOSTS)
CORS_ALLOWED_ORIGINS = [h.strip() for h in CORS_ALLOWED_ORIGINS.split(",") if h.strip()]

CORS_ALLOW_CREDENTIALS = True

# Templates
TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [BASE_DIR / "templates"],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "core.wsgi.application"


# Password validation
# https://docs.djangoproject.com/en/5.2/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]


# Internationalization
# https://docs.djangoproject.com/en/5.2/topics/i18n/

LANGUAGE_CODE = "en-us"

TIME_ZONE = "UTC"

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.2/howto/static-files/

STATIC_URL = "static/"

STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

# Default primary key field type
# https://docs.djangoproject.com/en/5.2/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"


DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.environ.get('POSTGRES_DB', 'myapp_dev'),
        'USER': os.environ.get('POSTGRES_USER', 'postgres'),
        'PASSWORD': os.environ.get('POSTGRES_PASSWORD', 'postgres'),
        'HOST': os.environ.get('POSTGRES_HOST', 'db'), 
        'PORT': os.environ.get('POSTGRES_PORT', '5432'),
    }
}

# Celery settings
CELERY_BROKER_URL = os.getenv("CELERY_BROKER_URL", "redis://localhost:6379/0")
CELERY_RESULT_BACKEND = os.getenv("CELERY_RESULT_BACKEND", "redis://localhost:6379/0")
CELERY_ACCEPT_CONTENT = ["json"]
CELERY_TASK_SERIALIZER = "json"
CELERY_RESULT_SERIALIZER = "json"
CELERY_TIMEZONE = "Africa/Porto-Novo"

# Celery beat scheduler
CELERY_BEAT_SCHEDULE = {
    "create-daily-attendance": {
        "task": "attendance.tasks.create_daily_attendance_records",
        "schedule": crontab(
            hour=0, minute=5, day_of_week="1-5"
        ),  # Monday to Friday at 00:05
    },
}
CELERY_WORKER_MAX_TASKS_PER_CHILD = 1
CELERY_WORKER_SEND_TASK_EVENTS = True
CELERY_TASK_SEND_SENT_EVENT = True

# EMAIL CONFIGS
EMAIL_BACKEND = os.getenv(
    "EMAIL_BACKEND", "django.core.mail.backends.smtp.EmailBackend"
)
EMAIL_HOST = os.getenv("EMAIL_HOST", "smtp.gmail.com")
EMAIL_PORT = int(os.getenv("EMAIL_PORT", 587))
EMAIL_USE_TLS = os.getenv("EMAIL_USE_TLS", "True") == "True"
EMAIL_HOST_USER = os.getenv("EMAIL_HOST_USER", "user")
EMAIL_HOST_PASSWORD = os.getenv("EMAIL_HOST_PASSWORD", "password")

DEFAULT_FROM_EMAIL = os.getenv("DEFAULT_FROM_EMAIL", "contact@time_manager.com")
DEFAULT_FROM_EMAIL = f"{SITE_NAME} <{DEFAULT_FROM_EMAIL}>"

# Attendance allowed hours (24h format)
CHECK_IN_START_HOUR = int(os.getenv("CHECK_IN_START_HOUR", 7))
CHECK_IN_HOUR = int(os.getenv("CHECK_IN_HOUR", 9))
CHECK_IN_END_HOUR = int(os.getenv("CHECK_IN_END_HOUR", 10))
CHECK_OUT_START_HOUR = int(os.getenv("CHECK_OUT_START_HOUR", 17))
CHECK_OUT_HOUR = int(os.getenv("CHECK_OUT_HOUR", 18))
CHECK_OUT_END_HOUR = int(os.getenv("CHECK_OUT_END_HOUR", 20))

# Company location for attendance geofencing
COMPANY_LATITUDE = float(os.getenv("COMPANY_LATITUDE", 6.366132646225389))
COMPANY_LONGITUDE = float(os.getenv("COMPANY_LONGITUDE", 2.429160219575613))

# Authorized radius (in meters) around company location for attendance
ATTENDANCE_LOCATION_RADIUS = int(os.getenv("ATTENDANCE_LOCATION_RADIUS", 150))
