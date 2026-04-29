export interface CreateTaskDto {
  title: string;
  description: string;
  price: number;
  deadline: string;
  locationText?: string;
  requiredWorkers?: number;
  startDate?: string;
  categoryId?: number;
}