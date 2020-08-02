from django.urls import path

from . import views

urlpatterns = [
    path('signup/', views.signup, name='signup'),
    path('signin/', views.LoginView.as_view(), name='signin'),
    path('signout/', views.LogoutView.as_view(), name='signout'),
]
