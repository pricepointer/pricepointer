from __future__ import absolute_import, unicode_literals

import os

from celery import Celery

# set the default Django settings module for the 'celery' program.
from celery.schedules import crontab

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'settings.production')

app = Celery('tasks')

# Using a string here means the worker doesn't have to serialize
# the configuration object to child processes.
# - namespace='CELERY' means all celery-related configuration keys
#   should have a `CELERY_` prefix.
app.config_from_object('django.conf:settings', namespace='CELERY')

# Load task modules from all registered Django app configs.
app.autodiscover_tasks()

app.conf.beat_schedule = {
    # runs everu hour
    'price-update-and-emails': {
        'task': 'dropshop.tasks.price_and_email_check',
        'schedule': crontab(hour='*'),
    },
    'clear-expired-emails': {
        'task': 'dropshop.tasks.clear_expired_emails',
        'schedule': crontab(minute='*'),
    },
}


@app.task(bind=True)
def debug_task(self):
    print('Request: {0!r}'.format(self.request))


if __name__ == '__main__':
    app.start()
