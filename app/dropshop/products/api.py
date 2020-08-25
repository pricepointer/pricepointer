from django.urls import path

from . import views

app_name = 'products'
urlpatterns = [
    # make url require parameter
    path('', views.ProductListView.as_view(), name='products'),
    path('<int:product_id>/', views.ProductView.as_view(), name='product')
]
