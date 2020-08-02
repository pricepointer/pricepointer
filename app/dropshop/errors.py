import json
import traceback

from django.conf import settings
from django.http import HttpResponse
from django.utils.deprecation import MiddlewareMixin
from rest_framework import status as statuses
from rest_framework.exceptions import APIException


def handle_404(request, exception):
    return build_response(
        name='Not Found',
        status=statuses.HTTP_404_NOT_FOUND,
        message=(exception.message if exception.message else 'The requested page could not be found.')
    )


def exception_handler(exc, context=None):
    """
    Returns the response that should be used for any given exception.
    Any unhandled exceptions may return `None`, which will cause a 500 error
    to be raised.
    """
    headers = {}
    if getattr(exc, 'auth_header', None):
        headers['WWW-Authenticate'] = exc.auth_header
    if getattr(exc, 'wait', None):
        headers['Retry-After'] = str(exc.wait)
    traceback.print_exc()
    if isinstance(exc, APIException):
        return handle_exception(exc)
    elif settings.DEBUG:
        return None
    else:
        return handle_exception(exc)


def handle_exception(exception: Exception, headers: dict = None):
    name = exception.name if hasattr(exception, 'name') else type(exception).__name__
    message = exception.message if hasattr(exception, 'message') else (
        exception.detail if hasattr(exception, 'detail') else None
    )
    status = exception.status if hasattr(exception, 'status') else (
        exception.status_code if hasattr(exception, 'status_code') else None
    )
    return build_response(
        name=name,
        message=message,
        status=status,
        errors=(exception.errors if hasattr(exception, 'errors') else None),
        headers=headers
    )


def build_response(
    name='Server Error',
    message=None,
    status=500,
    errors=None,
    headers: dict = {}
):
    response = HttpResponse(
        content_type="application/json",
        status=status,
        content=json.dumps(
            {
                'errors': errors,
                'description': message,
                'type': name
            } if errors else {
                'type': name,
                'description': message
            }
        )
    )

    if headers:
        for header, value in headers.items():
            response[header] = value

    return response


class HandleExceptionMiddleware(MiddlewareMixin):
    def process_exception(self, request, exception):
        if settings.DEBUG:
            # pass through
            return None
        else:
            # TODO: Send to 404 page
            pass
        return None
