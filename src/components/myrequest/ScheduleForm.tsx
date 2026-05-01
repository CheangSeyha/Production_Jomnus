"use client";

import FormSection from "./FormSection";
import { Calendar } from "lucide-react";

type Props = {
  form: any;
  onChange: (name: string, value: any) => void;
};

export default function ScheduleForm({ form, onChange }: Props) {
  const inputClass =
    "h-12 w-full rounded-lg border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100";

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
              className={inputClass}
              value={form.startDate}
              onChange={(e) => onChange("startDate", e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Deadline
          </label>

          <div className="relative">
            <input
              type="datetime-local"
              className={inputClass}
              value={form.deadline}
              onChange={(e) => onChange("deadline", e.target.value)}
            />
          </div>
        </div>
      </div>
    </FormSection>
  );
}
