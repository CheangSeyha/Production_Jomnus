"use client";

import { useEffect, useState } from "react";
import { adminService } from "@/services/adminService";
import {
  Layers,
  Clock,
  BadgeCheck,
  AlertCircle,
  SlidersHorizontal,
  ArrowUpDown,
  Plus,
  Eye,
  ChevronLeft,
  ChevronRight,
  XCircle,
  Search,
  ArrowUp,
  ArrowDown,
} from "lucide-react";

interface Assignment {
  id: number;
  task_id?: number;
  performer_id?: number;
  taskId?: number;
  performerId?: number;
  status?: string;
  start_date?: string;
  due_date?: string;
  startDate?: string;
  dueDate?: string;
  task?: { id?: number; title?: string; category?: string };
  performer?: { id?: number; fullName?: string; email?: string; tier?: string };
}

interface PaginatedAssignments {
  data: Assignment[];
  total: number;
  page: number;
}

const LIMIT = 15;

export default function AdminAssignmentsPage() {
  const [assignments, setAssignments] = useState<PaginatedAssignments | null>(null);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState<string | null>(null);
  const [page, setPage]               = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField]   = useState<"task" | "performer" | "status">("task");
  const [sortDir, setSortDir]       = useState<"asc" | "desc">("asc");

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        setLoading(true);
        const data = await adminService.getAssignments({ page, limit: LIMIT });
        setAssignments(data);
        setError(null);
      } catch (err) {
        setError("Failed to fetch assignments");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAssignments();
  }, [page]);

  // ── Helpers ──────────────────────────────────────────────────────────────
  const getTaskId = (a: Assignment) => a.task_id ?? a.taskId ?? a.id;
  const getPerformerId = (a: Assignment) => a.performer_id ?? a.performerId;

  const getTaskLabel = (a: Assignment) =>
      a.task?.title ?? `Task #${getTaskId(a)}`;

  const getPerformerLabel = (a: Assignment) =>
      a.performer?.fullName ?? `Performer #${getPerformerId(a) ?? "—"}`;

  const getInitials = (a: Assignment) => {
    const name = a.performer?.fullName;
    if (name) return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
    const pid = getPerformerId(a);
    return pid ? `P${pid}` : "?";
  };

  const rawData = assignments?.data ?? [];

  const filteredData = rawData.filter((a) => {
    const term = searchTerm.toLowerCase();
    return (
        getTaskLabel(a).toLowerCase().includes(term) ||
        getPerformerLabel(a).toLowerCase().includes(term) ||
        a.status?.toLowerCase().includes(term)
    );
  });

  const data = [...filteredData].sort((a, b) => {
    let valA = "";
    let valB = "";
    if (sortField === "task")      { valA = getTaskLabel(a);      valB = getTaskLabel(b); }
    if (sortField === "performer") { valA = getPerformerLabel(a); valB = getPerformerLabel(b); }
    if (sortField === "status")    { valA = a.status ?? "";       valB = b.status ?? ""; }
    return sortDir === "asc"
        ? valA.localeCompare(valB)
        : valB.localeCompare(valA);
  });

  const getStatusStyle = (status?: string) => {
    switch (status) {
      case "COMPLETED":  return { dot: "bg-green-500",  pill: "bg-green-100 text-green-700" };
      case "IN_PROGRESS":return { dot: "bg-blue-500",   pill: "bg-blue-100 text-blue-700" };
      case "ASSIGNED":   return { dot: "bg-slate-400",  pill: "bg-slate-100 text-slate-600" };
      case "VERIFIED":   return { dot: "bg-violet-500", pill: "bg-violet-100 text-violet-700" };
      default:           return { dot: "bg-slate-300",  pill: "bg-slate-100 text-slate-500" };
    }
  };

  // ── Pagination ────────────────────────────────────────────────────────────
  const totalPages = Math.max(1, Math.ceil((assignments?.total ?? 0) / LIMIT));

  // Shows up to 5 page buttons centred around the current page
  const getPageWindow = () => {
    const delta = 2;
    const start = Math.max(1, page - delta);
    const end   = Math.min(totalPages, page + delta);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  // ── Stats ─────────────────────────────────────────────────────────────────
  const stats = {
    inProgress: data.filter((a) => a.status === "IN_PROGRESS").length,
    verified:   data.filter((a) => a.status === "VERIFIED").length,
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
      <div className="min-h-screen space-y-8 max-w-[1400px] mx-auto">

        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
              Assignments Tracking
            </h1>
            <p className="text-slate-500 text-sm font-medium max-w-md leading-relaxed">
              Monitor real-time status of work distributions, manage performer
              progress, and verify completed milestones.
            </p>
          </div>

          {/* Mini stat cards */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm px-5 py-3.5 flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-xl">
                <Clock className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">In Progress</p>
                <p className="text-xl font-extrabold text-slate-900 leading-none mt-0.5">{stats.inProgress}</p>
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm px-5 py-3.5 flex items-center gap-3">
              <div className="p-2 bg-orange-50 rounded-xl">
                <BadgeCheck className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Verified</p>
                <p className="text-xl font-extrabold text-slate-900 leading-none mt-0.5">{stats.verified}</p>
              </div>
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

        {/* ── Table ── */}
        {!loading && (
            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">

              {/* Toolbar */}
              <div className="flex items-center justify-between px-8 py-5 border-b border-slate-100">
                <div className="flex items-center gap-2">

                  {/* Search — replaces Filter button */}
                  <div className="relative">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search task or performer..."
                        value={searchTerm}
                        onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
                        className="pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-100 text-sm font-medium text-slate-700 placeholder:text-slate-400 outline-none focus:bg-white focus:border-blue-200 focus:ring-4 focus:ring-blue-500/5 transition-all w-56"
                    />
                  </div>

                  {/* Sort button */}
                  <div className="flex items-center gap-1">
                    {(["task", "performer", "status"] as const).map((field) => (
                        <button
                            key={field}
                            onClick={() => {
                              if (sortField === field) {
                                setSortDir((d) => (d === "asc" ? "desc" : "asc"));
                              } else {
                                setSortField(field);
                                setSortDir("asc");
                              }
                            }}
                            className={`px-3 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-colors border ${
                                sortField === field
                                    ? "bg-slate-900 text-white border-slate-900"
                                    : "bg-slate-50 text-slate-600 border-slate-100 hover:bg-slate-100"
                            }`}
                        >
                          {field.charAt(0).toUpperCase() + field.slice(1)}
                          {sortField === field ? (
                              sortDir === "asc"
                                  ? <ArrowUp className="w-3 h-3" />
                                  : <ArrowDown className="w-3 h-3" />
                          ) : (
                              <ArrowUpDown className="w-3 h-3 opacity-40" />
                          )}
                        </button>
                    ))}
                  </div>

                </div>

              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    {["Task", "Task ID", "Performer", "Performer ID", "Status", "Verified", "Actions"].map((h) => (
                        <th key={h} className="px-8 py-4 text-[11px] font-extrabold text-slate-400 uppercase tracking-[0.15em]">
                          {h}
                        </th>
                    ))}
                  </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                  {data.length > 0 ? data.map((a) => {
                    const style      = getStatusStyle(a.status);
                    const isVerified = a.status === "COMPLETED" || a.status === "VERIFIED";
                    return (
                        <tr key={a.id} className="hover:bg-slate-50/30 transition-colors">

                          {/* Task title */}
                          <td className="px-8 py-6">
                            <p className="text-sm font-extrabold text-slate-900 leading-snug max-w-[180px]">
                              {getTaskLabel(a)}
                            </p>
                          </td>

                          {/* Task ID */}
                          <td className="px-8 py-6">
                        <span className="text-xs font-bold text-slate-400">
                          #TSK-{String(getTaskId(a)).padStart(5, "0")}
                        </span>
                          </td>

                          {/* Performer name */}
                          <td className="px-8 py-6">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-slate-200 to-slate-400 flex items-center justify-center text-xs font-extrabold text-white flex-shrink-0 border border-slate-100 shadow-sm">
                                {getInitials(a)}
                              </div>
                              <div className="min-w-0">
                                <p className="text-sm font-extrabold text-slate-900 truncate">
                                  {getPerformerLabel(a)}
                                </p>
                                {a.performer?.email && (
                                    <p className="text-xs text-slate-400 truncate">{a.performer.email}</p>
                                )}
                              </div>
                            </div>
                          </td>

                          {/* Performer ID */}
                          <td className="px-8 py-6">
                        <span className="text-xs font-bold text-slate-400">
                          #{getPerformerId(a) ?? "—"}
                        </span>
                          </td>

                          {/* Status */}
                          <td className="px-8 py-6">
                            <div className="flex items-center gap-2">
                              <span className={`w-2 h-2 rounded-full flex-shrink-0 ${style.dot}`} />
                              <span className={`px-3 py-1.5 rounded-full text-[11px] font-extrabold uppercase tracking-wider ${style.pill}`}>
                            {a.status?.replace("_", " ") || "UNKNOWN"}
                          </span>
                            </div>
                          </td>

                          {/* Verified */}
                          <td className="px-8 py-6">
                            {isVerified ? (
                                <div className="flex items-center gap-2 text-orange-500">
                                  <BadgeCheck className="w-5 h-5" />
                                  <span className="text-sm font-extrabold">Yes</span>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2 text-slate-400">
                                  <XCircle className="w-5 h-5" />
                                  <span className="text-sm font-bold">Pending</span>
                                </div>
                            )}
                          </td>

                          {/* Actions */}
                          <td className="px-8 py-6">
                            <button className="p-2 rounded-xl text-blue-500 hover:bg-blue-50 transition-colors" title="View">
                              <Eye className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                    );
                  }) : (
                      <tr>
                        <td colSpan={7} className="px-8 py-16 text-center">
                          <Layers className="w-12 h-12 text-slate-200 mx-auto mb-3" />
                          <p className="text-slate-400 font-semibold text-sm">No assignments to display</p>
                        </td>
                      </tr>
                  )}
                  </tbody>
                </table>
              </div>

              {/* ── Pagination Footer ── */}
              <div className="flex items-center justify-between px-8 py-5 border-t border-slate-100 bg-slate-50/40">
                <p className="text-sm text-slate-500 font-semibold">
                  Showing{" "}
                  {data.length === 0 ? 0 : (page - 1) * LIMIT + 1}–{(page - 1) * LIMIT + data.length}{" "}
                  of {assignments?.total ?? 0} results
                </p>

                <div className="flex items-center gap-1">
                  {/* Prev */}
                  <button
                      onClick={() => setPage(Math.max(1, page - 1))}
                      disabled={page === 1}
                      className="w-9 h-9 rounded-xl border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-white disabled:opacity-40 transition-all"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  {/* First page + ellipsis */}
                  {getPageWindow()[0] > 1 && (
                      <>
                        <button
                            onClick={() => setPage(1)}
                            className="w-9 h-9 rounded-xl text-sm font-extrabold border border-slate-200 text-slate-600 hover:bg-white transition-all"
                        >
                          1
                        </button>
                        {getPageWindow()[0] > 2 && (
                            <span className="text-slate-400 font-bold px-1">…</span>
                        )}
                      </>
                  )}

                  {/* Page window */}
                  {getPageWindow().map((p) => (
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
                  ))}

                  {/* Ellipsis + last page */}
                  {getPageWindow()[getPageWindow().length - 1] < totalPages && (
                      <>
                        {getPageWindow()[getPageWindow().length - 1] < totalPages - 1 && (
                            <span className="text-slate-400 font-bold px-1">…</span>
                        )}
                        <button
                            onClick={() => setPage(totalPages)}
                            className="w-9 h-9 rounded-xl text-sm font-extrabold border border-slate-200 text-slate-600 hover:bg-white transition-all"
                        >
                          {totalPages}
                        </button>
                      </>
                  )}

                  {/* Next */}
                  <button
                      onClick={() => setPage(Math.min(totalPages, page + 1))}
                      disabled={page >= totalPages}
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