from django.http import HttpResponse
from django.template.loader import get_template
from .models import ConfirmationEmail


def check_confirmation(request, confirmation_code):
    confirmation = ConfirmationEmail.objects.filter(confirmation_code=confirmation_code).first()
    if confirmation:
        confirmation.user.is_active = True
        confirmation.user.save()
        confirmation.delete()
        template = get_template('emails/successfulpage.html')
        return HttpResponse(template.render())
    template = get_template('emails/failedpage.html')
    return HttpResponse(template.render())
