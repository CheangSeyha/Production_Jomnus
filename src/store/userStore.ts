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

  setUser: (user: any) => void;
  clearUser: () => void;
  updateUser: (data: Partial<User> | any) => void;
};

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  isLoading: false,

  setUser: (user) => {
    if (!user) return set({ user: null, isLoading: false });
    
    // Normalize data properties from backend schema to frontend TypeScript contract
    const normalizedUser: User = {
      ...user,
      isIdentityVerified: user.isIdentityVerified ?? user.is_identity_verified ?? false,
      phoneVerified: user.phoneVerified ?? user.phone_verified ?? false,
      isVerified: user.isVerified ?? user.is_verified ?? false,
      isPerformer: user.isPerformer ?? user.is_performer ?? false,
    };
    
    set({
      user: normalizedUser,
      isLoading: false,
    });
  },

  clearUser: () =>
    set({
      user: null,
    }),

  updateUser: (data) =>
    set((state) => {
      if (!state.user) return { user: null };

      // Make sure partial updates don't accidentally wipe out verification attributes
      const updatedIncoming = {
        ...data,
        isIdentityVerified: data.isIdentityVerified ?? data.is_identity_verified ?? state.user.isIdentityVerified,
        phoneVerified: data.phoneVerified ?? data.phone_verified ?? state.user.phoneVerified,
        isVerified: data.isVerified ?? data.is_verified ?? state.user.isVerified,
        isPerformer: data.isPerformer ?? data.is_performer ?? state.user.isPerformer,
      };

      return {
        user: { ...state.user, ...updatedIncoming },
      };
    }),
}));

// Helper function to dynamically pull the profile picture
export const getAvatar = (user: any) => {
  return user?.profileImage || user?.picture ||
    `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user?.fullName || "User")}`;
};

// New helper function to dynamically check identity verification status across component layouts
export const isVerifiedUser = (user: any): boolean => {
  if (!user) return false;
  return user.isIdentityVerified === true || user.is_identity_verified === true;
};