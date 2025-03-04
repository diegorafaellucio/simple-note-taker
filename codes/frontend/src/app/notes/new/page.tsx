"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import "@fontsource/inria-serif";
import { useTokenExpiration } from "../../hooks/useTokenExpiration";
import { useDebounce } from "../../hooks/useDebounce";
import { useAuth } from "../../hooks/useAuth";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";
import { Button } from "../../components/ui/Button";
import { CategorySelect } from "../../components/ui/CategorySelect";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Function to apply 50% opacity to a hex color
const applyOpacity = (hex, opacity) => {
    const num = parseInt(hex.slice(1), 16);
    const r = (num >> 16) & 255;
    const g = (num >> 8) & 255;
    const b = num & 255;
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

export default function NewNotePage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    useTokenExpiration();
    const { userId } = useAuth();
    const noteId = searchParams.get("id");
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [title, setTitle] = useState("Note Title");
    const [content, setContent] = useState("");
    const [error, setError] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [lastSaved, setLastSaved] = useState<Date | null>(null);

    // Function to update note
    const handleUpdateNote = useCallback(async () => {
        if (!noteId) return;
        setIsSaving(true);
        const token = localStorage.getItem("token");
        try {
            const updatedNote = {
                id: noteId,
                title,
                content,
                last_edited: new Date().toISOString(),
                user: userId,
                category: selectedCategory,
            };

            const timestamp = new Date().getTime();
            const response = await fetch(`${API_URL}/api/notes/${noteId}/?t=${timestamp}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(updatedNote),
            });
            
            // Verify the update was successful
            const updatedData = await response.json();

            if (!response.ok) {
                throw new Error('Failed to save note');
            }

            setLastSaved(new Date());
        } catch (err) {
            setError('Failed to save changes. Please try again.');
        } finally {
            setIsSaving(false);
        }
    }, [noteId, title, content, userId, selectedCategory]);

    const debouncedTitle = useDebounce(title, 1000);
    const debouncedContent = useDebounce(content, 1000);

    // Auto-save effect when debounced values change
    useEffect(() => {
        if (noteId && (debouncedTitle !== "Note Title" || debouncedContent !== "")) {
            handleUpdateNote();
        }
    }, [debouncedTitle, debouncedContent, selectedCategory, noteId, handleUpdateNote]);

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
                // Fetch categories
                const categoriesResponse = await fetch(`${API_URL}/api/categories/`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (!categoriesResponse.ok) {
                    throw new Error('Failed to fetch categories');
                }

                const categoriesData = await categoriesResponse.json();
                if (Array.isArray(categoriesData)) {
                    setCategories(categoriesData);
                    setSelectedCategory(categoriesData[0]?.id || null);
                }

                // Fetch note details if editing
                if (noteId) {
                    const timestamp = new Date().getTime();
                    const noteResponse = await fetch(`${API_URL}/api/notes/${noteId}/?t=${timestamp}`, {
                        headers: { 
                            Authorization: `Bearer ${token}`
                        },
                    });

                    if (!noteResponse.ok) {
                        throw new Error('Failed to fetch note details');
                    }

                    const noteData = await noteResponse.json();
                    setTitle(noteData.title);
                    setContent(noteData.content);
                    setSelectedCategory(noteData.category);
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [router, noteId]);

    // Get selected category color for styling
    const selectedCategoryColor =
        categories.find((cat) => cat.id === selectedCategory)?.color || "#F5F5F5";
    const backgroundWithOpacity = applyOpacity(selectedCategoryColor, 0.5);

    if (isLoading) {
        return (
            <div className="h-screen w-screen bg-background flex items-center justify-center">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="h-screen w-screen bg-background flex flex-col items-center justify-center p-8 gap-4">
                <p className="text-red-500">{error}</p>
                <Button onClick={() => router.push('/notes')}>Return to Notes</Button>
            </div>
        );
    }

    return (
        <div className="h-screen w-screen bg-background flex flex-col p-8">
            {/* Header */}
            <div className="w-full flex justify-between items-center p-4">
                <CategorySelect
                    categories={categories}
                    selectedCategory={selectedCategory}
                    onSelect={setSelectedCategory}
                />

                {/* Close Button - Redirects to Notes Page */}
                <button
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                    onClick={async () => {
                        try {
                            if (!title.trim() && !content.trim()) {
                                const token = localStorage.getItem("token");
                                await fetch(`${API_URL}/api/notes/${noteId}/`, {
                                    method: "DELETE",
                                    headers: { Authorization: `Bearer ${token}` },
                                });
                            } else {
                                // Final save before closing
                                await handleUpdateNote();
                                // Wait for the save to complete
                                await new Promise(resolve => setTimeout(resolve, 500));
                            }
                            // Force a refresh and cache revalidation
                            await router.refresh();
                            router.push("/notes");
                        } catch (err) {
                            setError('Failed to save changes. Please try again.');
                        }
                    }}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            {/* Note Entry Section */}
            <div
                className="flex-1 mx-6 p-6 rounded-xl border-2 shadow-md relative font-['Arial'] font-normal"
                style={{
                    backgroundColor: backgroundWithOpacity,
                    borderColor: selectedCategoryColor,
                    boxShadow: "1px 1px 2px rgba(0, 0, 0, 0.25)",
                }}
            >
                <div className="absolute top-4 right-4 text-sm text-black flex items-center gap-4">
                    {isSaving && (
                        <span className="flex items-center gap-2">
                            <svg className="animate-spin h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span>Saving...</span>
                        </span>
                    )}
                    {lastSaved && (
                        <span className="text-xs text-gray-500">
                            Last edited: {lastSaved.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} at {lastSaved.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
                        </span>
                    )}
                </div>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Note Title"
                    className="w-full p-3 text-xl font-bold focus:outline-none transition-colors"
                    style={{
                        backgroundColor: "transparent",
                        border: "none",
                        fontFamily: "serif",
                        fontSize: "40px",
                        fontWeight: "bold",
                        color: "#000000",
                    }}
                />

                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Start typing your note..."
                    className="w-full h-[calc(100vh-300px)] p-3 text-lg focus:outline-none resize-none transition-colors"
                    style={{
                        backgroundColor: "transparent",
                        border: "none",
                        fontFamily: "Arial",
                        fontSize: "18px",
                        fontWeight: "normal",
                        color: "#000000",
                    }}
                />
            </div>

            {error && <p className="text-red-500 mt-2 text-center">{error}</p>}
        </div>
    );
}
