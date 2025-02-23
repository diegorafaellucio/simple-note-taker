from django.db import models

class CategoryModel(models.Model):
    CATEGORY_CHOICES = [
        ('random_thoughts', 'Random Thoughts'),
        ('school', 'School'),
        ('personal', 'Personal')
    ]
    name = models.CharField(max_length=50, choices=CATEGORY_CHOICES, unique=True)
    color = models.CharField(max_length=7, default="#ffffff")  # Hex color

    class Meta:
        db_table = 'category'
