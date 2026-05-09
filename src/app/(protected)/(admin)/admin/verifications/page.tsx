"use client";

import { useEffect, useState } from "react";
import { adminService } from "@/services/adminService";
import {
  CheckCircle,
  ShieldCheck,
  Clock,
  Check,
  X,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Download,
} from "lucide-react";

interface Verification {
  id: number;
  userId?: number;
  status: string;
  user?: { email: string; fullName: string };
  createdAt?: string;
}

interface PaginatedVerifications {
  data: Verification[];
  total: number;
  page: number;
}

export default function AdminVerificationsPage() {
  const [verifications, setVerifications] = useState<PaginatedVerifications | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [approveLoading, setApproveLoading] = useState<number | null>(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchVerifications = async () => {
      try {
        setLoading(true);
        const data = await adminService.getVerifications({ page, limit: 10 });
        setVerifications(data);
        setError(null);
      } catch (err) {
        setError("Failed to fetch verifications");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchVerifications();
  }, [page]);

  const handleApprove = async (verificationId: number) => {
    try {
      setApproveLoading(verificationId);
      await adminService.approveVerification(verificationId);
      setVerifications((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          data: prev.data.map((v) =>
            v.id === verificationId ? { ...v, status: "APPROVED" } : v
          ),
        };
      });
    } catch (err) {
      alert("Failed to approve verification");
      console.error(err);
    } finally {
      setApproveLoading(null);
    }
  };

  const pendingVerifications = verifications?.data.filter((v) => v.status === "PENDING") || [];
  const approvedVerifications = verifications?.data.filter((v) => v.status === "APPROVED") || [];
  const rejectedVerifications = verifications?.data.filter((v) => v.status === "REJECTED") || [];

  const getInitials = (name?: string, email?: string) => {
    if (name) return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
    if (email) return email.slice(0, 2).toUpperCase();
    return "??";
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "APPROVED": return "bg-green-100 text-green-700";
      case "REJECTED": return "bg-red-100 text-red-600";
      default: return "bg-orange-100 text-orange-600";
    }
  };

  return (
    <div className="min-h-screen space-y-8 max-w-[1400px] mx-auto">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
            Identity Verifications
          </h1>
          <p className="text-slate-500 text-sm font-medium max-w-md leading-relaxed">
            Review and manage community trust profiles. Ensure all submitted
            documents meet the platform&apos;s security standards.
          </p>
        </div>

        {/* Pending indicator */}
        {pendingVerifications.length > 0 && (
          <div className="flex items-center gap-2 flex-shrink-0 self-start mt-1">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500" />
            </span>
            <span className="text-sm font-bold text-slate-700">
              {pendingVerifications.length} Pending Reviews
            </span>
          </div>
        )}
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
        <div className="flex items-center justify-center h-80">
          <div className="animate-spin rounded-full h-14 w-14 border-4 border-blue-100 border-t-blue-600" />
        </div>
      )}

      {!loading && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── LEFT: Verification Queue ── */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
              {/* Queue Header */}
              <div className="flex items-center justify-between px-8 py-6 border-b border-slate-100">
                <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">
                  Verification Queue
                </h2>
                <div className="flex items-center gap-2">
                  <button className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-extrabold uppercase tracking-wider shadow-sm hover:bg-blue-700 transition-colors">
                    All Data
                  </button>
                  <button className="px-4 py-2 rounded-xl bg-slate-100 text-slate-600 text-xs font-extrabold uppercase tracking-wider hover:bg-slate-200 transition-colors flex items-center gap-2">
                    <Download className="w-3.5 h-3.5" />
                    Export CSV
                  </button>
                </div>
              </div>

              {/* Queue Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50 border-b border-slate-100">
                      {["User", "ID Card", "Selfie", "Status", "Actions"].map((h) => (
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
                    {verifications && verifications.data.length > 0 ? (
                      verifications.data.map((v, index) => {
                        const isPending = v.status === "PENDING";
                        const initials = getInitials(v.user?.fullName, v.user?.email);
                        const isFirst = index === 0;
                        return (
                          <tr
                            key={v.id}
                            className={`hover:bg-slate-50/30 transition-colors ${isFirst ? "bg-blue-50/20" : ""}`}
                          >
                            {/* User */}
                            <td className="px-8 py-5">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xs font-extrabold flex-shrink-0 shadow-sm">
                                  {initials}
                                </div>
                                <div className="min-w-0">
                                  <p className="text-sm font-extrabold text-slate-900 truncate">
                                    {v.user?.fullName || "Unknown"}
                                  </p>
                                  <p className="text-xs text-slate-500 font-medium truncate">
                                    {v.user?.email || "—"}
                                  </p>
                                </div>
                              </div>
                            </td>

                            {/* ID Card placeholder */}
                            <td className="px-8 py-5">
                              <div className="w-20 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden">
                                <ShieldCheck className="w-5 h-5 text-slate-300" />
                              </div>
                            </td>

                            {/* Selfie placeholder */}
                            <td className="px-8 py-5">
                              <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden">
                                <span className="text-xs font-extrabold text-slate-400">
                                  {initials}
                                </span>
                              </div>
                            </td>

                            {/* Status */}
                            <td className="px-8 py-5">
                              <span className={`px-3 py-1.5 rounded-full text-[11px] font-extrabold uppercase tracking-wider ${getStatusStyle(v.status)}`}>
                                {v.status === "APPROVED" ? "Approved" : v.status === "REJECTED" ? "Rejected" : "Pending"}
                              </span>
                            </td>

                            {/* Actions */}
                            <td className="px-8 py-5">
                              {isPending ? (
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => handleApprove(v.id)}
                                    disabled={approveLoading === v.id}
                                    className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition-colors disabled:opacity-50 shadow-sm"
                                    title="Approve"
                                  >
                                    {approveLoading === v.id ? (
                                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                                    ) : (
                                      <Check className="w-4 h-4" />
                                    )}
                                  </button>
                                  <button
                                    className="w-9 h-9 rounded-xl bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors shadow-sm"
                                    title="Reject"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </div>
                              ) : (
                                <button className="w-9 h-9 rounded-xl hover:bg-slate-100 flex items-center justify-center text-slate-400 transition-colors">
                                  <MoreVertical className="w-4 h-4" />
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={5} className="px-8 py-16 text-center">
                          <ShieldCheck className="w-12 h-12 text-slate-200 mx-auto mb-3" />
                          <p className="text-slate-400 font-semibold text-sm">
                            No verifications to display
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
                  Showing 1-{verifications?.data.length || 0} of{" "}
                  {verifications?.total || 0} results
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
                        page === p
                          ? "bg-blue-600 text-white shadow-md"
                          : "border border-slate-200 text-slate-600 hover:bg-white"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                  <button
                    onClick={() => setPage(page + 1)}
                    className="w-9 h-9 rounded-xl border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-white transition-all"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ── RIGHT: Sidebar ── */}
          <div className="space-y-5">
            {/* Recent Activity */}
            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-7">
              <h3 className="text-[11px] font-extrabold text-slate-400 uppercase tracking-[0.2em] mb-6">
                Recent Activity
              </h3>
              <div className="space-y-5">
                {approvedVerifications.slice(0, 2).map((v) => (
                  <div key={v.id} className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center text-xs font-extrabold text-slate-600 flex-shrink-0">
                      {getInitials(v.user?.fullName, v.user?.email)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-900 leading-snug">
                        <span className="font-extrabold">{v.user?.fullName || "User"}</span>{" "}
                        was approved by Admin
                      </p>
                      <div className="flex items-center gap-1.5 mt-1">
                        <div className="w-2 h-2 rounded-full bg-green-500" />
                        <p className="text-xs text-slate-400 font-medium">
                          {v.createdAt
                            ? new Date(v.createdAt).toLocaleDateString()
                            : "recently"}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                {rejectedVerifications.slice(0, 1).map((v) => (
                  <div key={v.id} className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-extrabold text-slate-400">
                        {getInitials(v.user?.fullName, v.user?.email)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-900 leading-snug">
                        <span className="font-extrabold">{v.user?.fullName || "User"}</span>{" "}
                        was rejected
                      </p>
                      <div className="flex items-center gap-1.5 mt-1">
                        <div className="w-2 h-2 rounded-full bg-red-500" />
                        <p className="text-xs text-slate-400 font-medium">
                          {v.createdAt
                            ? new Date(v.createdAt).toLocaleDateString()
                            : "recently"}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                {approvedVerifications.length === 0 && rejectedVerifications.length === 0 && (
                  <p className="text-sm text-slate-400 font-medium text-center py-4">
                    No recent activity
                  </p>
                )}
              </div>

              {/* Summary cluster */}
              {approvedVerifications.length > 0 && (
                <div className="mt-6 pt-5 border-t border-slate-100">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex -space-x-2">
                      {approvedVerifications.slice(0, 3).map((v) => (
                        <div
                          key={v.id}
                          className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-300 to-blue-500 border-2 border-white flex items-center justify-center text-[10px] font-extrabold text-white"
                        >
                          {getInitials(v.user?.fullName, v.user?.email)}
                        </div>
                      ))}
                      {approvedVerifications.length > 3 && (
                        <div className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-[10px] font-extrabold text-slate-600">
                          +{approvedVerifications.length - 3}
                        </div>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 font-semibold">
                    {approvedVerifications.length} verifications successfully processed
                  </p>
                </div>
              )}
            </div>

            {/* Trust & Safety Guidelines */}
            <div className="bg-[#0052CC] rounded-[2rem] p-7 text-white shadow-xl">
              <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center mb-5 border border-white/10">
                <ShieldCheck className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-extrabold tracking-tight mb-3">
                Trust &amp; Safety Guidelines
              </h3>
              <p className="text-blue-100 text-sm font-medium leading-relaxed opacity-80 mb-6">
                Ensure the document photo matches the live selfie. Check for
                valid expiration dates and clear text rendering.
              </p>
              <button className="w-full py-3 rounded-2xl bg-white/15 hover:bg-white/25 text-white text-sm font-extrabold uppercase tracking-widest border border-white/10 transition-colors">
                Review Policy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
