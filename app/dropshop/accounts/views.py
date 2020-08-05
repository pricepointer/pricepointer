from django.core.exceptions import ValidationError
from django.shortcuts import redirect, render
from django.urls import reverse
from django.views import View
from rest_framework import exceptions, status
from rest_framework.permissions import BasePermission
from rest_framework.response import Response
from rest_framework.views import APIView

from .authentication import authenticate, create_user, login, logout, require_authentication
from ..products.serializers import UserSerializer


class UsersApiView(APIView):
    def post(self, request):
        data = request.data

        form = {
            'name': data['name'],
            'email': data['email']
        }

        try:
            user = create_user(**form, password=data['password'])
            user.save()
            login(request, user)
        except ValidationError as error:
            errors = {
                field: messages[0]
                for (field, messages) in error
            }
            return Response(errors, status=status.HTTP_400_BAD_REQUEST)

        return Response(UserSerializer(user).data)


class SessionsApiView(APIView):
    class CustomPermission(BasePermission):
        def has_permission(self, request, view):
            return bool(
                request.method in ('POST', 'HEAD', 'OPTIONS') or
                (request.user and
                 request.user.is_authenticated)
            )

    permission_classes = (CustomPermission,)

    def get(self, request):
        # Already logged in, getting self details
        return Response(UserSerializer(request.user).data)

    def post(self, request):
        # Login
        data = request.data
        form = {'email': data['email']}
        user = authenticate(request, **form, password=data['password'])
        login(request, user)
        return Response(UserSerializer(user).data)

    def delete(self, request):
        # Logout
        logout(request)
        return Response(status=status.HTTP_204_NO_CONTENT)


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
