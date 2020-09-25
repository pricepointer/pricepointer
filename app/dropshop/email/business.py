import re
from decimal import Decimal, ROUND_HALF_UP

from django.template.loader import get_template
from django.urls import reverse
from post_office import mail


def send_forgot_password_mail(request, forgot_password_email):
    context = {
        'website': request.build_absolute_uri(
            reverse('forgotpassword', kwargs={'confirmation_code': forgot_password_email.confirmation_code})),
        'unsubscribe': request.build_absolute_uri(
            reverse('unsubscribe', kwargs={'unique_code': forgot_password_email.user.unique_code})),
    }
    template = get_template('emails/forgotpasswordemail.html')
    message = template.render(context)

    return mail.send(
        forgot_password_email.user.email,  # List of email addresses also accepted
        'no-reply@pricepointer.co',
        subject='Pricepointer password reset',
        message=message,
        html_message=message,
        priority='now',
    )


def send_error_mail(item, website, to_email, unsub_code):
    context = {
        'item': item,
        'website': website,
        'unsub_code': unsub_code,
    }
    template = get_template('emails/erroremail.html')
    message = template.render(context)

    return mail.send(
        to_email,  # List of email addresses also accepted
        'no-reply@pricepointer.co',
        subject=item + ' cannot be found!',
        message=message,
        html_message=message,
        priority='now',
    )


def send_confirmation_mail(request, confirmation_email):
    context = {
        'activate_link': request.build_absolute_uri(
            reverse('confirmation', kwargs={'confirmation_code': confirmation_email.confirmation_code})),
        'unsubscribe': request.build_absolute_uri(
            reverse('unsubscribe', kwargs={'unique_code': confirmation_email.user.unique_code})),
    }
    template = get_template('emails/confirmationemail.html')
    message = template.render(context)

    return mail.send(
        confirmation_email.user.email,  # List of email addresses also accepted
        'no-reply@pricepointer.co',
        subject='Pricepointer account activation',
        message=message,
        html_message=message,
        priority='now',
    )


def send_mail(item, website, original_price, current_price, threshold_price, to_email, unsub_code):

    remove_non_digit = re.compile(r'[^\d.]+')
    original_price_digit = remove_non_digit.sub('', original_price)

    current_price_digit = remove_non_digit.sub('', current_price)

    percent_difference = (1 - (Decimal(current_price_digit) / Decimal(original_price_digit))) * 100
    percent_difference = percent_difference.quantize(Decimal('.01'), rounding=ROUND_HALF_UP)
    percent_difference = str(percent_difference)
    percent_difference += '%'
    context = {
        'item': item,
        'website': website,
        'original_price': original_price,
        'current_price': current_price,
        'threshold_price': threshold_price,
        'percent_difference': percent_difference,
        'unsub_code': unsub_code,
    }
    template = get_template('emails/mainemail.html')
    message = template.render(context)

    return mail.send(
        to_email,  # List of email addresses also accepted
        'no-reply@pricepointer.co',
        subject=item + ' on sale!',
        message=message,
        html_message=message,
        priority='now',
    )
