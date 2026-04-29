"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import CreateTaskLayout from "@/components/myrequest/CreateTaskLayout";
import StepIndicator from "@/components/myrequest/StepIndicator";
import TaskDetailsForm from "@/components/myrequest/TaskDetailsForm";
import ScheduleForm from "@/components/myrequest/ScheduleForm";
import BudgetForm from "@/components/myrequest/BudgetForm";
import DraftTasks from "@/components/myrequest/DraftTasks";

export default function CreateTaskPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    location: "",
    startDate: "",
    deadline: "",
    price: 0,
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (name: string, value: any) => {
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNext = async () => {
    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:3001/tasks",
        {
          title: form.title,
          description: form.description,
          category: form.category,
          location_text: form.location,
          deadline: form.deadline,
          price: form.price,
        },
        { withCredentials: true }
      );

      localStorage.setItem("task_id", res.data.id);
      router.push("/myrequest/create/step2");
    } catch (err) {
      console.error(err);
      alert("Failed to create task. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <CreateTaskLayout draftTasks={<DraftTasks />}>
      <StepIndicator currentStep={1} totalSteps={3} />

      <div className="space-y-8">
        <TaskDetailsForm form={form} onChange={handleChange} />
        <ScheduleForm form={form} onChange={handleChange} />
        <BudgetForm form={form} onChange={handleChange} />

        {/* Action Buttons */}
        <div className="flex gap-3 pt-6 border-t border-gray-200">
          <button
            onClick={() => router.back()}
            className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
          >
            Back
          </button>
          <button
            onClick={handleNext}
            disabled={loading}
            className="ml-auto px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creating..." : "Next"}
          </button>
        </div>
      </div>
    </CreateTaskLayout>
  );
}
