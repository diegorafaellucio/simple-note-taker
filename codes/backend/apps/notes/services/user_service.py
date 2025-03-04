from typing import Optional
from apps.notes.domain.models import User
from apps.notes.domain.interfaces import UserRepository


class UserService:
    def __init__(self, user_repo: UserRepository):
        self.user_repo = user_repo

    def get_user_by_email(self, email: str) -> Optional[User]:
        return self.user_repo.get_by_email(email)

    def authenticate_user(self, email: str, password: str) -> Optional[User]:
        return self.user_repo.authenticate(email, password)
