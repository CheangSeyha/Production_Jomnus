"use client";

import { useRouter } from "next/navigation";

import { ArrowLeft, Send } from "lucide-react";

import StepIndicator from "@/components/myrequest/StepIndicator";
import TaskOverview from "@/components/myrequest/TaskOverview";

import { useTaskStore } from "@/store/taskStore";

import api from "@/lib/axios";

export default function Step2Page() {
  const router = useRouter();

  const { form, reset } = useTaskStore();

  const handleSubmit = async () => {
    try {
      // VALIDATION
      if (!form.categoryId) {
        alert("Category missing");
        return;
      }

      if (!form.deadline) {
        alert("Deadline missing");
        return;
      }

      const now = new Date();
      const startDate = form.startDate ? new Date(form.startDate) : null;
      const deadline = new Date(form.deadline);

      if (startDate && startDate.getTime() < now.getTime()) {
        alert("Start time cannot be in the past");
        return;
      }

      if (deadline.getTime() <= now.getTime()) {
        alert("Deadline must be in the future");
        return;
      }

      if (startDate && deadline.getTime() <= startDate.getTime()) {
        alert("Deadline must be after the start time");
        return;
      }

      // CREATE TASK
      const res = await api.post("/tasks", {
        title: form.title,

        description: form.description,

        price: Number(form.price),

        startDate: form.startDate
          ? new Date(form.startDate).toISOString()
          : undefined,

        deadline: new Date(
          form.deadline
        ).toISOString(),

        locationText: form.locationText,

        requiredWorkers:
          form.requiredWorkers ?? 1,

        categoryIds: [form.categoryId],

        latitude: form.latitude,

        longitude: form.longitude,
      });

      // BACKEND RETURNED TASK
      const createdTask = res.data;

      // RESET FORM
      reset();

      // REDIRECT TO TASK WORKSPACE
      router.push(
        `/myrequest/${createdTask.id}/applications`
      );
    } catch (err: any) {
      console.error(err);

      alert(
        err?.response?.data?.message ||
          "Failed to create task"
      );
    }
  };

  return (
    <div className="min-h-screen overflow-y-auto bg-slate-50">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:py-10">
        {/* STEP INDICATOR */}
        <StepIndicator currentStep={2} />

        <div className="space-y-5">
          {/* TASK PREVIEW */}
          <TaskOverview task={form} />

          {/* ACTIONS */}
          <div className="flex gap-3 pt-2">
            {/* BACK */}
            <button
              onClick={() => router.back()}
              className="
                inline-flex h-11 items-center gap-2
                rounded-lg border border-slate-200
                bg-white px-4
                text-sm font-semibold text-slate-700
                transition hover:bg-slate-100
              "
            >
              <ArrowLeft size={16} />
              Back
            </button>

            {/* POST */}
            <button
              onClick={handleSubmit}
              className="
                ml-auto inline-flex h-11 items-center gap-2
                rounded-lg bg-sky-600 px-5
                text-sm font-semibold text-white
                shadow-sm transition
                hover:bg-sky-700
              "
            >
              <Send size={16} />
              Post Task
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
