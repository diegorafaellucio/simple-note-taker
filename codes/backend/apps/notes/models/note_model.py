from django.db import models
from django.conf import settings
from django.utils import timezone
from apps.notes.models.category_model import CategoryModel
from apps.notes.domain.models import Note
from apps.notes.domain.value_objects import NoteContent, NoteMetadata
from typing import Optional


class NoteModel(models.Model):
    title = models.CharField(max_length=255, default="Untitled")
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    category = models.ForeignKey(CategoryModel, on_delete=models.SET_NULL, null=True)
    content = models.TextField(blank=True, default="")
    last_edited = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'note'

    def to_domain(self) -> Note:
        return Note(
            id=self.id,
            title=self.title,
            content=NoteContent(self.content),
            metadata=NoteMetadata(
                created_at=self.created_at,
                last_edited=self.last_edited,
                category_name=self.category.name if self.category else None
            ),
            user_id=self.user_id,
            category=self.category.to_domain() if self.category else None
        )

    @classmethod
    def from_domain(cls, note: Note) -> 'NoteModel':
        instance = cls(
            id=note.id,
            title=note.title,
            content=note.content.content,
            user_id=note.user_id,
        )
        if note.category:
            instance.category = CategoryModel.objects.get(name=note.category.name)
        return instance
