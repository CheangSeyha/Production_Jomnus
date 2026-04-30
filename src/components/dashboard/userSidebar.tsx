"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutGrid,
  ClipboardCheck,
  Star,
  ShoppingBag,
  Handshake,
  MessageSquare,
  Settings,
  HelpCircle,
  LogOut
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);

  const mainNav = [
    { name: 'Dashboard', icon: LayoutGrid, href: '/dashboard' },
    { name: 'Active Tasks', icon: ClipboardCheck, href: '/activetask' },
    { name: 'Reviews', icon: Star, href: '/Review' },
    { name: 'My Tasks', icon: ShoppingBag, href: '/mytask' },
    { name: 'My Requests', icon: Handshake, href: '/myrequest' },
    { name: 'Messages', icon: MessageSquare, href: '/message' },
    { name: 'Settings', icon: Settings, href: '/setting' },
  ];

  const bottomNav = [
    // { name: 'Support', icon: HelpCircle, color: 'text-slate-600' },
    { name: 'Sign Out', icon: LogOut, color: 'text-red-500', href: '/' },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      router.replace("/");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };


  return (
      <aside className="flex w-full flex-col border-b border-slate-100 bg-white px-4 py-6 md:h-full md:w-64 md:self-start md:overflow-y-auto md:border-b-0 md:border-r">
        {/* Main Navigation */}
        <nav className="flex-1 space-y-2">
          {mainNav.map((item) => {
            const isActive = item.href === '/dashboard' ? pathname === '/dashboard' : pathname.startsWith(item.href);

            return (
                <Link
                    key={item.name}
                    href={item.href}
                    className={`group flex w-full items-center gap-4 rounded-xl px-4 py-3 transition-all duration-200 ${
                        isActive
                            ? 'bg-[#005bc4] text-white shadow-md shadow-blue-100'
                            : 'text-slate-600 hover:bg-slate-50'
                    }`}
                >
                  <item.icon
                      size={22}
                      className={isActive ? 'text-white' : 'text-slate-500 group-hover:text-slate-800'}
                  />
                  <span className="text-[15px] font-semibold">{item.name}</span>
                </Link>
            );
          })}
        </nav>

        {/* Bottom Section */}
        <div className="mt-auto space-y-2 pt-6 border-t border-slate-50">
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

export default Sidebar;
