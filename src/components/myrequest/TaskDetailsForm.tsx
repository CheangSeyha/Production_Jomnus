"use client";

import CategoryDropdown from "./CategoryDropdown";
import FormSection from "./FormSection";

type Props = {
  form: any;
  onChange: (name: string, value: any) => void;
};

export default function TaskDetailsForm({ form, onChange }: Props) {
  return (
    <div className="space-y-6">
      {/* Task Title */}
      <FormSection title="Task Title">
        <input
          type="text"
          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="e.g. Senior Technical Editor for AI Research"
          value={form.title}
          onChange={(e) => onChange("title", e.target.value)}
        />
      </FormSection>

      {/* Category & Location */}
      <FormSection title="Category & Location">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              CATEGORY
            </label>
            <CategoryDropdown
              value={form.categoryId ?? ""}
              onChange={(value) => onChange("categoryId", value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              LOCATION
            </label>
            <input
              type="text"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Remote or City Name"
              value={form.locationText}
              onChange={(e) => onChange("locationText", e.target.value)}
            />
          </div>
        </div>
      </FormSection>

      {/* Description */}
      <FormSection title="Detailed Description">
        <textarea
          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Outline the scope of work, key deliverables, and preferred experience"
          rows={6}
          value={form.description}
          onChange={(e) => onChange("description", e.target.value)}
        />
      </FormSection>
    </div>
  );
}