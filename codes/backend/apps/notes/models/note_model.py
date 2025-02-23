from django.db import models
from django.contrib.auth.models import User
from apps.notes.models.category_model import CategoryModel


class NoteModel(models.Model):
    title = models.CharField(max_length=255, default="Untitled")
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    category = models.ForeignKey(CategoryModel, on_delete=models.SET_NULL, null=True)
    content = models.TextField(blank=True, default="")
    last_edited = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'note'
