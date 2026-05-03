"use client";

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
  Users,
  ShieldCheck,
  ClipboardList,
  FileText,
  Layers,
  Bell,
  LogOut,
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";

type Props = {
  role: "user" | "admin";
};

export default function Sidebar({ role }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const logout = useAuthStore((s) => s.logout);

  const userNav = [
    { name: "Dashboard", icon: LayoutGrid, href: "/dashboard" },
    { name: "Active Tasks", icon: ClipboardCheck, href: "/activetask" },
    { name: "Reviews", icon: Star, href: "/review" },
    { name: "My Tasks", icon: ShoppingBag, href: "/mytask" },
    { name: "My Requests", icon: Handshake, href: "/myrequest" },
    { name: "Messages", icon: MessageSquare, href: "/message" },
    { name: "Settings", icon: Settings, href: "/setting" },
  ];

  const adminNav = [
    { name: "Dashboard", icon: LayoutGrid, href: "/admin/dashboard" },
    { name: "Users", icon: Users, href: "/admin/users" },
    { name: "Verifications", icon: ShieldCheck, href: "/admin/verifications" },
    { name: "Tasks", icon: ClipboardList, href: "/admin/tasks" },
    { name: "Applications", icon: FileText, href: "/admin/applications" },
    { name: "Assignments", icon: Layers, href: "/admin/assignments" },
    { name: "Notifications", icon: Bell, href: "/admin/notifications" },
  ];

  const items = role === "admin" ? adminNav : userNav;

  const handleLogout = async () => {
    await logout();
    router.replace("/");
  };

  return (
    <aside className="flex flex-col px-2 py-10 ">

      {/* NAV */}
      <nav className="flex-1 space-y-4 overflow-y-auto">
        {items.map((item) => {
          const isActive = pathname.startsWith(item.href);

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`group relative flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-200 ${
                isActive
                  ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md hover:shadow-lg"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white hover:shadow-sm"
              }`}
            >
              {isActive && (
                <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-1 h-6 bg-gradient-to-b from-blue-400 to-indigo-600 rounded-r-lg" />
              )}
              <item.icon
                size={24}
                className={`flex-shrink-0 transition-all ${
                  isActive ? "text-white drop-shadow-sm" : "text-slate-400 group-hover:text-blue-500"
                }`}
              />
              <span className={`text-[16px] font-semibold tracking-wide transition-all ${
                isActive ? "text-white" : "text-slate-700"
              }`}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>

    
      {/* LOGOUT */}
      <div className="pt-5 mt-4 border-t border-slate-200">
      <button
          onClick={handleLogout}
          className="
          group flex w-full items-center gap-3 px-4 py-3
          text-red-500 transition-all duration-200
          hover:text-red-600
          "
      >
          {/* ICON */}
          <LogOut
          size={24}
          className="
              transition-all duration-200
              group-hover:translate-x-0.5
              group-hover:scale-110
          "
          />

          {/* TEXT */}
          <span className="text-[16px] font-semibold tracking-wide">
            Sign Out
          </span>
      </button>
      </div>
    </aside>
  );
}