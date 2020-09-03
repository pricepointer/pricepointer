from django.conf import settings
from django.urls import include, path

from . import api, views
from .accounts.urls import urlpatterns as accounts_urls
from .email.urls import urlpatterns as email_urls
urlpatterns = [
    path('', views.index, name='index'),
    *accounts_urls,
    *email_urls,
    path('api/v{}/'.format(settings.API_VERSION), include(api, namespace='api')),
]
