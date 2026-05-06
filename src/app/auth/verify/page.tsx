"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Mail, ArrowLeft, CheckCircle } from "lucide-react";

export default function VerifyPage() {
  const [verificationCode, setVerificationCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [email, setEmail] = useState("user@example.com");

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate verification
    setTimeout(() => {
      setIsVerified(true);
      setIsLoading(false);
    }, 1500);
  };

  const handleResendCode = () => {
    // Handle resend logic
    console.log("Resending code...");
  };

  if (isVerified) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 text-center">
            {/* Success Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
            </div>

            {/* Success Message */}
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
              Email Verified!
            </h1>
            <p className="text-slate-600 text-sm sm:text-base mb-8">
              Your email has been successfully verified. You can now access all features.
            </p>

            {/* Action Button */}
            <Link
              href="/dashboard"
              className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              Go to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-white flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <Link
          href="/auth/signin"
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-8 text-sm font-medium transition-colors"
        >
          <ArrowLeft size={18} />
          <span>Back to Sign In</span>
        </Link>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <Image
              src="/images/logo.png"
              alt="Jomnus"
              width={120}
              height={40}
              className="w-24 object-contain"
              style={{ height: "auto" }}
            />
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Mail className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
              Verify Your Email
            </h1>
            <p className="text-slate-600 text-sm sm:text-base">
              We've sent a verification code to <span className="font-semibold text-slate-900">{email}</span>
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleVerify} className="space-y-6">
            {/* Verification Code Input */}
            <div>
              <label htmlFor="code" className="block text-sm font-semibold text-slate-900 mb-2">
                Verification Code
              </label>
              <input
                id="code"
                type="text"
                placeholder="Enter 6-digit code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg text-center text-lg font-semibold tracking-widest focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                maxLength="6"
              />
              <p className="text-xs text-slate-500 mt-2">
                Please enter the 6-digit code sent to your email
              </p>
            </div>

            {/* Verify Button */}
            <button
              type="submit"
              disabled={verificationCode.length !== 6 || isLoading}
              className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {isLoading ? "Verifying..." : "Verify Email"}
            </button>

            {/* Resend Code */}
            <div className="text-center">
              <p className="text-slate-600 text-sm">
                Didn't receive the code?{" "}
                <button
                  type="button"
                  onClick={handleResendCode}
                  className="text-blue-600 font-semibold hover:text-blue-700 transition-colors"
                >
                  Resend
                </button>
              </p>
            </div>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-slate-200"></div>
            <span className="text-xs text-slate-500 font-medium">OR</span>
            <div className="flex-1 h-px bg-slate-200"></div>
          </div>

          {/* Change Email */}
          <div className="text-center">
            <p className="text-slate-600 text-sm mb-3">
              Wrong email address?
            </p>
            <Link
              href="/auth/signin"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors"
            >
              <span>Use different email</span>
            </Link>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-slate-500 text-xs sm:text-sm mt-6">
          Having trouble? <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">Contact support</a>
        </p>
      </div>
    </div>
  );
}

