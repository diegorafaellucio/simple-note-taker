from django.urls import path
from apps.notes.views.note_view import NoteView
from apps.notes.views.category_view import CategoryView

urlpatterns = [
    # Notes endpoints
    path('notes/', NoteView.as_view(), name='note-list-create'),
    path('notes/<int:pk>/', NoteView.as_view(), name='note-detail'),

    # Categories endpoints
    path('categories/', CategoryView.as_view(), name='category-list-create'),
    path('categories/<int:pk>/', CategoryView.as_view(), name='category-detail'),
]