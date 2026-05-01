"use client";

import { useRouter } from "next/navigation";
import axios from "axios";
import { ArrowLeft, Send } from "lucide-react";
import StepIndicator from "@/components/myrequest/StepIndicator";
import TaskOverview from "@/components/myrequest/TaskOverview";
import { useTaskStore } from "@/store/taskStore";

export default function Step3Page() {
  const router = useRouter();
  const { form, reset } = useTaskStore();

  const handleSubmit = async () => {
    try {
      if (!form.categoryId) {
        alert("Category missing");
        return;
      }

      if (!form.deadline) {
        alert("Deadline missing");
        return;
      }

      await axios.post(
        "http://localhost:3001/api/tasks",
        {
          title: form.title,
          description: form.description,
          price: Number(form.price),
          deadline: new Date(form.deadline).toISOString(),
          locationText: form.locationText,
          requiredWorkers: form.requiredWorkers ?? 1,
          categoryIds: [form.categoryId],

          // Step 2 fields
          auto_accept_top_rated: form.autoAccept,
          minimum_rating: form.minRating,
          specialty_required: form.specialty,
          hidden_bids: form.hiddenBids,
          minimum_rating_required: form.minRatingRequired,
          allow_messaging: form.allowMessaging,
        },
        { withCredentials: true }
      );

      reset(); // clear form after success
      router.push("/myrequest");
    } catch (err) {
      console.error(err);
      alert("Failed to create task");
    }
  };

  return (
    <div className="min-h-screen overflow-y-auto bg-slate-50">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:py-10">
        <StepIndicator currentStep={3} />
        <div className="space-y-5">
          <TaskOverview task={form} />

          <div className="flex gap-3 pt-2">
            <button
              onClick={() => router.back()}
              className="inline-flex h-11 items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              <ArrowLeft size={16} />
              Back
            </button>

            <button
              onClick={handleSubmit}
              className="ml-auto inline-flex h-11 items-center gap-2 rounded-lg bg-sky-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700"
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
