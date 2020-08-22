from django.core.management.base import BaseCommand

from dropshop.products.business import create_price
from dropshop.products.models import Product
from dropshop.scraper.webscraper import search_for_price


class Command(BaseCommand):
    help = 'Scrapes prices for products'

    def handle(self, *args, **options):
        for product in Product.objects.all():
            price = search_for_price(product.website, product.price_path)
            create_price(price, product.website, product)
