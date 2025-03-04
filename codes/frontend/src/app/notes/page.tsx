"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../hooks/useAuth";
import { useTokenExpiration } from "../hooks/useTokenExpiration";
import NoteCard from "../components/NoteCard";
import { LoadingSpinner } from "../components/ui/LoadingSpinner";
import { Button } from "../components/ui/Button";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function NotesPage() {
    const router = useRouter();
    const { userId } = useAuth();
    useTokenExpiration();
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [notes, setNotes] = useState([]);
    const [categoryNotesCount, setCategoryNotesCount] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/login");
            return;
        }

        const fetchData = async () => {
            setIsLoading(true);
            setError("");
            
            try {
                const categoriesResponse = await fetch(`${API_URL}/api/categories/`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (!categoriesResponse.ok) {
                    throw new Error(`Failed to fetch categories: ${await categoriesResponse.text()}`);
                }

                const data = await categoriesResponse.json();
                if (!Array.isArray(data)) {
                    throw new Error('Invalid categories data received');
                }

                setCategories(data);

                // Fetch note counts for each category
                const counts = {};
                await Promise.all(data.map(async (category) => {
                    const notesResponse = await fetch(`${API_URL}/api/notes/?category=${category.id}&user=${userId}`, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    if (notesResponse.ok) {
                        const notesData = await notesResponse.json();
                        counts[category.id] = notesData.length || 0;
                    }
                }));
                
                setCategoryNotesCount(counts);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
                setCategories([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [router, userId]);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return;

        const fetchNotes = async () => {
            setIsLoading(true);
            setError("");

            try {
                const endpoint = selectedCategory === null
                    ? `${API_URL}/api/notes/?user=${userId}`
                    : `${API_URL}/api/notes/?category=${selectedCategory}&user=${userId}`;

                const response = await fetch(endpoint, { 
                    headers: { Authorization: `Bearer ${token}` } 
                });

                if (!response.ok) {
                    throw new Error(`Failed to fetch notes: ${await response.text()}`);
                }

                const data = await response.json();
                setNotes(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
                setNotes([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchNotes();
    }, [selectedCategory, userId]);

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-background p-8">
                <div className="text-red-500 mb-4">{error}</div>
                <Button onClick={() => window.location.reload()}>Try Again</Button>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center h-screen bg-background p-8 max-w-[1280px] mx-auto relative">
            {isLoading && (
                <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-50">
                    <LoadingSpinner size="lg" />
                </div>
            )}
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
                                user: userId,
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
                                    <span className="capitalize">{category.name.replace("_", " ")}</span>
                                </div>
                                <span className="text-black">{categoryNotesCount[category.id] || 0}</span>
                            </div>
                        ))
                    ) : (
                        <p className="text-sm text-gray-500">No categories available</p>
                    )}
                </div>

                {/* Notes Grid */}
                <div className="w-[88%] flex flex-col items-center">
                    {notes.length > 0 ? (
                        <div className="grid grid-cols-3 gap-6 w-full">
                            {notes.map((note) => {
                                const category = categories.find((cat) => cat.id === note.category);
                                // Add last_edited to key to force remount when note is updated
                                return (
                                    <NoteCard
                                        key={`${note.id}-${note.last_edited}`}
                                        note={note}
                                        category={category}
                                    />
                                );
                            })}
                        </div>
                    ) : (
                        <div className="flex flex-1 flex-col items-center justify-center text-center">
                            <div className="bg-[#FFF2C5] rounded-full p-8 mb-6">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-primary">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-serif mb-3">Start Your Note-Taking Journey</h2>
                            <p className="text-gray-600 mb-8 max-w-md">
                                Create your first note by clicking the "+ New Note" button above. 
                                Your notes will be automatically organized by categories.
                            </p>
                            <button
                                className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors flex items-center gap-2"
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
                                            user: userId,
                                            category: categories[0]?.id || 1,
                                        }),
                                    });
                                    if (response.ok) {
                                        const newNote = await response.json();
                                        router.push(`/notes/new?id=${newNote.id}`);
                                    }
                                }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                </svg>
                                Create Your First Note
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
