"use client";

import React from "react";
const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"
).replace(/\/$/, "");

export default function GoogleOAuthButton() {
  const handleGoogleRedirect = () => {
    window.location.href = `${API_BASE_URL}/auth/google`;
  };

  return (
    <button
      type="button"
      onClick={handleGoogleRedirect}
      className="w-full flex items-center justify-center gap-2 border-2 border-[#0058BC] text-[#0058BC] font-semibold py-2.5 sm:py-3 px-4 text-sm sm:text-base rounded-full transition duration-200"
    >
      <img src="/Image/Google.png" className="w-10" alt="Google" />
      Sign in with Google
    </button>
  );
}
