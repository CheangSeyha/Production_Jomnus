"use client";

import React, { useState } from "react";
import Link from "next/link";
import { MdEmail, MdLock, MdVisibility, MdVisibilityOff } from "react-icons/md";
import GoogleOAuthButton from "./google-oauth-button";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   // TODO: Handle login logic
  //   console.log("Login attempted with:", { email, password, rememberMe });
  // };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    const res = await axios.post(
      "http://localhost:3001/api/auth/login",
      {
        email,
        password,
      },
      {
        withCredentials: true,
      }
    );

    const user = res.data.user;

    if (user.role === "ADMIN") {
      router.push("/admin/dashboard");
    } else if (user.role === "REQUESTER") {
      router.push("/dashboard");
    } else if (user.role === "PERFORMER") {
      router.push("/dashboard");
    } else {
      router.push("/");
    }

  } catch (err: any) {
    console.error("Login failed:", err.response?.data || err.message);
    alert("Invalid email or password");
  }
};

  return (
    <div className="flex h-screen bg-white p-4 sm:p-6 md:p-8 lg:p-12">
      <div className="hidden lg:flex w-1/2  flex-col justify-center items-center relative overflow-hidden">
        <div className="absolute top-10 left-20 z-50 text-center">
          <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight">
            Join Us
            <br />
            Today
          </h1>
        </div>
        <img src="/Image/content1.svg" alt="" className="relative z-10" />
      </div>

      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-4 sm:p-6 md:p-8 lg:p-12">
        <div className="w-full max-w-md">
          <div className="mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Welcome Back
            </h2>
            <p className="text-gray-600 text-xs sm:text-sm">
              Sign in to your account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            <div>
              <label
                htmlFor="email"
                className="block text-xs sm:text-sm font-medium text-gray-700 mb-2"
              >
                Email
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                  <MdEmail className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  placeholder="jomnus@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-2 sm:py-3 text-sm sm:text-base border-2 border-gray-200 rounded-full focus:outline-none focus:border-[#0058BC] focus:ring-1 focus:ring-[#0058BC] transition duration-200"
                  required
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-xs sm:text-sm font-medium text-gray-700 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                  <MdLock className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-2 sm:py-3 text-sm sm:text-base border-2 border-gray-200 rounded-full focus:outline-none focus:border-[#0058BC] focus:ring-1 focus:ring-[#0058BC] transition duration-200"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <MdVisibility className="w-5 h-5" />
                  ) : (
                    <MdVisibilityOff className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-2 gap-2 sm:gap-0">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 accent-blue-600 cursor-pointer rounded"
                />
                <span className="ml-2 text-xs sm:text-sm text-gray-700">
                  Remember me
                </span>
              </label>
              <Link
                href="/auth/forgotpassword"
                className="text-xs sm:text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Forgot Password
              </Link>
            </div>

            <button
              type="submit"
              className="w-full bg-[#0058BC] text-white font-semibold py-2.5 sm:py-3.5 px-4 text-sm sm:text-base rounded-full transition duration-200 mt-4"
            >
              Sign In
            </button>

            <div className="flex items-center gap-3 sm:gap-4">
              <div className="flex-1 h-px bg-gray-300"></div>
              <span className="text-gray-500 text-xs sm:text-sm">or</span>
              <div className="flex-1 h-px bg-gray-300"></div>
            </div>

            <GoogleOAuthButton />
          </form>

          <div className="mt-6 sm:mt-8 text-center">
            <p className="text-gray-600 text-xs sm:text-sm">
              Don't have an account?{" "}
              <Link
                href="/auth/register"
                className="text-[#0058BC]  font-semibold"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
