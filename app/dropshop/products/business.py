from .models import Price


def price_gen(user, price, error, html):
    price = Price(user=user, error=error, price=price, html=html)
    price.save()
    return price
