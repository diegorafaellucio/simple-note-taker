"use client";

import React from "react";
import { useRouter } from "next/navigation";

interface NoteCardProps {
    note: {
        id: number;
        title: string;
        content: string;
        last_edited: string;
        category: number;
    };
    category?: {
        name: string;
        color: string;
    };
}

const NoteCard: React.FC<NoteCardProps> = ({ note, category }) => {
    const router = useRouter();

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const today = new Date();
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        if (date.toDateString() === today.toDateString()) {
            return "today";
        } else if (date.toDateString() === yesterday.toDateString()) {
            return "yesterday";
        } else {
            return `${date.toLocaleString('default', { month: 'short' })} ${date.getDate()}`;
        }
    };

    const categoryName = category?.name.replace("_", " ") || "Uncategorized";
    const categoryColor = category?.color || "#F5F5F5";
    const backgroundColor = `rgba(${parseInt(categoryColor.slice(1, 3), 16)}, ${parseInt(categoryColor.slice(3, 5), 16)}, ${parseInt(categoryColor.slice(5, 7), 16)}, 0.2)`;

    return (
        <div
            onClick={() => router.push(`/notes/new?id=${note.id}`)}
            className="p-6 rounded-lg cursor-pointer transition-transform hover:scale-[1.02] flex flex-col border-2"
            style={{ 
                width: '303px',
                height: '246px',
                backgroundColor,
                borderColor: categoryColor
            }}
        >
            <div className="flex items-start mb-2 text-sm text-black gap-2">
                <span className="font-bold">{formatDate(note.last_edited)}</span>
                <span className="capitalize">{categoryName}</span>
            </div>
            
            <h3 className="text-2xl font-serif mb-3 font-bold">{note.title}</h3>
            
            <p className="text-black line-clamp-4 flex-grow">
                {note.content}
            </p>
        </div>
    );
};

export default NoteCard;
