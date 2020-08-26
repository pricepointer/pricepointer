from django.template.loader import get_template
from post_office import mail


def send_error_mail(item, website, to_email):
    context = {
        'item': item,
        'website': website,
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
