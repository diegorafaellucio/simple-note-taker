from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from apps.notes.models.category_model import CategoryModel
from apps.notes.models.note_model import NoteModel
from apps.notes.models.custom_user_model import CustomModelUser

@admin.register(CategoryModel)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'color')  # Show these fields in the admin list view
    search_fields = ('name',)  # Enable search by category name
    ordering = ('name',)  # Order categories alphabetically

@admin.register(NoteModel)
class NoteAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'category', 'user', 'last_edited')  # Show these fields
    list_filter = ('category', 'user', 'last_edited')  # Filter options in admin
    search_fields = ('title', 'content')  # Search by title and content
    ordering = ('-last_edited',)  # Show most recently edited notes first

@admin.register(CustomModelUser)
class CustomUserAdmin(UserAdmin):
    list_display = ('email', 'is_staff', 'is_active')
    list_filter = ('is_staff', 'is_active')
    search_fields = ('email',)
    ordering = ('email',)
    
    # Define the fieldsets for add/edit forms
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Permissions', {'fields': ('is_staff', 'is_active', 'is_superuser', 'groups', 'user_permissions')}),
    )
    
    # Define the fields for adding a new user
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'password1', 'password2', 'is_staff', 'is_active')
        }),
    )
