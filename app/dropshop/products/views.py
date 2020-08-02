from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Price, Product
from .serializers import PriceSerializer, ProductSerializer
from ..accounts.models import User


class ProductListView(APIView):
    def post(self, request):
        # Read from request payload
        data = request.data
        user = User.objects.get(id=data['user'])
        product = Product(user=user, website=data['website'], price_path=data['price_path'],
                          target_price=data['target_price'], name=data['name'])
        product.save()
        return Response(ProductSerializer(product).data)

    def get(self, request):
        product = Product.objects.all()
        return Response(ProductSerializer(product, many=True).data)


# class PriceListView(APIView):
#     def post(self, request):
#         # Read from request payload
#         data = request.data
#         user = User.objects.get(id=data['user'])
#         price = Price(user=user, html=data['html'], price=data['price'], error=data['error'], )
#         price.save()
#         return Response(PriceSerializer(price).data)
#
#     def get(self, request):
#         price = Price.objects.all()
#         return Response(PriceSerializer(price, many=True).data)
