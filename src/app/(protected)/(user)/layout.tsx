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
        <div className="min-h-screen w-full bg-white">
            <Navbar />
            <div className="mx-auto flex w-full max-w-screen-2xl flex-col md:flex-row">
                <Sidebar />
                <main className="min-w-0 flex-1 p-4 sm:p-6 md:p-8">{children}</main>
            </div>
            <Footer/>
        </div>
    );
}

