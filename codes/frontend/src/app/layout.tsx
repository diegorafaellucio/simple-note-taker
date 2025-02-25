import type {Metadata} from "next";
import {Geist, Geist_Mono, Inria_Serif} from "next/font/google";
import "../styles/globals.css";
import SessionProvider from "./components/SessionProvider";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

const inriaSerif = Inria_Serif({
    subsets: ["latin"],
    weight: ["700"], // Only bold weight
    variable: "--font-inria", // Define CSS variable for Tailwind
});

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <body
            className={`${geistSans.variable} ${geistMono.variable} ${inriaSerif.variable} antialiased bg-background `}
        >
            <SessionProvider>{children}</SessionProvider>

        </body>
        </html>
    );
}

export const metadata: Metadata = {
    title: "Simple Note Taker",
    description: "",
};
