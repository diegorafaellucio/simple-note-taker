from dataclasses import dataclass
from datetime import datetime
from typing import Optional

@dataclass(frozen=True)
class NoteContent:
    content: str

    def __post_init__(self):
        if len(self.content) > 10000:  # Example validation
            raise ValueError("Note content too long")

@dataclass(frozen=True)
class CategoryColor:
    hex_value: str

    def __post_init__(self):
        if not self.hex_value.startswith("#") or len(self.hex_value) != 7:
            raise ValueError("Invalid hex color format")

@dataclass(frozen=True)
class NoteMetadata:
    created_at: datetime
    last_edited: datetime
    category_name: Optional[str] = None
