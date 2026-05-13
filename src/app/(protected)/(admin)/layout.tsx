"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import Sidebar from "@/components/dashboard/sidebar";
import Navbar from "@/components/dashboard/header";

type AdminLayoutProps = {
  children: ReactNode;
};

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen w-full flex-col bg-slate-50/50">
      <Navbar role="admin" onMenuClick={() => setIsSidebarOpen(true)} />

      <div className="flex flex-1 min-h-0 overflow-hidden relative">
        <Sidebar 
          role="admin" 
          isOpen={isSidebarOpen} 
          onClose={() => setIsSidebarOpen(false)} 
        />

        <main className="min-w-0 flex-1 overflow-y-auto overflow-x-hidden p-4">
          {children}
        </main>
      </div>
    </div>
  );
}
