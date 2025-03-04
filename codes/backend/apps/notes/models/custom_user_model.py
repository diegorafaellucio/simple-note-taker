from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from apps.notes.managers.custom_user_manager import CustomUserManager
from apps.notes.domain.models import User


class CustomModelUser(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    objects = CustomUserManager()

    class Meta:
        app_label = 'notes'
        db_table = 'custom_user'

    def __str__(self):
        return self.email

    def to_domain(self) -> User:
        return User(
            id=self.id,
            email=self.email,
            is_active=self.is_active,
            is_staff=self.is_staff
        )

    @classmethod
    def from_domain(cls, user: User) -> 'CustomModelUser':
        return cls(
            id=user.id,
            email=user.email,
            is_active=user.is_active,
            is_staff=user.is_staff
        )