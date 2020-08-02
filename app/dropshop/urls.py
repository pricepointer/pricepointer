from django.urls import path, include

from . import models
from . import views
from .products import urls as products_urls
from .accounts.urls import urlpatterns as accounts_urls

urlpatterns = [
    path('', views.index, name='index'),

    *accounts_urls,
    path('products/', include(products_urls), name='products'),
]
