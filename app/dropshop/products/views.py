from django.core.exceptions import ValidationError
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from dropshop.products.business import create_product
from .models import Product
from .serializers import ProductSerializer
from ..tasks import price_search


class ProductListView(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        # Read from request payload
        data = request.data

        form = {
            'user': request.user,
            'website': data['website'],
            'price_path': data['price_path'],
            'target_price': data['target_price'],
            'name': data['name'],
            'notification_period': data['notification_period']
        }
        try:
            product = create_product(**form)
            price_search.delay(product.id)

        except ValidationError as error:
            errors = {
                field: messages[0]
                for (field, messages) in error
            }
            return Response(errors, status=status.HTTP_400_BAD_REQUEST)
        except:
            errors = {'general': 'There was an error with the server. Try again later.'}
            return Response(errors, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response(ProductSerializer(product).data, status=status.HTTP_201_CREATED)

    def get(self, request):
        product = Product.objects.filter(user=request.user, active=True)
        return Response(ProductSerializer(product, many=True).data)


class ProductView(APIView):
    permission_classes = (IsAuthenticated,)

    def delete(self, request, product_id):
        Product.objects.filter(id=product_id).update(active=False)
        return Response(status=status.HTTP_204_NO_CONTENT)
