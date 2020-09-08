from django.core.management.base import BaseCommand

from dropshop.products.business import discover_prices


class Command(BaseCommand):
    help = 'Scrapes prices for products'

    def handle(self, *args, **options):
        discover_prices()
