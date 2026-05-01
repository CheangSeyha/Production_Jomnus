"use client";

import CategoryDropdown from "./CategoryDropdown";
import FormSection from "./FormSection";
import { FileText, LocateFixed, MapPin, Tag } from "lucide-react";

type Props = {
  form: any;
  onChange: (name: string, value: any) => void;
};

export default function TaskDetailsForm({ form, onChange }: Props) {
  const fieldClass =
    "w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-100";

  return (
    <div className="space-y-5">
      <FormSection
        title="Task Title"
        description="Keep it short, specific, and easy to scan."
        icon={<FileText size={18} />}
      >
        <input
          type="text"
          className={fieldClass}
          placeholder="Example: Edit a research report"
          value={form.title}
          onChange={(e) => onChange("title", e.target.value)}
        />
      </FormSection>

      <FormSection
        title="Category & Location"
        description="Help workers understand the type of work and where it happens."
        icon={<Tag size={18} />}
      >
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Category
            </label>
            <CategoryDropdown
              value={form.categoryId ?? ""}
              onChange={(value) => onChange("categoryId", value)}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Location
            </label>

            <div className="relative">
              <MapPin
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                className={`${fieldClass} pl-10`}
                placeholder="Example: Phnom Penh, BKK1"
                value={form.locationText}
                onChange={(e) => onChange("locationText", e.target.value)}
              />
            </div>

            <button
              type="button"
              className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-sky-700 transition hover:text-sky-900"
              onClick={() => alert("Map picker coming next")}
            >
              <LocateFixed size={15} />
              Pick from map
            </button>
          </div>
        </div>
      </FormSection>

      <FormSection
        title="Detailed Description"
        description="Add requirements, timing, files, tools, and what a good result looks like."
        icon={<FileText size={18} />}
      >
        <textarea
          className={`${fieldClass} min-h-36 resize-y leading-6`}
          placeholder="Describe the work clearly: what you need, where it happens, and any expectations."
          rows={5}
          value={form.description}
          onChange={(e) => onChange("description", e.target.value)}
        />
      </FormSection>
    </div>
  );
}
