"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import StepIndicator from "@/components/myrequest/StepIndicator";
import WorkerPreferencesForm from "@/components/myrequest/WorkerPreferencesForm";
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
    <div className="min-h-screen overflow-y-auto bg-slate-50">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:py-10">
        <StepIndicator currentStep={2} />
        <div className="space-y-5">
          <WorkerPreferencesForm form={form} onChange={handleChange} />

          <div className="flex gap-3 pt-2">
            <button
              onClick={() => router.back()}
              className="inline-flex h-11 items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              <ArrowLeft size={16} />
              Back
            </button>

            <button
              onClick={handleNext}
              className="ml-auto inline-flex h-11 items-center gap-2 rounded-lg bg-sky-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700"
            >
              Next
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
