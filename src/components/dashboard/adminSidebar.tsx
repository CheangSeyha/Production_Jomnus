"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutGrid,
  Users,
  ShieldCheck,
  ClipboardList,
  FileText,
  Layers,
  Bell,
  LogOut,
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";

const AdminSidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);

  const mainNav = [
    { name: "Dashboard", icon: LayoutGrid, href: "/admin/dashboard" },
    { name: "Users", icon: Users, href: "/admin/users" },
    { name: "Verifications", icon: ShieldCheck, href: "/admin/verifications" },
    { name: "Tasks", icon: ClipboardList, href: "/admin/tasks" },
    { name: "Applications", icon: FileText, href: "/admin/applications" },
    { name: "Assignments", icon: Layers, href: "/admin/assignments" },
    { name: "Notifications", icon: Bell, href: "/admin/notifications" },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      router.replace("/auth/signin");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <aside className="w-64 border-r border-amber-50 bg-white px-4 py-6">
      {/* Main Navigation */}
      <nav className="flex-1 space-y-2">
        {mainNav.map((item) => {
          const isActive =
            item.href === "/admin/dashboard"
              ? pathname === "/admin/dashboard"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`group flex w-full items-center gap-4 rounded-xl px-4 py-3 transition-all duration-200 ${
                isActive
                  ? "bg-[#005bc4] text-white shadow-md shadow-blue-100"
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
              <span className="text-[15px] font-semibold">
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="mt-auto pt-6 border-t border-slate-50">
        <button
          onClick={handleLogout}
          className="group flex w-full items-center gap-4 rounded-xl px-4 py-3 transition-colors hover:bg-slate-50"
        >
          <LogOut
            size={22}
            className="text-red-500 opacity-80 group-hover:opacity-100"
          />
          <span className="text-[15px] font-semibold text-red-500">
            Sign Out
          </span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
