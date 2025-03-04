from dataclasses import dataclass
from datetime import datetime
from typing import Optional, List
from apps.notes.domain.value_objects import NoteContent, CategoryColor, NoteMetadata

@dataclass
class Category:
    name: str
    color: CategoryColor

    def change_color(self, new_color: CategoryColor) -> None:
        self.color = new_color

@dataclass
class Note:
    title: str
    content: NoteContent
    metadata: NoteMetadata
    user_id: int
    id: Optional[int] = None
    category: Optional[Category] = None

    def update_content(self, new_content: NoteContent) -> None:
        self.content = new_content
        self.metadata.last_edited = datetime.now()

    def change_category(self, new_category: Optional[Category]) -> None:
        self.category = new_category
        self.metadata.last_edited = datetime.now()

@dataclass
class User:
    email: str
    is_active: bool
    is_staff: bool
    id: Optional[int] = None
    notes: List[Note] = None

    def __post_init__(self):
        self.notes = self.notes or []

    def add_note(self, note: Note) -> None:
        if note.user_id != self.id:
            raise ValueError("Note doesn't belong to this user")
        self.notes.append(note)

    def remove_note(self, note_id: int) -> None:
        self.notes = [note for note in self.notes if note.id != note_id]

    def get_active_status(self) -> dict:
        return {
            'email': self.email,
            'is_active': self.is_active,
            'is_staff': self.is_staff
        }
