from django.urls import path, include

from .products import urls as products_urls

urlpatterns = [
    path('products/', include(products_urls), name='products'),
]
