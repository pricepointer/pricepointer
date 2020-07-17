from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Product
from .serializers import ProductSerializer
from ..accounts.models import User


class ProductListView(APIView):
    def post(self, request):
        # Read from request payload
        data = request.data
        user = User.objects.get(id=data['user'])
        product = Product(user=user,    website=data['website'], price_path=['price_path'],
                          target_price=data['target_price'])
        product.save()
        return Response(ProductSerializer(product).data)

    def get(self, request):
        data = request.data
        product = Product.objects.get(id=data['id'])
        return Response(ProductSerializer(product).data)
