"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "./ui/Input";
import { Button } from "./ui/Button";
import { PasswordInput } from "./ui/PasswordInput";
import { useAuth } from "../hooks/useAuth";

interface AuthFormProps {
    buttonText: string;
    redirectText: string;
    redirectUrl: string;
    isRegister?: boolean;
}

export default function AuthForm({ buttonText, redirectText, redirectUrl, isRegister = false }: AuthFormProps) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();
    const { authenticate, error, loading } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const success = await authenticate(email, password, isRegister);
        if (success) {
            router.push("/notes");
        }
    };

    return (
        <div className="p-10 text-center w-full max-w-md">
            <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    error={error}
                />
                <PasswordInput
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <Button
                    type="submit"
                    fullWidth
                    disabled={loading}
                >
                    {loading ? "Loading..." : buttonText}
                </Button>
            </form>

            <p 
                className="text-sm mt-6 text-primary cursor-pointer hover:underline" 
                onClick={() => router.push(redirectUrl)}
            >
                {redirectText}
            </p>
        </div>
    );
}
