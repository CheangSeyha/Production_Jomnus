// src/app/(protected)/(admin)/layout.tsx

import type { ReactNode } from "react";
import AdminSidebar from "@/components/dashboard/adminSidebar";
import AdminHeader from "@/components/dashboard/adminNavbar";
import Footer from "@/components/dashboard/footer";

type AdminLayoutProps = {
  children: ReactNode;
};

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="flex min-h-screen w-full flex-col bg-white">
      <AdminHeader />

      <div className="mx-auto flex w-full max-w-screen-2xl flex-1 min-h-0 flex-col md:flex-row">
        <AdminSidebar />

        <main className="min-w-0 min-h-0 flex-1 overflow-hidden p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
