from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse, HttpRequest
from django.views.decorators.http import require_http_methods
from apps.notes.services.note_service import NoteService
from apps.notes.repositories.note_repository import DjangoNoteRepository
from apps.notes.repositories.category_repository import DjangoCategoryRepository


def get_note_service() -> NoteService:
    """Factory function to create NoteService with its dependencies"""
    return NoteService(
        note_repo=DjangoNoteRepository(),
        category_repo=DjangoCategoryRepository()
    )


@login_required
def main_page(request: HttpRequest):
    """Main page view that lists all notes for the logged-in user"""
    note_service = get_note_service()
    user_notes = note_service.get_user_notes(request.user.id)
    
    return render(request, 'notes/main.html', {
        'notes': user_notes,
        'user': request.user
    })


@login_required
@require_http_methods(['GET'])
def api_list_notes(request: HttpRequest):
    """API endpoint to list notes for the logged-in user"""
    note_service = get_note_service()
    user_notes = note_service.get_user_notes(request.user.id)
    
    notes_data = [{
        'id': note.id,
        'title': note.title,
        'content': str(note.content),
        'created_at': note.metadata.created_at.isoformat(),
        'last_edited': note.metadata.last_edited.isoformat(),
        'category': note.metadata.category_name
    } for note in user_notes]
    
    return JsonResponse({'notes': notes_data})
