from abc import ABC, abstractmethod
from typing import List, Optional
from apps.notes.domain.value_objects import NoteContent, CategoryColor, NoteMetadata

class NoteRepository(ABC):
    @abstractmethod
    def save(self, note: 'Note') -> None:
        pass

    @abstractmethod
    def get_by_id(self, note_id: int) -> Optional['Note']:
        pass

    @abstractmethod
    def get_by_user(self, user_id: int) -> List['Note']:
        pass

    @abstractmethod
    def delete(self, note_id: int) -> None:
        pass

class CategoryRepository(ABC):
    @abstractmethod
    def save(self, category: 'Category') -> None:
        pass

    @abstractmethod
    def get_by_name(self, name: str) -> Optional['Category']:
        pass

    @abstractmethod
    def get_all(self) -> List['Category']:
        pass

class UserRepository(ABC):
    @abstractmethod
    def save(self, user: 'User') -> None:
        pass

    @abstractmethod
    def get_by_email(self, email: str) -> Optional['User']:
        pass

    @abstractmethod
    def authenticate(self, email: str, password: str) -> Optional['User']:
        pass
