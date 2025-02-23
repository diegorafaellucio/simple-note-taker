from rest_framework import serializers, viewsets
from apps.notes.models.note_model import NoteModel


class NoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = NoteModel
        fields = '__all__'