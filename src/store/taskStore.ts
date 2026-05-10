import { create } from "zustand";

type TaskForm = {
  title: string;
  description: string;
  price: number;
  deadline: string;
  startDate?: string;
  locationText?: string;
  latitude?: number;
  longitude?: number;
  requiredWorkers?: number;
  categoryId?: number;
};

type TaskStore = {
  form: TaskForm;
  setField: (field: keyof TaskForm, value: any) => void;
  reset: () => void;
};

export const useTaskStore = create<TaskStore>((set) => ({
  form: {
    title: "",
    description: "",
    price: 0,
    deadline: "",
    startDate: "",
    locationText: "",
    requiredWorkers: 1,
    latitude: undefined,
    longitude: undefined,
    categoryId: undefined,
  },

  setField: (field, value) =>
    set((state) => ({
      form: { ...state.form, [field]: value },
    })),

  reset: () =>
    set({
      form: {
        title: "",
        description: "",
        price: 0,
        deadline: "",
        startDate: "",
        locationText: "",
        latitude: undefined,
        longitude: undefined,
        requiredWorkers: 1,
        categoryId: undefined,
      },
    }),
}));
