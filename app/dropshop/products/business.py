import re
from decimal import Decimal

from django.core.exceptions import ValidationError
from django.core.validators import URLValidator

from dropshop.email.senderrormail import send_error_mail
from dropshop.email.sendmail import send_mail
from dropshop.products.models import Product
from dropshop.scraper.webscraper import search_for_price
from .models import Price


def create_price(price, html, product, currency):
    error = False
    validate = URLValidator()
    try:
        validate(html)
    except ValidationError:
        error = True

    if price is None:
        error = True

    price = Price(error=error, price=price, html=html, product=product, currency=currency)
    price.save()
    return price


def get_first_price(product):
    price_object = product.price_set.order_by('date').first()
    return price_object.price


def get_currency(price):
    cost = re.sub(r'[^$£€¥₾]', '', price)
    return cost


def get_price(price):
    cost = re.sub(r'[^\d\.]', '', price)
    return cost


def discover_prices():
    for product in Product.objects.filter(active=True):
        cost = search_for_price(product.website, product.price_path)
        price = get_price(cost)
        currency = get_currency(cost)
        price_object = create_price(price, product.website, product, currency)

        if price is not None and Decimal(price) <= product.target_price:
            original_price = get_first_price(product)
            product.active = False
            product.save()
            send_mail(product.name, product.website, original_price, price,
                      product.target_price, product.user.email)

        elif price_object.error is True:
            product.active = False
            product.save()
            send_error_mail(product.name, product.website, product.user.email)

        elif product.notification_period is not None and product.expires_at > product.created_at:
            product.active = False
            product.save()
