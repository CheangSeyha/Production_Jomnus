"use client";

import FormSection from "./FormSection";
import { Calendar } from "lucide-react";
import { toDateTimeLocalValue } from "@/utils/dateTime";

type Props = {
  form: any;
  onChange: (name: string, value: any) => void;
};

export default function ScheduleForm({ form, onChange }: Props) {
  const inputClass =
    "h-12 w-full rounded-lg border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100";
  const nowValue = toDateTimeLocalValue(new Date());
  const deadlineMin = form.startDate
    ? toDateTimeLocalValue(new Date(new Date(form.startDate).getTime() + 60000))
    : nowValue;
  const hasInvalidRange =
    form.startDate &&
    form.deadline &&
    new Date(form.deadline).getTime() <= new Date(form.startDate).getTime();

  return (
    <FormSection
      title="Schedule"
      description="Set when the work can start and when it needs to be done."
      icon={<Calendar size={18} />}
    >
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Start Date & Time
          </label>

          <div className="relative">
            <input
              type="datetime-local"
              min={nowValue}
              className={inputClass}
              value={form.startDate}
              onChange={(e) => {
                const nextStart = e.target.value;
                onChange("startDate", nextStart);

                if (
                  form.deadline &&
                  nextStart &&
                  new Date(form.deadline).getTime() <= new Date(nextStart).getTime()
                ) {
                  onChange("deadline", "");
                }
              }}
            />
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Start time cannot be earlier than now.
          </p>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Deadline
          </label>

          <div className="relative">
            <input
              type="datetime-local"
              min={deadlineMin}
              className={inputClass}
              value={form.deadline}
              onChange={(e) => onChange("deadline", e.target.value)}
            />
          </div>
          {hasInvalidRange ? (
            <p className="mt-2 text-xs font-medium text-red-600">
              Deadline must be after the start time.
            </p>
          ) : (
            <p className="mt-2 text-xs text-slate-500">
              Deadline must be after the start time.
            </p>
          )}
        </div>
      </div>
    </FormSection>
  );
}
