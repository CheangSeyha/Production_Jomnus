"use client";

import { useState } from "react";
import { Check } from "lucide-react";

// This simulates the data coming from your backend or a master list
const INITIAL_CATEGORIES = [
  { name: "Relocation", active: true },
  { name: "Tech Setup", active: true },
  { name: "Repair", active: false },
  { name: "Furniture", active: true },
  { name: "Electric", active: false },
  { name: "Cleaning", active: false },
  { name: "Plumbing", active: false },
  { name: "Gardening", active: false },
];

type SpecializationsProps = {
  data?: any[];
};

export default function Specializations({ data }: SpecializationsProps) {
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);

  const toggleCategory = (name: string) => {
    // 1. Calculate how many are currently active
    const activeCount = categories.filter((c) => c.active).length;
    const targetCategory = categories.find((c) => c.name === name);

    // 2. Logic: Only allow activation if under the limit (5)
    if (!targetCategory?.active && activeCount >= 5) {
      alert("You can only select up to 5 specializations.");
      return;
    }

    // 3. Toggle the state
    setCategories((prev) =>
      prev.map((cat) =>
        cat.name === name ? { ...cat, active: !cat.active } : cat,
      ),
    );
  };

  return (
    <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h3 className="font-bold text-xl text-slate-800">Specializations</h3>
          <p className="text-xs text-slate-400 mt-1">
            Choose the skills that best describe your services.
          </p>
        </div>
        <p className="text-[10px] font-black uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
          {categories.filter((c) => c.active).length} / 5 Selected
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {categories.map((cat) => (
          <button
            key={cat.name}
            onClick={() => toggleCategory(cat.name)}
            className={`flex items-center justify-between p-4 rounded-2xl border transition-all duration-200 group ${
              cat.active
                ? "bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-100"
                : "bg-white text-slate-600 border-slate-100 hover:border-blue-300 hover:bg-slate-50"
            }`}
          >
            <span className="text-sm font-bold">{cat.name}</span>
            {cat.active && <Check className="w-4 h-4 text-white" />}
          </button>
        ))}

        {/* Static "Show All" button for UI completeness */}
        <button className="bg-slate-50 text-slate-400 p-4 rounded-2xl border border-dashed border-slate-200 text-sm font-medium hover:bg-slate-100 transition-colors">
          Show More...
        </button>
      </div>
    </div>
  );
}
