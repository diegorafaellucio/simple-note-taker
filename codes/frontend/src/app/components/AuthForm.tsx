"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL; // Load from .env.local

interface AuthFormProps {
    buttonText: string;
    redirectText: string;
    redirectUrl: string;
    isRegister?: boolean;
}

export default function AuthForm({ buttonText, redirectText, redirectUrl, isRegister = false }: AuthFormProps) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        try {
            const endpoint = isRegister ? 'register' : 'login';
            const response = await fetch(`${API_URL}/api/authenticate/${endpoint}/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                // For both login and register, we get access token
                const token = isRegister ? data.tokens.access : data.access;
                localStorage.setItem("token", token);
                
                // Store user info if available
                if (data.id) {
                    localStorage.setItem("userId", data.id.toString());
                }
                
                router.push("/notes");
            } else {
                setError(data.error || data.detail || "An error occurred");
            }
        } catch (error) {
            setError("An error occurred. Please try again.");
        }
    };

    return (
        <div className="p-10 text-center w-full max-w-md">
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3 border border-[#C4A484] rounded-lg bg-inputBackground focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-3 border border-[#C4A484] rounded-lg bg-inputBackground focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                    type="submit"
                    className="w-full p-3 bg-buttonBackground text-white rounded-lg font-semibold hover:bg-[#6B3A1A] transition duration-300"
                >
                    {buttonText}
                </button>
                {error && <p className="text-red-500 mt-2">{error}</p>}
            </form>

            <p className="text-sm mt-6 text-primary cursor-pointer hover:underline" onClick={() => router.push(redirectUrl)}>
                {redirectText}
            </p>
        </div>
    );
}
