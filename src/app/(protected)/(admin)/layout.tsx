// src/app/(protected)/(admin)/layout.tsx

import type { ReactNode } from "react";
import Footer from "@/components/dashboard/footer";
import Sidebar from "@/components/dashboard/sidebar";
import Navbar from "@/components/dashboard/header";

type AdminLayoutProps = {
  children: ReactNode;
};

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="flex h-screen w-full flex-col bg-white">
      <Navbar role="admin" />

      <div className="flex flex-1 min-h-0 overflow-hidden">
        <div className="flex-shrink-0 border-r border-slate-100">
          <Sidebar role="admin" />
        </div>

        <main className="min-w-0 flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
