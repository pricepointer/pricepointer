# Generated by Django 3.0.8 on 2020-08-26 00:07

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dropshop', '0002_price_product'),
    ]

    operations = [
        migrations.AddField(
            model_name='price',
            name='currency',
            field=models.CharField(default='$', max_length=5),
        ),
    ]