from typing import List, Optional
from datetime import datetime
from apps.notes.domain.models import Note
from apps.notes.domain.value_objects import NoteContent, NoteMetadata
from apps.notes.domain.interfaces import NoteRepository, CategoryRepository


class NoteService:
    def __init__(self, note_repo: NoteRepository, category_repo: CategoryRepository):
        self.note_repo = note_repo
        self.category_repo = category_repo

    def create_note(self, title: str, content: str, user_id: int, category_name: Optional[str] = None) -> Note:
        note_content = NoteContent(content)
        metadata = NoteMetadata(
            created_at=datetime.now(),
            last_edited=datetime.now(),
            category_name=category_name
        )
        
        category = None
        if category_name:
            category = self.category_repo.get_by_name(category_name)
            if not category:
                raise ValueError(f"Category {category_name} not found")

        note = Note(
            title=title,
            content=note_content,
            metadata=metadata,
            user_id=user_id,
            category=category
        )
        
        self.note_repo.save(note)
        return note

    def get_user_notes(self, user_id: int) -> List[Note]:
        return self.note_repo.get_by_user(user_id)

    def update_note(self, note_id: int, title: Optional[str] = None, 
                   content: Optional[str] = None, category_name: Optional[str] = None) -> Note:
        note = self.note_repo.get_by_id(note_id)
        if not note:
            raise ValueError(f"Note {note_id} not found")

        if title:
            note.title = title
        if content:
            note.update_content(NoteContent(content))
        if category_name is not None:  # Allow setting to None to remove category
            category = self.category_repo.get_by_name(category_name) if category_name else None
            note.change_category(category)

        self.note_repo.save(note)
        return note
