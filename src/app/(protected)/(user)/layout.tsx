// src/app/(protected)/(admin)/admin/layout.tsx

import type { ReactNode } from "react";
import Sidebar from "@/components/dashboard/userSidebar";
import Navbar from "@/components/dashboard/userNavbar";
import Footer from "@/components/dashboard/footer";

type DashboardLayoutProps = {
  children: ReactNode;
};
export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="flex">

        {/* FIXED SIDEBAR */}
        <aside className="fixed top-[64px] left-0 h-[calc(100vh-64px)] w-64 border-r border-gray-200 bg-white overflow-y-auto">
          <Sidebar />
        </aside>

        {/* MAIN AREA */}
        <div className="ml-64 flex-1 flex flex-col min-h-[calc(100vh-64px)]">

          {/* CONTENT */}
          <main className="flex-1 p-6">
            {children}
          </main>

          {/* FOOTER ONLY FOR MAIN */}
          <Footer />

        </div>
      </div>
    </div>
  );
}