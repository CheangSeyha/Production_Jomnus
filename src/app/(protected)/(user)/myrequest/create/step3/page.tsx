"use client";

import { useRouter } from "next/navigation";
import axios from "axios";
import CreateTaskLayout from "@/components/myrequest/CreateTaskLayout";
import StepIndicator from "@/components/myrequest/StepIndicator";
import TaskOverview from "@/components/myrequest/TaskOverview";
import DraftTasks from "@/components/myrequest/DraftTasks";
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
    <CreateTaskLayout draftTasks={<DraftTasks />}>
      <StepIndicator currentStep={3} totalSteps={3} />

      <div className="space-y-8">
        <TaskOverview task={form} />

        <div className="flex gap-3 pt-6 border-t">
          <button
            onClick={() => router.back()}
            className="px-6 py-3 border rounded-lg"
          >
            Back
          </button>

          <button
            onClick={handleSubmit}
            className="ml-auto px-8 py-3 bg-blue-600 text-white rounded-lg"
          >
            Post Task
          </button>
        </div>
      </div>
    </CreateTaskLayout>
  );
}