from typing import Optional
from django.contrib.auth import authenticate
from apps.notes.domain.interfaces import UserRepository
from apps.notes.domain.models import User
from apps.notes.models.custom_user_model import CustomModelUser


class DjangoUserRepository(UserRepository):
    def save(self, user: User) -> None:
        user_model = CustomModelUser.from_domain(user)
        user_model.save()

    def get_by_email(self, email: str) -> Optional[User]:
        try:
            user_model = CustomModelUser.objects.get(email=email)
            return user_model.to_domain()
        except CustomModelUser.DoesNotExist:
            return None

    def authenticate(self, email: str, password: str) -> Optional[User]:
        user = authenticate(email=email, password=password)
        if user is not None and isinstance(user, CustomModelUser):
            return user.to_domain()
        return None
