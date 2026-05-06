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
  X,
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";

type Props = {
  role: "user" | "admin";
  isOpen?: boolean;
  onClose?: () => void;
};

export default function Sidebar({ role, isOpen = false, onClose }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const logout = useAuthStore((s) => s.logout);

  const userNav = [
    { name: "Dashboard", icon: LayoutGrid, href: "/dashboard" },
    { name: "Active Tasks", icon: ClipboardCheck, href: "/activetask" },
    { name: "Reviews", icon: Star, href: "/Review" },
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
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 md:hidden z-30 transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed md:static
          top-0 left-0 bottom-0
          w-64 md:w-72
          bg-white border-r border-slate-200/80
          z-40
          flex flex-col
          transform transition-all duration-300 ease-out
          ${isOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full md:translate-x-0 md:shadow-none"}
        `}
      >
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between p-4 border-b border-slate-200/80">
          <h3 className="font-bold text-slate-900 text-sm uppercase tracking-widest">Menu</h3>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-100 rounded-lg transition text-slate-600"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-2 py-4 md:py-6 space-y-1">
          {items.map((item) => {
            const isActive = pathname.startsWith(item.href);

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onClose}
                className={`
                  group relative flex items-center gap-3 
                  rounded-lg px-3 py-2.5 transition-all duration-200
                  ${
                    isActive
                      ? "bg-blue-500 text-white shadow-md hover:shadow-lg"
                      : "text-slate-700 hover:text-slate-900 hover:bg-slate-100"
                  }
                `}
              >
                {isActive && (
                  <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-blue-400 rounded-r-full" />
                )}
                <item.icon
                  size={20}
                  className={`flex-shrink-0 transition-all ${
                    isActive
                      ? "text-white"
                      : "text-slate-400 group-hover:text-blue-500"
                  }`}
                />
                <span
                  className={`text-sm font-medium transition-all ${
                    isActive ? "text-white" : "text-slate-700"
                  }`}
                >
                  {item.name}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-slate-200/80">
          <button
            onClick={handleLogout}
            className="
            group flex w-full items-center gap-3 px-3 py-2.5
            text-red-600 hover:bg-red-50/50 rounded-lg
            transition-all duration-200 font-medium text-sm
            "
          >
            <LogOut
              size={20}
              className="flex-shrink-0 group-hover:translate-x-0.5 transition-transform"
            />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
