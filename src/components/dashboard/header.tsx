"use client";

import Image from "next/image";
import Link from "next/link"; // Import Link for navigation
import { Search, Bell, ChevronDown, Settings, LogOut, Menu } from "lucide-react";

import { useUserStore, getAvatar } from "@/store/userStore";

import { useState, useRef, useEffect } from "react";
import { useNotificationStore } from "@/store/userNotificationStore";

type Props = {
  role?: "user" | "admin";
  onMenuClick?: () => void;
};

export default function Header({ role = "user", onMenuClick }: Props) {
  const user = useUserStore((s) => s.user);
  const unreadCount = useNotificationStore((s) => s.unreadCount); // Get unread count from Zustand

  const avatar =
    user?.profileImage ||
    `https://api.dicebear.com/7.x/initials/svg?seed=${user?.fullName || "User"}`;

  const displayName = user?.fullName || "User";
  const displayEmail = user?.email || "No email provided";

  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // close dropdown on outside click
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
    window.location.href = "/auth/signin";
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200/80 shadow-sm">
      <div className="flex h-16 sm:h-18 md:h-20 items-center justify-between px-3 sm:px-4 md:px-6 lg:px-8">
        {/* LEFT: Mobile Menu + Logo */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-shrink-0">
          {/* Mobile Menu Button */}
          <button
            onClick={onMenuClick}
            className="md:hidden p-2 hover:bg-slate-100 rounded-lg transition text-slate-600"
            aria-label="Toggle menu"
          >
            <Menu size={20} />
          </button>

          {/* LOGO */}
          <Image
            src="/images/logo.png"
            alt="Jomnus"
            width={100}
            height={32}
            className="object-contain w-16 sm:w-20 md:w-28 lg:w-32"
            style={{ height: "auto" }}
            priority
          />
        </div>

        {/* CENTER: Search (Desktop only) */}
        <div className="hidden lg:flex flex-1 justify-center max-w-md mx-6">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search tasks..."
              className="
                w-full h-10
                rounded-lg
                bg-slate-50
                pl-10 pr-4
                text-sm
                border border-slate-200
                outline-none
                transition-all
                focus:bg-white
                focus:ring-2 focus:ring-blue-500/20
                focus:border-blue-300
              "
            />
          </div>
        </div>

        {/* RIGHT: Actions */}
        <div className="flex items-center gap-1 sm:gap-2 md:gap-3 ml-auto">
          {/* NOTIFICATION */}
          <Link
            href="/notifications"
            className="
              relative p-2 sm:p-2.5 rounded-lg
              hover:bg-slate-100
              transition flex-shrink-0 text-slate-600
            "
            aria-label="Notifications"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </Link>

          {/* PROFILE DROPDOWN */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setOpen(!open)}
              className="
                flex items-center gap-1 sm:gap-2
                rounded-lg px-1 sm:px-2 py-1.5
                hover:bg-slate-100
                transition flex-shrink-0
              "
              aria-label="Profile menu"
            >
              <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-full overflow-hidden bg-slate-200 relative border border-slate-300 flex-shrink-0">
                <Image
                  src={getAvatar(user)}
                  alt="Profile"
                  fill
                  className="object-cover"
                  unoptimized={getAvatar(user).includes("dicebear")}
                />
              </div>
              <ChevronDown
                size={16}
                className={`text-slate-400 transition hidden sm:block ${open ? "rotate-180" : ""}`}
              />
            </button>

            {/* DROPDOWN MENU */}
            {open && (
              <div className="absolute right-0 mt-2 w-72 rounded-xl bg-white border border-slate-200 shadow-xl z-50">
                {/* PROFILE SECTION */}
                <Link
                  href="/setting"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 border-b border-slate-200 hover:bg-slate-50 transition"
                >
                  <div className="h-10 w-10 rounded-full overflow-hidden bg-slate-200 relative border border-slate-300 flex-shrink-0">
                    <Image
                      src={getAvatar(user)}
                      alt="Profile"
                      fill
                      className="object-cover"
                      unoptimized={getAvatar(user).includes("dicebear")}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900 truncate">
                      {user?.fullName || "Guest"}
                    </p>
                    <p className="text-xs text-slate-500 truncate">
                      {user?.email || "No email"}
                    </p>
                  </div>
                </Link>

                {/* MENU ITEMS */}
                <div className="p-2 space-y-1">
                  <Link
                    href="/setting"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 px-4 py-2 rounded-lg text-slate-700 hover:bg-slate-100 transition text-sm font-medium"
                  >
                    <Settings size={18} className="text-slate-400 flex-shrink-0" />
                    <span>Settings</span>
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-4 py-2 rounded-lg text-red-600 hover:bg-red-50 transition text-sm font-medium"
                  >
                    <LogOut size={18} className="flex-shrink-0" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
