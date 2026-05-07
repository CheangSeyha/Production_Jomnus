import { create } from 'zustand';
import axios from '@/lib/axios';

interface Notification {
  id: number;
  message: string;
  is_read: boolean;
  type: 'INFO' | 'SUCCESS' | 'WARNING'; // Added type for the icons
  created_at: string;
}

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  fetchNotifications: () => Promise<void>;
  markAsRead: (id: number) => Promise<void>;
  markAllAsRead: () => Promise<void>; // Added missing action
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,

  fetchNotifications: async () => {
    set({ isLoading: true });
    try {
      const res = await axios.get('/notifications');
      // Ensure fallbacks to avoid 'undefined' errors
      set({ 
        notifications: res.data.notifications || [], 
        unreadCount: res.data.unread_count || 0,
        isLoading: false 
      });
    } catch (error) {
      console.error("Store Error:", error);
      set({ notifications: [], isLoading: false });
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

  markAllAsRead: async () => { // Implemented missing action
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