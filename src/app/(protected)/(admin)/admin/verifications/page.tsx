"use client";

import { useEffect, useState, useRef } from "react";
import { adminService } from "@/services/adminService";
import {
  ShieldCheck,
  Check,
  X,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Download,
  RotateCcw,
  Eye,
  Maximize2,
} from "lucide-react";

interface Verification {
  id: number;
  id_card_url?: string;
  selfie_url?: string;
  status: string;
  rejection_reason?: string | null;
  reviewed_by?: number;
  reviewed_at?: string;
  created_at?: string;
  updated_at?: string;
  user?: any;
}

interface PaginatedVerifications {
  data: Verification[];
  meta: {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  };
}

export default function AdminVerificationsPage() {
  const [verifications, setVerifications] = useState<PaginatedVerifications | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [approveLoading, setApproveLoading] = useState<number | null>(null);
  const [rejectLoading, setRejectLoading] = useState<number | null>(null);
  const [resetLoading, setResetLoading] = useState<number | null>(null);
  const [exportLoading, setExportLoading] = useState(false);
  const [page, setPage] = useState(1);

  // ── Upgraded Multi-Image Context State ──
  const [activeInspection, setActiveInspection] = useState<Verification | null>(null);

  // Tracks which rows have their 3-dots actions menu visible
  const [activeMenuId, setActiveMenuId] = useState<number | null>(null);
  const menuContainerRef = useRef<HTMLTableSectionElement | null>(null);

  const [brokenCardImages, setBrokenCardImages] = useState<Record<number, boolean>>({});
  const [brokenSelfieImages, setBrokenSelfieImages] = useState<Record<number, boolean>>({});

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

  useEffect(() => {
    fetchVerifications();
  }, [page]);

  // Handle click away and escape hotkey patterns
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      // Logic Fix: Target the parent containment container to prevent individual ref overriding loops
      if (menuContainerRef.current && !menuContainerRef.current.contains(event.target as Node)) {
        setActiveMenuId(null);
      }
    }
    
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setActiveInspection(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleExportCSV = async () => {
    try {
      setExportLoading(true);
      await adminService.exportVerificationsToCsv();
    } catch (err) {
      alert("Failed to export verification records spreadsheet file.");
      console.error(err);
    } finally {
      setExportLoading(false);
    }
  };

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
      // Synchronize changes back to modal view if currently open
      if (activeInspection?.id === verificationId) {
        setActiveInspection(prev => prev ? { ...prev, status: "APPROVED" } : null);
      }
    } catch (err) {
      alert("Failed to approve verification");
      console.error(err);
    } finally {
      setApproveLoading(null);
    }
  };

  const handleReject = async (verificationId: number) => {
    const reason = prompt("Enter a reason for rejection (required):");
    
    // Logic Fix: Strict checking for empty text fields or cancellation actions
    if (reason === null) return; 
    if (reason.trim() === "") {
      alert("Rejection reason cannot be blank. Action aborted.");
      return;
    }
    
    try {
      setRejectLoading(verificationId);
      await adminService.rejectVerification(verificationId, { reason: reason.trim() });
      setVerifications((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          data: prev.data.map((v) =>
            v.id === verificationId ? { ...v, status: "REJECTED", rejection_reason: reason.trim() } : v
          ),
        };
      });
      // Synchronize changes back to modal view if currently open
      if (activeInspection?.id === verificationId) {
        setActiveInspection(prev => prev ? { ...prev, status: "REJECTED", rejection_reason: reason.trim() } : null);
      }
    } catch (err) {
      alert("Failed to reject verification");
      console.error(err);
    } finally {
      setRejectLoading(null);
    }
  };

  const handleResetToPending = async (verificationId: number) => {
    if (!confirm("Are you sure you want to revert this identity verification back to PENDING status? This updates user roles immediately.")) {
      return;
    }
    try {
      setResetLoading(verificationId);
      setActiveMenuId(null);
      await adminService.resetVerificationToPending(verificationId);
      
      setVerifications((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          data: prev.data.map((v) =>
            v.id === verificationId ? { ...v, status: "PENDING", rejection_reason: null } : v
          ),
        };
      });
      // Synchronize changes back to modal view if currently open
      if (activeInspection?.id === verificationId) {
        setActiveInspection(prev => prev ? { ...prev, status: "PENDING", rejection_reason: null } : null);
      }
    } catch (err) {
      alert("Failed to reset verification record back to pending status.");
      console.error(err);
    } finally {
      setResetLoading(null);
    }
  };

  const getUserName = (v: Verification): string => {
    if (!v.user) return `User #${v.id || "?"}`;
    return v.user.fullName || v.user.FullName || v.user.fullname || v.user.name || `User #${v.user.id || v.id}`;
  };

  const getUserEmail = (v: Verification): string => {
    if (!v.user) return "no-email@associated.com";
    return v.user.email || v.user.Email || "no-email@associated.com";
  };

  const getInitials = (v: Verification) => {
    const name = getUserName(v);
    if (!name) return "??";
    if (name.startsWith("User #")) return `U${name.replace("User #", "")}`;

    return name
      .split(" ")
      .filter(Boolean)
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const pendingPageCount = verifications?.data?.filter((v) => v.status === "PENDING").length || 0;
  const approvedVerifications = verifications?.data?.filter((v) => v.status === "APPROVED") || [];
  const rejectedVerifications = verifications?.data?.filter((v) => v.status === "REJECTED") || [];

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "APPROVED": return "bg-green-100 text-green-700";
      case "REJECTED": return "bg-red-100 text-red-600";
      default: return "bg-orange-100 text-orange-600";
    }
  };

  // Safe arithmetic for paginated item metrics
  const totalItems = verifications?.meta?.totalItems || 0;
  const itemsPerPage = verifications?.meta?.itemsPerPage || 10;
  const currentCountOnPage = verifications?.data?.length || 0;
  
  const fromRange = totalItems === 0 ? 0 : (page - 1) * itemsPerPage + 1;
  const toRange = (page - 1) * itemsPerPage + currentCountOnPage;

  const totalPages = verifications?.meta?.totalPages || 1;
  const pageNumbers = Array.from({ length: Math.max(1, totalPages) }, (_, i) => i + 1);

  return (
    <div className="min-h-screen space-y-8 max-w-[1400px] mx-auto p-4 sm:p-6 lg:p-8">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
            Identity Verifications
          </h1>
          <p className="text-slate-500 text-sm font-medium max-w-md leading-relaxed">
            Review and manage community trust profiles. Click on any document image placeholder to inspect details closely.
          </p>
        </div>

        {pendingPageCount > 0 && (
          <div className="flex items-center gap-2 flex-shrink-0 self-start mt-1 bg-orange-50 border border-orange-100 px-3 py-1.5 rounded-xl">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500" />
            </span>
            <span className="text-xs font-bold text-orange-800">
              {pendingPageCount} Pending On This Page
            </span>
          </div>
        )}
      </div>

      {/* ── Error Display ── */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-red-700 text-sm font-medium flex items-center gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          {error}
        </div>
      )}

      {/* ── Loading Spinner ── */}
      {loading && (
        <div className="flex items-center justify-center h-80">
          <div className="animate-spin rounded-full h-14 w-14 border-4 border-blue-100 border-t-blue-600" />
        </div>
      )}

      {!loading && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ── LEFT SIDE: Table Queue ── */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-6 py-5 sm:px-8 sm:py-6 border-b border-slate-100">
                <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">
                  Verification Queue
                </h2>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={fetchVerifications}
                    className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-extrabold uppercase tracking-wider shadow-sm hover:bg-blue-700 transition-colors"
                  >
                    All Data
                  </button>
                  <button 
                    onClick={handleExportCSV}
                    disabled={exportLoading}
                    className="px-4 py-2 rounded-xl bg-slate-100 text-slate-600 text-xs font-extrabold uppercase tracking-wider hover:bg-slate-200 transition-colors flex items-center gap-2 disabled:opacity-50"
                  >
                    <Download className="w-3.5 h-3.5" />
                    {exportLoading ? "Exporting..." : "Export CSV"}
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50 border-b border-slate-100">
                      {["User", "ID Card", "Selfie", "Status", "Actions"].map((h) => (
                        <th
                          key={h}
                          className="px-6 py-4 sm:px-8 text-[11px] font-extrabold text-slate-400 uppercase tracking-[0.15em]"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  {/* Container Ref attached to parent node scope instead of inner map cycles */}
                  <tbody ref={menuContainerRef} className="divide-y divide-slate-50">
                    {verifications && verifications.data?.length > 0 ? (
                      verifications.data.map((v, index) => {
                        const isPending = v.status === "PENDING";
                        const isFirst = index === 0;
                        const uName = getUserName(v);
                        
                        const cardImgSrc = v.id_card_url 
                          ? (v.id_card_url.startsWith('http') ? v.id_card_url : `http://localhost:3001/${v.id_card_url}`) 
                          : null;

                        const selfieImgSrc = v.selfie_url 
                          ? (v.selfie_url.startsWith('http') ? v.selfie_url : `http://localhost:3001/${v.selfie_url}`) 
                          : null;

                        const isCardBroken = !cardImgSrc || brokenCardImages[v.id];
                        const isSelfieBroken = !selfieImgSrc || brokenSelfieImages[v.id];

                        return (
                          <tr
                            key={v.id}
                            className={`hover:bg-slate-50/30 transition-colors ${isFirst && isPending ? "bg-blue-50/10" : ""}`}
                          >
                            <td className="px-6 py-4 sm:px-8">
                              <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-blue-600 text-xs font-bold flex-shrink-0 shadow-sm border border-slate-200/40">
                                  {getInitials(v)}
                                </div>
                                <div className="min-w-0 space-y-0.5">
                                  <p className="text-sm font-bold text-slate-900 truncate max-w-[140px] sm:max-w-[200px]">
                                    {uName}
                                  </p>
                                  <p className="text-xs text-slate-400 font-medium truncate max-w-[140px] sm:max-w-[200px]">
                                    {getUserEmail(v)}
                                  </p>
                                </div>
                              </div>
                            </td>

                            {/* ID CARD CELL */}
                            <td className="px-6 py-4 sm:px-8">
                              {!isCardBroken ? (
                                <div 
                                  onClick={() => setActiveInspection(v)}
                                  className="w-20 h-12 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden shadow-sm group relative flex items-center justify-center cursor-zoom-in"
                                >
                                  <img 
                                    src={cardImgSrc!} 
                                    alt="ID Front" 
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                                    onError={() => {
                                      setBrokenCardImages(prev => ({ ...prev, [v.id]: true }));
                                    }}
                                  />
                                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-200">
                                    <Maximize2 className="w-4 h-4 text-white" />
                                  </div>
                                </div>
                              ) : (
                                <div className="w-20 h-12 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center justify-center" title="Image unavailable">
                                  <ShieldCheck className="w-5 h-5 text-slate-300" />
                                </div>
                              )}
                            </td>

                            {/* SELFIE CELL */}
                            <td className="px-6 py-4 sm:px-8">
                              {!isSelfieBroken ? (
                                <div 
                                  onClick={() => setActiveInspection(v)}
                                  className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 overflow-hidden shadow-sm group relative flex items-center justify-center cursor-zoom-in"
                                >
                                  <img 
                                    src={selfieImgSrc!} 
                                    alt="Selfie Check" 
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                                    onError={() => {
                                      setBrokenSelfieImages(prev => ({ ...prev, [v.id]: true }));
                                    }}
                                  />
                                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-200 rounded-full">
                                    <Eye className="w-3.5 h-3.5 text-white" />
                                  </div>
                                </div>
                              ) : (
                                <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-200/60 flex items-center justify-center" title="Selfie unavailable">
                                  <span className="text-[10px] font-extrabold text-slate-400 select-none">N/A</span>
                                </div>
                              )}
                            </td>

                            <td className="px-6 py-4 sm:px-8">
                              <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${getStatusStyle(v.status)}`}>
                                {v.status === "APPROVED" ? "Approved" : v.status === "REJECTED" ? "Rejected" : "Pending"}
                              </span>
                            </td>

                            <td className="px-6 py-4 sm:px-8">
                              {isPending ? (
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => handleApprove(v.id)}
                                    disabled={approveLoading === v.id || rejectLoading === v.id}
                                    className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition-colors disabled:opacity-50 shadow-sm"
                                    title="Approve"
                                  >
                                    {approveLoading === v.id ? (
                                      <div className="animate-spin rounded-full h-3 w-3 border-2 border-white border-t-transparent" />
                                    ) : (
                                      <Check className="w-3.5 h-3.5" />
                                    )}
                                  </button>
                                  <button
                                    onClick={() => handleReject(v.id)}
                                    disabled={approveLoading === v.id || rejectLoading === v.id}
                                    className="w-8 h-8 rounded-xl bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors disabled:opacity-50 shadow-sm"
                                    title="Reject"
                                  >
                                    {rejectLoading === v.id ? (
                                      <div className="animate-spin rounded-full h-3 w-3 border-2 border-white border-t-transparent" />
                                    ) : (
                                      <X className="w-3.5 h-3.5" />
                                    )}
                                  </button>
                                </div>
                              ) : (
                                <div className="relative inline-block text-left">
                                  <button 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setActiveMenuId(activeMenuId === v.id ? null : v.id);
                                    }}
                                    disabled={resetLoading === v.id}
                                    className="w-8 h-8 rounded-xl hover:bg-slate-100 flex items-center justify-center text-slate-400 transition-colors focus:bg-slate-100"
                                  >
                                    {resetLoading === v.id ? (
                                      <div className="animate-spin rounded-full h-3 w-3 border-2 border-slate-400 border-t-transparent" />
                                    ) : (
                                      <MoreVertical className="w-4 h-4" />
                                    )}
                                  </button>
                                  
                                  {activeMenuId === v.id && (
                                    <div 
                                      className="absolute right-0 mt-1 w-44 rounded-xl bg-white border border-slate-100 shadow-xl py-1.5 z-50 ring-1 ring-black ring-opacity-5 animate-in fade-in slide-in-from-top-1 duration-100"
                                    >
                                      <button
                                        onClick={() => handleResetToPending(v.id)}
                                        className="w-full text-left px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition-colors"
                                      >
                                        <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                                        Reset to Pending
                                      </button>
                                    </div>
                                  )}
                                </div>
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
                            No verifications found
                          </p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination controls */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 sm:px-8 border-t border-slate-100 bg-slate-50/40">
                <p className="text-xs text-slate-500 font-semibold order-2 sm:order-1">
                  Showing {fromRange}-{toRange} of {totalItems} results
                </p>
                <div className="flex items-center gap-1 order-1 sm:order-2">
                  <button
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page === 1}
                    className="w-8 h-8 rounded-xl border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-white disabled:opacity-40 transition-all"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  {pageNumbers.map((p) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-8 h-8 rounded-xl text-xs font-extrabold transition-all ${
                        page === p
                          ? "bg-blue-600 text-white shadow-md"
                          : "border border-slate-200 text-slate-600 hover:bg-white"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                  <button
                    onClick={() => setPage(Math.min(totalPages, page + 1))}
                    disabled={page === totalPages}
                    className="w-8 h-8 rounded-xl border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-white disabled:opacity-40 transition-all"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ── RIGHT SIDE: Sidebar Widgets ── */}
          <div className="space-y-5">
            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6 sm:p-7">
              <h3 className="text-[11px] font-extrabold text-slate-400 uppercase tracking-[0.2em] mb-6">
                Activity On This Page
              </h3>
              <div className="space-y-5">
                {approvedVerifications.slice(0, 2).map((v) => (
                  <div key={v.id} className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center text-[10px] font-extrabold text-slate-600 flex-shrink-0">
                      {getInitials(v)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-900 leading-snug">
                        <span className="font-extrabold">{getUserName(v)}</span> was approved by Admin
                      </p>
                      <div className="flex items-center gap-1.5 mt-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                        <p className="text-[10px] text-slate-400 font-medium">
                          {v.created_at ? new Date(v.created_at).toLocaleDateString() : "recently"}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                {rejectedVerifications.slice(0, 1).map((v) => (
                  <div key={v.id} className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0 text-[10px] text-slate-400 font-extrabold">
                      {getInitials(v)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-900 leading-snug">
                        <span className="font-extrabold">{getUserName(v)}</span> was rejected
                      </p>
                      <div className="flex items-center gap-1.5 mt-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                        <p className="text-[10px] text-slate-400 font-medium">
                          {v.created_at ? new Date(v.created_at).toLocaleDateString() : "recently"}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                {approvedVerifications.length === 0 && rejectedVerifications.length === 0 && (
                  <p className="text-xs text-slate-400 font-medium text-center py-4">
                    No recent changes on this page
                  </p>
                )}
              </div>
            </div>

            <div className="bg-[#0052CC] rounded-[2rem] p-6 sm:p-7 text-white shadow-xl">
              <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center mb-5 border border-white/10">
                <ShieldCheck className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-extrabold tracking-tight mb-3">
                Trust &amp; Safety Guidelines
              </h3>
              <p className="text-blue-100 text-xs font-medium leading-relaxed opacity-80 mb-6">
                Ensure the document photo matches the live selfie. Check for valid expiration dates and clear text rendering.
              </p>
              <button className="w-full py-3 rounded-2xl bg-white/15 hover:bg-white/25 text-white text-xs font-extrabold uppercase tracking-widest border border-white/10 transition-colors">
                Review Policy
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── UPGRADED GLORIFIED LIGHTBOX INSPECTION MODAL OVERLAY ── */}
      {activeInspection && (
        <div 
          onClick={() => setActiveInspection(null)}
          className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-[100] flex flex-col items-center justify-between p-4 sm:p-6 md:p-8 animate-in fade-in duration-200"
        >
          {/* Top Navbar Contextual Info */}
          <div className="w-full max-w-6xl flex items-center justify-between gap-4 text-white z-10 bg-slate-900/60 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/10">
            <div className="min-w-0">
              <h4 className="text-sm font-bold text-white truncate">
                Inspecting: {getUserName(activeInspection)}
              </h4>
              <p className="text-[11px] text-slate-400 font-medium truncate mt-0.5">
                {getUserEmail(activeInspection)}
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${getStatusStyle(activeInspection.status)}`}>
                {activeInspection.status}
              </span>
              <button 
                onClick={() => setActiveInspection(null)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 transition-colors text-white"
                title="Close Inspection View (Esc)"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Core Layout Area: Dual Image Comparison Workspace */}
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-6 my-auto items-center justify-center select-none animate-in zoom-in-95 duration-200"
          >
            {/* Box 1: ID Card Document File */}
            <div className="flex flex-col gap-2">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 px-1">
                Provided Identity Document
              </span>
              <div className="bg-slate-900 border border-white/5 rounded-2xl overflow-hidden p-2 shadow-2xl flex items-center justify-center aspect-[16/10]">
                {!brokenCardImages[activeInspection.id] && activeInspection.id_card_url ? (
                  <img 
                    src={activeInspection.id_card_url.startsWith('http') ? activeInspection.id_card_url : `http://localhost:3001/${activeInspection.id_card_url}`} 
                    alt="ID Document Target File" 
                    className="max-w-full max-h-full object-contain rounded-xl"
                  />
                ) : (
                  <div className="text-center p-6 space-y-2">
                    <ShieldCheck className="w-10 h-10 text-slate-700 mx-auto" />
                    <p className="text-xs text-slate-500 font-bold">Document Image Corrupted or Missing</p>
                  </div>
                )}
              </div>
            </div>

            {/* Box 2: Face Selfie Match Verification */}
            <div className="flex flex-col gap-2">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 px-1">
                Live Face Check Match
              </span>
              <div className="bg-slate-900 border border-white/5 rounded-2xl overflow-hidden p-2 shadow-2xl flex items-center justify-center aspect-[16/10]">
                {!brokenSelfieImages[activeInspection.id] && activeInspection.selfie_url ? (
                  <img 
                    src={activeInspection.selfie_url.startsWith('http') ? activeInspection.selfie_url : `http://localhost:3001/${activeInspection.selfie_url}`} 
                    alt="Live Face Check Match Target" 
                    className="max-w-full max-h-full object-contain rounded-xl"
                  />
                ) : (
                  <div className="text-center p-6 space-y-2">
                    <Eye className="w-10 h-10 text-slate-700 mx-auto" />
                    <p className="text-xs text-slate-500 font-bold">Selfie Check Image Corrupted or Missing</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Bottom Interactive Dashboard Menu Context */}
          <div className="w-full max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900/60 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/10 z-10">
            <div className="text-center sm:text-left">
              <p className="text-xs font-semibold text-slate-300">
                {activeInspection.status === "PENDING" 
                  ? "Awaiting your administrative baseline decision profile status override." 
                  : `Verification instance marked as ${activeInspection.status.toLowerCase()}.`}
              </p>
              {activeInspection.rejection_reason && (
                <p className="text-[11px] font-medium text-red-400 mt-1 max-w-md line-clamp-1">
                  Reason: {activeInspection.rejection_reason}
                </p>
              )}
            </div>
            {activeInspection.status === "PENDING" && (
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => handleReject(activeInspection.id)}
                  disabled={rejectLoading === activeInspection.id || approveLoading === activeInspection.id}
                  className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-xs font-bold transition-colors disabled:opacity-50"
                >
                  Reject File
                </button>
                <button
                  onClick={() => handleApprove(activeInspection.id)}
                  disabled={rejectLoading === activeInspection.id || approveLoading === activeInspection.id}
                  className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors disabled:opacity-50"
                >
                  Approve Verification
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}