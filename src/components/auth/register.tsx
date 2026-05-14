"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  MdPerson,
  MdEmail,
  MdLock,
  MdVisibility,
  MdVisibilityOff,
} from "react-icons/md";
import GoogleOAuthButton from "./google-oauth-button";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { motion } from "framer-motion";

export default function RegisterForm() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formError, setFormError] = useState("");

  const router = useRouter();
  const { register, isLoading } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (password !== confirmPassword) {
      setFormError("Passwords do not match");
      return;
    }

    if (!agreeToTerms) {
      setFormError("Please agree to the Terms & Condition");
      return;
    }

    try {
      const user = await register({
        fullName,
        email,
        password,
        confirmPassword,
      });

      if (user.role === "ADMIN") {
        router.push("/admin/dashboard");
      } else {
        router.push("/dashboard");
      }
    } catch (error) {
      const message =
          error instanceof Error ? error.message : "Registration failed";

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
          {/* Glow */}
          <div className="absolute w-125 h-125 bg-blue-400/30 rounded-full blur-3xl"></div>

          {/* Text */}
          <motion.div
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.7 }}
              className="absolute top-16 left-16 z-20"
          >
          </motion.div>

          {/* Floating SVG + Logo */}
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
                Get Started Now
              </h2>

              <p className="text-gray-600 text-sm">
                Let's create your account
              </p>
            </motion.div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Full Name */}
              <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
              >
                <label
                    htmlFor="fullName"
                    className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Full Name
                </label>

                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2">
                    <MdPerson className="w-5 h-5 text-gray-400" />
                  </div>

                  <input
                      id="fullName"
                      type="text"
                      placeholder="jomnus"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-full focus:outline-none focus:border-[#0058BC] focus:ring-2 focus:ring-[#0058BC]/20 transition-all duration-300"
                      required
                  />
                </div>
              </motion.div>

              {/* Email */}
              <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
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
                  transition={{ delay: 0.5 }}
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
                      placeholder="Set your password"
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

              {/* Confirm Password */}
              <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
              >
                <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Confirm Password
                </label>

                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2">
                    <MdLock className="w-5 h-5 text-gray-400" />
                  </div>

                  <input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full pl-12 pr-12 py-3 border-2 border-gray-200 rounded-full focus:outline-none focus:border-[#0058BC] focus:ring-2 focus:ring-[#0058BC]/20 transition-all duration-300"
                      required
                  />

                  <button
                      type="button"
                      onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                  >
                    {showConfirmPassword ? (
                        <MdVisibility className="w-5 h-5" />
                    ) : (
                        <MdVisibilityOff className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </motion.div>

              {/* Terms */}
              <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="flex items-start gap-2"
              >
                <input
                    id="terms"
                    type="checkbox"
                    checked={agreeToTerms}
                    onChange={(e) => setAgreeToTerms(e.target.checked)}
                    className="w-4 h-4 accent-blue-600 rounded mt-1"
                />

                <label htmlFor="terms" className="text-sm text-gray-700">
                  I agree to{" "}
                  <Link
                      href="/terms-condition"
                      className="text-[#0058BC] font-medium hover:underline"
                  >
                    Terms & Conditions
                  </Link>
                </label>
              </motion.div>

              {/* Submit */}
              <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#0058BC] hover:bg-[#004799] disabled:opacity-70 text-white font-semibold py-3.5 rounded-full transition duration-300 shadow-lg hover:shadow-xl"
              >
                {isLoading ? "Signing up..." : "Sign up"}
              </motion.button>

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

              <GoogleOAuthButton name="Sign up with Google" />
            </form>

            {/* Footer */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="mt-8 text-center"
            >
              <p className="text-gray-600 text-sm">
                Already have an account?{" "}
                <Link
                    href="/auth/signin"
                    className="text-[#0058BC] font-semibold hover:underline"
                >
                  Sign in
                </Link>
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
  );
}