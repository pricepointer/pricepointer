from datetime import timedelta

from django.db import models


class Product:
    user = models.ForeignKey('accounts.User', on_delete=models.CASCADE)
    website = models.TextField()
    price_path = models.TextField()
    active = models.BooleanField()
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField(auto_now_add=True, blank=True, null=True)
    notification_Period = models.DurationField(default=timedelta(days=7), null=True)
    target_price = models.DecimalField(max_digits=19, decimal_places=2)


class Price:
    user = models.ForeignKey('accounts.User', on_delete=models.CASCADE)
    date = models.DateTimeField(auto_now_add=True)
    price = models.DecimalField(max_digits=19, decimal_places=2, null=True)
    error = models.BooleanField()
    html = models.TextField()
