"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutGrid,
  ClipboardCheck,
  Star,
  ShoppingBag,
  Handshake,
  MessageSquare,
  Settings,
  LogOut,
} from "lucide-react";
import axios from "axios";

const UserSidebar = () => {
  const pathname = usePathname();
  const router = useRouter();

  const mainNav = [
    { name: "Dashboard", icon: LayoutGrid, href: "/dashboard" },
    { name: "Active Tasks", icon: ClipboardCheck, href: "/activetask" },
    { name: "Reviews", icon: Star, href: "/review" },
    { name: "My Tasks", icon: ShoppingBag, href: "/mytask" },
    { name: "My Requests", icon: Handshake, href: "/myrequest" },
    { name: "Messages", icon: MessageSquare, href: "/message" },
    { name: "Settings", icon: Settings, href: "/setting" },
  ];

  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:3001/api/auth/logout",
        {},
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );

      router.replace("/auth/signin");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <aside className="w-64 bg-white border-r border-amber-50 flex flex-col">

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {mainNav.map((item) => {
          const isActive =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`group flex items-center gap-4 rounded-xl px-4 py-3 transition ${
                isActive
                  ? "bg-[#005bc4] text-white"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <item.icon
                size={22}
                className={
                  isActive
                    ? "text-white"
                    : "text-slate-500 group-hover:text-slate-800"
                }
              />
              <span className="font-semibold">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="px-4 py-4 border-t">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 text-red-500 hover:bg-slate-50 px-4 py-3 rounded-xl w-full"
        >
          <LogOut size={22} />
          <span className="font-semibold">Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default UserSidebar;