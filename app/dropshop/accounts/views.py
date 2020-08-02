from django.shortcuts import render, redirect
from django.urls import reverse
from django.views import View

from .authentication import authenticate, require_authentication, logout, login


def signup(request):
    return render(request, 'accounts/signup.html')


class LoginView(View):
    def get(self, request):
        if request.user and request.user.is_authenticated:
            return redirect(reverse('dashboard'))

        return render(request, 'accounts/login.html')

    def post(self, request):
        data = request.POST
        query = request.GET
        user = authenticate(request, email=data.get('email'), password=data.get('password'))
        login(request, user)

        destination = query.get('next', reverse('index'))
        return redirect(destination)


@require_authentication
class LogoutView(View):
    def get(self, request):
        logout(request)
        return redirect(reverse('index'))
