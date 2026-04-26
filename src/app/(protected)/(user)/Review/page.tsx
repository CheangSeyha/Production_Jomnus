"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function DashboardPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const token = searchParams.get("token");

        if (token) {
            localStorage.setItem("access_token", token);
            // Clean URL after saving token.
            router.replace("/dashboard");
            return;
        }

        const existingToken = localStorage.getItem("access_token");
        if (!existingToken) {
            router.replace("/auth/signin");
        }
    }, [router, searchParams]);

    return (
        <main className="min-h-screen flex items-center justify-center bg-[#f4f7ff]">
            <div className="text-center">
                <h1 className="text-3xl font-semibold text-[#0d1b2a]">Review</h1>
                <p className="mt-3 text-[#4a5568]">You are logged in successfully.</p>
            </div>
        </main>
    );
}
