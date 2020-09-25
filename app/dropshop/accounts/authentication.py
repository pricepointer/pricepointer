import random
import re
import string
from typing import Type

from django.contrib.auth import BACKEND_SESSION_KEY, HASH_SESSION_KEY, SESSION_KEY, _get_backends
from django.contrib.auth.signals import user_logged_in, user_logged_out
from django.core.exceptions import ValidationError
from django.core.validators import validate_email
from django.db import transaction
from django.middleware.csrf import rotate_token
from django.shortcuts import redirect
from django.urls import reverse
from django.utils.crypto import constant_time_compare
from django.utils.translation import LANGUAGE_SESSION_KEY, ugettext_lazy as _
from django.views import View
from rest_framework import exceptions
from rest_framework.authentication import BaseAuthentication, CSRFCheck

from .backends import ModelBackend
from .models import AnonymousUser, User
from ..email.business import send_confirmation_mail
from ..email.business import send_forgot_password_mail
from ..email.models import ConfirmationEmail, ForgotPasswordEmail

CONFIRMATION_CODE_LENGTH = 16


def create_confirmation_email(request, user):
    letters = string.ascii_letters
    while True:
        confirmation_code = ''.join(random.choice(letters) for i in range(CONFIRMATION_CODE_LENGTH))
        if not ConfirmationEmail.objects.filter(confirmation_code=confirmation_code).exists():
            break
    confirmation_email = ConfirmationEmail(confirmation_code=confirmation_code, user=user)
    confirmation_email.save()

    send_confirmation_mail(request, confirmation_email)


def authenticate(request, email, password):
    backend = ModelBackend()
    user = backend.authenticate(request, email=email, password=password)
    if not user:
        msg = _('The provided email address and/or password do not match our records.')
        raise exceptions.AuthenticationFailed(msg)

    return user


def forgot_password_user_check(request, email):
    user = User.objects.filter(email=email).first()
    if user:
        letters = string.ascii_letters
        while True:
            confirmation_code = ''.join(random.choice(letters) for i in range(CONFIRMATION_CODE_LENGTH))
            if not ForgotPasswordEmail.objects.filter(confirmation_code=confirmation_code).exists():
                break
        forgot_password_email = ForgotPasswordEmail(confirmation_code=confirmation_code, user=user)
        forgot_password_email.save()
        send_forgot_password_mail(request, forgot_password_email)
        return forgot_password_email
    else:
        raise ValidationError(message="No account found")


def change_password(password, confirmation_code):
    forgot_password = ForgotPasswordEmail.objects.filter(confirmation_code=confirmation_code).first()
    if forgot_password:
        forgot_password.user.set_password(password)
        forgot_password.user.save()
        forgot_password.delete()
    else:
        raise ValidationError(message="No account found")


def login(request, user, backend=None):
    """
    Persist a user id and a backend in the request. This way a user doesn't
    have to reauthenticate on every request. Note that data set during
    the anonymous session is retained when the user logs in.
    """
    session_auth_hash = ''
    if user is None:
        user = request.user
    if hasattr(user, 'get_session_auth_hash'):
        session_auth_hash = user.get_session_auth_hash()

    if SESSION_KEY in request.session:
        if _get_user_session_key(request) != user.pk or (
            session_auth_hash and
            not constant_time_compare(request.session.get(HASH_SESSION_KEY, ''), session_auth_hash)):
            # To avoid reusing another user's session, create a new, empty
            # session if the existing session corresponds to a different
            # authenticated user.
            request.session.flush()
    else:
        request.session.cycle_key()

    try:
        backend = backend or user.backend
    except AttributeError:
        backends = _get_backends(return_tuples=True)
        if len(backends) == 1:
            _, backend = backends[0]
        else:
            raise ValueError(
                'You have multiple authentication backends configured and '
                'therefore must provide the `backend` argument or set the '
                '`backend` attribute on the user.'
            )
    else:
        if not isinstance(backend, str):
            raise TypeError('backend must be a dotted import path string (got %r).' % backend)

    request.session[SESSION_KEY] = user._meta.pk.value_to_string(user)
    request.session[BACKEND_SESSION_KEY] = backend
    request.session[HASH_SESSION_KEY] = session_auth_hash
    if hasattr(request, 'user'):
        request.user = user
    rotate_token(request)
    user_logged_in.send(sender=user.__class__, request=request, user=user)


