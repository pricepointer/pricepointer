import re
from decimal import *

from django.template.loader import get_template
from post_office import mail


def send_mail(item, website, original_price, current_price, threshold_price, to_email):
    # item = 'Patagonia vest'
    # website = 'https://www.amazon.com/Aduro-Sport-Adjustable-Equipment-20lbs-32lbs/dp/B086KYF5JY/ref=sr_1_2_sspa' \
    #           '?dchild=1&keywords=weighted+vest&qid=1596231913&sr=8-2-spons&psc=1&spLa' \
    #           '=ZW5jcnlwdGVkUXVhbGlmaWVyPUEzTFZTRkZNSFI2VTFQJmVuY3J5cHRlZElkPUEwNjIzNzU0RTlZT05ISVFBVFFMJmVuY3J5cHRlZEFkSWQ9QTAzNTM5MjIyRlM0NkIySkc5NEhNJndpZGdldE5hbWU9c3BfYXRmJmFjdGlvbj1jbGlja1JlZGlyZWN0JmRvTm90TG9nQ2xpY2s9dHJ1ZQ=='
    # original_price = '$50.00'
    # current_price = '$30.00'
    # threshold_price = '$40.00'

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
        'percent_difference': percent_difference
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
