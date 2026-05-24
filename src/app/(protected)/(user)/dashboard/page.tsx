"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight, SlidersHorizontal } from "lucide-react";
import DetailTaskCard from "@/components/myrequest/DetailTaskCard";
import { Task } from "@/types/task";
import ApplyTaskModal from "@/components/applications/ApplyTaskModal";
import api from "@/lib/axios";
import dynamic from "next/dynamic";

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

  latitude?: number | null;

  longitude?: number | null;

  price: number;

  created_at: string;

  updated_at?: string;

  start_date?: string | null;

  deadline: string;

  required_workers?: number;

  categories?: Category[];

  status:
    | "POSTED"
    | "ACCEPTED"
    | "IN_PROGRESS"
    | "PARTIAL_COMPLETED"
    | "COMPLETED"
    | "VERIFIED"
    | "CANCELLED";

  requester?: {
    id: number;

    fullName: string;

    profileImage?: string | null;
  } | null;

  hasApplied?: boolean;
};

const TASKS_PER_PAGE = 6;

export default function DashboardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("newest");
  const [tasks, setTasks] = useState<Task[]>([]);

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const [selectedApplyTask, setSelectedApplyTask] = useState<Task | null>(null);  

  const [selectedPrice, setSelectedPrice] = useState("");

  const SharedTaskMap = dynamic(
    () => import("@/components/map/SharedTaskMap"),
    { ssr: false }
  );

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


      console.log({
        title: task.title,
        categoryIds: task.categoryIds,
        selectedCategory,
        matches:
          task.categoryIds?.includes(Number(selectedCategory)),
      });
        // SEARCH
        const matchesSearch =
          !normalizedSearch ||
          [
            task.title,
            task.description,
            task.locationText,
            task.requesterName,
          ]
            .filter(Boolean)
            .some((value) =>
              String(value).toLowerCase().includes(normalizedSearch)
            );

        // CATEGORY
        const matchesCategory =
          !selectedCategory ||
          task.categoryIds?.includes(Number(selectedCategory));
        // PRICE
        let matchesPrice = true;

        if (selectedPrice) {
          const price = task.price;

          switch (selectedPrice) {
            case "0-5":
              matchesPrice = price <= 5;
              break;

            case "5-20":
              matchesPrice = price > 5 && price <= 20;
              break;

            case "20-50":
              matchesPrice = price > 20 && price <= 50;
              break;

            case "50-100":
              matchesPrice = price > 50 && price <= 100;
              break;

            case "100+":
              matchesPrice = price > 100;
              break;
          }
        }

        return (
          matchesSearch &&
          matchesCategory &&
          matchesPrice
        );
      })
      .sort((a, b) => {
        switch (sortBy) {
          case "oldest":
            return (
              new Date(a.createdAt).getTime() -
              new Date(b.createdAt).getTime()
            );

          case "highest-price":
            return b.price - a.price;

          case "lowest-price":
            return a.price - b.price;

          case "deadline":
            return (
              new Date(a.deadline).getTime() -
              new Date(b.deadline).getTime()
            );

          case "newest":
          default:
            return (
              new Date(b.createdAt).getTime() -
              new Date(a.createdAt).getTime()
            );
        }
      })
  }, [
    searchTerm,
    selectedCategory,
    selectedPrice,
    tasks,
    sortBy
  ]);
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

        const res = await api.get<TaskApi[]>("/tasks")

        const data = res.data;
        console.log("API RESPONSE:", data);


        const mapped: Task[] = data.map((task) => ({
          id: task.id,

          categoryIds:
          Array.isArray(task.categories)
            ? task.categories.map((c) => c.id)
            : [],
          
          title: task.title,

          description: task.description || "",

          locationText: task.location_text || "",

          latitude: task.latitude ?? undefined,

          longitude: task.longitude ?? undefined,

          price: task.price,

          createdAt: task.created_at,

          updatedAt: task.updated_at,

          startDate: task.start_date || "",

          deadline: task.deadline,

          requester_id: task.requester?.id,

          requester: task.requester,
          requiredWorkers:
            task.required_workers || 1,

          status: task.status,

          requesterName:
            task.requester?.fullName || "Unknown",

          hasApplied: task.hasApplied ?? false,

          priority: "Normal",

          requestCount: 0,
        }));
        console.log("MAPPED TASKS:", mapped);
        setTasks(mapped);

        if (mapped.length > 0) {
          setSelectedTask(mapped[0]);
        }

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

        const res = await api.get<Category[]>("/categories", {
          signal: controller.signal,
        });

        setCategories(res.data);
      } catch (error) {
        if ((error as Error).name !== "CanceledError") {
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
    <div className="h-full overflow-hidden bg-white px-4 py-3 md:px-6 md:py-4 ">
      <div className="max-w-[1700px] mx-auto h-full flex flex-col gap-4">
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
                <option key={category.id} value={String(category.id)}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="w-full space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
              Price Range
            </label>
            <select
            value={selectedPrice}
            onChange={(e) => setSelectedPrice(e.target.value)}
            className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-blue-500 appearance-none">
              <option value="">Any Price</option>
              <option value="0-5">$0 - $5</option>
              <option value="5-20">$5 - $20</option>
              <option value="20-50">$20 - $50</option>
              <option value="50-100">$50 - $100</option>
              <option value="100+">$100+</option>
            </select>
          </div>

          <div className="w-full space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
              Sort By
            </label>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-blue-500 appearance-none"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="highest-price">Highest Price</option>
              <option value="lowest-price">Lowest Price</option>
              <option value="deadline">Deadline Soon</option>
            </select>
          </div>
        </div>

        {/* Task Cards Container */}
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between mb-10">
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
          <div className="grid flex-1 min-h-0 grid-cols-1 xl:grid-cols-[600px_1fr] gap-6">


            {/* RIGHT SHARED MAP */}
            <div className="sticky top-6 self-start h-[calc(100vh-370px)] w-full rounded-3xl overflow-hidden border border-slate-200 shadow-sm bg-white">
              {filteredTasks.length > 0 ? (
                <SharedTaskMap
                  lat={selectedTask?.latitude}
                  lng={selectedTask?.longitude}
                />
              ) : (
                <div className="h-full flex items-center justify-center text-slate-400">
                  No matching task location
                </div>
              )}
            </div>

            {/* LEFT TASK LIST */}
            <div className="overflow-y-auto pr-2 space-y-6 min-h-0">
              {paginatedTasks.map((task) => (
                <DetailTaskCard
                  key={task.id}
                  task={task}
                  onOpen={setSelectedTask}
                  onApply={setSelectedApplyTask}
                />
              ))}
            </div>
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
