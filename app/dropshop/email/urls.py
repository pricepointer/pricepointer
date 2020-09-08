from django.urls import path

from . import views

urlpatterns = [
    # path('confirmation', views.ConfirmationCreateViews.as_view(), name='confirmation-create'),
    path('confirmation/<str:confirmation_code>/', views.check_confirmation, name='confirmation'),
    path('password/<str:confirmation_code>/', views.forgot_password, name='forgotpassword'),
]
