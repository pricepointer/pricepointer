from django.core.exceptions import ValidationError
from django.shortcuts import render
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from dropshop.products.business import create_price
from dropshop.scraper.webscraper import search_for_price
from .models import Product
from .serializers import ProductSerializer
from ..accounts.authentication import create_product


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
            'name': data['name']
        }
        try:
            product = create_product(**form)
            product.save()
            price = search_for_price(data['website'], data['price_path'])
            create_price(price, data['website'], product)

        except ValidationError as error:
            errors = {
                field: messages[0]
                for (field, messages) in error
            }
            return Response(errors, status=status.HTTP_400_BAD_REQUEST)
        except:
            errors = {'general': 'There was an error with the server. Try again later.'}
            return render(request, self.template, {'errors': errors, 'form': form})

        return Response(ProductSerializer(product).data, status=status.HTTP_201_CREATED)

    def get(self, request):
        product = Product.objects.all()
        return Response(ProductSerializer(product, many=True).data)


class ProductView(APIView):
    permission_classes = (IsAuthenticated,)

    def delete(self, request, product_id):
        Product.objects.filter(id=product_id).delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
