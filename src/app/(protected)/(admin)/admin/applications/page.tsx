"use client";

import { useEffect, useState } from "react";
import { adminService } from "@/services/adminService";
import { getSocket } from "@/lib/websoket";
import {
  FileText,
  Eye,
  SlidersHorizontal,
  Download,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Clock,
  Zap,
  DivideCircle,
} from "lucide-react"; 

interface Application {
  id: number;
  taskId?: number;
  userId?: number;
  status?: string;
  appliedAt?: string;
  offered_price?: number;

  task?: { 
    title: string; 
    description?: string;
    category?: string; 
    type?: string;
    requester?: {
      fullName: string;
      email: string;
    };
  };
  performer?: { fullName: string; email: string; isTopPerformer?: boolean };
}

interface PaginatedApplications {
  data: Application[];
  total: number;
  page: number;
}

export default function AdminApplicationsPage() {
  const [applications, setApplications] = useState<PaginatedApplications | null>(null);
  const [selectedApplication, setSelectedApplication] =
  useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [realtimeTick, setRealtimeTick] = useState(0);
  const [isRealtimeConnected, setIsRealtimeConnected] = useState(false);
  const LIMIT = 15;

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        const data = await adminService.getApplications({ page, limit: LIMIT });
        console.log("FULL RESPONSE:", data);
        console.log("DATA:", data.data);
        console.log("APPLICATIONS:", data.data?.data);
        setApplications(data);
        setError(null);
      } catch (err) {
        setError("Failed to fetch applications");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, [page, realtimeTick]);

  useEffect(() => {
    const socket = getSocket();

    const handleApplicationsUpdated = () => {
      setRealtimeTick((value) => value + 1);
    };

    const handleConnect = () => setIsRealtimeConnected(true);
    const handleDisconnect = () => setIsRealtimeConnected(false);

    setIsRealtimeConnected(socket.connected);
    socket.on("applications:updated", handleApplicationsUpdated);
    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);

    return () => {
      socket.off("applications:updated", handleApplicationsUpdated);
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
    };
  }, []);

  useEffect(() => {
    if (!selectedApplication || !applications?.data?.length) return;

    const updatedApplication = applications.data.find(
      (item) => item.id === selectedApplication.id,
    );

    if (updatedApplication) {
      setSelectedApplication(updatedApplication);
    }
  }, [applications, selectedApplication]);

  const getStatusStyle = (status?: string) => {
    switch (status) {
      case "ACCEPTED": return "bg-green-100 text-green-700";
      case "REJECTED": return "bg-red-100 text-red-600";
      case "PENDING":  return "bg-orange-100 text-orange-600";
      default:         return "bg-slate-100 text-slate-500";
    }
  };

  const getInitials = (name?: string, id?: number) => {
    if (name) return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
    return `U${id ?? "?"}`;
  };

  const total = applications?.total ?? 0;
  const pendingCount = applications?.data?.filter((a) => a.status === "PENDING")?.length ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / LIMIT));

  const handleAccept = async (id: number) => {
    try {

      alert(`Accepting application ${id}`);
      
      setSelectedApplication(null);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen space-y-8 max-w-[1400px] mx-auto">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
            Applications Monitor
          </h1>
          <p className="text-slate-500 text-sm font-medium max-w-md leading-relaxed">
            Review and curate incoming requests from performers. Ensure
            high-quality matches for the TaskExchange community.
          </p>
        </div>

        {/* Live Activity */}
        <div className="flex items-center gap-3 flex-shrink-0 self-start mt-1">
          <div className="flex -space-x-2">
            {["A", "B", "C"].map((l, i) => (
              <div
                key={i}
                className="w-9 h-9 rounded-full bg-gradient-to-br from-slate-300 to-slate-400 border-2 border-white flex items-center justify-center text-xs font-bold text-white shadow-sm"
              >
                {l}
              </div>
            ))}
            <div className="w-9 h-9 rounded-full bg-blue-600 border-2 border-white flex items-center justify-center text-xs font-bold text-white shadow-sm">
              +{Math.max(0, total - 3)}
            </div>
          </div>
          <div>
            <p className="text-sm font-extrabold text-blue-600 leading-none">
              {isRealtimeConnected ? "Live Activity" : "Syncing..."}
            </p>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              {pendingCount} new today
            </p>
          </div>
        </div>
      </div>

      {/* ── Stats Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {/* Total Pending */}
        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-slate-400 mb-3">
            Total Pending
          </p>
          <p className="text-5xl font-extrabold text-slate-900 tracking-tighter">
            {pendingCount}
          </p>
          <p className="text-orange-500 text-sm font-bold mt-3 flex items-center gap-1">
            <span className="text-base">↗</span>
            14% increase
          </p>
        </div>

        {/* Avg. Response */}
        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-slate-400 mb-3">
            Avg. Response
          </p>
          <p className="text-5xl font-extrabold text-slate-900 tracking-tighter">
            2.4h
          </p>
          <p className="text-blue-600 text-sm font-bold mt-3 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            System Target: 4h
          </p>
        </div>

        {/* Urgent Review */}
        <div className="bg-[#0052CC] rounded-[2rem] shadow-xl p-8 text-white relative overflow-hidden">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-blue-200 mb-3">
            High Priority
          </p>
          <p className="text-2xl font-extrabold tracking-tight leading-tight">
            Urgent Review Needed
          </p>
          <p className="text-blue-100/80 text-sm font-medium mt-3 leading-relaxed">
            {pendingCount > 0
              ? `${pendingCount} application${pendingCount > 1 ? "s" : ""} require immediate attention from a senior admin.`
              : "All applications are up to date. Great work!"}
          </p>
          <div className="absolute bottom-5 right-5 opacity-20">
            <Zap className="w-16 h-16 text-white" />
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

      {/* ── Active Applications Table ── */}
      {!loading && (
        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
          {/* Table Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-8 py-6 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">
                Active Applications
              </h2>
              <p className="text-xs text-slate-400 font-semibold mt-0.5">
                Monitoring real-time performer requests
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button className="px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs font-extrabold text-slate-600 flex items-center gap-2 hover:bg-slate-100 transition-colors">
                <SlidersHorizontal className="w-3.5 h-3.5" />
                Filter
              </button>
              <button className="px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs font-extrabold text-slate-600 flex items-center gap-2 hover:bg-slate-100 transition-colors">
                <Download className="w-3.5 h-3.5" />
                Export
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  {["Task Details", "Performer", "Offered Price", "Status", "Action"].map((h) => (
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
                {(applications?.data?.length ?? 0) > 0 ? (
                  applications?.data?.map((app) => (
                    <tr
                      key={app.id}
                      className="hover:bg-slate-50/30 transition-colors group"
                    >
                      {/* Task Details */}
                      <td className="px-8 py-6">
                        <p className="text-sm font-extrabold text-slate-900 leading-snug">
                          {app.task?.title || `Task #${app.taskId ?? app.id}`}
                        </p>
                        <p className="text-xs text-slate-400 font-medium mt-0.5">
                          {app.task?.category
                            ? `${app.task.category} • ${app.task.type || "Fixed Price"}`
                            : `ID: APP-${app.id}`}
                        </p>
                      </td>

                      {/* Performer */}
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-200 to-slate-400 flex items-center justify-center text-xs font-extrabold text-white flex-shrink-0 border border-slate-100 shadow-sm">
                            {getInitials(app.performer?.fullName, app.userId)}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-extrabold text-slate-900 truncate">
                              {app.performer?.fullName || `User #${app.userId ?? app.id}`}
                            </p>
                            {app.performer?.isTopPerformer && (
                              <span className="inline-block mt-0.5 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-100 text-blue-700 uppercase tracking-wider">
                                Top Performer
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Offered Price */}
                      <td className="px-8 py-6">
                        <span className="text-base font-extrabold text-blue-600 tabular-nums">
                          {app.offered_price != null
                            ? `$${app.offered_price.toFixed(2)}`
                            : "—"}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-8 py-6">
                        <span
                          className={`px-3 py-1.5 rounded-full text-[11px] font-extrabold uppercase tracking-wider ${getStatusStyle(app.status)}`}
                        >
                          {app.status || "PENDING"}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="px-8 py-6">
                        <button
                          className="p-2.5 rounded-xl text-blue-500 hover:bg-blue-50 transition-colors"
                          title="View application"
                          onClick={() => setSelectedApplication(app)}
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-8 py-16 text-center">
                      <FileText className="w-12 h-12 text-slate-200 mx-auto mb-3" />
                      <p className="text-slate-400 font-semibold text-sm">
                        No applications to display
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
              Showing 1 to {applications?.data?.length ?? 0} of {total} applications
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
                disabled={page >= totalPages}
                className="w-9 h-9 rounded-xl border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-white disabled:opacity-40 transition-all"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
      {/* ── Application Details Modal */}
   {selectedApplication && (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
    <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-gray-100 overflow-hidden transform transition-all">
      
      {/* Header */}
      <div className="px-6 pt-6 pb-4 border-b border-gray-100">
        <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
          Application Details
        </span>
        <h2 className="text-2xl font-bold text-gray-800 mt-1">
          {selectedApplication.task?.title}
        </h2>
      </div>

      {/* Body Content */}
      <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
        
        {/* Description */}
        {selectedApplication.task?.description && (
          <div className="space-y-1">
            <h4 className="text-sm font-semibold text-gray-500">Description</h4>
            <p className="text-gray-600 leading-relaxed text-sm">
              {selectedApplication.task?.description}
            </p>
          </div>
        )}

        <hr className="border-gray-100" />

        {/* Metadata Grid */}
        <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-sm">
          <div>
            <span className="block text-xs font-medium text-gray-400 uppercase">Budget</span>
            <span className="font-semibold text-gray-900 text-base">
              ${selectedApplication.offered_price}
            </span>
          </div>

          <div>
            <span className="block text-xs font-medium text-gray-400 uppercase">Status</span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 capitalize mt-1">
              {selectedApplication.status}
            </span>
          </div>

          <div className="col-span-2 sm:col-span-1">
            <span className="block text-xs font-medium text-gray-400 uppercase">Requester</span>
            <span className="font-medium text-gray-800 block">
              {selectedApplication.task?.requester?.fullName}
            </span>
            <span className="text-xs text-gray-500 break-all">
              {selectedApplication.task?.requester?.email}
            </span>
          </div>

          <div className="col-span-2 sm:col-span-1">
            <span className="block text-xs font-medium text-gray-400 uppercase">Performer</span>
            <span className="font-medium text-gray-800 block">
              {selectedApplication.performer?.fullName}
            </span>
            <span className="text-xs text-gray-500 break-all">
              {selectedApplication.performer?.email}
            </span>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="bg-gray-50 px-6 py-4 flex justify-end border-t border-gray-100">
        <button
          onClick={() => setSelectedApplication(null)}
          className="bg-white hover:bg-gray-50 text-gray-700 font-medium px-5 py-2.5 rounded-xl border border-gray-300 shadow-sm transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        >
          Close
        </button>
      </div>

    </div>
  </div>
)}
      
    </div>
    
  );
}
