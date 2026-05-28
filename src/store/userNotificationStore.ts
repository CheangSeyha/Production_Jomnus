import { create } from 'zustand';
import api from '@/lib/axios';
import axios from '@/lib/axios';

interface Notification {
  id: number;
  message: string;
  is_read: boolean;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'APPLICATION_ACCEPTED' | 'APPLICATION_REJECTED' | 'INFO_UPDATE'; 
  created_at: string;
}

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  fetchNotifications: () => Promise<void>;
  markAsRead: (id: number) => Promise<void>;
  markAllAsRead: () => Promise<void>; 
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,

  fetchNotifications: async () => {
    set({ isLoading: true });
    try {
      // ✅ 1. Reverted to match your @Get() endpoint
      const res = await axios.get('/notifications');
      
      // ✅ 2. Read from res.data.data because your backend names the key "data"
      const parsedNotifications = res.data?.data || [];
      const parsedUnreadCount = res.data?.unread_count || 0;

      set({ 
        notifications: parsedNotifications, 
        unreadCount: parsedUnreadCount,
        isLoading: false 
      });
    } catch (error) {
      console.error("Store Error:", error);
      set({ notifications: [], unreadCount: 0, isLoading: false });
    }
  },

  markAsRead: async (id: number) => {
    try {
      await axios.patch(`/notifications/${id}/read`);
      const { notifications, unreadCount } = get();
      set({
        notifications: notifications.map(n => n.id === id ? { ...n, is_read: true } : n),
        unreadCount: Math.max(0, unreadCount - 1)
      });
    } catch (error) {
      console.error("Update Error:", error);
    }
  },

  markAllAsRead: async () => { 
    try {
      await axios.patch('/notifications/read-all');
      const { notifications } = get();
      set({
        notifications: notifications.map(n => ({ ...n, is_read: true })),
        unreadCount: 0
      });
    } catch (error) {
      console.error("Mark All Read Error:", error);
    }
  }
}));