"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function NotesPage() {
    const router = useRouter();
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [notes, setNotes] = useState([]);
    const [categoryNotesCount, setCategoryNotesCount] = useState({});

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/login");
            return;
        }

        fetch(`${API_URL}/api/categories/`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(async (response) => {
                if (!response.ok) {
                    throw new Error(`HTTP Error ${response.status}: ${await response.text()}`);
                }
                return response.json();
            })
            .then((data) => {
                if (Array.isArray(data)) {
                    setCategories(data);
                    const counts = {};
                    data.forEach((category) => {
                        fetch(`${API_URL}/api/notes/?category=${category.id}`, {
                            headers: { Authorization: `Bearer ${token}` },
                        })
                            .then((response) => response.json())
                            .then((notesData) => {
                                counts[category.id] = notesData.length || 0;
                            });
                    });
                    setCategoryNotesCount(counts);
                } else {
                    setCategories([]);
                }
            })
            .catch((error) => console.error("Error fetching categories:", error));
    }, [router]);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return;

        const endpoint = selectedCategory === null
            ? `${API_URL}/api/notes/`
            : `${API_URL}/api/notes/?category=${selectedCategory}`;

        fetch(endpoint, { headers: { Authorization: `Bearer ${token}` } })
            .then((response) => response.json())
            .then(setNotes);
    }, [selectedCategory]);

    return (
        <div className="flex flex-col items-center h-screen bg-background p-8 max-w-[1280px] mx-auto">
            {/* Header */}
            <div className="flex justify-between items-center w-full mb-4">
                <h1 className="text-xl font-bold">Notes</h1>
                <button
                    className="px-5 py-2 border border-primary text-primary rounded-full hover:bg-primary hover:text-white transition"
                    onClick={async () => {
                        const token = localStorage.getItem("token");
                        const response = await fetch(`${API_URL}/api/notes/`, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${token}`,
                            },
                            body: JSON.stringify({
                                title: "Note Title",
                                content: "",
                                user: 1,
                                category: 1,
                            }),
                        });
                        if (response.ok) {
                            const newNote = await response.json();
                            router.push(`/notes/new?id=${newNote.id}`);
                        }
                    }}
                >
                    + New Note
                </button>
            </div>

            <div className="flex flex-row flex-1 w-full">
                {/* Category List */}
                <div className="w-[25%] pr-6 text-black font-normal">
                    <h3
                        className={`text-lg mb-2 cursor-pointer ${selectedCategory === null ? "font-bold" : ""}`}
                        onClick={() => setSelectedCategory(null)}
                    >
                        All Categories
                    </h3>
                    {categories.length > 0 ? (
                        categories.map((category) => (
                            <div
                                key={category.id}
                                className={`flex items-center justify-between mb-2 cursor-pointer ${
                                    selectedCategory === category.id ? "font-bold" : ""
                                }`}
                                onClick={() => setSelectedCategory(category.id)}
                            >
                                <div className="flex items-center">
                                    <span
                                        className="w-3 h-3 rounded-full mr-2"
                                        style={{ backgroundColor: category.color }}
                                    ></span>
                                    {category.name.replace("_", " ")}
                                </div>
                                <span className="text-gray-600">{categoryNotesCount[category.id] || 0}</span>
                            </div>
                        ))
                    ) : (
                        <p className="text-sm text-gray-500">No categories available</p>
                    )}
                </div>

                {/* Notes Grid */}
                <div className="w-[88%] flex flex-col items-center">
                    {notes.length > 0 ? (
                        <div className="grid grid-cols-3 gap-4 w-full">
                            {notes.map((note) => {
                                const category = categories.find((cat) => cat.id === note.category);
                                const categoryColor = category?.color || "#F5F5F5";
                                const backgroundColor = `rgba(${parseInt(categoryColor.slice(1, 3), 16)}, ${parseInt(categoryColor.slice(3, 5), 16)}, ${parseInt(categoryColor.slice(5, 7), 16)}, 0.5)`;

                                return (
                                    <div
                                        key={note.id}
                                        className="p-4 rounded-lg shadow-md border-2 w-[303px] h-[246px] flex flex-col justify-between"
                                        style={{ backgroundColor, borderColor: categoryColor }}
                                    >
                                        <p className="font-bold text-sm">
                                            {new Date(note.last_edited).toLocaleDateString()} {category?.name.replace("_", " ")}
                                        </p>
                                        <h4 className="font-bold text-lg">{note.title}</h4>
                                        <p className="text-sm">{note.content}</p>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="flex flex-1 flex-col items-center justify-center text-primary">
                            <Image src="/images/bubble-tea.png" alt="Bubble Tea" width={150} height={150} />
                            <p className="text-lg mt-4">I’m just here waiting for your charming notes...</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
