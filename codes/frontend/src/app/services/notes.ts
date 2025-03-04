import { api } from './api';
import { Note, CreateNoteDto, UpdateNoteDto } from '../types/note';
import { decodeJWT } from '../utils/jwt';

class NotesService {
    private getUserId(): number {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No authentication token found');
        
        const decoded = decodeJWT(token);
        if (!decoded?.user_id) throw new Error('Invalid token or missing user ID');
        
        const userId = Number(decoded.user_id);
        if (isNaN(userId)) throw new Error('Invalid user ID format');
        
        return userId;
    }

    async createNote(data: CreateNoteDto): Promise<Note> {
        const userId = this.getUserId();
        return api.post<Note>('/api/notes', {
            title: data.title,
            content: data.content,
            category: data.category,
            user: userId
        });
    }

    async updateNote(noteId: number, data: UpdateNoteDto): Promise<Note> {
        const userId = this.getUserId();
        return api.put<Note>(`/api/notes/${noteId}`, {
            title: data.title,
            content: data.content,
            category: data.category,
            user: userId
        });
    }

    async getNotes(categoryId?: number): Promise<Note[]> {
        const endpoint = categoryId 
            ? `/api/notes/?category=${categoryId}`
            : '/api/notes/';
        return api.get<Note[]>(endpoint);
    }

    async getNote(noteId: number): Promise<Note> {
        return api.get<Note>(`/api/notes/${noteId}/`);
    }

    async deleteNote(noteId: number): Promise<void> {
        return api.delete(`/api/notes/${noteId}/`);
    }
}

export const notesService = new NotesService();
