"use client";

import { useEffect, useState } from "react";
import { adminService } from "@/services/adminService";
import {
  Users,
  Search,
  Eye,
  ArrowLeftRight,
  Ban,
  History,
  AlertCircle,
  CheckCircle2,
  XCircle,
  FileText,
  BarChart3,
  MapPin,
  TrendingUp,
  DollarSign,
  Briefcase
} from "lucide-react";

// Matches NestJS user entity and identityVerifications relation structure
interface IdentityVerification {
  id: number;
  status: "PENDING" | "APPROVED" | "REJECTED" | string;
}

interface User {
  id: number;
  email: string;
  fullName?: string;
  currentRole?: string;
  createdAt?: string;
  deletedAt?: string | null;
  status?: string;
  verificationStatus?: string;
  city?: string;
  country?: string;
  phoneNumber?: string;
  
  // Relations mapped directly from NestJS leftJoinAndSelect
  identityVerifications?: IdentityVerification[];
  
  // Explicit transaction metrics mapped dynamically below
  requesterStats?: {
    tasks_posted: number;
    total_spent: number | string;
  };
  performerStats?: {
    tasks_completed: number;
    total_earned: number | string;
  };
}

interface PaginatedUsers {
  data: User[];
  total: number;
  page: number;
  last_page: number;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<PaginatedUsers | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [modalTab, setModalTab] = useState<"profile" | "activity" | "location">("profile");
  
  const [roleFilter, setRoleFilter] = useState<"ALL" | "REQUESTER" | "PERFORMER" | "ADMIN">("ALL");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "ACTIVE" | "BANNED">("ALL");

