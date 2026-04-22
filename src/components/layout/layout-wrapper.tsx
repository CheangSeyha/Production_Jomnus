"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/homepage/header";
import Footer from "@/components/homepage/footer";

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isAuthPage = pathname.startsWith("/auth");
  const isDashboardPage = pathname === "/dashboard" || pathname.startsWith("/dashboard/");
  const hideGlobalChrome = isAuthPage || isDashboardPage;

  return (
    <div className="flex min-h-screen flex-col">
      {!hideGlobalChrome && <Navbar />}
      <main className="flex-1">{children}</main>
      {!hideGlobalChrome && <Footer />}
    </div>
  );
}
