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
    <div className="min-h-screen flex flex-col bg-gray-50">

      <AdminHeader />

      <div className="flex flex-1">

        <AdminSidebar />

        <main className="flex-1 p-6 md:ml-64">
          {children}
        </main>

      </div>

      <Footer />

    </div>
  );
}