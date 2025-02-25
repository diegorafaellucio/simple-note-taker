"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import "@fontsource/inria-serif";

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
    const noteId = searchParams.get("id");
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [title, setTitle] = useState("Note Title");
    const [content, setContent] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/login");
            return;
        }

        // Fetch categories
        fetch(`${API_URL}/api/categories/`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((response) => response.json())
            .then((data) => {
                if (Array.isArray(data)) {
                    setCategories(data);
                    setSelectedCategory(data[0]?.id || null);
                } else {
                    setCategories([]);
                }
            })
            .catch(() => setCategories([]));

        // Fetch note details if editing
        if (noteId) {
            fetch(`${API_URL}/api/notes/${noteId}/`, {
                headers: { Authorization: `Bearer ${token}` },
            })
                .then((response) => response.json())
                .then((note) => {
                    setTitle(note.title);
                    setContent(note.content);
                    setSelectedCategory(note.category);
                })
                .catch(() => setError("Failed to fetch note details"));
        }
    }, [router, noteId]);

    // Function to update note
    const handleUpdateNote = async (field, value) => {
        if (!noteId) return;
        const token = localStorage.getItem("token");
        const updatedNote = {
            id: noteId,
            title: field === "title" ? value : title,
            content: field === "content" ? value : content,
            last_edited: new Date().toISOString(),
            user: 1,
            category: selectedCategory,
        };

        await fetch(`${API_URL}/api/notes/${noteId}/`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(updatedNote),
        });
    };

    // Get selected category color for styling
    const selectedCategoryColor =
        categories.find((cat) => cat.id === selectedCategory)?.color || "#F5F5F5";
    const backgroundWithOpacity = applyOpacity(selectedCategoryColor, 0.5);

    return (
        <div className="h-screen w-screen bg-background flex flex-col p-8">
            {/* Header */}
            <div className="w-full flex justify-between items-center p-4">
                <select
                    className="border rounded-lg px-4 py-2 text-lg"
                    style={{ backgroundColor: "#FAF1E3", borderColor: "#957139" }}
                    value={selectedCategory}
                    onChange={(e) => {
                        setSelectedCategory(Number(e.target.value));
                        handleUpdateNote("category", Number(e.target.value));
                    }}
                >
                    {categories.map((category) => (
                        <option key={category.id} value={category.id} style={{ display: "flex", alignItems: "center" }}>
                            <span style={{ backgroundColor: category.color, borderRadius: "50%", width: "10px", height: "10px", display: "inline-block", marginRight: "8px" }}></span>
                            {category.name.replace("_", " ")}
                        </option>
                    ))}
                </select>

                {/* Close Button - Redirects to Notes Page */}
                <button
                    className="text-xl"
                    onClick={async () => {
                        if (!title.trim() && !content.trim()) {
                            const token = localStorage.getItem("token");
                            await fetch(`${API_URL}/api/notes/${noteId}/`, {
                                method: "DELETE",
                                headers: { Authorization: `Bearer ${token}` },
                            });
                        }
                        router.push("/notes");
                    }}
                >
                    ✕
                </button>
            </div>

            {/* Note Entry Section */}
            <div
                className="flex-1 mx-6 p-6 rounded-xl border-2 shadow-md relative"
                style={{
                    backgroundColor: backgroundWithOpacity,
                    borderColor: selectedCategoryColor,
                    boxShadow: "1px 1px 2px rgba(0, 0, 0, 0.25)",
                }}
            >
                <p className="absolute top-4 right-4 text-sm text-gray-600">
                    Last Edited: {new Date().toLocaleString()}
                </p>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => {
                        setTitle(e.target.value);
                        handleUpdateNote("title", e.target.value);
                    }}
                    className="w-full p-3 text-xl font-bold focus:outline-none"
                    style={{
                        backgroundColor: "transparent",
                        border: "none",
                        fontFamily: "'Inria Serif', serif",
                        fontSize: "24px",
                        fontWeight: "700",
                        color: "#000000",
                    }}
                />

                <textarea
                    value={content}
                    onChange={(e) => {
                        setContent(e.target.value);
                        handleUpdateNote("content", e.target.value);
                    }}
                    className="w-full h-40 p-3 text-lg focus:outline-none"
                    style={{
                        backgroundColor: "transparent",
                        border: "none",
                        fontFamily: "'Inria Serif', serif",
                        fontSize: "24px",
                        fontWeight: "700",
                        color: "#000000",
                    }}
                />
            </div>

            {error && <p className="text-red-500 mt-2 text-center">{error}</p>}
        </div>
    );
}
