from django.core.exceptions import ValidationError
from django.core.validators import URLValidator
from .models import Price


def create_price(price, html, product):
    errors = {}
    error = False
    validate = URLValidator()
    try:
        validate(html)
    except ValidationError:
        error = True
        errors['html'] = ValidationError(message="invalid website url")

    if price is None:
        error = True
        errors['price'] = ValidationError(message="Cannot find price")

    if errors:
        raise ValidationError(message=errors)

    price = Price(error=error, price=price, html=html, product=product)
    price.save()
    return price
