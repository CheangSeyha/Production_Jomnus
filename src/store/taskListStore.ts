import { create } from "zustand";

export type Task = {
  id: number;
  title: string;
  description?: string;
  price: number;
  deadline: string;
  status: "DRAFT" | "POSTED" | "ACCEPTED" | "IN_PROGRESS" | "COMPLETED";
  location_text?: string;
  created_at: string;
};

type TaskStore = {
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
};

export const useTaskListStore = create<TaskStore>((set) => ({
  tasks: [],
  setTasks: (tasks) => set({ tasks }),
}));
