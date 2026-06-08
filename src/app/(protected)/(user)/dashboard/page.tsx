"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight, Search, SlidersHorizontal, X } from "lucide-react";
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

const PRICE_OPTIONS = [
  { value: "", label: "Any Price" },
  { value: "0-5", label: "$0 – $5" },
  { value: "5-20", label: "$5 – $20" },
  { value: "20-50", label: "$20 – $50" },
  { value: "50-100", label: "$50 – $100" },
  { value: "100+", label: "$100+" },
];

const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
  { value: "highest-price", label: "Highest Price" },
  { value: "lowest-price", label: "Lowest Price" },
  { value: "deadline", label: "Deadline Soon" },
];

export default function DashboardPage() {

  // ─────────────────────────────────────────────
  // NAVIGATION + URL STATE
  // ─────────────────────────────────────────────
  const router = useRouter();
  const searchParams = useSearchParams();


  // ─────────────────────────────────────────────
  // MAIN STATE (UI + DATA)
  // ─────────────────────────────────────────────
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
  const [showMap, setShowMap] = useState(false);

  const SharedTaskMap = dynamic(
      () => import("@/components/map/SharedTaskMap"),
      { ssr: false }
  );

  const markTaskApplied = (taskId: number) => {
    setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, hasApplied: true } : t))
    );
  };


  // ─────────────────────────────────────────────
  // FILTER + SEARCH + SORT LOGIC (VERY IMPORTANT)
  // ─────────────────────────────────────────────
  const filteredTasks = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return [...tasks]
        .filter((task) => {
          const matchesSearch =
              !q ||
              [task.title, task.description, task.locationText, task.requesterName]
                  .filter(Boolean)
                  .some((v) => String(v).toLowerCase().includes(q));

          const matchesCategory =
              !selectedCategory ||
              task.categoryIds?.includes(Number(selectedCategory));

          let matchesPrice = true;
          if (selectedPrice) {
            const p = task.price;
            switch (selectedPrice) {
              case "0-5":    matchesPrice = p <= 5; break;
              case "5-20":   matchesPrice = p > 5 && p <= 20; break;
              case "20-50":  matchesPrice = p > 20 && p <= 50; break;
              case "50-100": matchesPrice = p > 50 && p <= 100; break;
              case "100+":   matchesPrice = p > 100; break;
            }
          }
          return matchesSearch && matchesCategory && matchesPrice;
        })
        .sort((a, b) => {
          switch (sortBy) {
            case "oldest":        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
            case "highest-price": return b.price - a.price;
            case "lowest-price":  return a.price - b.price;
            case "deadline":      return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
            default:              return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          }
        });
  }, [searchTerm, selectedCategory, selectedPrice, tasks, sortBy]);


  // ─────────────────────────────────────────────
  // PAGINATION
  // ─────────────────────────────────────────────
  const totalPages = Math.max(1, Math.ceil(filteredTasks.length / TASKS_PER_PAGE));
  const paginatedTasks = filteredTasks.slice(
      (currentPage - 1) * TASKS_PER_PAGE,
      currentPage * TASKS_PER_PAGE
  );

  const activeFilterCount = [selectedCategory, selectedPrice, sortBy !== "newest" ? sortBy : ""]
      .filter(Boolean).length;


  // ─────────────────────────────────────────────
  // LOAD TASKS (API CALL)
  // ─────────────────────────────────────────────
  useEffect(() => {
    const token = searchParams.get("token");

    if (token) {
      localStorage.setItem("access_token", token);
      router.replace("/dashboard");
      return;
    }

    if (!localStorage.getItem("access_token")) {
      router.replace("/auth/signin");
    }

    // Fetch tasks
    const loadTasks = async () => {
      try {
        const res = await api.get<TaskApi[]>("/tasks");
        const mapped: Task[] = res.data.map((task) => ({
          id: task.id,
          categoryIds: Array.isArray(task.categories) ? task.categories.map((c) => c.id) : [],
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
          requiredWorkers: task.required_workers || 1,
          status: task.status,
          requesterName: task.requester?.fullName || "Unknown",
          hasApplied: task.hasApplied ?? false,
          priority: "Normal",
          requestCount: 0,
        }));
        setTasks(mapped);
        if (mapped.length > 0) setSelectedTask(mapped[0]);
      } catch (err) {
        console.error("Error loading tasks:", err);
      }
    };

    loadTasks();
  }, [router, searchParams]);


  // ─────────────────────────────────────────────
  // LOAD CATEGORIES
  // ─────────────────────────────────────────────
  useEffect(() => {
    const controller = new AbortController();
    const loadCategories = async () => {
      try {
        setIsLoadingCategories(true);
        const res = await api.get<Category[]>("/categories", { signal: controller.signal });
        setCategories(res.data);
      } catch (err) {
        if ((err as Error).name !== "CanceledError") console.error(err);
      } finally {
        setIsLoadingCategories(false);
      }
    };
    loadCategories();
    return () => controller.abort();
  }, []);


  // ─────────────────────────────────────────────
  // RESET PAGE WHEN FILTER CHANGES
  // ─────────────────────────────────────────────
  useEffect(() => { setCurrentPage(1); }, [searchTerm, selectedCategory, selectedPrice]);


  // ─────────────────────────────────────────────
  // FIX PAGE OUT OF RANGE
  // ─────────────────────────────────────────────
  useEffect(() => { if (currentPage > totalPages) setCurrentPage(totalPages); }, [currentPage, totalPages]);


  // ─────────────────────────────────────────────
  // UI RENDER (JSX)
  // ─────────────────────────────────────────────
  return (
      <div className="w-full">
        <div className="mx-auto flex w-full max-w-[1800px] flex-col gap-5 px-4 py-4 md:px-8">

          {/* ── PAGE HEADER ── */}
          <div className="flex items-end justify-between gap-4 shrink-0">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-sky-600 mb-1">Marketplace</p>
              <h1 className="text-2xl md:text-3xl font-black text-slate-950 tracking-tight">Available Tasks</h1>
            </div>
            <div className="rounded-2xl border border-sky-200 bg-white/85 px-4 py-2 text-right shadow-sm">
              <p className="text-2xl font-black leading-none text-sky-600">{filteredTasks.length}</p>
              <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                {filteredTasks.length === 1 ? "task" : "tasks"}
              </p>
            </div>
          </div>

          {/* ── FILTER BAR ── */}
          <div className="relative z-0 shrink-0 rounded-2xl border border-sky-200 bg-white/90 p-4 shadow-[0_14px_40px_rgba(14,165,233,0.12)]">
            <div className="flex flex-col sm:flex-row gap-3">

              {/* Search */}
              <div className="relative flex-1">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sky-500" />
                <input
                    type="text"
                    placeholder="Search tasks, locations…"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full rounded-xl border border-sky-200 bg-sky-50/70 py-3 pl-10 pr-10 text-sm font-medium text-slate-800 placeholder-slate-500 shadow-inner shadow-sky-100/60 transition focus:border-sky-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-sky-200/80"
                />
                {searchTerm && (
                    <button
                        onClick={() => setSearchTerm("")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                    >
                      <X size={14} />
                    </button>
                )}
              </div>

              {/* FIX 2: Use lg:flex-nowrap instead of sm:flex-nowrap to avoid overflow at mid-widths */}
              <div className="flex gap-2 flex-wrap lg:flex-nowrap">
                <div className="relative min-w-[140px] flex-1 lg:flex-none">
                  <SlidersHorizontal size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-cyan-600" />
                  <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      disabled={isLoadingCategories}
                      className="h-full w-full cursor-pointer appearance-none rounded-xl border border-cyan-200 bg-cyan-50/70 py-3 pl-9 pr-8 text-sm font-bold text-slate-700 transition focus:border-cyan-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-cyan-200/80 disabled:cursor-wait disabled:opacity-70"
                  >
                    <option value="">{isLoadingCategories ? "Loading…" : "All Categories"}</option>
                    {categories.map((c) => (
                        <option key={c.id} value={String(c.id)}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <select
                    value={selectedPrice}
                    onChange={(e) => setSelectedPrice(e.target.value)}
                    className="min-w-[110px] flex-1 cursor-pointer appearance-none rounded-xl border border-emerald-200 bg-emerald-50/70 px-3 py-3 text-sm font-bold text-slate-700 transition focus:border-emerald-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-200/80 lg:flex-none"
                >
                  {PRICE_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>

                <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="min-w-[120px] flex-1 cursor-pointer appearance-none rounded-xl border border-indigo-200 bg-indigo-50/70 px-3 py-3 text-sm font-bold text-slate-700 transition focus:border-indigo-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-200/80 lg:flex-none"
                >
                  {SORT_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>

                {activeFilterCount > 0 && (
                    <button
                        onClick={() => { setSelectedCategory(""); setSelectedPrice(""); setSortBy("newest"); }}
                        className="flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-3 py-3 text-sm font-bold text-rose-700 transition hover:bg-rose-100 whitespace-nowrap"
                    >
                      <X size={13} />
                      Clear ({activeFilterCount})
                    </button>
                )}
              </div>
            </div>
          </div>

          {/* ── MAIN CONTENT ── */}
          {/*
          FIX 3: On mobile, use flex-col so task list appears first (order-1) and map second (order-2).
          On xl, switch to a side-by-side grid.
        */}
          <div className="flex flex-col xl:grid xl:grid-cols-[1fr_700px] gap-5">

            {/* Task list — order-1 so it appears FIRST on mobile */}
            <div className="order-1 xl:order-2 flex flex-col gap-4">
              <div className="space-y-4">
                {paginatedTasks.length > 0 ? (
                    paginatedTasks.map((task) => (
                        <DetailTaskCard
                            key={task.id}
                            task={task}
                            isSelected={selectedTask?.id === task.id}
                            onOpen={(t) => { setSelectedTask(t); }}
                            onApply={setSelectedApplyTask}
                        />
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center h-64 rounded-2xl border-2 border-dashed border-sky-200 bg-white/85 text-center">
                      <div className="text-3xl mb-3">🔍</div>
                      <p className="font-semibold text-slate-800">No tasks found</p>
                      <p className="text-sm text-slate-500 mt-1">Try adjusting your filters</p>
                    </div>
                )}
              </div>

              {/* Pagination */}
              {filteredTasks.length > TASKS_PER_PAGE && (
                  <div className="shrink-0 flex items-center justify-between rounded-2xl border border-sky-200 bg-white/90 px-4 py-3 shadow-sm">
                    <p className="text-sm text-slate-500">
                      Page <span className="font-bold text-sky-700">{currentPage}</span> of {totalPages}
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                          disabled={currentPage === 1}
                          className="inline-flex items-center gap-1.5 h-9 px-3 rounded-xl border border-sky-200 text-sm font-bold text-sky-700 transition hover:bg-sky-50 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <ChevronLeft size={15} /> Prev
                      </button>
                      <button
                          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                          disabled={currentPage === totalPages}
                          className="inline-flex items-center gap-1.5 h-9 px-3 rounded-xl border border-sky-200 bg-sky-600 text-sm font-bold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500"
                      >
                        Next <ChevronRight size={15} />
                      </button>
                    </div>
                  </div>
              )}
            </div>

            {/*
            FIX 4: Map — order-2 (appears below tasks on mobile).
            FIX 5: Cap height on mobile (h-[260px]), full height on xl.
            FIX 6: Remove sticky top-0 — not needed and misfires on mobile.
          */}
            <div className="order-2 xl:order-1 h-[300px] xl:h-[calc(100vh-280px)] xl:sticky xl:top-4 overflow-hidden rounded-2xl border border-sky-200 bg-white shadow-[0_18px_45px_rgba(14,165,233,0.18)]">
              {filteredTasks.length > 0 ? (
                  <SharedTaskMap lat={selectedTask?.latitude} lng={selectedTask?.longitude} />
              ) : (
                  <div className="h-full flex flex-col items-center justify-center gap-2 bg-sky-50 text-slate-500">
                    <span className="text-2xl">📍</span>
                    <p className="text-sm font-medium">No task location</p>
                  </div>
              )}
            </div>

          </div>
        </div>

        {selectedApplyTask && (
            <ApplyTaskModal
                taskId={selectedApplyTask.id}
                taskTitle={selectedApplyTask.title}
                defaultPrice={selectedApplyTask.price}
                onApplied={() => markTaskApplied(selectedApplyTask.id)}
                onClose={() => setSelectedApplyTask(null)}
            />
        )}
      </div>
  );
}