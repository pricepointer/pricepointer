from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Product
from .serializers import ProductSerializer, PriceSerializer
from ..accounts.models import User


class ProductListView(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        # Read from request payload
        data = request.data
        product = Product(user=request.user, website=data['website'], price_path=data['price_path'],
                          target_price=data['target_price'], name=data['name'])
        product.save()
        return Response(ProductSerializer(product).data)

    def get(self, request):
        product = Product.objects.all()
        return Response(ProductSerializer(product, many=True).data)
