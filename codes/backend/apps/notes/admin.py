from django.contrib import admin
from apps.notes.models.category_model import CategoryModel
from apps.notes.models.note_model import NoteModel

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
