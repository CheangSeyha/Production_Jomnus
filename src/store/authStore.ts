import { create } from "zustand";
import { authService } from "@/services/authService";
import { AuthUser, LoginPayload, RegisterPayload } from "@/types/auth";

type AuthState = {
  user: AuthUser | null;
  accessToken: string | null;
  isLoading: boolean;
  error: string | null;
  isInitialized: boolean;
  login: (payload: LoginPayload) => Promise<AuthUser>;
  register: (payload: RegisterPayload) => Promise<AuthUser>;
  logout: () => Promise<void>;
  clearError: () => void;
  initializeAuth: () => Promise<void>;
};

const getErrorMessage = (error: unknown): string => {
  if (typeof error === "object" && error !== null) {
    const maybeAxiosError = error as {
      response?: { data?: { message?: string | string[] } };
      message?: string;
    };

    const responseMessage = maybeAxiosError.response?.data?.message;
    if (Array.isArray(responseMessage))
      return responseMessage[0] || "Request failed";
    if (typeof responseMessage === "string") return responseMessage;
    if (maybeAxiosError.message) return maybeAxiosError.message;
  }

  return "Something went wrong";
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  accessToken:
    typeof window !== "undefined" ? localStorage.getItem("access_token") : null,
  isLoading: false,
  error: null,
  isInitialized: false,

  async initializeAuth() {
    // Check if user data exists in localStorage on app load
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("access_token");
      const storedUser = localStorage.getItem("user_data");

      if (storedToken) {
        // First, quickly restore from localStorage to show something immediately
        if (storedUser) {
          try {
            const user = JSON.parse(storedUser);
            set({ user, accessToken: storedToken });
          } catch (e) {}
        }

        // Then, fetch fresh data from backend to ensure latest sync (image, name, etc.)
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"}/auth/profile`, {
            headers: { Authorization: `Bearer ${storedToken}` }
          });
          
          if (response.ok) {
            const freshUser = await response.json();
            localStorage.setItem("user_data", JSON.stringify(freshUser));
            set({ user: freshUser, accessToken: storedToken, isInitialized: true });
            return;
          }
        } catch (error) {
          console.warn("Failed to refresh session from backend, staying with local data.");
        }
      }
      
      set({ isInitialized: true });
    }
  },

  async login(payload) {
    set({ isLoading: true, error: null });
    try {
      const data = await authService.login(payload);
      localStorage.setItem("access_token", data.accessToken);
      localStorage.setItem("user_role", data.user.role);
      localStorage.setItem("user_data", JSON.stringify(data.user));
      set({ user: data.user, accessToken: data.accessToken, isLoading: false });
      return data.user;
    } catch (error) {
      const message = getErrorMessage(error);
      set({ error: message, isLoading: false });
      throw new Error(message);
    }
  },

  async register(payload) {
    set({ isLoading: true, error: null });
    try {
      const data = await authService.register(payload);
      localStorage.setItem("access_token", data.accessToken);
      localStorage.setItem("user_role", data.user.role);
      localStorage.setItem("user_data", JSON.stringify(data.user));
      set({ user: data.user, accessToken: data.accessToken, isLoading: false });
      return data.user;
    } catch (error) {
      const message = getErrorMessage(error);
      set({ error: message, isLoading: false });
      throw new Error(message);
    }
  },

  async logout() {
    const token = get().accessToken || localStorage.getItem("access_token");

    try {
      if (token) {
        await authService.logout(token);
      }
    } finally {
      localStorage.removeItem("access_token");
      localStorage.removeItem("user_role");
      localStorage.removeItem("user_data");
      set({ user: null, accessToken: null, error: null, isLoading: false });
    }
  },

  clearError() {
    set({ error: null });
  },
}));
