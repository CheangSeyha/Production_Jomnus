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

export default function RegisterForm() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    if (!agreeToTerms) {
      alert("Please agree to the Terms & Condition");
      return;
    }
    // TODO: Handle registration logic
    console.log("Registration attempted with:", {
      fullName,
      email,
      password,
    });
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
        <div className="w-full max-w-md space-y-3 sm:space-y-4">
          {/* Header */}
          <div className="mb-6 text-start">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Get Started Now
            </h2>
            <p className="text-gray-600 text-xs sm:text-sm">
              Let's create your account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-2.5 sm:space-y-3">
            <div>
              <label
                htmlFor="fullName"
                className="block text-xs sm:text-sm font-medium text-gray-700 mb-2"
              >
                Full Name
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                  <MdPerson className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  id="fullName"
                  type="text"
                  placeholder="jomnus"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-12 pr-4 py-2 sm:py-3 text-sm sm:text-base border-2 border-gray-200 rounded-full focus:outline-none focus:border-[#0058BC] focus:ring-1 focus:ring-[#0058BC] transition duration-200"
                  required
                />
              </div>
            </div>

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
                  placeholder="Set your password"
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

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-xs sm:text-sm font-medium text-gray-700 mb-2"
              >
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                  <MdLock className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-2 sm:py-3 text-sm sm:text-base border-2 border-gray-200 rounded-full focus:outline-none focus:border-[#0058BC] focus:ring-1 focus:ring-[#0058BC] transition"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? (
                    <MdVisibility className="w-5 h-5" />
                  ) : (
                    <MdVisibilityOff className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-start pt-2 space-x-2">
              <input
                id="terms"
                type="checkbox"
                checked={agreeToTerms}
                onChange={(e) => setAgreeToTerms(e.target.checked)}
                className="w-4 h-4 accent-blue-600 cursor-pointer rounded mt-0.5"
              />
              <label
                htmlFor="terms"
                className="text-xs sm:text-sm text-gray-700 flex flex-col sm:flex-row sm:items-center gap-1"
              >
                I agree to{" "}
                <Link
                  href="/terms-condition"
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Term & Condition
                </Link>
              </label>
            </div>

            <button
              type="submit"
              className="w-full bg-[#0058BC] text-white font-semibold py-2.5 sm:py-3.5 px-4 text-sm sm:text-base rounded-full transition duration-200 mt-4"
            >
              Sign up
            </button>

            <div className="flex items-center gap-3 sm:gap-4">
              <div className="flex-1 h-px bg-gray-300"></div>
              <span className="text-gray-500 text-xs sm:text-sm">or</span>
              <div className="flex-1 h-px bg-gray-300"></div>
            </div>

            <GoogleOAuthButton />
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600 text-xs sm:text-sm">
              Already have an account?{" "}
              <Link
                href="/auth/signin"
                className="text-[#0058BC]  font-semibold"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
