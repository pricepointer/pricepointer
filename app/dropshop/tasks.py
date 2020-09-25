from dropshop.celery import app
from dropshop.products.business import discover_prices, expiry_check
from dropshop.prices.createprice import make_price_object


@app.task
def price_and_email_check():
    discover_prices()


@app.task
def clear_expired_emails():
    expiry_check()


@app.task
def price_search(product_id):
    make_price_object(product_id)

