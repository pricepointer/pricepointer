from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

from . import views

app_name = 'accounts'
urlpatterns = [
    path('', views.UsersApiView.as_view(), name='users'),
    path('me/', views.UserMeView.as_view(), name='me'),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('forgotpassword/', views.ForgotPasswordView.as_view(), name='forgot_password'),
]
