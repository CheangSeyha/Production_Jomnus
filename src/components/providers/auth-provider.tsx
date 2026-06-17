"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { useUserStore } from "@/store/userStore"; 
import { useCallStore } from "@/store/callStore";
import { socket } from "@/lib/websocket";
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const initializeAuth = useAuthStore((s) => s.initializeAuth);
  const authUser = useAuthStore((s) => s.user);  
  const setUser = useUserStore((s) => s.setUser);
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  
  useEffect(() => {
    if (authUser) {
      setUser(authUser);
    }
  }, [authUser, setUser]);

  
  useEffect(() => {
  if (!socket) return;

  socket.on('call:incoming', (data: { conversationId: number; callerId: number; isVideo: boolean }) => {
    useCallStore.getState().receiveIncomingCall(data.conversationId, data.callerId, data.isVideo);
  });

  socket.on('call:signal', (data: { senderId: number; signalData: any }) => {
    useCallStore.getState().handleSignal(data.signalData);
  });

  socket.on('call:ended', () => {
    useCallStore.getState().endCall(true);
  });

  return () => {
    socket?.off('call:incoming');
    socket?.off('call:signal');
    socket?.off('call:ended');
  };
  }, []);

  return <>{children}</>;
}