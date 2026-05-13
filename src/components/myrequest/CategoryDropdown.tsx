"use client";

import api from "@/lib/axios";
import { useEffect, useState } from "react";

type Category = {
  id: number;
  name: string;
};

type Props = {
  value: number | undefined;
  onChange: (value: number | undefined) => void;
};

export default function CategoryDropdown({ value, onChange }: Props) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get("/categories");
        setCategories(response.data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <select
        value={value || ""}
        onChange={(e) => {
        const val = e.target.value;

        if (val === "") {
            onChange(undefined);
        } else {
            onChange(Number(val)); 
        }
      }}
      className="h-12 w-full rounded-lg border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
    >
      <option value="">Select Category</option>
      {categories.map((category) => (
        <option key={category.id} value={category.id}>
          {category.name}
        </option>
      ))}
    </select>
  );
}
