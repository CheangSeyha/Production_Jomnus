"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import StepIndicator from "@/components/myrequest/StepIndicator";
import TaskDetailsForm from "@/components/myrequest/TaskDetailsForm";
import ScheduleForm from "@/components/myrequest/ScheduleForm";
import BudgetForm from "@/components/myrequest/BudgetForm";
import { useTaskStore } from "@/store/taskStore";

export default function CreateTaskPage() {
  const router = useRouter();
  const { form, setField } = useTaskStore();

  const handleChange = (name: string, value: any) => {
    setField(name as any, value);
  };

  const handleNext = () => {
    router.push("/myrequest/create/step2");
  };

  return (
    <div className="min-h-screen overflow-y-auto bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:py-10">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div>
            <StepIndicator currentStep={1} />
            <div className="space-y-5">
              <TaskDetailsForm form={form} onChange={handleChange} />
              <ScheduleForm form={form} onChange={handleChange} />
              <BudgetForm form={form} onChange={handleChange} />

              <div className="flex items-center gap-3 pt-2">
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
                  Continue
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>

          <aside className="space-y-4 lg:sticky lg:top-6 lg:h-fit">
            <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="text-base font-semibold text-slate-950">
                Live Preview
              </h3>

              <div className="mt-4 space-y-3">
                <p className="text-lg font-semibold leading-7 text-slate-950">
                  {form.title || "Your task title"}
                </p>

                <p className="line-clamp-4 text-sm leading-6 text-slate-500">
                  {form.description || "Task description preview"}
                </p>

                <div className="rounded-lg bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase text-slate-500">
                    Offered Price
                  </p>
                  <p className="mt-1 text-2xl font-bold text-slate-950">
                    ${Number(form.price || 0).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-5">
              <h4 className="flex items-center gap-2 text-sm font-semibold text-emerald-900">
                <CheckCircle2 size={16} />
                Better requests get better replies
              </h4>

              <ul className="mt-3 space-y-2 text-sm leading-6 text-emerald-800">
                <li>Clear title and location help workers decide faster.</li>
                <li>A realistic budget attracts stronger applications.</li>
                <li>Specific details reduce back-and-forth later.</li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
