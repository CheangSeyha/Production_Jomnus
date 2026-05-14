export type Task = {
  id: number;
  title: string;
  description?: string;
  locationText?: string;
  latitude?: number;
  longitude?: number;
  price: number;
  createdAt: string;
  deadline: string;
  requesterName: string;
  hasApplied?: boolean;

  // optional extras
  priority?: "Urgent" | "Normal" | "Low";
  requestCount?: number;
};
