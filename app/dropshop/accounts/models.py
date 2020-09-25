from django.db import models
from django.utils.translation import gettext_lazy as _

from .abstract import PasswordMixin


class AnonymousUser:
    id = None
    pk = None

    is_active = False
    is_staff = False
    is_anonymous = True
    is_authenticated = False

    def __str__(self):
        return 'AnonymousUser'

    def __eq__(self, other):
        return isinstance(other, self.__class__)

    def __hash__(self):
        return 1  # instances always return the same hash value

    def __int__(self):
        raise TypeError('Cannot cast AnonymousUser to int. Are you trying to use it in place of User?')

    def save(self):
        raise NotImplementedError("Django doesn't provide a DB representation for AnonymousUser.")

    def delete(self):
        raise NotImplementedError("Django doesn't provide a DB representation for AnonymousUser.")

    def set_password(self, raw_password):
        raise NotImplementedError("Django doesn't provide a DB representation for AnonymousUser.")

    def check_password(self, raw_password):
        raise NotImplementedError("Django doesn't provide a DB representation for AnonymousUser.")


class User(PasswordMixin):
    """
    Represents a user login
    """
    name = models.CharField(_('first name'), max_length=250, blank=True)
    email = models.EmailField(_('email address'), unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(
        _('active'),
        default=False,
    )
    unique_code = models.TextField()
    is_authenticated = True
    is_anonymous = False

    REQUIRED_FIELDS = ('name',)
    USERNAME_FIELD = 'email'

    @property
    def is_staff(self):
        return False
