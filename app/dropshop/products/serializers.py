from rest_framework.serializers import ModelSerializer

from .models import Price, Product
from ..accounts.models import User


class ProductSerializer(ModelSerializer):
    class Meta:
        model = Product
        fields = (
            'id', 'user', 'website', 'price_path', 'active', 'created_at', 'expires_at',
            'notification_period', 'target_price', 'name'
        )


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
