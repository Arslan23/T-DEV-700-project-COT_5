# users/emails.py

import logging
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils.translation import gettext_lazy as _
from django.conf import settings

from datetime import timedelta
from django.utils import timezone

logger = logging.getLogger(__name__)


def send_otp_email(user, code, expires_at):
    """
    Sends an OTP email to the specified user.
    """
    subject = "Vérification de connexion - Votre code OTP"
    context = {
        "user": user,
        "code": code,
        "expires_at": expires_at,
        "site_name": getattr(settings, "SITE_NAME"),
    }

    # Text and HTML versions of the email
    text_body = render_to_string("emails/otp_email.txt", context)
    html_body = render_to_string("emails/otp_email.html", context)

    msg = EmailMultiAlternatives(
        subject=subject,
        body=text_body,
        from_email=settings.DEFAULT_FROM_EMAIL,
        to=[user.email],
    )
    msg.attach_alternative(html_body, "text/html")

    try:
        msg.send()
        logger.info(f"OTP email successfully sent to {user.email}")
    except Exception as e:
        logger.exception(f"Failed to send OTP email to {user.email}: {e}")


class BaseEmail:
    """Base reusable email class with text+HTML rendering and logging."""

    subject = ""
    template_name = ""
    context = {}

    def __init__(self, user, context=None):
        self.user = user
        self.context = context or {}
        self.context.setdefault("user", user)
        self.context.setdefault("site_name", getattr(settings, "SITE_NAME", "MySite"))

    def send(self):
        """Render templates and send the email."""
        text_body = render_to_string(f"emails/{self.template_name}.txt", self.context)
        html_body = render_to_string(f"emails/{self.template_name}.html", self.context)

        msg = EmailMultiAlternatives(
            subject=self.subject,
            body=text_body,
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[self.user.email],
        )
        msg.attach_alternative(html_body, "text/html")

        try:
            msg.send()
            logger.info(f"Email '{self.subject}' sent to {self.user.email}")
        except Exception as e:
            logger.exception(
                f"Error sending email '{self.subject}' to {self.user.email}: {e}"
            )


class OtpEmail(BaseEmail):
    subject = _("Your OTP Code for Login Verification")
    template_name = "otp_email"

    def __init__(self, user, code, expires_at=None):
        expires_at = expires_at or (timezone.now() + timedelta(minutes=5))
        super().__init__(user, context={"code": code, "expires_at": expires_at})
