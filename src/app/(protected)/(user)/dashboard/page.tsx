"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight, SlidersHorizontal } from "lucide-react";
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
    hasApplied?: boolean;
    status: "OPEN" | "COMPLETED" | "CANCELLED";
};

const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"
).replace(/\/$/, "");

const TASKS_PER_PAGE = 6;

export default function DashboardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [tasks, setTasks] = useState<Task[]>([]);

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const [selectedApplyTask, setSelectedApplyTask] = useState<Task | null>(null);  

  const markTaskApplied = (taskId: number) => {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === taskId ? { ...task, hasApplied: true } : task,
      ),
    );
  };

  const filteredTasks = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return [...tasks]
      .filter((task) => {
        if (!normalizedSearch) return true;

        return [
          task.title,
          task.description,
          task.locationText,
          task.requesterName,
        ]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(normalizedSearch));
      })
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
  }, [searchTerm, tasks]);

  const totalPages = Math.max(1, Math.ceil(filteredTasks.length / TASKS_PER_PAGE));
  const paginatedTasks = filteredTasks.slice(
    (currentPage - 1) * TASKS_PER_PAGE,
    currentPage * TASKS_PER_PAGE,
  );

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

          requester_id: task.requester?.id,

          requesterName: task.requester?.fullName || "Unknown",

          requester: task.requester,

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

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

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
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
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
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Available Tasks</h2>
              <p className="text-sm text-slate-500">
                Showing newest tasks first.
              </p>
            </div>
            <p className="text-sm font-semibold text-slate-500">
              {filteredTasks.length} task{filteredTasks.length === 1 ? "" : "s"}
            </p>
          </div>

          {/* Task card*/}
          <div className="space-y-6">
            {paginatedTasks.map((task) => (
              <DetailTaskCard key={task.id} task={task} onOpen={setSelectedTask} onApply={setSelectedApplyTask}/>
            ))}
          </div>

          {filteredTasks.length === 0 && (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
              No tasks match your search.
            </div>
          )}

          {filteredTasks.length > TASKS_PER_PAGE && (
            <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-slate-500">
                Page {currentPage} of {totalPages}
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                  disabled={currentPage === 1}
                  className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 px-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronLeft size={16} />
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                  disabled={currentPage === totalPages}
                  className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 px-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}

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
            onApplied={() => markTaskApplied(selectedApplyTask.id)}
            onClose={() => setSelectedApplyTask(null)}
          />
        )
      }

    </div>
  );
}
