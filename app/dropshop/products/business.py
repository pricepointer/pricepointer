import datetime
import re

from django.core.exceptions import ValidationError
from django.core.validators import URLValidator
from django.utils import timezone

from dropshop.products.models import Product
from ..email.models import ForgotPasswordEmail


def discover_prices():
    from ..tasks import price_search
    for product in Product.objects.filter(active=True):
        price_search.delay(product.id)


def expiry_check():
    for email in ForgotPasswordEmail.objects.all():
        if email.expires_at < timezone.now():
            email.delete()


def create_product(user, website, price_path, target_price, name, notification_period):
    errors = {}
    validate = URLValidator()
    notification = 0
    if notification_period:
        notification = datetime.timedelta(days=int(notification_period))
    if not (name and name.strip()):
        errors['name'] = ValidationError(message='Name is a required field')
    try:
        validate(website)
    except ValidationError:
        errors['website'] = ValidationError(message='Website must be valid')
    price = re.sub('[^0-9]', '', target_price)
    if not price:
        errors['target_price'] = ValidationError(message='target_price must be a valid integer')
    if not (price_path and price_path.strip()):
        errors['price_path'] = ValidationError(message='price_path must be a valid xml path')

    if errors:
        raise ValidationError(message=errors)

    product = Product(user=user, website=website, price_path=price_path,
                      target_price=target_price, name=name, notification_period=notification)

    product.save()
    product.set_expiration_date()
    return product
