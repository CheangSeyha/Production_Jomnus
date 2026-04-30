"use client";

import axios from "axios";
import { useEffect, useState } from "react";

type Category = {
  id: number;
  name: string;
};

type Props = {
  value: number;
  onChange: (value: number) => void;
};

export default function CategoryDropdown({ value, onChange }: Props) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("http://localhost:3001/api/categories");
        setCategories(res.data);
      } catch (err) {
        console.error("Failed to fetch categories", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <select
        value={value}
        onChange={(e) => {
        const value = e.target.value;

        if (value === "") {
            onChange(undefined);
        } else {
            onChange(Number(value)); 
        }
        }}
        className="w-full px-4 py-3 border border-gray-200 rounded-lg"
    >
      <option value="">Select Category</option>

      {loading ? (
        <option>Loading...</option>
      ) : (
        categories.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.name}
          </option>
        ))
      )}
    </select>
  );
}