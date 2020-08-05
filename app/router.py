from django.conf import settings
from django.conf.urls import include
from django.urls import path

urlpatterns = [
    path('', include('dropshop.urls')),
]

if settings.DEBUG is True:
    handler404 = 'dropshop.errors.handle_404'
