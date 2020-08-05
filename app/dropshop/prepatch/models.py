from django.apps import apps
from django.contrib.auth import checks as auth_checks, models as auth_models, apps as auth_apps

from ..accounts.models import User

auth_models.User = User
auth_apps.check_models_permissions = auth_checks.check_models_permissions = lambda *args, **kwargs: []

for auth_model in dict(apps.all_models['auth']):
    del apps.all_models['auth'][auth_model]
