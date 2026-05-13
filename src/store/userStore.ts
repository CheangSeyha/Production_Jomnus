import { create } from "zustand";

export enum UserRole {
  REQUESTER = "REQUESTER",
  PERFORMER = "PERFORMER",
  ADMIN = "ADMIN",
}

export interface User {
  id: string;
  fullName: string;
  email: string;

  phone?: string;
  profileImage?: string;

  phoneVerified: boolean;
  isIdentityVerified: boolean;
  isVerified: boolean;
  isPerformer: boolean;

  currentRole: UserRole;

  bio?: string;

  city?: string;
  country?: string;
  locationText?: string;

  latitude?: number;
  longitude?: number;

  performerStats?: IPerformerStats;
  requesterStats?: IRequesterStats;

  identityVerifications?: IIdentityVerification[];

  createdAt: string;
  updatedAt: string;
}

export interface IPerformerStats {
  id: string;
  rating: number;
  totalReviews: number;
  totalJobs: number;
  totalJobsCompleted: number;
  totalJobsCancelled: number;
}

export interface IRequesterStats {
  id: string;
  rating: number;
  totalReviews: number;
  totalJobs: number;
  totalJobsCompleted: number;
  totalJobsCancelled: number;
}

export interface IIdentityVerification {
  id: string;
  status: string;
  createdAt: string;
}

type UserStore = {
  user: User | null;
  isLoading: boolean;

  setUser: (user: User) => void;
  clearUser: () => void;

  // optional but useful
  updateUser: (data: Partial<User>) => void;
};

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  isLoading: false,

  setUser: (user) =>
    set({
      user,
      isLoading: false,
    }),

  clearUser: () =>
    set({
      user: null,
    }),

  updateUser: (data) =>
    set((state) => ({
      user: state.user ? { ...state.user, ...data } : null,
    })),
}));

// Add a getter or a helper function
export const getAvatar = (user: any) => {
  return user?.profileImage || user?.picture ||
    `https://api.dicebear.com/7.x/initials/svg?seed=${user?.fullName || "User"}`;
};