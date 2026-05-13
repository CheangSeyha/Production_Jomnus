"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import api from "@/lib/axios";

export default function CallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const processCallback = async () => {
      try {
        const token = searchParams.get("token");
        const roleFromParams = searchParams.get("role");

        console.log("Callback page loaded");
        console.log("Token:", token ? "✓ Present" : "✗ Missing");
        console.log("Role param:", roleFromParams);

        if (!token) {
          console.error("No token in callback URL");
          setError("No authentication token received");
          setTimeout(() => router.push("/auth/signin"), 2000);
          return;
        }

        // Step 1: Store token in localStorage
        localStorage.setItem("access_token", token);
        console.log("Step 1: Token stored in localStorage");

        // Step 2: Extract role from JWT payload
        let userRole = roleFromParams || "USER";
        try {
          const parts = token.split(".");
          if (parts.length === 3) {
            const base64Url = parts[1];
            const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
            const decoded = JSON.parse(atob(base64));
            console.log("Step 2: JWT decoded successfully");
            userRole = decoded.role || roleFromParams || "USER";
          }
        } catch (decodeError) {
          console.warn("Could not decode JWT, using role from params");
        }

        // Step 3: Store role in localStorage
        localStorage.setItem("user_role", userRole);
        console.log("Step 3: User role stored:", userRole);

        // Step 4: Fetch user data from backend
        console.log("Step 4: Fetching user profile from /auth/profile...");
        let userData = null;
        try {
          const response = await api.get("/auth/profile", {
            headers: { Authorization: `Bearer ${token}` },
          });
          userData = response.data;
          console.log("Step 4: User data received:", userData);

          // Store user_data in localStorage so initializeAuth can sync it to Zustand
          localStorage.setItem("user_data", JSON.stringify(userData));
          console.log("Step 4b: User data stored in localStorage");
        } catch (fetchError) {
          console.warn("Could not fetch user data from backend");
          console.warn(
            "This may cause issues if user_data is required by initializeAuth",
          );
          // Don't fail here - callback can still proceed
        }

        // Step 5: Call initializeAuth to sync localStorage → Zustand state
        console.log("📡 Step 5: Calling initializeAuth()...");
        const authStore = useAuthStore.getState();
        await authStore.initializeAuth();
        console.log("Step 5: initializeAuth() completed");
        console.log("Step 5b: Auth state should now be synced");

        // Step 6: Redirect to appropriate dashboard
        const destination =
          userRole === "ADMIN" ? "/admin/dashboard" : "/dashboard";
        console.log(`Step 6: Redirecting to ${destination}...`);

        // Small delay to ensure all state is persisted
        await new Promise((resolve) => setTimeout(resolve, 200));
        router.push(destination);
      } catch (err) {
        console.error("Callback processing failed:", err);
        setError("An error occurred during authentication");
        setTimeout(() => router.push("/auth/signin"), 3000);
      }
    };

    // Only process callback if we have searchParams
    if (searchParams) {
      processCallback();
    }
  }, [searchParams, router]);

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-red-600">
            Authentication Error
          </h1>
          <p className="mt-2 text-gray-600">{error}</p>
          <p className="mt-4 text-sm text-gray-500">
            Redirecting to sign in...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen items-center justify-center bg-white">
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-gray-800">
          Completing your sign in...
        </h1>
        <p className="mt-2 text-gray-600">
          Please wait while we set up your account.
        </p>
      </div>
    </div>
  );
}
