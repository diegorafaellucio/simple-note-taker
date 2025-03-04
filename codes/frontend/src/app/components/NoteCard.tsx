// src/components/NoteCard.tsx

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
    const router = useRouter(); // Hook para navegação

    // Definir cor da categoria com fallback
    const categoryColor = category?.color || "#F5F5F5";
    const backgroundColor = `rgba(${parseInt(categoryColor.slice(1, 3), 16)}, ${parseInt(categoryColor.slice(3, 5), 16)}, ${parseInt(categoryColor.slice(5, 7), 16)}, 0.5)`;

    // Função para formatar a data corretamente
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const today = new Date();
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        if (date.toDateString() === today.toDateString()) {
            return "Hoje";
        } else if (date.toDateString() === yesterday.toDateString()) {
            return "Ontem";
        } else {
            return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
        }
    };

    return (
        <div
            key={note.id}
            onClick={() => router.push(`/notes/new?id=${note.id}`)} // Redirecionamento ao clicar
            className="p-4 rounded-lg shadow-md border-2 w-[303px] h-[246px] flex flex-col justify-between cursor-pointer transition-transform hover:scale-105"
            style={{ backgroundColor, borderColor: categoryColor }}
        >
            {/* Data e Categoria */}
            <p className="font-bold text-sm">
                {formatDate(note.last_edited)} <span className="font-normal">{category?.name.replace("_", " ") || "Sem Categoria"}</span>
            </p>

            {/* Título da Nota */}
            <h4 className="font-bold text-lg truncate">{note.title}</h4>

            {/* Trecho do conteúdo */}
            <p className="text-sm line-clamp-3">{note.content}</p>
        </div>
    );
};

export default NoteCard;
