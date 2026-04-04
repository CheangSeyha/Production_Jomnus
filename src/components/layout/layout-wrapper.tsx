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

  // Check if current page is an auth page
  const isAuthPage = pathname.startsWith("/auth");

  return (
    <div className="flex min-h-screen flex-col">
      {!isAuthPage && <Navbar />}
      <main className="flex-1">{children}</main>
      {!isAuthPage && <Footer />}
    </div>
  );
}
