"use client";

import FormSection from "./FormSection";
import { DollarSign } from "lucide-react";

type Props = {
  form: any;
  onChange: (name: string, value: any) => void;
};

export default function BudgetForm({ form, onChange }: Props) {
  return (
    <FormSection title="Budget & Pricing" icon={<DollarSign size={20} />}>
      <div className="max-w-xs">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          OFFERED PRICE (USD)
        </label>
        <div className="relative">
          <span className="absolute left-4 top-3.5 text-gray-500">$</span>
          <input
            type="number"
            className="w-full px-4 py-3 pl-8 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="0.00"
            step="0.01"
            min="0"
            value={form.price}
            onChange={(e) => onChange("price", Number(e.target.value))}
          />
        </div>
      </div>
    </FormSection>
  );
}