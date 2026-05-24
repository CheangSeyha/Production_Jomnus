"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import Sidebar from "@/components/dashboard/sidebar";
import Navbar from "@/components/dashboard/header";

type UserLayoutProps = {
    children: ReactNode;
};

export default function UserLayout({ children }: UserLayoutProps) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="h-screen w-full flex flex-col bg-white">
            <Navbar role="user" onMenuClick={() => setIsSidebarOpen(true)} />

            <div className="flex flex-1 min-h-0">
                <Sidebar
                    role="user"
                    isOpen={isSidebarOpen}
                    onClose={() => setIsSidebarOpen(false)}
                />

                <main className="flex-1 min-w-0 overflow-y-auto px-6 py-4">
                    {children}
                </main>
            </div>
        </div>
    );
}