def logout(request):
    """
    Remove the authenticated user's ID from the request and flush their session
    data.
    """
    # Dispatch the signal before the user is logged out so the receivers have a
    # chance to find out *who* logged out.
    user = getattr(request, 'user', None)
    if not getattr(user, 'is_authenticated', True):
        user = None
    user_logged_out.send(sender=user.__class__, request=request, user=user)

    # remember language choice saved to session
    language = request.session.get(LANGUAGE_SESSION_KEY)

    request.session.flush()

    if language is not None:
        request.session[LANGUAGE_SESSION_KEY] = language

    if hasattr(request, 'user'):
        request.user = AnonymousUser()


def create_user(request, name, email, password):
    errors = {}
    if not (name and name.strip()):
        errors['name'] = ValidationError(message='Name is a required field')

    try:
        validate_email(email)
    except ValidationError:
        errors['email'] = ValidationError(message='Email must be valid')

    if User.objects.filter(email__iexact=email).exists():
        errors['email'] = ValidationError(message='This email address is already in use. Please sign in.')

    if not password:
        errors['password'] = ValidationError(message='Password is a required field')

    if errors:
        raise ValidationError(message=errors)

    with transaction.atomic():
        letters = string.ascii_letters
        while True:
            unique_code = ''.join(random.choice(letters) for i in range(CONFIRMATION_CODE_LENGTH))
            if not User.objects.filter(unique_code=unique_code).exists():
                break
        user = User(
            name=name,
            email=email,
            unique_code=unique_code
        )
        user.set_password(password)
        user.save()

        create_confirmation_email(request, user)

    return user


def _get_user_session_key(request):
    # This value in the session is always serialized to a string, so we need
    # to convert it back to Python whenever we access it.
    return User._meta.pk.to_python(request.session[SESSION_KEY])


class SessionAuthentication(BaseAuthentication):
    """
    Use Django's session framework for authentication.
    """

    def authenticate(self, request):
        """
        Returns a `User` if the request session currently has a logged in user.
        Otherwise returns `None`.
        """

        if re.match(r'^\/api', request.META.get('PATH_INFO', '')):
            return None

        # Get the session-based user from the underlying HttpRequest object
        user = getattr(request._request, 'user', None)

        # Unauthenticated, CSRF validation not required
        if not user or not user.is_active:
            return None

        self.enforce_csrf(request)

        # CSRF passed with authenticated user
        return (user, None)

    def enforce_csrf(self, request):
        """
        Enforce CSRF validation for session based authentication.
        """
        check = CSRFCheck()
        # populates request.META['CSRF_COOKIE'], which is used in process_view()
        check.process_request(request)
        reason = check.process_view(request, None, (), {})
        if reason:
            # CSRF failed, bail with explicit error message
            raise exceptions.PermissionDenied('CSRF Failed: %s' % reason)


def require_authentication(cls: Type[View]):
    """
    Decorator to require authentication for standard (i.e., non API views)

    Will redirect to signin
    :param cls:
    :return:
    """

    class AuthenticatedView(*cls.mro()):
        def dispatch(self, request, *args, **kwargs):
            if not bool(request.user and request.user.is_authenticated):
                return redirect('{}?next={}'.format(reverse('signin'), request.path_info))

            return super(AuthenticatedView, self).dispatch(request, *args, **kwargs)

    AuthenticatedView.__qualname__ = cls.__qualname__
    AuthenticatedView.__name__ = cls.__name__
    return AuthenticatedView
