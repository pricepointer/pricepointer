from datetime import datetime, timedelta

from django.db import models

from ..accounts.models import User


# default to 1 day from now
def get_expiration_date():
    return datetime.now() + timedelta(minutes=30)


class ConfirmationEmail(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    confirmation_code = models.TextField()


class ForgotPasswordEmail(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField(default=get_expiration_date)
    confirmation_code = models.TextField()
