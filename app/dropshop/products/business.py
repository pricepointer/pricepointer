from .models import Price


def create_price(price, error, html, product):
    price = Price(error=error, price=price, html=html, product=product)
    price.save()
    return price
