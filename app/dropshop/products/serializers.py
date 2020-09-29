from decimal import *

from rest_framework.serializers import ModelSerializer

from .models import Product
from ..accounts.models import User


class ProductSerializer(ModelSerializer):
    class Meta:
        model = Product
        fields = (
            'id', 'user', 'website', 'active', 'created_at', 'expires_at',
            'notification_period', 'target_price', 'name',
        )

    def to_representation(self, instance):
        response = super().to_representation(instance)
        extra = {
            **self._get_price_data(instance),
        }

        response.update(extra)
        return response

    def _get_price_data(self, instance):
        first_price = self._get_first_price(instance)
        if not first_price:
            return {
                'price': None,
                'original_price': None,
                'currency': None,
                'percent': None,
                'price_difference': None,
                'error': False,
            }

        latest_price = self._get_latest_price(instance)

        # error handling in case latest price was an error
        if not latest_price.price:
            last_price = 0
        else:
            last_price = latest_price.price

        # get percent
        percent = str(
            (
                (1 - (Decimal(last_price) / Decimal(first_price.price))) * 100
            ).quantize(Decimal('.01'), rounding=ROUND_HALF_UP)
        )

        return {
            'price': latest_price.price,
            'original_price': first_price.price,
            'currency': latest_price.currency,
            'percent': percent,
            'price_difference': str(
                (latest_price.price - first_price.price).quantize(Decimal('.01'), rounding=ROUND_HALF_UP)
            ),
            'error': latest_price.error,
        }

    def _get_price_queryset(self, product):
        return product.price_set.order_by('date')

    def _get_first_price(self, product):
        queryset = self._get_price_queryset(product)
        for price in queryset.iterator():
            if not price.error:
                return price
        return None

    def _get_latest_price(self, product):
        queryset = self._get_price_queryset(product)
        return queryset.last()


class UserSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = (
            'id', 'name', 'email'
        )
