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

export interface IReview {
  id: number;
  reviewerName: string;
  revieweeName?: string;
  rating: number;
  comment: string;
  created_at: string;
  assignment_id: number;
}
