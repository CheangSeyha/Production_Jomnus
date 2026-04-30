export type UserRole = "ADMIN" | "USER";

export interface AuthUser {
  id: number;
  email: string;
  fullName: string;
  role: UserRole;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface VerifyOtpPayload {
  email: string;
  otp: string;
}

export interface ResetPasswordPayload {
  email: string;
  otp: string;
  password: string;
}
