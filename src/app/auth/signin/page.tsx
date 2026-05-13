"use client";

import { useEffect } from "react";
import LoginForm from "@/components/auth/login";

export default function SignInPage() {
  useEffect(() => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_role");
  }, []);

  return <LoginForm />;
}
