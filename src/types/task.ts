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
  requesterName?: string;
  requester_id: number; // 👈 Change this to underscore
  // optional extras
  priority?: "Urgent" | "Normal" | "Low";
  requestCount?: number;
};