"use client";

import { useEffect, useState } from "react";
import { adminService } from "@/services/adminService";
import {
  Layers,
  Clock,
  CheckCircle2,
  AlertCircle,
  SlidersHorizontal,
  ArrowUpDown,
  Plus,
  Eye,
  ChevronLeft,
  ChevronRight,
  BadgeCheck,
  XCircle,
} from "lucide-react";

interface Assignment {
  id: number;
  taskId?: number;
  performerId?: number;
  status?: string;
  startDate?: string;
  dueDate?: string;
  task?: { title: string; category?: string };
  performer?: { fullName: string; email: string; tier?: string };
}

interface PaginatedAssignments {
  data: Assignment[];
  total: number;
  page: number;
}

export default function AdminAssignmentsPage() {
  const [assignments, setAssignments] = useState<PaginatedAssignments | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const LIMIT = 15;

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

  const stats = {
    total: assignments?.total || 0,
    inProgress: assignments?.data.filter((a) => a.status === "IN_PROGRESS").length || 0,
    completed: assignments?.data.filter((a) => a.status === "COMPLETED").length || 0,
    verified: assignments?.data.filter((a) => a.status === "VERIFIED").length || 0,
  };

  const totalPages = Math.max(1, Math.ceil((assignments?.total || 0) / LIMIT));

  const getStatusStyle = (status?: string) => {
    switch (status) {
      case "COMPLETED": return { dot: "bg-green-500",  pill: "bg-green-100 text-green-700" };
      case "IN_PROGRESS": return { dot: "bg-blue-500", pill: "bg-blue-100 text-blue-700" };
      case "ASSIGNED":    return { dot: "bg-slate-400", pill: "bg-slate-100 text-slate-600" };
      case "VERIFIED":    return { dot: "bg-violet-500", pill: "bg-violet-100 text-violet-700" };
      default:            return { dot: "bg-slate-300", pill: "bg-slate-100 text-slate-500" };
    }
  };

  const getInitials = (name?: string, id?: number) => {
    if (name) return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
    return `P${id ?? "?"}`;
  };

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

        {/* Stats mini-cards */}
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
              <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Verified Today</p>
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
              <button className="px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs font-extrabold text-slate-600 flex items-center gap-2 hover:bg-slate-100 transition-colors">
                <SlidersHorizontal className="w-3.5 h-3.5" />
                Filter
              </button>
              <button className="px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs font-extrabold text-slate-600 flex items-center gap-2 hover:bg-slate-100 transition-colors">
                <ArrowUpDown className="w-3.5 h-3.5" />
                Sort
              </button>
            </div>
            <button className="px-5 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-extrabold flex items-center gap-2 hover:bg-blue-700 transition-colors shadow-sm">
              <Plus className="w-4 h-4" />
              New Assignment
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  {["Task Name & ID", "Performer", "Status", "Verified", "Actions"].map((h) => (
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
                {assignments && assignments.data.length > 0 ? (
                  assignments.data.map((a) => {
                    const style = getStatusStyle(a.status);
                    const isVerified = a.status === "COMPLETED" || a.status === "VERIFIED";
                    return (
                      <tr key={a.id} className="hover:bg-slate-50/30 transition-colors group">
                        {/* Task Name & ID */}
                        <td className="px-8 py-6">
                          <p className="text-sm font-extrabold text-slate-900 leading-snug max-w-[200px]">
                            {a.task?.title || `Task #${a.taskId ?? a.id}`}
                          </p>
                          <p className="text-xs text-slate-400 font-medium mt-0.5">
                            #TSK-{String(a.taskId ?? a.id).padStart(5, "0")}
                          </p>
                        </td>

                        {/* Performer */}
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-slate-200 to-slate-400 flex items-center justify-center text-xs font-extrabold text-white flex-shrink-0 border border-slate-100 shadow-sm">
                              {getInitials(a.performer?.fullName, a.performerId)}
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-extrabold text-slate-900 truncate">
                                {a.performer?.fullName || `Performer #${a.performerId ?? a.id}`}
                              </p>
                              {a.performer?.tier && (
                                <span className="inline-block mt-0.5 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-50 text-blue-600 uppercase tracking-wider">
                                  {a.performer.tier}
                                </span>
                              )}
                            </div>
                          </div>
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
                              <span className="text-sm font-bold text-slate-400">
                                Pending completion
                              </span>
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
                  })
                ) : (
                  <tr>
                    <td colSpan={5} className="px-8 py-16 text-center">
                      <Layers className="w-12 h-12 text-slate-200 mx-auto mb-3" />
                      <p className="text-slate-400 font-semibold text-sm">No assignments to display</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="flex items-center justify-between px-8 py-5 border-t border-slate-100 bg-slate-50/40">
            <p className="text-sm text-slate-500 font-semibold">
              Showing 1-{assignments?.data.length ?? 0} of {assignments?.total ?? 0} results
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="w-9 h-9 rounded-xl border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-white disabled:opacity-40 transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {[1, 2, 3].map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-9 h-9 rounded-xl text-sm font-extrabold transition-all ${
                    page === p ? "bg-blue-600 text-white shadow-md" : "border border-slate-200 text-slate-600 hover:bg-white"
                  }`}
                >
                  {p}
                </button>
              ))}
              {totalPages > 3 && <span className="text-slate-400 font-bold px-1">…</span>}
              {totalPages > 3 && (
                <button
                  onClick={() => setPage(totalPages)}
                  className="w-9 h-9 rounded-xl text-sm font-extrabold border border-slate-200 text-slate-600 hover:bg-white transition-all"
                >
                  {totalPages}
                </button>
              )}
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
