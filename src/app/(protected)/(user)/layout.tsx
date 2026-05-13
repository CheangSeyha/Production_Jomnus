// src/app/(protected)/(user)/layout.tsx

"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import Sidebar from "@/components/dashboard/sidebar";
import Navbar from "@/components/dashboard/header";
import Footer from "@/components/dashboard/footer";

type DashboardLayoutProps = {
  children: ReactNode;
};

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen w-full bg-white flex flex-col">
      <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          role={"user"}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        <main className="flex-1 overflow-y-auto ">
          {children}
        </main>
      </div>
      <Footer />
    </div>
  );
}
