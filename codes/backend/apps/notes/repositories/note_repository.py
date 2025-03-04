from typing import List, Optional
from apps.notes.domain.interfaces import NoteRepository
from apps.notes.domain.models import Note
from apps.notes.models.note_model import NoteModel
from apps.notes.models.category_model import CategoryModel


class DjangoNoteRepository(NoteRepository):
    def save(self, note: Note) -> None:
        note_model = NoteModel.from_domain(note)
        note_model.save()

    def get_by_id(self, note_id: int) -> Optional[Note]:
        try:
            note_model = NoteModel.objects.get(id=note_id)
            return note_model.to_domain()
        except NoteModel.DoesNotExist:
            return None

    def get_by_user(self, user_id: int) -> List[Note]:
        note_models = NoteModel.objects.filter(user_id=user_id)
        return [note_model.to_domain() for note_model in note_models]

    def delete(self, note_id: int) -> None:
        NoteModel.objects.filter(id=note_id).delete()
