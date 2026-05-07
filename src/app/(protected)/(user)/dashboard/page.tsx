"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SlidersHorizontal } from "lucide-react";
import DetailTaskCard from "@/components/myrequest/DetailTaskCard";
import TaskDetailModal from "@/components/myrequest/TaskDetailModal";
import { Task } from "@/types/task";
import ApplyTaskModal from "@/components/applications/ApplyTaskModal";
type Category = {
  id: number;
  name: string;
  description?: string;
};

type TaskApi = {
    id: number;
    title: string;
    description?: string | null;
    location_text?: string | null;
    price: number;
    created_at: string;
    deadline: string;
    requester_id?: number;
    latitude?: number;
    longitude?: number;
    requester?: {
        id: number;
        fullName: string;
        profileImage?: string | null;
    } | null;
};

const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"
).replace(/\/$/, "");

export default function DashboardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");

  const [tasks, setTasks] = useState<Task[]>([]);

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const [selectedApplyTask, setSelectedApplyTask] = useState<Task | null>(null);  

  useEffect(() => {
    const token = searchParams.get("token");

    if (token) {
      localStorage.setItem("access_token", token);
      router.replace("/dashboard");
      return;
    }

    const existingToken = localStorage.getItem("access_token");
    if (!existingToken) {
      router.replace("/auth/signin");
    }

    const loadTasks = async () => {
      try {
        const token = localStorage.getItem("access_token");

        const res = await fetch(`${API_BASE_URL}/tasks`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // IMPORTANT
          },
        });

        if (!res.ok) {
          throw new Error(`Failed to fetch tasks (${res.status})`);
        }

        const data: TaskApi[] = await res.json();

        const mapped: Task[] = data.map((task) => ({
          id: task.id,
          title: task.title,
          description: task.description || "",
          locationText: task.location_text || "",
          price: task.price,
          createdAt: task.created_at,
          deadline: task.deadline,
          requesterName: task.requester?.fullName || "Unknown",
          priority: "Normal",
          requestCount: 0,
          latitude: task.latitude,
          longitude: task.longitude,
        }));

        setTasks(mapped);
      } catch (error) {
        console.error("Error loading tasks:", error);
      }
    };

    loadTasks().then((r) => console.log("Tasks loaded:", r));
  }, [router, searchParams]);

  useEffect(() => {
    const controller = new AbortController();

    const loadCategories = async () => {
      try {
        setIsLoadingCategories(true);

        const res = await fetch(`${API_BASE_URL}/categories`, {
          method: "GET",
          signal: controller.signal,
          headers: { "Content-Type": "application/json" },
        });

        if (!res.ok) {
          throw new Error(`Failed to fetch categories (${res.status})`);
        }

        const data: Category[] = await res.json();
        setCategories(data);
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          console.error("Error loading categories:", error);
        }
      } finally {
        setIsLoadingCategories(false);
      }
    };

    loadCategories().then((r) => console.log("Categories loaded:", r));
    return () => controller.abort();
  }, []);

  return (
    <div className="min-h-screen bg-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Filter Bar */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-slate-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
          <div className="flex-1 space-y-2 sm:col-span-2 lg:col-span-1">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
              Search Keywords
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="e.g. 'Decor', 'Shopping'..."
                className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-blue-500"
              />
              <SlidersHorizontal
                size={18}
                className="absolute right-4 top-3 text-slate-400"
              />
            </div>
          </div>

          <div className="w-full space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
              Category
            </label>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              disabled={isLoadingCategories}
              className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-blue-500 appearance-none"
            >
              <option value="">
                {isLoadingCategories
                  ? "Loading categories..."
                  : "All Categories"}
              </option>

              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="w-full space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
              Price Range
            </label>
            <select className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-blue-500 appearance-none">
              <option>Any Price</option>
            </select>
          </div>

          <button className="bg-[#0069d9] text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors h-12 w-full sm:col-span-2 lg:col-span-1">
            Apply Filters
          </button>
        </div>

        {/* Task Cards Container */}
        <div className="space-y-6">
          {/* Task card*/}
          <div className="space-y-6">
            {tasks.map((task) => (
              <DetailTaskCard key={task.id} task={task} onOpen={setSelectedTask} onApply={setSelectedApplyTask}/>
            ))}
          </div>
          {selectedTask && (
            <TaskDetailModal
              task={selectedTask}
              onClose={() => setSelectedTask(null)}
            />
          )}
        </div>
      </div>

      {
        selectedApplyTask && (
          <ApplyTaskModal
            taskId={selectedApplyTask.id}
            taskTitle={selectedApplyTask.title}
            defaultPrice={selectedApplyTask.price}
            onClose={() => setSelectedApplyTask(null)}
          />
        )
      }

    </div>
  );
}
