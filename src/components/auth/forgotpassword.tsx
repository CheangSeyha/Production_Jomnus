"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  MdEmail,
  MdLock,
  MdVisibility,
  MdVisibilityOff,
  MdCheck,
} from "react-icons/md";
import { RxArrowLeft } from "react-icons/rx";
import { authService } from "@/services/authService";

type Step = "email" | "otp" | "newPassword" | "success";

export default function ForgotPasswordForm() {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  // Timer for OTP resend
  useEffect(() => {
    if (step !== "otp" || timeLeft === 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [step, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setMessage("");
    setIsSubmitting(true);
    try {
      const response = await authService.forgotPassword({ email });
      setMessage(response.message || "OTP has been sent to your email.");
      setStep("otp");
      setTimeLeft(300);
    } catch (error) {
      const errMessage =
        error instanceof Error ? error.message : "Failed to request password reset";
      setMessage(errMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const otpValue = otp.join("");
    if (otpValue.length !== 6) {
      setMessage("Please enter the 6-digit OTP");
      return;
    }
    setMessage("");
    setStep("newPassword");
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }
    if (newPassword.length < 8) {
      setMessage("Password must be at least 8 characters");
      return;
    }
    setIsSubmitting(true);
    try {
      await authService.resetPassword({
        email,
        otp: otp.join(""),
        password: newPassword,
      });
      setStep("success");
    } catch (error) {
      const errMessage =
        error instanceof Error ? error.message : "Failed to reset password";
      setMessage(errMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackToSignIn = () => {
    // Reset form and go back
    setStep("email");
    setEmail("");
    setOtp(["", "", "", "", "", ""]);
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white">
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center items-center relative overflow-hidden">
          <>
            <div className="absolute top-10 left-20 z-50 text-center">
              <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight">
                Join Us
                <br />
                Today
              </h1>
            </div>
            <img src="/Image/content1.svg" alt="" className="relative z-10" />
          </>
        )}
        {step === "otp" && (
          <>
            <div className="absolute top-1/2 transform -translate-y-1/2 right-0 left-0 z-50 flex justify-center items-center">
              <MdLock className="text-[#F1F6FF] w-40 h-40 sm:w-60 sm:h-60" />
            </div>
            <img src="/Image/content2.svg" alt="" className="relative z-10" />
          </>
        )}
        {step === "newPassword" && (
          <>
            <div className="absolute top-1/2 transform -translate-y-1/2 right-0 left-0 z-50 flex justify-center items-center">
              <MdLock className="text-[#F1F6FF] w-40 h-40 sm:w-60 sm:h-60" />
            </div>
            <img src="/Image/content2.svg" alt="" className="relative z-10" />
          </>
        )}
        {step === "success" && (
          <>
            <div className="absolute top-1/2 transform -translate-y-1/2 right-0 left-0 z-50 flex justify-center items-center">
              <MdLock className="text-[#F1F6FF] w-40 h-40 sm:w-60 sm:h-60" />
            </div>
            <img src="/Image/content2.svg" alt="" className="relative z-10" />
          </>
        )}
      </div>
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center px-4 sm:px-6 md:px-8 lg:px-12 py-8 sm:py-12 md:py-16 lg:py-0 overflow-y-auto max-h-screen lg:max-h-none relative">
        {step !== "success" && (
          <Link
            href={step === "email" ? "/auth/signin" : "#"}
            onClick={(e) => {
              if (step !== "email") {
                e.preventDefault();
                setStep(step === "otp" ? "email" : "otp");
              }
            }}
            className="absolute top-3 sm:top-6 left-3 sm:left-6 text-blue-600 hover:text-blue-700 hover:bg-blue-50 p-2 rounded-full transition"
            aria-label="Go back"
          >
            <RxArrowLeft className="w-5 sm:w-6 h-5 sm:h-6" />
          </Link>
        )}

        <div className="w-full max-w-md">
          {/* Step 1: Forgot Password */}
          {step === "email" && (
            <>
              <div className="flex justify-start mb-6 sm:mb-8">
                <div className="w-16 h-16 bg-[#F1F6FF] rounded-full flex items-center justify-center">
                  <MdLock className="w-8 h-8 text-[#1A73E8]" />
                </div>
              </div>

              <div className="mb-6 sm:mb-8 text-start">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                  Forgot Password?
                </h2>
                <p className="text-gray-600 text-xs sm:text-sm">
                  Enter your email to reset your password
                </p>
              </div>

              <form
                onSubmit={handleEmailSubmit}
                className="space-y-4 sm:space-y-5"
              >
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
                      placeholder="domat@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-12 pr-4 py-2 sm:py-3 text-sm sm:text-base border-2 border-gray-200 rounded-full focus:outline-none focus:border-[#0058BC] focus:ring-1 focus:ring-[#0058BC] transition duration-200"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#0058BC] hover:bg-[#004799] disabled:opacity-70 text-white font-semibold py-3 sm:py-3 px-4 text-sm sm:text-base rounded-full transition duration-200 mt-6 sm:mt-8"
                >
                  {isSubmitting ? "Submitting..." : "Submit"}
                </button>
                {message && (
                  <p className="text-xs text-center text-red-500">{message}</p>
                )}
              </form>
            </>
          )}

          {/* Step 2: OTP Verification */}
          {step === "otp" && (
            <>
              <div className="flex justify-start mb-8">
                <div className="w-16 h-16 bg-[#F1F6FF] rounded-full flex items-center justify-center">
                  <MdEmail className="w-8 h-8 text-[#1A73E8]" />
                </div>
              </div>

              <div className="mb-6 sm:mb-8 text-start">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                  OTP Verification
                </h2>
                <p className="text-gray-600 text-xs sm:text-sm">
                  Check your email to see the verification code
                </p>
              </div>

              <form
                onSubmit={handleOtpSubmit}
                className="space-y-4 sm:space-y-6"
              >
                <div>
                  <div className="flex gap-2 sm:gap-3 justify-center">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        id={`otp-${index}`}
                        type="text"
                        inputMode="numeric"
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                        maxLength={1}
                        className="w-9 h-9 sm:w-12 sm:h-12 border-2 border-gray-200 rounded-lg sm:rounded-full text-center text-base sm:text-lg font-semibold focus:outline-none focus:border-[#0058BC] focus:ring-1 focus:ring-[#0058BC] transition duration-200"
                      />
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#0058BC] hover:bg-[#004799] disabled:opacity-70 text-white font-semibold py-3 sm:py-3 px-4 text-sm sm:text-base rounded-full transition duration-200"
                >
                  Verify
                </button>
                {message && (
                  <p className="text-xs text-center text-red-500">{message}</p>
                )}

                <div className="text-center">
                  <p className="text-gray-600 text-xs sm:text-sm">
                    Resend code in{" "}
                    <span className="text-[#0058BC] font-semibold">
                      {formatTime(timeLeft)}
                    </span>
                  </p>
                </div>
              </form>
            </>
          )}

          {/* Step 3: Set New Password */}
          {step === "newPassword" && (
            <>
              <div className="flex justify-start mb-8">
                <div className="w-16 h-16 bg-[#F1F6FF] rounded-full flex items-center justify-center">
                  <MdLock className="w-8 h-8 text-[#0058BC]" />
                </div>
              </div>

              <div className="mb-6 sm:mb-8 text-start">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                  Set New Password
                </h2>
                <p className="text-gray-600 text-xs sm:text-sm">
                  Enter your new password to complete the reset process
                </p>
              </div>

              <form
                onSubmit={handlePasswordSubmit}
                className="space-y-4 sm:space-y-5"
              >
                <div>
                  <label
                    htmlFor="newPassword"
                    className="block text-xs sm:text-sm font-medium text-gray-700 mb-2"
                  >
                    New Password
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                      <MdLock className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                      id="newPassword"
                      type={showNewPassword ? "text" : "password"}
                      placeholder="Set your password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full pl-12 pr-12 py-2 sm:py-3 text-sm sm:text-base border-2 border-gray-200 rounded-full focus:outline-none focus:border-[#0058BC] focus:ring-1 focus:ring-[#0058BC] transition duration-200"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showNewPassword ? (
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
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                      <MdLock className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full pl-12 pr-12 py-2 sm:py-3 text-sm sm:text-base border-2 border-gray-200 rounded-full focus:outline-none focus:border-[#0058BC] focus:ring-1 focus:ring-[#0058BC] transition duration-200"
                      required
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
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

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#0058BC] hover:bg-[#004799] disabled:opacity-70 text-white font-semibold py-3 sm:py-3 px-4 text-sm sm:text-base rounded-full transition duration-200 mt-6 sm:mt-8"
                >
                  {isSubmitting ? "Saving..." : "Save New Password"}
                </button>
                {message && (
                  <p className="text-xs text-center text-red-500">{message}</p>
                )}
              </form>

              <div className="text-center mt-4 sm:mt-6">
                <p className="text-gray-600 text-xs sm:text-sm">
                  Remember old password?{" "}
                  <Link
                    href="/auth/signin"
                    className="text-[#0058BC] font-semibold"
                  >
                    Sign in
                  </Link>
                </p>
              </div>
            </>
          )}

          {/* Step 4: Success */}
          {step === "success" && (
            <>
              <div className="flex justify-center mb-6 sm:mb-8">
                <div className="w-14 sm:w-16 h-14 sm:h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <MdCheck className="w-7 sm:w-8 h-7 sm:h-8 text-green-600" />
                </div>
              </div>

              <div className="mb-6 sm:mb-8 text-center">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                  Your Password
                  <br />
                  Successfully Changed
                </h2>
                <p className="text-gray-600 text-xs sm:text-sm">
                  Sign in to your account with your new password
                </p>
              </div>

              <Link
                href="/auth/signin"
                className="w-full block text-center bg-[#0058BC] hover:bg-[#004799] text-white font-semibold py-3 sm:py-3 px-4 text-sm sm:text-base rounded-full transition duration-200"
              >
                Go to Sign In
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
