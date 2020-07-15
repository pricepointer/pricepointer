import os
from importlib import import_module
from django.conf import settings

directory = os.path.dirname(os.path.realpath(__file__))

for subdir, dirs, files in os.walk(os.path.dirname(os.path.realpath(__file__))):
    if directory == subdir:
        # Skip the files for the top-level directory
        continue

    for file in files:
        if file == 'models.py':
            modulepath = subdir.replace('{}'.format(directory), settings.ROOT_APP).replace(os.sep, '.')
            filepath = modulepath + '.models'
            try:
                globals().update(import_module(filepath).__dict__)
            except ImportError:
                raise
            break
