from __future__ import absolute_import, unicode_literals

import os

from celery import Celery
from celery.schedules import crontab

from dropshop.products.business import discover_prices

# set the default Django settings module for the 'celery' program.

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'settings.production')

app = Celery('tasks')

# Using a string here means the worker doesn't have to serialize
# the configuration object to child processes.
# - namespace='CELERY' means all celery-related configuration keys
#   should have a `CELERY_` prefix.
app.config_from_object('django.conf:settings', namespace='CELERY')

# Load task modules from all registered Django app configs.
app.autodiscover_tasks()


@app.on_after_configure.connect
def setup_periodic_tasks(sender, **kwargs):
    # Calls test('hello') every 10 seconds.
    sender.add_periodic_task(10.0, price_and_email_check(), name='add every 10')


app.conf.beat_schedule = {
    # Executes every Monday morning at 7:30 a.m.
    'price-update-and-emails': {
        'task': 'tasks.price_and_email_check',
        'schedule': crontab(hour='*'),
        'args': (16, 16),
    },
}


@app.task
def price_and_email_check():
    discover_prices()


@app.task(bind=True)
def debug_task(self):
    print('Request: {0!r}'.format(self.request))


if __name__ == '__main__':
    app.start()
