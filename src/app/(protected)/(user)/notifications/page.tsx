"use client";

import { useState, useEffect } from "react"; 
import { useRouter } from "next/navigation"; 
import { Bell, CheckCheck, Clock, Info, AlertTriangle, User, Check, X } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useNotificationStore } from "@/store/userNotificationStore";
import axios from '@/lib/axios';
import { toast } from "sonner";
import { io } from "socket.io-client";

interface NotificationItem {
  id: number;
  title?: string;
  message: string;
  is_read: boolean;
  type: string;
  sender_avatar?: string;
  sender_name?: string;
  sender_role?: string;
  task_id?: number;
  created_at: string;
  application_id?: number;
}

export default function NotificationsPage() {
  const router = useRouter(); 
  const { notifications, isLoading, markAsRead, markAllAsRead, fetchNotifications } = useNotificationStore();
  const [activeTab, setActiveTab] = useState<"all" | "unread">("all");
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUserId(parsedUser.id);
    }
  }, []);

  useEffect(() => {
    const loadData = async () => {
      if (fetchNotifications) {
        try {
          await fetchNotifications();
        } catch (error) {
          console.error(error);
        }
      }
    };
    loadData();
  }, [fetchNotifications]);

  useEffect(() => {
    const socketUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:3001';
    const socket = io(socketUrl);

    socket.on('new_broadcast', (data: { title: string; message: string }) => {
      if (fetchNotifications) fetchNotifications();
      toast.info(`🔔 ${data.title}`, { description: data.message });
    });

    if (userId) {
      socket.on(`personal_notification_${userId}`, (data: { message: string }) => {
        if (fetchNotifications) fetchNotifications();
        toast.success(data.message);
      });
    }

    return () => {
      socket.disconnect();
    };
  }, [fetchNotifications, userId]);

  const filteredNotifications = notifications?.filter((notif: NotificationItem) => {
    if (activeTab === "unread") return !notif.is_read;
    return true; 
  });

  const handleCardClick = (notif: NotificationItem) => {
    const type = notif.type?.toUpperCase() || "";
    const msg = notif.message?.toLowerCase() || "";
    const title = notif.title?.toLowerCase() || ""; 

    if (
      type === 'APPLICATION_RECEIVED' || 
      title.includes('new applicant') ||
      msg.includes('wants to do') ||
      msg.includes('applied')
    ) {
      if (notif.task_id) {
        router.push(`/myrequest/${notif.task_id}/applications`);
      } else {
        router.push(`/myrequest`);
      }
    } 
    else if (
      type === 'ACCEPTED' || 
      type === 'ASSIGNED' || 
      title.includes('accepted') ||
      msg.includes('congratulations') ||
      msg.includes('accepted')
    ) {
      router.push(`/mytask`);
    }

    if (!notif.is_read) {
      markAsRead(notif.id).catch((err) => console.error(err));
    }
  };

  const handleAccept = async (e: React.MouseEvent, applicationId?: number) => {
    e.stopPropagation(); 
    if (!applicationId) return;

    try {
      await axios.patch(`/applications/${applicationId}/accept`);
      toast.success("Application accepted successfully!");
      if (fetchNotifications) await fetchNotifications();
      router.push('/myrequest'); 
    } catch (error) {
      console.error(error);
      toast.error("Failed to accept application.");
    }
  };

  const handleReject = async (e: React.MouseEvent, applicationId?: number) => {
    e.stopPropagation(); 
    if (!applicationId) return;

    try {
      await axios.patch(`/applications/${applicationId}/reject`);
      toast.success("Application declined.");
      if (fetchNotifications) await fetchNotifications();
    } catch (error) {
      console.error(error);
      toast.error("Failed to decline application.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-10">
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
          {notifications?.some((n: NotificationItem) => !n.is_read) && activeTab !== "unread" && (
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
          )}
        </button>
      </div>

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
          filteredNotifications?.map((notif: NotificationItem) => {
            const type = notif.type?.toUpperCase() || "";
            const msg = notif.message?.toLowerCase() || "";
            const isClickable = type === 'APPLICATION_RECEIVED' || type === 'ACCEPTED' || type === 'ASSIGNED' || msg.includes('congratulations') || msg.includes('wants to do') || msg.includes('applied');

            const formattedTime = notif.created_at 
              ? formatDistanceToNow(new Date(notif.created_at.endsWith('Z') ? notif.created_at : notif.created_at + 'Z'), { addSuffix: true }) 
              : "Recent";

            return (
              <div 
                key={notif.id}
                onClick={() => handleCardClick(notif)}
                className={`p-5 rounded-2xl border transition-all flex gap-4 ${
                  isClickable ? "cursor-pointer hover:border-blue-300 hover:shadow-md" : ""
                } ${
                  notif.is_read ? 'bg-white border-slate-100' : 'bg-blue-50/50 border-blue-100 shadow-sm'
                }`}
              >
                <div className="flex-shrink-0 mt-1">
                  {notif.sender_avatar ? (
                    <img 
                      src={notif.sender_avatar} 
                      alt={notif.sender_name || "User"} 
                      className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                    />
                  ) : (
                    <div className={`p-3 rounded-xl h-fit ${notif.is_read ? 'bg-slate-100 text-slate-400' : 'bg-blue-600 text-white'}`}>
                      {notif.type === 'WARNING' ? <AlertTriangle size={20} /> : 
                       notif.type === 'APPLICATION_RECEIVED' ? <User size={20} /> : <Info size={20} />}
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  {notif.sender_name && (
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-sm font-bold text-slate-800 uppercase tracking-wide">
                        {notif.sender_name}
                      </span>
                      {notif.sender_role && (
                        <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${
                          notif.sender_role === 'ADMIN'
                            ? 'bg-red-50 text-red-700 border-red-200'
                            : notif.sender_role === 'REQUESTER'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-blue-50 text-blue-700 border-blue-200'
                        }`}>
                          {notif.sender_role}
                        </span>
                      )}
                    </div>
                  )}

                  {notif.title && (
                    <p className={`text-sm font-bold mb-1 ${notif.is_read ? 'text-slate-700' : 'text-slate-900'}`}>
                      {notif.title}
                    </p>
                  )}

                  <p className={`text-sm ${notif.is_read ? 'text-slate-600' : 'text-slate-900 font-semibold'}`}>
                    {notif.message}
                  </p>
                  <div className="flex items-center gap-1 mt-2 text-xs text-slate-400">
                    <Clock size={12} />
                    {formattedTime}
                  </div>

                  {notif.type?.toUpperCase() === 'APPLICATION_RECEIVED' && (
                    <div className="flex items-center gap-3 mt-4">
                      <button 
                        onClick={(e) => handleAccept(e, notif.application_id)}
                        className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm"
                      >
                        <Check size={16} /> Accept
                      </button>
                      <button 
                        onClick={(e) => handleReject(e, notif.application_id)}
                        className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl transition-colors"
                      >
                        <X size={16} /> Decline
                      </button>
                    </div>
                  )}
                </div>

                {!notif.is_read && (
                  <div className="flex flex-col items-center justify-center">
                    <div className="w-2.5 h-2.5 bg-blue-600 rounded-full"></div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}