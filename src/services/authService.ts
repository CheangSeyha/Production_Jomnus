import api from "@/lib/axios";
import {
  AuthResponse,
  ForgotPasswordPayload,
  LoginPayload,
  RegisterPayload,
  ResetPasswordPayload,
} from "@/types/auth";

export const authService = {
  async login(payload: LoginPayload) {
    const response = await api.post<AuthResponse>("/auth/login", payload);
    return response.data;
  },

  async register(payload: RegisterPayload) {
    const response = await api.post<AuthResponse>("/auth/register", payload);
    return response.data;
  },

  async forgotPassword(payload: ForgotPasswordPayload) {
    const response = await api.post<{ message: string }>(
      "/auth/forgot-password",
      payload,
    );
    return response.data;
  },

  async resetPassword(payload: ResetPasswordPayload) {
    const response = await api.post<{ message: string }>(
      "/auth/reset-password",
      payload,
    );
    return response.data;
  },

  async logout(accessToken: string) {
    const response = await api.post(
      "/auth/logout",
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    return response.data;
  },
};
