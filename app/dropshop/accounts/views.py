from django.core.exceptions import ValidationError
from django.shortcuts import redirect, render
from django.urls import reverse
from django.views import View
from rest_framework import exceptions, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

from .authentication import (
    authenticate,
    change_password,
    create_user,
    forgot_password_user_check,
    login,
    logout,
    require_authentication,
)
from ..products.serializers import UserSerializer


class UsersApiView(APIView):
    def post(self, request):
        data = request.data

        form = {
            'name': data.get('name'),
            'email': data.get('email')
        }

        try:
            user = create_user(request, **form, password=data.get('password'))
            login(request, user)
        except ValidationError as error:
            errors = {
                field: messages[0]
                for (field, messages) in error
            }
            return Response(errors, status=status.HTTP_400_BAD_REQUEST)

        refresh = RefreshToken.for_user(user)
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user': UserSerializer(user).data,
        })


class UserMeView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        # Already logged in, getting self details
        if request.user.is_active is False:
            error = {'error': 'Account not confirmed yet'}
            return Response(error, status=status.HTTP_401_UNAUTHORIZED)
        return Response(UserSerializer(request.user).data)


class SignupView(View):
    template = 'accounts/signup.html'

    def get(self, request):
        if request.user and request.user.is_authenticated:
            return redirect(reverse('profile'))

        return render(request, self.template)

    def post(self, request):
        data = request.POST
        query = request.GET

        form = {
            'name': data.get('name'),
            'email': data.get('email')
        }

        try:
            user = create_user(request, **form, password=data.get('password'))
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

        destination = query.get('next', reverse('profile'))
        return redirect(destination)


@require_authentication
class ProfileView(View):
    template = 'accounts/profile.html'

    def get(self, request):
        return render(request, self.template)


class LoginView(View):
    template = 'accounts/login.html'

    def get(self, request):
        if request.user and request.user.is_authenticated:
            return redirect(reverse('profile'))

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

        destination = query.get('next', reverse('profile'))
        return redirect(destination)


@require_authentication
class LogoutView(View):
    def get(self, request):
        logout(request)
        return redirect(reverse('index'))


class ForgotPasswordView(APIView):
    def post(self, request):
        email = request.data['email']
        try:
            forgot_password = forgot_password_user_check(request, email)
        except ValidationError as err:
            error = {
                'error': err,
            }
            return Response(error, status=status.HTTP_404_NOT_FOUND)
        return Response({'email': forgot_password.user.email})


class ChangePasswordView(APIView):
    def post(self, request):
        password = request.data['password']
        confirmation_code = request.data['confirmationCode']
        try:
            change_password(password, confirmation_code)
            return Response({
                'response': 'success'
            })
        except ValidationError as err:
            error = {
                'error': err,
            }

            return Response(error, status=status.HTTP_404_NOT_FOUND)
