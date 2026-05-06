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
      <div className="min-h-screen w-full bg-white">
        <Navbar />
        <div className="mx-auto flex w-full pl-10 pr-0 flex-col md:flex-row">
          <Sidebar role={"admin"} />
          <main className="min-w-0 flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto h-[calc(100vh-64px)]">{children}</main>
        </div>
        <Footer/>
      </div>
  );
}