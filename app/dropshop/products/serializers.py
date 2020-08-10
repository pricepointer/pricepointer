from rest_framework import serializers
from rest_framework.serializers import ModelSerializer

from .models import Price, Product
from ..accounts.models import User


class ProductSerializer(ModelSerializer):
    price = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = (
            'id', 'user', 'website', 'price_path', 'active', 'created_at', 'expires_at',
            'notification_period', 'target_price', 'name', 'price'
        )

    def get_price(self, product):
        price_object = product.price_set.order_by('date').last()
        if not price_object:
            return None
        return price_object.price


class PriceSerializer(ModelSerializer):
    class Meta:
        model = Price
        fields = (
            'user', 'date', 'price', 'error', 'html'
        )


class UserSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = (
            'id', 'name', 'email'
        )
