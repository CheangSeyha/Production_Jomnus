"use client";

import FormSection from "./FormSection";
import { DollarSign } from "lucide-react";

type Props = {
  form: any;
  onChange: (name: string, value: any) => void;
};

export default function BudgetForm({ form, onChange }: Props) {
  return (
    <FormSection
      title="Budget & Pricing"
      description="Show the amount you are ready to pay for the completed task."
      icon={<DollarSign size={18} />}
    >
      <div className="max-w-sm">
        <label className="mb-2 block text-sm font-medium text-slate-700">
          Offered Price (USD)
        </label>

        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-400">
            $
          </span>

          <input
            type="number"
            className="h-12 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
            placeholder="Enter amount"
            value={form.price === 0 ? "" : form.price}
            onChange={(e) => {
              const value = e.target.value;

              if (value === "") {
                onChange("price", 0);
              } else {
                onChange("price", Number(value));
              }
            }}
          />
        </div>
      </div>
    </FormSection>
  );
}
