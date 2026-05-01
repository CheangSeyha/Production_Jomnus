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
    <div className="flex min-h-screen w-full flex-col bg-white">
      <Navbar />
      <div className="mx-auto flex w-full flex-1 min-h-0 flex-col md:flex-row">
        <Sidebar />
        <main className="min-w-0 min-h-0 flex-1 overflow-hidden">{children}</main>
      </div>
      <Footer />
    </div>
  );
}