  const fetchUsers = async (pageNum: number, search: string, role: string, status: string) => {
    try {
      setLoading(true);
      const data = await adminService.getUsers({
        page: pageNum,
        limit: 10,
        ...(search.trim() && { search: search.trim() }),
        ...(role !== "ALL" && { role }),
        ...(status !== "ALL" && { status }),
      });
      setUsers(data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch users matching specified filters");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(page, searchTerm, roleFilter, statusFilter);
  }, [page, searchTerm, roleFilter, statusFilter]);

  const handleRoleChange = (newRole: "ALL" | "REQUESTER" | "PERFORMER" | "ADMIN") => {
    setRoleFilter(newRole);
    setPage(1);
  };

  const handleStatusChange = (newStatus: "ALL" | "ACTIVE" | "BANNED") => {
    setStatusFilter(newStatus);
    setPage(1);
  };

  const toggleUserBanStatus = async (user: User) => {
    const isCurrentlyBanned = user.status?.toUpperCase() === "BANNED" || !!user.deletedAt;
    const promptMessage = isCurrentlyBanned 
      ? `Are you sure you want to lift restrictions and restore access for ${user.email}?`
      : `Are you sure you want to ban ${user.email}? This revokes platform privileges immediately.`;

    if (!confirm(promptMessage)) return;

    try {
      setActionLoading(user.id);
      if (isCurrentlyBanned) {
        await adminService.restoreUser(user.id);
      } else {
        await adminService.banUser(user.id);
      }
      
      setUsers((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          data: prev.data.map((u) => 
            u.id === user.id ? { 
              ...u, 
              status: isCurrentlyBanned ? "ACTIVE" : "BANNED",
              deletedAt: isCurrentlyBanned ? null : new Date().toISOString()
            } : u
          ),
        };
      });

      if (statusFilter !== "ALL") {
        fetchUsers(page, searchTerm, roleFilter, statusFilter);
      }
    } catch (err) {
      alert(`Operation encountered an issue modifying authorization tokens.`);
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  };

  const getRoleBadge = (role?: string) => {
    switch (role?.toUpperCase()) { 
      case "ADMIN":
        return "bg-blue-100 text-blue-700";
      case "PERFORMER":
        return "bg-orange-100 text-orange-700";
      default:
        return "bg-indigo-100 text-indigo-700";
    }
  };

  // Helper checking dynamic array structures returned from NestJS leftJoin queries
  const checkVerificationState = (user: User) => {
    if (user.currentRole?.toUpperCase() === "ADMIN") return "INTERNAL";
    
    const elements = user.identityVerifications || [];
    if (elements.some(v => v.status?.toUpperCase() === "APPROVED")) return "VERIFIED";
    if (elements.some(v => v.status?.toUpperCase() === "PENDING") || user.verificationStatus === "PENDING") return "PENDING";
    
    return "NONE";
  };

  const pendingCount = users?.data.filter((u) => checkVerificationState(u) === "PENDING").length ?? 0;
  const nonAdminUsers = users?.data.filter((u) => u.currentRole?.toUpperCase() !== "ADMIN") ?? [];

  return (
    <div className="min-h-screen space-y-8 max-w-7xl mx-auto px-4 py-8">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
            User Management
          </h1>
          <p className="text-slate-500 text-sm font-medium max-w-md leading-relaxed">
            Oversee the platform ecosystem. Manage roles, track statuses, and maintain community standards across all participants.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="flex -space-x-3">
            {nonAdminUsers.slice(0, 3).map((user) => (
              <div
                key={user.id}
                className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 border-2 border-white flex items-center justify-center text-xs font-bold text-slate-600 shadow-sm uppercase shrink-0"
              >
                {(user.fullName || user.email).charAt(0)}
              </div>
            ))}
            {users && users.total > 3 && (
              <div className="w-10 h-10 rounded-full bg-blue-600 border-2 border-white flex items-center justify-center text-xs font-bold text-white shadow-sm shrink-0">
                +{users.total - 3}
              </div>
            )}
          </div>
          <span className="text-sm font-semibold text-slate-600">
            Platform Members
          </span>
        </div>
      </div>

      {/* ── Filters ── */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1 bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search database globally by email or name..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-100 text-sm font-medium text-slate-700 placeholder:text-slate-400 outline-none focus:bg-white focus:border-blue-200 focus:ring-4 focus:ring-blue-500/5 transition-all"
            />
          </div>

          <div className="flex flex-col gap-4 text-xs font-extrabold uppercase tracking-widest text-slate-400">
            <div className="flex items-center gap-2">
              <span className="w-16 shrink-0 text-left">Role:</span>
              <div className="flex flex-wrap gap-2">
                {(["ALL", "REQUESTER", "PERFORMER", "ADMIN"] as const).map((r) => (
                  <button
                    key={r}
                    onClick={() => handleRoleChange(r)}
                    className={`px-4 py-1.5 rounded-full text-xs font-extrabold tracking-wider transition-all ${
                      roleFilter === r
                        ? "bg-blue-600 text-white shadow-md"
                        : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="w-16 shrink-0 text-left">Status:</span>
              <div className="flex flex-wrap gap-2">
                {(["ALL", "ACTIVE", "BANNED"] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => handleStatusChange(s)}
                    className={`px-4 py-1.5 rounded-full text-xs font-extrabold tracking-wider transition-all ${
                      statusFilter === s
                        ? "bg-slate-900 text-white shadow-md"
                        : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {pendingCount > 0 && (
          <div className="bg-orange-50 border border-orange-200 rounded-2xl p-5 flex items-start gap-4 lg:w-72 shrink-0">
            <div className="p-2 bg-orange-100 rounded-xl mt-0.5">
              <AlertCircle className="w-5 h-5 text-orange-500" />
            </div>
            <div>
              <p className="text-base font-extrabold text-orange-800 leading-tight">
                {pendingCount} Pending Review
              </p>
              <p className="text-xs text-orange-600 mt-1 font-medium leading-relaxed">
                Verification requests requiring attention on this slice.
              </p>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-red-700 text-sm font-medium flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-80">
          <div className="animate-spin rounded-full h-14 w-14 border-4 border-blue-100 border-t-blue-600" />
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/60 border-b border-slate-100">
                  {["User Profile", "Platform Role", "Verified", "Status", "Actions"].map((h) => (
                    <th
                      key={h}
                      className="px-8 py-5 text-[11px] font-extrabold text-slate-400 uppercase tracking-[0.15em]"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {users?.data && users.data.length > 0 ? (
                  users.data.map((user) => {
                    const isBanned = user.status?.toUpperCase() === "BANNED" || !!user.deletedAt;
                    const verifyState = checkVerificationState(user);
                    
                    return (
                      <tr key={user.id} className="hover:bg-slate-50/40 transition-colors group">
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center text-base font-extrabold text-slate-600 shrink-0 border border-slate-100">
                              {(user.fullName || user.email).charAt(0).toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-extrabold text-slate-900 truncate">
                                {user.fullName || "Unnamed User"}
                              </p>
                              <p className="text-xs text-slate-500 font-medium truncate mt-0.5">
                                {user.email}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-8 py-6">
                          <span className={`px-3 py-1.5 rounded-full text-[11px] font-extrabold uppercase tracking-wider ${getRoleBadge(user.currentRole)}`}>
                            {user.currentRole || "REQUESTER"}
                          </span>
                        </td>

                        <td className="px-8 py-6">
                          {verifyState === "INTERNAL" ? (
                            <div className="flex items-center gap-2 text-purple-600 bg-purple-50/80 px-2.5 py-1 rounded-lg w-fit border border-purple-100">
                              <CheckCircle2 className="w-4 h-4" />
                              <span className="text-xs font-extrabold">Internal</span>
                            </div>
                          ) : verifyState === "VERIFIED" ? (
                            <div className="flex items-center gap-2 text-blue-600">
                              <CheckCircle2 className="w-4 h-4" />
                              <span className="text-xs font-extrabold">Yes</span>
                            </div>
                          ) : verifyState === "PENDING" ? (
                            <div className="flex items-center gap-2 text-orange-500 font-medium animate-pulse">
                              <AlertCircle className="w-4 h-4" />
                              <span className="text-xs font-extrabold">Pending</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 text-slate-400">
                              <XCircle className="w-4 h-4" />
                              <span className="text-xs font-extrabold">No</span>
                            </div>
                          )}
                        </td>

                        <td className="px-8 py-6">
                          <span className={`px-3 py-1.5 rounded-full text-[11px] font-extrabold uppercase tracking-wider ${
                            isBanned ? "bg-red-100 text-red-600" : "bg-green-100 text-green-700"
                          }`}>
                            {isBanned ? "Banned" : "Active"}
                          </span>
                        </td>

                        <td className="px-8 py-6">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                setSelectedUser(user);
                                setModalTab("profile");
                              }}
                              className="p-2 rounded-xl text-blue-500 hover:bg-blue-50 transition-colors"
                              title="View details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>

                            <button
                              className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors"
                              title="Change role"
                            >
                              <ArrowLeftRight className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => toggleUserBanStatus(user)}
                              disabled={actionLoading === user.id}
                              title={isBanned ? "Restore account access" : "Ban account access"}
                              className={`p-2 rounded-xl transition-colors disabled:opacity-50 ${
                                isBanned ? "text-green-500 hover:bg-green-50" : "text-red-500 hover:bg-red-50"
                              }`}
                            >
                              {actionLoading === user.id ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current" />
                              ) : isBanned ? (
                                <History className="w-4 h-4" />
                              ) : (
                                <Ban className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={5} className="px-8 py-16 text-center">
                      <Users className="w-12 h-12 text-slate-200 mx-auto mb-3" />
                      <p className="text-slate-400 font-semibold text-sm">
                        No accounts match your active search filter profiles.
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          {users && users.last_page >= 1 && (
            <div className="flex items-center justify-between px-8 py-5 border-t border-slate-100 bg-slate-50/40">
              <p className="text-sm text-slate-500 font-semibold">
                Showing {(page - 1) * 10 + 1} to {Math.min(page * 10, users.total)} of {users.total} total accounts
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="px-5 py-2 rounded-xl text-sm font-bold border border-slate-200 text-slate-600 hover:bg-white hover:shadow-sm disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  Previous
                </button>
                {Array.from({ length: Math.min(5, users.last_page) }).map((_, i) => {
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
                  onClick={() => setPage(Math.min(users.last_page, page + 1))}
                  disabled={page === users.last_page}
                  className="px-5 py-2 rounded-xl text-sm font-bold bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── ENHANCED TABBED INSPECT DETAILS MODAL ── */}
      {selectedUser && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-xl border border-slate-100 flex flex-col space-y-5 transform transition-all duration-200">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 text-base font-extrabold shrink-0 border border-blue-100/50 uppercase">
                  {(selectedUser.fullName || selectedUser.email).charAt(0)}
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">Account File Inspect</h3>
                  <p className="text-xs text-slate-400 font-semibold">System Index ID: #{selectedUser.id}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedUser(null)}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold bg-slate-100 hover:bg-slate-200 px-3 py-2 rounded-xl transition-all"
              >
                Close
              </button>
            </div>

            {/* TAB SELECTOR STRIP */}
            <div className="grid grid-cols-3 p-1 bg-slate-100 rounded-xl">
              <button
                onClick={() => setModalTab("profile")}
                className={`flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-extrabold tracking-wide transition-all ${
                  modalTab === "profile" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                Profile
              </button>
              <button
                onClick={() => setModalTab("activity")}
                className={`flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-extrabold tracking-wide transition-all ${
                  modalTab === "activity" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5" />
                Activity
              </button>
              <button
                onClick={() => setModalTab("location")}
                className={`flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-extrabold tracking-wide transition-all ${
                  modalTab === "location" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
                }`}
              >
                <MapPin className="w-3.5 h-3.5" />
                Location
              </button>
            </div>

            {/* TAB PANELS CONTAINER */}
            <div className="flex-1 min-h-[220px] transition-all duration-300">
              
              {/* TAB 1: PROFILE FIELDS */}
              {modalTab === "profile" && (
                <div className="space-y-4 animate-slideRight">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <span className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-0.5">Full Name</span>
                      <span className="text-sm font-bold text-slate-800">{selectedUser.fullName || "Unnamed User"}</span>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <span className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-0.5">Assigned Role</span>
                      <span className={`text-xs font-extrabold px-2 py-0.5 rounded-md inline-block mt-0.5 uppercase ${getRoleBadge(selectedUser.currentRole)}`}>
                        {selectedUser.currentRole || "REQUESTER"}
                      </span>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <span className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-0.5">Email Communications Address</span>
                    <span className="text-sm font-bold text-slate-800 break-all">{selectedUser.email}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <span className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-0.5">Access Authorization</span>
                      <span className={`text-xs font-extrabold uppercase block mt-1 ${
                        (selectedUser.status?.toUpperCase() === 'BANNED' || !!selectedUser.deletedAt) ? 'text-red-500' : 'text-green-600'
                      }`}>
                        {(selectedUser.status?.toUpperCase() === 'BANNED' || !!selectedUser.deletedAt) ? "BANNED" : "ACTIVE"}
                      </span>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <span className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-0.5">Platform Creation Date Log</span>
                      <span className="text-xs font-bold text-slate-700 block mt-1">
                        {selectedUser.createdAt ? new Date(selectedUser.createdAt).toLocaleDateString() : "Prior Record"}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: PLATFORM PERFORMANCE STATISTICS */}
              {modalTab === "activity" && (
                <div className="space-y-4 animate-slideRight">
                  <div className="p-3 bg-blue-50/50 border border-blue-100 rounded-xl flex items-center gap-3">
                    <TrendingUp className="w-5 h-5 text-blue-500 shrink-0" />
                    <p className="text-xs text-blue-800 font-medium leading-relaxed">
                      Ecosystem transaction summaries. Derived context balances from <b>{selectedUser.currentRole || "REQUESTER"}</b> account logs.
                    </p>
                  </div>

                  {selectedUser.currentRole?.toUpperCase() === "PERFORMER" ? (
                    /* Render Dynamic Performer Metrics */
                    <div className="grid grid-cols-2 gap-4">
                      <div className="border border-slate-100 p-4 rounded-xl bg-slate-50/50 flex flex-col items-start">
                        <Briefcase className="w-4 h-4 text-orange-500 mb-2" />
                        <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Completed Tasks</span>
                        <span className="text-xl font-black text-slate-800 mt-1">
                          {selectedUser.performerStats?.tasks_completed ?? 0}
                        </span>
                      </div>
                      <div className="border border-slate-100 p-4 rounded-xl bg-slate-50/50 flex flex-col items-start">
                        <DollarSign className="w-4 h-4 text-emerald-500 mb-2" />
                        <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Total Revenue Earned</span>
                        <span className="text-xl font-black text-emerald-600 mt-1">
                          ${Number(selectedUser.performerStats?.total_earned ?? 0).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ) : (
                    /* Render Dynamic Requester Metrics */
                    <div className="grid grid-cols-2 gap-4">
                      <div className="border border-slate-100 p-4 rounded-xl bg-slate-50/50 flex flex-col items-start">
                        <Briefcase className="w-4 h-4 text-indigo-500 mb-2" />
                        <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Tasks Spawned/Posted</span>
                        <span className="text-xl font-black text-slate-800 mt-1">
                          {selectedUser.requesterStats?.tasks_posted ?? 0}
                        </span>
                      </div>
                      <div className="border border-slate-100 p-4 rounded-xl bg-slate-50/50 flex flex-col items-start">
                        <DollarSign className="w-4 h-4 text-indigo-500 mb-2" />
                        <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Capital Allocated</span>
                        <span className="text-xl font-black text-indigo-600 mt-1">
                          ${Number(selectedUser.requesterStats?.total_spent ?? 0).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex justify-between items-center text-xs">
                    <span className="font-extrabold text-slate-400 uppercase tracking-wider">Identity Verification Check:</span>
                    <span className={`font-black uppercase ${
                      checkVerificationState(selectedUser) === "VERIFIED" || checkVerificationState(selectedUser) === "INTERNAL" 
                        ? 'text-blue-600' 
                        : checkVerificationState(selectedUser) === "PENDING" 
                        ? 'text-orange-500' 
                        : 'text-slate-400'
                    }`}>
                      {checkVerificationState(selectedUser) === "VERIFIED" 
                        ? "Verified Pass" 
                        : checkVerificationState(selectedUser) === "INTERNAL" 
                        ? "Internal Admin Pass" 
                        : checkVerificationState(selectedUser) === "PENDING" 
                        ? "Review Pending" 
                        : "Unverified Status"
                      }
                    </span>
                  </div>
                </div>
              )}

              {/* TAB 3: REGIONAL ADDRESS LOCATION LOGS */}
              {modalTab === "location" && (
                <div className="space-y-4 animate-slideRight">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <span className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-0.5">City Registry</span>
                      <span className="text-sm font-bold text-slate-800">{selectedUser.city || "Not Provided"}</span>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <span className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-0.5">Country Registry</span>
                      <span className="text-sm font-bold text-slate-800">{selectedUser.country || "Global Region"}</span>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <span className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-0.5">Phone Contact</span>
                    <span className="text-sm font-bold text-slate-800">{selectedUser.phoneNumber || "No Phone Contact Bonded"}</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-slate-400 font-medium leading-relaxed">
                    📍 Information fields populated on this interface reflect network coordinates registered during core onboarding authentication.
                  </div>
                </div>
              )}

            </div>

          </div>
        </div>
      )}
    </div>
  );
}