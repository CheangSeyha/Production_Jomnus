"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  MdEmail,
  MdLock,
  MdVisibility,
  MdVisibilityOff,
} from "react-icons/md";
import GoogleOAuthButton from "./google-oauth-button";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { useUserStore } from "@/store/userStore"; 
import { motion } from "framer-motion";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState("");

  const router = useRouter();
  const { login, isLoading } = useAuthStore();
  const setUser = useUserStore((s) => s.setUser); 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    try {
      const user = await login({ email, password });

      // Seed the store immediately
      if (user) {
        setUser(user);
      }

      // Hard navigation ensures Next.js mounts the layout freshly with updated cache state
      if (user.role === "ADMIN") {
        window.location.href = "/admin/dashboard";
      } else {
        window.location.href = "/dashboard";
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Invalid email or password";

      setFormError(message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white overflow-hidden">
      {/* LEFT SIDE */}
      <motion.div
        initial={{ opacity: 0, x: -80 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="hidden lg:flex lg:w-1/2 relative bg-[#0058BC] items-center justify-center overflow-hidden"
      >
        {/* Background Glow */}
        <div className="absolute w-125 h-125 bg-blue-400/30 rounded-full blur-3xl"></div>

        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="absolute top-16 left-16 z-20"
        ></motion.div>

        <motion.div
          className="relative z-10 w-[80%] max-w-xl"
          animate={{ y: [0, -15, 0] }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {/* Background SVG */}
          <img
            src="/Image/content2.svg"
            alt="Background Shape"
            className="w-full"
          />

          {/* Logo */}
          <img
            src="/images/jomnus.png"
            alt="JomNus Logo"
            className="
              absolute
              top-1/2
              left-1/2
              -translate-x-1/2
              -translate-y-1/2
              w-250
              z-50"
          />
        </motion.div>
      </motion.div>

      {/* RIGHT SIDE */}
      <motion.div
        initial={{ opacity: 0, x: 80 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full lg:w-1/2 flex flex-col justify-center items-center px-4 sm:px-6 md:px-8 lg:px-12 py-8"
      >
        <div className="w-full max-w-md">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome Back
            </h2>
            <p className="text-gray-600 text-sm">Sign in to your account</p>
          </motion.div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email
              </label>

              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2">
                  <MdEmail className="w-5 h-5 text-gray-400" />
                </div>

                <input
                  id="email"
                  type="email"
                  placeholder="jomnus@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-full focus:outline-none focus:border-[#0058BC] focus:ring-2 focus:ring-[#0058BC]/20 transition-all duration-300"
                  required
                />
              </div>
            </motion.div>

            {/* Password */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password
              </label>

              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2">
                  <MdLock className="w-5 h-5 text-gray-400" />
                </div>

                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-3 border-2 border-gray-200 rounded-full focus:outline-none focus:border-[#0058BC] focus:ring-2 focus:ring-[#0058BC]/20 transition-all duration-300"
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                >
                  {showPassword ? (
                    <MdVisibility className="w-5 h-5" />
                  ) : (
                    <MdVisibilityOff className="w-5 h-5" />
                  )}
                </button>
              </div>
            </motion.div>

            {/* Remember */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2"
            >
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 accent-blue-600 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Remember me</span>
              </label>

              <Link
                href="/auth/forgotpassword"
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Forgot Password
              </Link>
            </motion.div>

            {/* Submit */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#0058BC] hover:bg-[#004799] disabled:opacity-70 text-white font-semibold py-3.5 rounded-full transition duration-300 shadow-lg hover:shadow-xl"
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </motion.button>

            {/* Form Error Message */}
            {formError && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm text-red-500 text-center"
              >
                {formError}
              </motion.p>
            )}

            {/* Divider */}
            <div className="flex items-center gap-4">
              <div className="flex-1 h-px bg-gray-300"></div>
              <span className="text-gray-500 text-sm">or</span>
              <div className="flex-1 h-px bg-gray-300"></div>
            </div>

            <GoogleOAuthButton name="Sign in with Google" />
          </form>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-8 text-center"
          >
            <p className="text-gray-600 text-sm">
              Don't have an account?{" "}
              <Link
                href="/auth/register"
                className="text-[#0058BC] font-semibold hover:underline"
              >
                Sign up
              </Link>
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}