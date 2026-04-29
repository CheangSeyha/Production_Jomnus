import { create } from "zustand";

type TaskForm = {
  title: string;
  description: string;
  price: number;
  deadline: string;
  startDate?: string;
  locationText?: string;
  requiredWorkers?: number;
  categoryId?: number;

  // Step 2
  autoAccept?: boolean;
  minRating?: string;
  specialty?: string;
  hiddenBids?: boolean;
  minRatingRequired?: boolean;
  allowMessaging?: boolean;
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
    categoryId: undefined,

    autoAccept: false,
    minRating: "4.5",
    specialty: "",
    hiddenBids: false,
    minRatingRequired: false,
    allowMessaging: true,
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
        requiredWorkers: 1,
        categoryId: undefined,

        autoAccept: false,
        minRating: "4.5",
        specialty: "",
        hiddenBids: false,
        minRatingRequired: false,
        allowMessaging: true,
      },
    }),
}));