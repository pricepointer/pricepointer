from datetime import timedelta

from django.db import models

from ..accounts.models import User


class Product(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    website = models.TextField()
    price_path = models.TextField()
    active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField(auto_now=True, blank=True, null=True)
    notification_period = models.DurationField(default=timedelta(days=7), null=True)
    target_price = models.DecimalField(max_digits=19, decimal_places=2)
    name = models.CharField(max_length=50)


class Price(models.Model):
    date = models.DateTimeField(auto_now_add=True)
    price = models.DecimalField(max_digits=19, decimal_places=2, null=True)
    error = models.BooleanField()
    html = models.TextField()
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
