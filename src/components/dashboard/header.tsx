"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Search,
  Bell,
  Settings,
  LogOut,
  Menu,
  UserCircle,
  ShieldCheck,
  User,
  ChevronRight,
  CheckCircle2,
} from "lucide-react";

import { useUserStore, getAvatar, isVerifiedUser } from "@/store/userStore";
import { useAuthStore } from "@/store/authStore";
import { useState, useRef, useEffect } from "react";
import { useNotificationStore } from "@/store/userNotificationStore";
import { motion, AnimatePresence } from "framer-motion";

type Props = {
  role?: "user" | "admin";
  onMenuClick?: () => void;
};

export default function Header({ role = "user", onMenuClick }: Props) {
  // Use both stores for maximum compatibility
  const authUser = useAuthStore((s) => s.user);
  const storeUser = useUserStore((s) => s.user);
  const setStoreUser = useUserStore((s) => s.setUser);
  
  // Prioritize authUser, fallback to storeUser
  const user = authUser || storeUser;
  
  const unreadCount = useNotificationStore((s) => s.unreadCount);
  const fetchNotifications = useNotificationStore((s) => s.fetchNotifications);

  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isVerified = isVerifiedUser(user);

  // Sync notifications on header mount (solves the page refresh red dot lag)
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Sync user state loop from localStorage fallback
  useEffect(() => {
    if (!user && typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user_store"); 
      if (storedUser) {
        try {
          const parsed = JSON.parse(storedUser);
          if (parsed?.state?.user && setStoreUser) {
            setStoreUser(parsed.state.user);
          }
        } catch (e) {
          console.error("Failed to parse user store back layer:", e);
        }
      }
    }
  }, [user, setStoreUser]);

  useEffect(() => {
    const handleClick = (e: any) => {
      if (!dropdownRef.current?.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  const handleLogout = async () => {
    localStorage.removeItem("access_token");
    if (typeof window !== "undefined") {
      window.location.href = "/auth/signin";
    }
  };

  const is_admin = role === "admin";
  const avatarUrl = getAvatar(user);
  const isGoogleUser = avatarUrl?.includes("googleusercontent.com") || avatarUrl?.includes("google");

  // Get display name with proper fallbacks
  // Fix: Use only fullName since AuthUser doesn't have 'name' property
  const displayName = user?.fullName || "Guest User";
  const firstName = displayName.split(" ")[0] || "Account";

  return (
    <header className="sticky top-0 z-[1000]  backdrop-blur-md border-b border-slate-200/60">
      <div className="flex h-16 sm:h-20 items-center justify-between px-4 sm:px-6 md:px-8">
        <div className="flex items-center gap-3 min-w-0 shrink-0">
          <button
            onClick={onMenuClick}
            className="md:hidden p-2 hover:bg-slate-100 rounded-xl transition text-slate-600"
            aria-label="Toggle menu"
          >
            <Menu size={20} />
          </button>
          <Link
            href={is_admin ? "/admin/dashboard" : "/dashboard"}
            className="flex items-center gap-2"
          >
            <Image
              src="/images/logo.png"
              alt="Jomnus"
              width={240}
              height={80}
              className="object-contain w-32 sm:w-40"
              style={{ height: "auto" }}
              priority
            />
          </Link>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-4 ml-auto">
          {/* Notifications Link */}
          <Link
            href={is_admin ? "/admin/notifications" : "/notifications"}
            className="relative p-2.5 rounded-full hover:bg-slate-100 transition-all duration-200 flex-shrink-0 text-slate-500 group"
            aria-label="Notifications"
          >
            <Bell
              size={22}
              className="group-hover:rotate-12 transition-transform"
            />
            {/* Reactive Red Dot Indicator */}
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 h-2.5 w-2.5 rounded-full bg-rose-500 border-2 border-white animate-pulse" />
            )}
          </Link>

          <div className="h-8 w-px bg-slate-200/60 mx-1 hidden sm:block" />

          {/* Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setOpen(!open)}
              className="flex items-center gap-2 rounded-full p-0.5 pr-2.5 hover:bg-slate-50 transition-all duration-200 border border-transparent hover:border-slate-200"
            >
              <div className="relative">
                <div
                  className={`h-9 w-9 sm:h-10 sm:w-10 rounded-full overflow-hidden bg-slate-100 relative border-2 shadow-sm ${
                    is_admin ? "border-indigo-100" : "border-blue-100"
                  }`}
                >
                  <Image
                    src={avatarUrl || "/images/default-avatar.png"}
                    alt="Profile"
                    fill
                    className="object-cover"
                    unoptimized={avatarUrl?.includes("dicebear") || isGoogleUser}
                  />
                </div>
                {isGoogleUser && (
                  <div className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-white border border-slate-100 flex items-center justify-center shadow-sm p-0.5">
                    <svg viewBox="0 0 24 24" className="w-full h-full">
                      <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                      />
                      <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        fill="#EA4335"
                      />
                    </svg>
                  </div>
                )}
              </div>
              <div className="hidden sm:block text-left">
                <div className="flex items-center gap-1">
                  <p className="text-[13px] font-bold text-slate-800 leading-none truncate max-w-[100px]">
                    {firstName}
                  </p>
                  {isVerified && (
                    <span className="text-blue-500 shrink-0" title="Identity Verified">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
                        <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 014.254 2.226 4.49 4.49 0 01-.093 4.793 4.49 4.49 0 012.226 4.254 4.49 4.49 0 01-1.549 3.397 4.49 4.49 0 01-2.226 4.254 4.49 4.49 0 01-4.793-.093 4.49 4.49 0 01-4.254 2.226 4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-4.254-2.226 4.49 4.49 0 01.093-4.793 4.49 4.49 0 01-2.226-4.254 4.49 4.49 0 011.549-3.397 4.49 4.49 0 012.226-4.254zm5.418 7.301a.75.75 0 00-1.06-1.06l-3.5 3.5-1.5-1.5a.75.75 0 10-1.06 1.06l2 2a.75.75 0 001.06 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </span>
                  )}
                </div>
                <p
                  className={`text-[10px] font-black uppercase tracking-wider mt-0.5 ${
                    is_admin ? "text-indigo-600" : "text-blue-600"
                  }`}
                >
                  {role}
                </p>
              </div>
            </button>

            <AnimatePresence>
              {open && (
                <motion.div
                  initial={{ opacity: 0, y: 12, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 12, scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  className="absolute right-0 mt-3 w-80 rounded-[24px] bg-white border border-slate-200 shadow-[0_20px_50px_rgba(0,0,0,0.1)] z-50 py-3 overflow-hidden"
                >
                  <div
                    className={`px-5 py-5 flex items-center gap-4 ${
                      is_admin
                        ? "bg-gradient-to-br from-indigo-600 to-violet-700"
                        : "bg-gradient-to-br from-slate-50 to-white"
                    }`}
                  >
                    <div className="relative">
                      <div
                        className={`h-14 w-14 rounded-2xl overflow-hidden bg-slate-100 relative border-2 ${
                          is_admin ? "border-white/30" : "border-blue-200"
                        }`}
                      >
                        <Image
                          src={avatarUrl || "/images/default-avatar.png"}
                          alt="Profile"
                          fill
                          className="object-cover"
                          unoptimized={
                            avatarUrl?.includes("dicebear") || isGoogleUser
                          }
                        />
                      </div>
                      <div
                        className={`absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-white shadow-sm ${
                          is_admin ? "bg-amber-400" : "bg-emerald-500"
                        }`}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 max-w-full">
                        <p
                          className={`text-base font-black truncate ${
                            is_admin ? "text-white" : "text-slate-900"
                          }`}
                        >
                          {displayName}
                        </p>
                        {isVerified && (
                          <span className={`${is_admin ? "text-white" : "text-blue-500"} shrink-0`} title="Identity Verified">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                              <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 014.254 2.226 4.49 4.49 0 01-.093 4.793 4.49 4.49 0 012.226 4.254 4.49 4.49 0 01-1.549 3.397 4.49 4.49 0 01-2.226 4.254 4.49 4.49 0 01-4.793-.093 4.49 4.49 0 01-4.254 2.226 4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-4.254-2.226 4.49 4.49 0 01.093-4.793 4.49 4.49 0 01-2.226-4.254 4.49 4.49 0 011.549-3.397 4.49 4.49 0 012.226-4.254zm5.418 7.301a.75.75 0 00-1.06-1.06l-3.5 3.5-1.5-1.5a.75.75 0 10-1.06 1.06l2 2a.75.75 0 001.06 0l4-4z" clipRule="evenodd" />
                            </svg>
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-black uppercase tracking-widest ${
                            is_admin
                              ? "bg-white/20 text-white backdrop-blur-md"
                              : "bg-blue-600 text-white"
                          }`}
                        >
                          {role}
                        </span>
                        {is_admin && (
                          <span className="text-[10px] text-white/70 font-bold flex items-center gap-1">
                            <div className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
                            System Health: 100%
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {is_admin && (
                    <div className="px-5 py-3 bg-indigo-50/50 border-b border-indigo-100 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ShieldCheck size={14} className="text-indigo-600" />
                        <span className="text-[11px] font-bold text-indigo-700">
                          Pending Actions
                        </span>
                      </div>
                      <span className="text-[11px] font-black bg-indigo-600 text-white px-2 py-0.5 rounded-full">
                        3
                      </span>
                    </div>
                  )}

                  <div className="px-3 pt-4 pb-2 space-y-1">
                    {!is_admin && (
                      <Link
                        href="/setting"
                        onClick={() => setOpen(false)}
                        className="flex items-center justify-between group p-3 rounded-2xl hover:bg-slate-50 transition-all duration-200"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-xl bg-blue-50 text-blue-600 group-hover:bg-blue-100 transition-colors">
                            <User size={18} />
                          </div>
                          <span className="text-sm font-bold text-slate-700">
                            My Profile
                          </span>
                        </div>
                        <ChevronRight
                          size={16}
                          className="text-slate-300 group-hover:text-slate-500 transition-colors"
                        />
                      </Link>
                    )}

                    {is_admin && (
                      <Link
                        href="/admin/dashboard"
                        onClick={() => setOpen(false)}
                        className="flex items-center justify-between group p-3 rounded-2xl hover:bg-slate-50 transition-all duration-200"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600 group-hover:bg-indigo-100 transition-colors">
                            <ShieldCheck size={18} />
                          </div>
                          <span className="text-sm font-bold text-slate-700">
                            Admin Console
                          </span>
                        </div>
                        <ChevronRight
                          size={16}
                          className="text-slate-300 group-hover:text-slate-500 transition-colors"
                        />
                      </Link>
                    )}

                    <Link
                      href={is_admin ? "/admin/setting" : "/setting"}
                      onClick={() => setOpen(false)}
                      className="flex items-center justify-between group p-3 rounded-2xl hover:bg-slate-50 transition-all duration-200"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-slate-100 text-slate-600 group-hover:bg-slate-200 transition-colors">
                          <Settings size={18} />
                        </div>
                        <span className="text-sm font-bold text-slate-700">
                          Settings
                        </span>
                      </div>
                      <ChevronRight
                        size={16}
                        className="text-slate-300 group-hover:text-slate-500 transition-colors"
                      />
                    </Link>
                  </div>

                  <div className="mx-3 my-2 h-px bg-slate-100" />

                  <div className="px-3 pb-2">
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 w-full p-3 rounded-2xl text-rose-500 hover:bg-rose-50 transition-all duration-200 group"
                    >
                      <div className="p-2 rounded-xl bg-rose-50 text-rose-500 group-hover:bg-rose-100 transition-colors">
                        <LogOut size={18} />
                      </div>
                      <span className="text-sm font-black uppercase tracking-widest">
                        Sign Out
                      </span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
}