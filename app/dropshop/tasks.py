from dropshop.celery import app
from dropshop.products.business import discover_prices


@app.task
def price_and_email_check():
    discover_prices()
