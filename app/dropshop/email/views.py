from django.http import HttpResponse
from django.shortcuts import render
from django.template.loader import get_template

from .models import ConfirmationEmail, ForgotPasswordEmail, User


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


def forgot_password(request, confirmation_code):
    forgotpassword = ForgotPasswordEmail.objects.filter(confirmation_code=confirmation_code).first()
    if forgotpassword:
        template = 'accounts/reset.html'
        return render(request, template, {'confirmation_code': confirmation_code})
    template = 'emails/failedpage.html'
    return render(request, template)


def unsubscribe(request, unique_code):
    user = User.objects.filter(unique_code=unique_code).first()
    if user:
        user.is_active = False
        user.save()
        template = 'accounts/unsubscribe.html'
        return render(request, template, {'unique_code': unique_code})
    template = 'emails/failedpage.html'
    return render(request, template)
