"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { useUserStore } from "@/store/userStore"; // 1. Import your user store

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const initializeAuth = useAuthStore((s) => s.initializeAuth);
  const authUser = useAuthStore((s) => s.user);   // 2. Monitor the logged-in user state
  const setUser = useUserStore((s) => s.setUser); // 3. Get the setter for the header store

  useEffect(() => {
    // Initialize auth once when app loads
    initializeAuth();
  }, [initializeAuth]);

  // 4. Whenever authUser changes or loads, sync it into the userStore
  useEffect(() => {
    if (authUser) {
      setUser(authUser);
    }
  }, [authUser, setUser]);

  return <>{children}</>;
}