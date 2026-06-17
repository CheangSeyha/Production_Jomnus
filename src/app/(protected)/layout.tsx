"use client";
import type { ReactNode } from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const accessToken = useAuthStore((s) => s.accessToken);
  const initializeAuth = useAuthStore((s) => s.initializeAuth);
  const isInitialized = useAuthStore((s) => s.isInitialized);

  useEffect(() => {
    // Initialize auth on first load to restore session
    if (!isInitialized) {
      initializeAuth();
    }
  }, [initializeAuth, isInitialized]);

  useEffect(() => {
    // Check if user is not logged in after initialization
    if (isInitialized && !accessToken && typeof window !== "undefined") {
      router.push("/auth/signin");
      return;
    }

    // Redirect based on user role
    if (isInitialized && user && typeof window !== "undefined") {
      if (
        user.role === "ADMIN" &&
        !window.location.pathname.includes("/admin")
      ) {
        router.push("/admin/dashboard");
      } else if (
        user.role === "USER" &&
        window.location.pathname.includes("/admin")
      ) {
        router.push("/dashboard");
      }
    }
  }, [user, accessToken, router, isInitialized]);

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <main className="flex-1">{children}</main>
    </div>
  );
}
