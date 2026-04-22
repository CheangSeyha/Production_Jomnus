"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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

const Sidebar = () => {
  const pathname = usePathname();

  const mainNav = [
    { name: 'Dashboard', icon: LayoutGrid, href: '/dashboard' },
    { name: 'Active Tasks', icon: ClipboardCheck, href: '/dashboard/activetask' },
    { name: 'Reviews', icon: Star, href: '/dashboard/Review' },
    { name: 'My Tasks', icon: ShoppingBag, href: '/dashboard/mytask' },
    { name: 'My Requests', icon: Handshake, href: '/dashboard/myrequest' },
    { name: 'Messages', icon: MessageSquare, href: '/dashboard/message' },
    { name: 'Settings', icon: Settings, href: '/dashboard/setting' },
  ];

  const bottomNav = [
    // { name: 'Support', icon: HelpCircle, color: 'text-slate-600' },
    { name: 'Sign Out', icon: LogOut, color: 'text-red-500', href: '/' },
  ];

  return (
      <aside className="flex w-full flex-col border-b border-slate-100 bg-white px-4 py-6 md:sticky md:top-20 md:h-[calc(100vh-5rem)] md:w-64 md:self-start md:overflow-y-auto md:border-b-0 md:border-r">
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
          {bottomNav.map((item) => {
            if (item.href) {
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className="group flex w-full items-center gap-4 rounded-xl px-4 py-3 transition-colors hover:bg-slate-50"
                >
                  <item.icon
                    size={22}
                    className={`${item.color} opacity-80 group-hover:opacity-100`}
                  />
                  <span className={`text-[15px] font-semibold ${item.color}`}>{item.name}</span>
                </Link>
              );
            }

            return (
              <button
                key={item.name}
                className="group flex w-full items-center gap-4 rounded-xl px-4 py-3 transition-colors hover:bg-slate-50"
                type="button"
              >
                <item.icon
                  size={22}
                  className={`${item.color} opacity-80 group-hover:opacity-100`}
                />
                <span className={`text-[15px] font-semibold ${item.color}`}>{item.name}</span>
              </button>
            );
          })}
        </div>
      </aside>
  );
};

export default Sidebar;