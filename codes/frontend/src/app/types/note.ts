export interface Note {
    id: number;
    title: string;
    content: string;
    category: number;
    last_edited: string;
    user: number;
}

export interface CreateNoteDto {
    title: string;
    content: string;
    category: number;
}

export interface UpdateNoteDto {
    title: string;
    content: string;
    category: number;
}
