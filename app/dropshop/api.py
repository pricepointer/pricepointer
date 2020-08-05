from django.urls import path, include

from .products import api as products_api
from .accounts import api as accounts_api

app_name = 'api'
urlpatterns = [
    path('accounts/', include(accounts_api, namespace='accounts')),
    path('products/', include(products_api, namespace='products')),
]
