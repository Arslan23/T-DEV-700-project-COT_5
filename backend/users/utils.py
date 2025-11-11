# users/utils.py

import random
import logging
from django.utils import timezone
from datetime import timedelta
from users.models import LoginOTP
from users.emails import OtpEmail

logger = logging.getLogger(__name__)


def generate_and_send_otp(user):
    """
    Creates a LoginOTP for the given user, sends it via email, and returns the OTP instance.
    """
    code = f"{random.randint(100000, 999999)}"
    expires_at = timezone.now() + timedelta(minutes=5)

    otp = LoginOTP.objects.create(user=user, code=code, expires_at=expires_at)

    logger.info(f"OTP generated for user={user.email} (expires at {expires_at})")

    # Send OTP email
    otp_email = OtpEmail(user, code, expires_at)
    otp_email.send()

    return otp
