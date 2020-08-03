from django.core.exceptions import ValidationError
from django.shortcuts import render, redirect
from django.urls import reverse
from django.views import View
from rest_framework import exceptions

from .authentication import authenticate, require_authentication, logout, login, create_user


class SignupView(View):
    template = 'accounts/signup.html'

    def get(self, request):
        if request.user and request.user.is_authenticated:
            return redirect(reverse('index'))

        return render(request, self.template)

    def post(self, request):
        data = request.POST
        query = request.GET

        form = {
            'name': data.get('name'),
            'email': data.get('email')
        }

        try:
            user = create_user(**form, password=data.get('password'))
            login(request, user)
        except ValidationError as error:
            errors = {
                field: messages[0]
                for (field, messages) in error
            }
            return render(request, self.template, {'errors': errors, 'form': form})
        except:
            errors = {'general': 'There was an error with the server. Try again later.'}
            return render(request, self.template, {'errors': errors, 'form': form})

        destination = query.get('next', reverse('index'))
        return redirect(destination)


class LoginView(View):
    template = 'accounts/login.html'

    def get(self, request):
        if request.user and request.user.is_authenticated:
            return redirect(reverse('index'))

        return render(request, self.template)

    def post(self, request):
        data = request.POST
        query = request.GET
        form = {'email': data.get('email')}
        try:
            user = authenticate(request, **form, password=data.get('password'))
            login(request, user)
        except exceptions.AuthenticationFailed as error:
            errors = {'general': error.detail}
            return render(request, self.template, {'errors': errors, 'form': form})
        except:
            errors = {'general': 'There was an error with the server. Try again later.'}
            return render(request, self.template, {'errors': errors, 'form': form})

        destination = query.get('next', reverse('index'))
        return redirect(destination)


@require_authentication
class LogoutView(View):
    def get(self, request):
        logout(request)
        return redirect(reverse('index'))
