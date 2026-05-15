import { create } from "zustand";

export type Task = {
  id: number;
  title: string;
  description?: string;
  price: number;
  deadline: string;
  status: "OPEN" | "COMPLETED" | "CANCELLED";
  locationText?: string;
  createdAt: string;
};

type TaskStore = {
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
};

export const useTaskListStore = create<TaskStore>((set) => ({
  tasks: [],
  setTasks: (tasks) => set({ tasks }),
}));
