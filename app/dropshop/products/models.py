from django.db import models

from ..accounts.models import User


class Product(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    website = models.TextField()
    price_path = models.TextField()
    active = models.BooleanField(default=True, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField(auto_now=False, blank=True, null=True)
    notification_period = models.DurationField(null=True, blank=True)
    target_price = models.DecimalField(max_digits=19, decimal_places=2)
    name = models.CharField(max_length=50)

    def set_expiration_date(self, *args, **kwargs):
        if self.notification_period is not None:
            self.expires_at = self.created_at + self.notification_period
            self.save(*args, **kwargs)


class Price(models.Model):
    date = models.DateTimeField(auto_now_add=True)
    price = models.DecimalField(max_digits=19, decimal_places=2, null=True, blank=True)
    error = models.BooleanField()
    html = models.TextField()
    currency = models.CharField(max_length=5, default='$', null=True, blank=True)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
