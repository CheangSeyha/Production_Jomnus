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
  LifeBuoy,
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
    { name: "Support", icon: LifeBuoy, href: "/admin/support" },
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
          w-64 md:w-80
          bg-white border-r border-slate-200/60
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
        <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
          {items.map((item) => {
            const isActive = pathname.startsWith(item.href);

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onClose}
                className={`
                  group flex items-center gap-4 
                  rounded-xl px-4 py-3.5 transition-all duration-200
                  ${
                    isActive
                      ? "bg-blue-50/80 text-blue-600"
                      : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                  }
                `}
              >
                <item.icon
                  size={22}
                  className={`flex-shrink-0 transition-all ${
                    isActive
                      ? "text-blue-600"
                      : "text-slate-400 group-hover:text-slate-600"
                  }`}
                />
                <span
                  className={`text-base font-medium transition-all ${
                    isActive ? "text-blue-600" : "text-slate-600"
                  }`}
                >
                  {item.name}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Section: Support and Logout */}
        <div className="p-4 border-t border-slate-100 space-y-1">
          <Link
            href="/support"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              pathname === "/support" 
                ? "bg-blue-50 text-blue-600" 
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <LifeBuoy size={20} />
            <span className="font-medium">Help & Support</span>
          </Link>
        </div>s

        {/* Logout Button */}
        <div className="p-6 mt-auto">
          <button
            onClick={handleLogout}
            className="
            group flex items-center gap-4 px-4 py-4
            text-red-500 hover:bg-red-50 rounded-2xl
            transition-all duration-200 font-bold text-base w-full
            "
          >
            <LogOut
              size={22}
              className="flex-shrink-0"
            />
            <span>Log Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
