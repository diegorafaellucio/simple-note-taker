"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Image from "next/image";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const result = await signIn("credentials", {
            email,
            password,
            redirect: false,
        });

        if (!result?.error) {
            window.location.href = "/";
        } else {
            setError("Invalid credentials");
        }
    };

    return (
        <div className="flex h-screen items-center justify-center bg-background px-6">
            <div className="bg-[#FDF6EB] p-10 rounded-2xl shadow-xl text-center w-full max-w-md">
                {/* Cute Cat Image */}
                <div className="flex justify-center mb-6">
                    <Image
                        src="/cute-cat.png"
                        alt="Cute Cat"
                        width={120}
                        height={120}
                    />
                </div>

                {/* Title */}
                <h2 className="text-4xl font-bold text-primary mb-6">
                    Yay, New Friend!
                </h2>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="text-left">
                        <label className="text-sm text-primary font-semibold">
                            Email address
                        </label>
                        <input
                            type="email"
                            placeholder="Email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-3 mt-1 border border-[#C4A484] rounded-lg bg-inputBackground focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>

                    <div className="text-left">
                        <label className="text-sm text-primary font-semibold">
                            Password
                        </label>
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-3 mt-1 border border-[#C4A484] rounded-lg bg-inputBackground focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>

                    {/* Sign Up Button */}
                    <button
                        type="submit"
                        className="w-full p-3 mt-4 bg-buttonBackground text-white rounded-lg font-semibold hover:bg-[#6B3A1A] transition duration-300"
                    >
                        Sign Up
                    </button>

                    {/* Error Message */}
                    {error && <p className="text-red-500 mt-2">{error}</p>}
                </form>

                {/* Already have an account? */}
                <p className="text-sm mt-6 text-primary cursor-pointer hover:underline">
                    We&apos;re already friends!
                </p>
            </div>
        </div>
    );
}
