"use client";

import FormSection from "./FormSection";
import { Calendar } from "lucide-react";

type Props = {
  form: any;
  onChange: (name: string, value: any) => void;
};

export default function ScheduleForm({ form, onChange }: Props) {
  return (
    <FormSection title="Logistics & Schedule" icon={<Calendar size={20} />}>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            START DATE & TIME
          </label>
          <input
            type="datetime-local"
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="mm/dd/yyyy, --:-- --"
            value={form.startDate}
            onChange={(e) => onChange("startDate", e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            DEADLINE
          </label>
          <input
            type="datetime-local"
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="mm/dd/yyyy, --:-- --"
            value={form.deadline}
            onChange={(e) => onChange("deadline", e.target.value)}
          />
        </div>
      </div>
    </FormSection>
  );
}