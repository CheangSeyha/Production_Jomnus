"use client";

import { useEffect, useState } from "react";
import { adminService } from "@/services/adminService";
import {
  Trash2,
  FileText,
  Search,
  Eye,
  RefreshCw,
  Download,
  SlidersHorizontal,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
} from "lucide-react";

interface Task {
  id: number;
  title: string;
  description?: string;
  budget?: number;
  status?: string;
  createdAt?: string;
  deadline?: string;
  requester?: { fullName: string; email: string };
}

type StatusFilter = "ALL" | "POSTED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";

export default function AdminTasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteLoading, setDeleteLoading] = useState<number | null>(null);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [tab, setTab] = useState<"All Tasks" | "My Actions" | "Archived">("All Tasks");
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const data = await adminService.getTasks();
      setTasks(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      setError("Failed to fetch tasks");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleDelete = async (taskId: number) => {
    if (!confirm("Are you sure you want to delete this task?")) return;
    try {
      setDeleteLoading(taskId);
      await adminService.deleteTask(taskId);
      setTasks(tasks.filter((t) => t.id !== taskId));
    } catch (err) {
      alert("Failed to delete task");
      console.error(err);
    } finally {
      setDeleteLoading(null);
    }
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || task.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const paginatedTasks = filteredTasks.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );
  const totalPages = Math.max(1, Math.ceil(filteredTasks.length / ITEMS_PER_PAGE));

  // Stats
  const inProgressCount = tasks.filter((t) => t.status === "IN_PROGRESS").length;
  const totalBudget = tasks.reduce((sum, t) => sum + (t.budget || 0), 0);
  const completedCount = tasks.filter((t) => t.status === "COMPLETED").length;
  const efficiencyRate = tasks.length > 0
    ? ((completedCount / tasks.length) * 100).toFixed(1)
    : "0.0";

  const getStatusStyle = (status?: string) => {
    switch (status) {
      case "IN_PROGRESS": return "bg-blue-100 text-blue-700";
      case "COMPLETED":   return "bg-green-100 text-green-700";
      case "CANCELLED":   return "bg-red-100 text-red-600";
      case "POSTED":      return "bg-slate-100 text-slate-600";
      default:            return "bg-slate-100 text-slate-500";
    }
  };

  const getInitials = (name?: string) => {
    if (!name) return "?";
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  };

  return (
    <div className="min-h-screen space-y-8 max-w-[1400px] mx-auto">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
            Manage Tasks
          </h1>
          <p className="text-slate-500 text-sm font-medium">
            Monitor and manage all community task activities.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex bg-white rounded-2xl border border-slate-100 shadow-sm p-1.5 gap-1">
          {(["All Tasks", "My Actions", "Archived"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-xl text-sm font-extrabold transition-all ${
                tab === t
                  ? "bg-slate-900 text-white shadow-md"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* ── Stats Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {/* Ongoing Impact */}
        <div className="bg-[#0052CC] rounded-[2rem] p-8 text-white relative overflow-hidden shadow-xl">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-blue-200 mb-3">
            Ongoing Impact
          </p>
          <p className="text-5xl font-extrabold tracking-tighter">
            {inProgressCount.toLocaleString()}
          </p>
          <p className="text-blue-100/80 text-sm font-medium mt-3 leading-relaxed">
            Active tasks across {new Set(tasks.map((t) => t.status)).size} categories this week.
          </p>
          <div className="absolute bottom-6 right-6 opacity-20">
            <TrendingUp className="w-20 h-20 text-white" />
          </div>
        </div>

        {/* Efficiency Rate */}
        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-slate-400 mb-3">
            Efficiency Rate
          </p>
          <p className="text-5xl font-extrabold text-slate-900 tracking-tighter">
            {efficiencyRate}%
          </p>
          <p className="text-green-600 text-sm font-bold mt-3 flex items-center gap-1">
            <span className="text-base">↑</span>
            +2.4% from last month
          </p>
        </div>

        {/* Total Volume */}
        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-slate-400 mb-3">
            Total Volume
          </p>
          <p className="text-5xl font-extrabold text-slate-900 tracking-tighter">
            ${totalBudget >= 1000
              ? `${(totalBudget / 1000).toFixed(1)}k`
              : totalBudget.toFixed(0)}
          </p>
          <div className="flex -space-x-2 mt-3">
            {tasks.slice(0, 3).map((t, i) => (
              <div
                key={i}
                className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-300 to-slate-400 border-2 border-white flex items-center justify-center text-[10px] font-extrabold text-white"
              >
                {getInitials(t.requester?.fullName)}
              </div>
            ))}
            {tasks.length > 3 && (
              <div className="w-8 h-8 rounded-full bg-blue-600 border-2 border-white flex items-center justify-center text-[10px] font-extrabold text-white">
                +{tasks.length - 3}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Error ── */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-red-700 text-sm font-medium flex items-center gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          {error}
        </div>
      )}

      {/* ── Loading ── */}
      {loading && (
        <div className="flex items-center justify-center h-72">
          <div className="animate-spin rounded-full h-14 w-14 border-4 border-blue-100 border-t-blue-600" />
        </div>
      )}

      {/* ── Filters + Table ── */}
      {!loading && (
        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-8 py-5 border-b border-slate-100">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-slate-400">
                Quick Filters:
              </span>
              {(["ALL", "POSTED", "IN_PROGRESS", "COMPLETED", "CANCELLED"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => { setStatusFilter(s); setPage(1); }}
                  className={`px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wider transition-all ${
                    statusFilter === s
                      ? "bg-slate-900 text-white shadow-md"
                      : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                  }`}
                >
                  {s.replace("_", " ")}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={searchTerm}
                  onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
                  className="pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-100 text-sm font-medium text-slate-700 placeholder:text-slate-400 outline-none focus:bg-white focus:border-blue-200 focus:ring-4 focus:ring-blue-500/5 transition-all w-48"
                />
              </div>
              <button className="px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs font-extrabold text-slate-600 flex items-center gap-2 hover:bg-slate-100 transition-colors">
                <SlidersHorizontal className="w-3.5 h-3.5" />
                Advanced Filters
              </button>
              <button className="px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs font-extrabold text-slate-600 flex items-center gap-2 hover:bg-slate-100 transition-colors">
                <Download className="w-3.5 h-3.5" />
                Export CSV
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  {["Task Title", "Requester", "Price", "Status", "Deadline", "Actions"].map((h) => (
                    <th
                      key={h}
                      className="px-8 py-4 text-[11px] font-extrabold text-slate-400 uppercase tracking-[0.15em]"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {paginatedTasks.length > 0 ? (
                  paginatedTasks.map((task) => (
                    <tr
                      key={task.id}
                      className="hover:bg-slate-50/30 transition-colors group"
                    >
                      {/* Task Title */}
                      <td className="px-8 py-5">
                        <p className="text-sm font-extrabold text-slate-900 max-w-[200px] leading-snug">
                          {task.title}
                        </p>
                        <p className="text-xs text-slate-400 font-medium mt-0.5">
                          ID: TSK-{task.id}
                        </p>
                      </td>

                      {/* Requester */}
                      <td className="px-8 py-5">
                        {task.requester ? (
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center text-xs font-extrabold text-slate-600 flex-shrink-0 border border-slate-100">
                              {getInitials(task.requester.fullName)}
                            </div>
                            <span className="text-sm font-bold text-slate-700 leading-tight max-w-[120px]">
                              {task.requester.fullName}
                            </span>
                          </div>
                        ) : (
                          <span className="text-sm text-slate-400 font-medium">—</span>
                        )}
                      </td>

                      {/* Price */}
                      <td className="px-8 py-5">
                        <span className="text-sm font-extrabold text-slate-900 tabular-nums">
                          {task.budget != null ? `$${task.budget.toFixed(2)}` : "—"}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-8 py-5">
                        <span className={`px-3 py-1.5 rounded-full text-[11px] font-extrabold uppercase tracking-wider ${getStatusStyle(task.status)}`}>
                          {task.status?.replace("_", " ") || "—"}
                        </span>
                      </td>

                      {/* Deadline */}
                      <td className="px-8 py-5">
                        <span className="text-sm text-slate-600 font-semibold">
                          {task.deadline
                            ? new Date(task.deadline).toLocaleDateString("en-US", {
                                month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
                              })
                            : task.createdAt
                            ? new Date(task.createdAt).toLocaleDateString()
                            : "—"}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-1.5">
                          <button className="p-2 rounded-xl text-blue-500 hover:bg-blue-50 transition-colors" title="View">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors" title="Reassign">
                            <RefreshCw className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(task.id)}
                            disabled={deleteLoading === task.id}
                            className="p-2 rounded-xl text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50"
                            title="Delete"
                          >
                            {deleteLoading === task.id ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-2 border-red-500 border-t-transparent" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-8 py-16 text-center">
                      <FileText className="w-12 h-12 text-slate-200 mx-auto mb-3" />
                      <p className="text-slate-400 font-semibold text-sm">
                        {searchTerm ? "No tasks found matching your search" : "No tasks to display"}
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="flex items-center justify-between px-8 py-5 border-t border-slate-100 bg-slate-50/40">
            <p className="text-sm text-slate-500 font-semibold">
              Showing {filteredTasks.length === 0 ? 0 : (page - 1) * ITEMS_PER_PAGE + 1} to{" "}
              {Math.min(page * ITEMS_PER_PAGE, filteredTasks.length)} of {filteredTasks.length} tasks
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="w-9 h-9 rounded-xl border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-white disabled:opacity-40 transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: Math.min(3, totalPages) }).map((_, i) => {
                const p = i + 1;
                return (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-9 h-9 rounded-xl text-sm font-extrabold transition-all ${
                      page === p
                        ? "bg-blue-600 text-white shadow-md"
                        : "border border-slate-200 text-slate-600 hover:bg-white"
                    }`}
                  >
                    {p}
                  </button>
                );
              })}
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="w-9 h-9 rounded-xl border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-white disabled:opacity-40 transition-all"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
