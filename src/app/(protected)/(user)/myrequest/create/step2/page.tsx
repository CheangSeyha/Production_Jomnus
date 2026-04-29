"use client";

import { useRouter } from "next/navigation";
import CreateTaskLayout from "@/components/myrequest/CreateTaskLayout";
import StepIndicator from "@/components/myrequest/StepIndicator";
import WorkerPreferencesForm from "@/components/myrequest/WorkerPreferencesForm";
import DraftTasks from "@/components/myrequest/DraftTasks";
import { useTaskStore } from "@/store/taskStore";

export default function Step2Page() {
  const router = useRouter();
  const { form, setField } = useTaskStore();

  const handleChange = (name: string, value: any) => {
    setField(name as any, value);
  };

  const handleNext = () => {
    router.push("/myrequest/create/step3");
  };

  return (
    <CreateTaskLayout draftTasks={<DraftTasks />}>
      <StepIndicator currentStep={2} totalSteps={3} />

      <div className="space-y-8">
        <WorkerPreferencesForm form={form} onChange={handleChange} />

        <div className="flex gap-3 pt-6 border-t">
          <button
            onClick={() => router.back()}
            className="px-6 py-3 border rounded-lg"
          >
            Back
          </button>

          <button
            onClick={handleNext}
            className="ml-auto px-8 py-3 bg-blue-600 text-white rounded-lg"
          >
            Next
          </button>
        </div>
      </div>
    </CreateTaskLayout>
  );
}