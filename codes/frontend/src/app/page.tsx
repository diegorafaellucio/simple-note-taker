"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") return <p>Loading...</p>;

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-background">
      <h1 className="text-3xl font-bold text-primary">
        Welcome, {session?.user?.email}!
      </h1>
      <button
        className="mt-5 px-4 py-2 bg-red-500 text-white rounded-md"
        onClick={() => signOut()}
      >
        Logout
      </button>
    </div>
  );
}

