import os
from pathlib import Path

import dotenv

dotenv.load_dotenv()

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

ENV = os.getenv("ENV", "dev")

# SECURITY WARNING: keep the secret key used in production secret!
INSECURE_SECRET_KEY = (
    "django-insecure-u&qile=x3p1l*3v*jbzig-##hh9$7f@1_0_^_8gr9xd_i2&t1z"
)

SECRET_KEY = os.getenv("SECRET_KEY") if ENV != "test" else INSECURE_SECRET_KEY

# SECURITY WARNING: don't run with debug turned on in production!
# DEBUG = ENV == "dev"
DEBUG = False

ALLOWED_HOSTS = ["127.0.0.1", "localhost"]


# Database
# https://docs.djangoproject.com/en/5.2/ref/settings/#databases

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": os.getenv("DB_NAME") or "time_manager",
        "USER": os.getenv("DB_USER") or "time_manager",
        "PASSWORD": os.getenv("DB_PASSWORD") or "time_manager",
        "HOST": os.getenv("DB_HOST"),
        "PORT": os.getenv("DB_PORT"),
    }
}
