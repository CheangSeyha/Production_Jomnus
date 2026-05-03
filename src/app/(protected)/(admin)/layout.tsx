// src/app/(protected)/(admin)/layout.tsx

import type { ReactNode } from "react";
import Footer from "@/components/dashboard/footer";
import Sidebar from "@/components/dashboard/sidebar";
import Header from "@/components/dashboard/header";

type AdminLayoutProps = {
  children: ReactNode;
};

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="min-h-screen">
      <Header/>
      <div className="flex flex-col">
        <div className="flex z-10">

          {/* FIXED SIDEBAR */}
          <aside className="mt-4 fixed top-[64px] left-0 h-[calc(100vh-64px)] w-70 border-r border-gray-200 bg-white overflow-y-auto">
            <Sidebar role="admin"/>
          </aside>

          {/* MAIN AREA */}
          <div className="ml-64 flex-1 flex flex-col min-h-[calc(100vh-64px)]">

            {/* CONTENT */}
            <main className="flex-1 p-6">
              {children}
            </main>

          </div>
        </div>        
        {/* FOOTER ONLY FOR MAIN */}
        <div className="z-20">
          <Footer/> 
        </div>
                     
      </div>


    </div>
  );
}