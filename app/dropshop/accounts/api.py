from django.urls import path

from . import views

app_name = 'accounts'
urlpatterns = [
    path('', views.UsersApiView.as_view(), name='users'),
    path('sessions/', views.SessionsApiView.as_view(), name='sessions'),
]
