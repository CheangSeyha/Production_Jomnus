"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function CallbackPage() {
  const router = useRouter();
  const params = useSearchParams();
  useEffect(() => {
    const token = params.get("token");
    const role = params.get("role");

    if (token) {
      localStorage.setItem("access_token", token);
    }

    const userRole = role || localStorage.getItem("user_role");

    if (userRole === "ADMIN") {
      router.push("/admin/dashboard");
    } else {
      router.push("/dashboard");
    }
  }, []);
  return (
    <div className="flex items-center justify-center h-screen">
      <p>Logging you in...</p>
    </div>
  );
}