"use client";

import Image from "next/image";
import { Search, Bell, ChevronDown, Settings, LogOut } from "lucide-react";
import { getAvatar, useUserStore } from "@/store/userStore";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";

type Props = {
  role?: "user" | "admin";
};

export default function Header({ role = "user" }: Props) {
  const user = useUserStore((s) => s.user);

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

  return (
    <header
      className="
        sticky top-0 z-50
        flex h-25 items-center justify-between
        px-6 lg:px-10
        backdrop-blur-xl bg-white/60
        border-b border-slate-200/60
      "
    >
					{/* LEFT: BIG LOGO */}
			<div className="flex items-center gap-3 min-w-[220px]">
				<Image
					src="/images/logo.png"
					alt="Logo"
					width={200}
					height={200}
					className="h-30 w-auto object-contain"
					priority
				/>
			</div>

      {/* RIGHT */}
      <div className="flex items-center gap-4">

        {/* SEARCH */}
        <div className="relative hidden md:block">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />

          <input
            type="text"
            placeholder="Search tasks..."
            className="
              h-11 w-[260px] lg:w-[320px]
              rounded-xl
              bg-white/70
              pl-10 pr-4
              text-sm
              border border-slate-200/60
              outline-none
              transition-all
              focus:bg-white
              focus:ring-2 focus:ring-blue-100
              focus:border-blue-200
              shadow-sm
            "
          />
        </div>

        {/* NOTIFICATION */}
        <button
          className="
            relative p-2 rounded-xl
            hover:bg-white/60
            transition
          "
        >
          <Bell className="h-5 w-5 text-slate-600" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500" />
        </button>

        {/* PROFILE DROPDOWN */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setOpen(!open)}
            className="
              flex items-center gap-2
              rounded-xl px-2 py-1.5
              hover:bg-white/60
              transition
            "
          >
            {/* Avatar in the main Header bar */}
            <div className="h-9 w-9 rounded-full overflow-hidden bg-slate-100 relative border border-slate-200">
              <Image
                src={getAvatar(user)}
                alt="profile"
                fill
                className="object-cover"
                unoptimized={getAvatar(user).includes("dicebear")}
              />
            </div>

            {/* <span className="hidden lg:block text-sm font-medium text-slate-700">
              {user?.fullName || "User"}
            </span> */}

            <ChevronDown
              size={16}
              className={`text-slate-400 transition ${open ? "rotate-180" : ""}`}
            />
          </button>

          {/* DROPDOWN MENU */}
          {open && (
            <div className="absolute right-0 mt-3 w-64 rounded-xl bg-white/95 backdrop-blur-xl border border-slate-200 shadow-xl p-2 animate-in fade-in zoom-in-95 z-50">
              
              {/* HEADER: Matches the "Profile" look from Settings */}
              <Link 
                href="/setting" 
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-3 py-3 border-b border-slate-100 hover:bg-slate-50 transition rounded-t-lg group"
              >
                {/* Profile Image inside Dropdown */}
                <div className="h-11 w-11 rounded-full overflow-hidden bg-slate-100 relative border border-slate-200 shrink-0">
                  <Image
                    src={getAvatar(user)}
                    alt="profile"
                    fill
                    className="object-cover"
                    unoptimized={getAvatar(user).includes("dicebear")}
                  />
                </div>

                {/* Name and Email Stack */}
                <div className="flex flex-col min-w-0">
                  <p className="text-sm font-bold text-slate-800 truncate group-hover:text-blue-600 transition">
                    {user?.fullName || "Guest User"}
                  </p>
                  <p className="text-[11px] text-slate-500 truncate">
                    {user?.email || "No email provided"}
                  </p>
                </div>
              </Link>

              <div className="pt-1">
                {/* SETTINGS LINK */}
                <Link
                  href="/setting"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-slate-600 hover:bg-slate-100 transition"
                >
                  <Settings size={18} className="text-slate-400" />
                  <span className="text-sm font-medium">Settings</span>
                </Link>

                {/* LOGOUT */}
                <button
                  className="flex items-center gap-3 w-full px-3 py-2.5 mt-1 rounded-lg text-red-500 hover:bg-red-50 transition"
                >
                  <LogOut size={18} />
                  <span className="text-sm font-semibold">Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}