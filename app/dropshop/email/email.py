import os

from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
# from_address we pass to our Mail object, edit with your name
FROM_EMAIL = 'andrew@pricepointer.co'


def send_email(sendemail, name, item, price, html):
    """ Send an email to the provided email addresses

    :returns API response code
    :raises Exception e: raises an exception """
    message = Mail(
        from_email=FROM_EMAIL,
        to_emails=sendemail,
        subject='A Test from SendGrid!',
        html_content='<strong>Hey %s! we have tracked that your item, %s, is on sale for %d!'.format(name, item,
                                                                                                     price) +
                     '<a href=''%s''>Click here to view now!</a></strong>'.format(html))
    try:
        sg = SendGridAPIClient(os.environ.get('SENDGRID_API_KEY'))
        response = sg.send(message)
        code, body, headers = response.status_code, response.body, response.headers
        print(f"Response Code: {code} ")
        print(f"Response Body: {body} ")
        print(f"Response Headers: {headers} ")
        print("Message Sent!")
    except Exception as e:
        print("Error: {0}".format(e))
    return str(response.status_code)
