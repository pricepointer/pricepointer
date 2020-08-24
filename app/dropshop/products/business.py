from decimal import Decimal

from django.core.exceptions import ValidationError
from django.core.validators import URLValidator

from dropshop.email.sendmail import send_mail
from dropshop.products.business import create_price
from dropshop.products.models import Product
from dropshop.scraper.webscraper import search_for_price
from .models import Price


def create_price(price, html, product):
    error = False
    validate = URLValidator()
    try:
        validate(html)
    except ValidationError:
        error = True

    if price is None:
        error = True

    price = Price(error=error, price=price, html=html, product=product)
    price.save()
    return price


def get_current_price(product):
    price_object = product.price_set.order_by('date').last()
    return price_object.price


def get_first_price(product):
    price_object = product.price_set.order_by('date').first()
    return price_object.price


def discover_prices():
    for product in Product.objects.all():
        price = search_for_price(product.website, product.price_path)

        create_price(price, product.website, product)

        if price is not None and Decimal(price) <= product.target_price:
            original_price = get_first_price(product)
            current_price = get_current_price(product)
            send_mail(product.name, product.website, original_price, current_price,
                      product.target_price, product.user.email)
