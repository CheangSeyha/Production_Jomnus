export type Task = {
  id: number;

  title: string;

  description?: string;

  locationText?: string;

  latitude?: number;

  longitude?: number;

  price: number;

  createdAt: string;

  updatedAt?: string;

  startDate?: string;

  deadline: string;

  requester_id?: number;

  requester?: {
    id: number;
    fullName: string;
    profileImage?: string | null;
  } | null;

  requiredWorkers?: number;

  categoryId?: number;

  status:
    | "POSTED"
    | "ACCEPTED"
    | "IN_PROGRESS"
    | "PARTIAL_COMPLETED"
    | "COMPLETED"
    | "VERIFIED"
    | "CANCELLED";

  requesterName: string;

  hasApplied?: boolean;

  priority?: "Urgent" | "Normal" | "Low";

  requestCount?: number;
};