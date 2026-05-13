"use client";

import { useState } from "react"; // Added useState
import { Bell, CheckCheck, Clock, Info, AlertTriangle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useNotificationStore } from "@/store/userNotificationStore";

export default function NotificationsPage() {
  const { notifications, isLoading, markAsRead, markAllAsRead } = useNotificationStore();
  
  // 1. Add state to manage the active filter
  const [activeTab, setActiveTab] = useState<"all" | "unread">("all");

  // 2. Filter the notifications based on the active tab
  const filteredNotifications = notifications?.filter((notif) => {
    if (activeTab === "unread") return !notif.is_read;
    return true; // Show all for the "all" tab
  });

  return (
    <div className="max-w-4xl mx-auto pb-10">
      {/* HEADER SECTION */}
      <div className="mb-6 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Notifications</h1>
          <p className="text-slate-500 text-sm">Stay updated with your latest task activities.</p>
        </div>
        <button 
          onClick={markAllAsRead}
          className="text-sm font-bold text-blue-600 hover:underline flex items-center gap-1 transition-all"
        >
          <CheckCheck size={18} /> Mark all read
        </button>
      </div>

      {/* 3. FILTER TABS SECTION */}
      <div className="flex gap-4 mb-6 border-b border-slate-100 pb-4">
        <button
          onClick={() => setActiveTab("all")}
          className={`px-4 py-2 text-sm font-medium rounded-full transition-all ${
            activeTab === "all" 
              ? "bg-blue-600 text-white shadow-md shadow-blue-100" 
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          All
        </button>
        <button
          onClick={() => setActiveTab("unread")}
          className={`px-4 py-2 text-sm font-medium rounded-full transition-all relative ${
            activeTab === "unread" 
              ? "bg-blue-600 text-white shadow-md shadow-blue-100" 
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          Unread
          {/* Optional: Show a small dot if there are unread items */}
          {notifications?.some(n => !n.is_read) && activeTab !== "unread" && (
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
          )}
        </button>
      </div>

      {/* NOTIFICATION LIST */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="py-20 text-center text-slate-400">
            <div className="animate-spin inline-block w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full mb-2"></div>
            <p>Loading notifications...</p>
          </div>
        ) : (filteredNotifications?.length ?? 0) === 0 ? (
          <div className="bg-white rounded-2xl p-20 flex flex-col items-center border border-slate-100 shadow-sm">
            <Bell size={48} className="text-slate-200 mb-4" />
            <p className="text-slate-400 font-medium text-lg">
              {activeTab === "unread" ? "No unread notifications" : "No notifications yet"}
            </p>
            <p className="text-slate-300 text-sm">We'll let you know when something happens.</p>
          </div>
        ) : (
          /* 4. Use the FILTERED list for mapping */
          filteredNotifications?.map((notif) => (
            <div 
              key={notif.id}
              onClick={() => !notif.is_read && markAsRead(notif.id)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer flex gap-4 hover:shadow-md ${
                notif.is_read ? 'bg-white border-slate-100' : 'bg-blue-50/50 border-blue-100 shadow-sm'
              }`}
            >
              <div className={`p-2 rounded-xl h-fit ${notif.is_read ? 'bg-slate-100 text-slate-400' : 'bg-blue-600 text-white'}`}>
                {notif.type === 'WARNING' ? <AlertTriangle size={20} /> : <Info size={20} />}
              </div>
              <div className="flex-1">
                <p className={`text-sm ${notif.is_read ? 'text-slate-600' : 'text-slate-900 font-semibold'}`}>
                  {notif.message}
                </p>
                <div className="flex items-center gap-1 mt-2 text-xs text-slate-400">
                  <Clock size={12} />
                  {notif.created_at && formatDistanceToNow(new Date(notif.created_at), { addSuffix: true })}
                </div>
              </div>
              {!notif.is_read && (
                <div className="flex flex-col items-center justify-center">
                  <div className="w-2.5 h-2.5 bg-blue-600 rounded-full"></div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}