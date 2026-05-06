"use client";

import axios from "axios";
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
        const response = await axios.get("/api/categories");
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
        className="w-full px-4 py-3 border border-gray-200 rounded-lg"
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
