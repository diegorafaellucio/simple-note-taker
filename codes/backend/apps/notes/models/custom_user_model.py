from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from apps.notes.managers.custom_user_manager import CustomUserManager


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

    def get_user_status(self):
        # Good place to add a breakpoint for debugging
        status = {
            'email': self.email,
            'is_active': self.is_active,
            'is_staff': self.is_staff,
            'is_superuser': self.is_superuser
        }
        return status