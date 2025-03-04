from django.db import models
from apps.notes.domain.models import Category
from apps.notes.domain.value_objects import CategoryColor


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

    def to_domain(self) -> Category:
        return Category(
            name=self.name,
            color=CategoryColor(self.color)
        )

    @classmethod
    def from_domain(cls, category: Category) -> 'CategoryModel':
        return cls(
            name=category.name,
            color=category.color.hex_value
        )
