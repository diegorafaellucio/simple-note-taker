"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Notes() {
    const { data: session } = useSession();
    const [notes, setNotes] = useState([]);

    useEffect(() => {
        if (session) {
            axios
                .get("http://127.0.0.1:8000/api/notes/", {
                    headers: { Authorization: `Bearer ${session.accessToken}` },
                })
                .then((res) => setNotes(res.data))
                .catch((err) => console.error(err));
        }
    }, [session]);

    if (!session) return <p>Loading...</p>;

    return (
        <div className="h-screen p-10 bg-background">
            <h1 className="text-3xl text-primary font-bold">Your Notes</h1>
            <ul className="mt-5 space-y-3">
                {notes.map((note) => (
                    <li key={note.id} className="p-3 border rounded-lg bg-white shadow">
                        <h2 className="font-semibold">{note.title}</h2>
                        <p>{note.content}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}
