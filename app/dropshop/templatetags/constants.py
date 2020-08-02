from django import template

from .. import config as configuration

register = template.Library()


@register.simple_tag
def config(value):
    return getattr(configuration, value)
