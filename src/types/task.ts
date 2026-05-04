export interface CreateTaskDto {
  title: string;
  description: string;
  price: number;
  deadline: string;
  locationText?: string;
  latitude?: number;
  longitude?: number;
  requiredWorkers?: number;
  startDate?: string;
  categoryId?: number;
}