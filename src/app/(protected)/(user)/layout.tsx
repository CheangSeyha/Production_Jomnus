// src/app/(protected)/(admin)/admin/layout.tsx

import type { ReactNode } from "react";
import Sidebar from "@/components/dashboard/userSidebar";
import Navbar from "@/components/homepage/header";
import Footer from "@/components/dashboard/footer";
type UserLayoutProps = {
  children: ReactNode;
};

export default function AdminLayout({ children }: UserLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">

      <Navbar />

      <div className="flex flex-1">

        <Sidebar />

        <main className="flex-1 p-2 md:ml-4">
          {children}
        </main>

      </div>

      <Footer />

    </div>
  );
}