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

  status: "OPEN" | "COMPLETED" | "CANCELLED";

  requesterName: string;
  hasApplied?: boolean;

  priority?: "Urgent" | "Normal" | "Low";
  requestCount?: number;
};