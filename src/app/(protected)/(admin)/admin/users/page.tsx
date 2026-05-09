"use client";

import { useEffect, useState } from "react";
import { adminService } from "@/services/adminService";
import {
  Trash2,
  Users,
  Search,
  Eye,
  ArrowLeftRight,
  Ban,
  History,
  AlertCircle,
  CheckCircle2,
  XCircle,
} from "lucide-react";

interface User {
  id: number;
  email: string;
  fullName?: string;
  role?: string;
  createdAt?: string;
  isIdentityVerified?: boolean;
  status?: string;
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
  const [deleteLoading, setDeleteLoading] = useState<number | null>(null);
  const [roleFilter, setRoleFilter] = useState<
    "ALL" | "REQUESTER" | "PERFORMER"
  >("ALL");

  const fetchUsers = async (pageNum: number) => {
    try {
      setLoading(true);
      const data = await adminService.getUsers({ page: pageNum, limit: 10 });
      setUsers(data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch users");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(page);
  }, [page]);

  const handleDelete = async (userId: number) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      setDeleteLoading(userId);
      await adminService.deleteUser(userId);
      setUsers((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          data: prev.data.filter((u) => u.id !== userId),
          total: prev.total - 1,
        };
      });
    } catch (err) {
      alert("Failed to delete user");
      console.error(err);
    } finally {
      setDeleteLoading(null);
    }
  };

  const filteredUsers = users?.data.filter((user) => {
    const matchesSearch =
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.fullName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "ALL" || user.role === roleFilter;
    const isNotAdmin =
      user.role !== "ADMIN" && !user.email.toLowerCase().includes("admin");
    return matchesSearch && matchesRole && isNotAdmin;
  });

  const pendingCount =
    users?.data.filter((u) => !u.isIdentityVerified).length ?? 0;

  const getRoleBadge = (role?: string) => {
    switch (role) {
      case "ADMIN":
        return "bg-blue-100 text-blue-700";
      case "PERFORMER":
        return "bg-orange-100 text-orange-700";
      default:
        return "bg-slate-100 text-slate-600";
    }
  };

  return (
    <div className="min-h-screen space-y-8 max-w-350 mx-auto">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
            User Management
          </h1>
          <p className="text-slate-500 text-sm font-medium max-w-md leading-relaxed">
            Oversee the platform ecosystem. Manage roles, verify credentials,
            and maintain community standards across all participants.
          </p>
        </div>

        {/* Active Admins Cluster */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex -space-x-3">
            {["A", "B", "C"].map((l, i) => (
              <div
                key={i}
                className="w-10 h-10 rounded-full bg-linear-to-br from-slate-300 to-slate-400 border-2 border-white flex items-center justify-center text-xs font-bold text-white shadow-sm"
              >
                {l}
              </div>
            ))}
            <div className="w-10 h-10 rounded-full bg-blue-600 border-2 border-white flex items-center justify-center text-xs font-bold text-white shadow-sm">
              +{Math.max(0, (users?.total ?? 0) - 3)}
            </div>
          </div>
          <span className="text-sm font-semibold text-slate-600">
            Admins active today
          </span>
        </div>
      </div>

      {/* ── Filters + Alert Row ── */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Quick Filters Card */}
        <div className="flex-1 bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by email or name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-100 text-sm font-medium text-slate-700 placeholder:text-slate-400 outline-none focus:bg-white focus:border-blue-200 focus:ring-4 focus:ring-blue-500/5 transition-all"
            />
          </div>

          {/* Role pills */}
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-xs font-extrabold uppercase tracking-widest text-slate-400">
              Quick Filters&nbsp;&nbsp;Role:
            </span>
            {(["ALL", "REQUESTER", "PERFORMER"] as const).map((r) => (
              <button
                key={r}
                onClick={() => setRoleFilter(r)}
                className={`px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wider transition-all ${
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

        {/* Pending Verifications Alert */}
        {pendingCount > 0 && (
          <div className="bg-orange-50 border border-orange-200 rounded-2xl p-5 flex items-start gap-4 lg:w-72 shrink-0">
            <div className="p-2 bg-orange-100 rounded-xl mt-0.5">
              <AlertCircle className="w-5 h-5 text-orange-500" />
            </div>
            <div>
              <p className="text-base font-extrabold text-orange-800 leading-tight">
                {pendingCount} Pending Verifications
              </p>
              <p className="text-xs text-orange-600 mt-1 font-medium leading-relaxed">
                Requires urgent manual review before access.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* ── Error ── */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-red-700 text-sm font-medium flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          {error}
        </div>
      )}

      {/* ── Loading ── */}
      {loading && (
        <div className="flex items-center justify-center h-80">
          <div className="animate-spin rounded-full h-14 w-14 border-4 border-blue-100 border-t-blue-600" />
        </div>
      )}

      {/* ── Table ── */}
      {!loading && (
        <div className="bg-white rounded-4xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/60 border-b border-slate-100">
                  {[
                    "User Profile",
                    "Platform Role",
                    "Verified",
                    "Status",
                    "Actions",
                  ].map((h) => (
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
                {filteredUsers && filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => {
                    const isBanned = user.status === "BANNED";
                    const verified = user.isIdentityVerified;
                    return (
                      <tr
                        key={user.id}
                        className="hover:bg-slate-50/40 transition-colors group"
                      >
                        {/* User Profile */}
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-slate-200 to-slate-300 flex items-center justify-center text-base font-extrabold text-slate-600 shrink-0 overflow-hidden border border-slate-100">
                              {user.fullName
                                ? user.fullName.charAt(0).toUpperCase()
                                : user.email.charAt(0).toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-extrabold text-slate-900 truncate">
                                {user.fullName || "—"}
                              </p>
                              <p className="text-xs text-slate-500 font-medium truncate mt-0.5">
                                {user.email}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Role */}
                        <td className="px-8 py-6">
                          <span
                            className={`px-3 py-1.5 rounded-full text-[11px] font-extrabold uppercase tracking-wider ${getRoleBadge(user.role)}`}
                          >
                            {user.role || "REQUESTER"}
                          </span>
                        </td>

                        {/* Verified */}
                        <td className="px-8 py-6">
                          {verified ? (
                            <div className="flex items-center gap-2 text-blue-600">
                              <CheckCircle2 className="w-4 h-4" />
                              <span className="text-xs font-extrabold">
                                Yes
                              </span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 text-slate-400">
                              <XCircle className="w-4 h-4" />
                              <span className="text-xs font-extrabold">No</span>
                            </div>
                          )}
                        </td>

                        {/* Status */}
                        <td className="px-8 py-6">
                          <span
                            className={`px-3 py-1.5 rounded-full text-[11px] font-extrabold uppercase tracking-wider ${
                              isBanned
                                ? "bg-red-100 text-red-600"
                                : "bg-green-100 text-green-700"
                            }`}
                          >
                            {isBanned ? "Banned" : "Active"}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-2">
                            {/* View */}
                            <button
                              className="p-2 rounded-xl text-blue-500 hover:bg-blue-50 transition-colors"
                              title="View user"
                            >
                              <Eye className="w-4 h-4" />
                            </button>

                            {/* Switch role */}
                            <button
                              className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors"
                              title="Change role"
                            >
                              <ArrowLeftRight className="w-4 h-4" />
                            </button>

                            {/* Delete / Unban */}
                            <button
                              onClick={() => handleDelete(user.id)}
                              disabled={deleteLoading === user.id}
                              title={isBanned ? "Unban user" : "Delete user"}
                              className={`p-2 rounded-xl transition-colors disabled:opacity-50 ${
                                isBanned
                                  ? "text-green-500 hover:bg-green-50"
                                  : "text-red-500 hover:bg-red-50"
                              }`}
                            >
                              {deleteLoading === user.id ? (
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
                        {searchTerm
                          ? "No users found matching your search"
                          : "No users to display"}
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
                Showing {(page - 1) * 10 + 1} to{" "}
                {Math.min(page * 10, users.total)} of {users.total} users
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="px-5 py-2 rounded-xl text-sm font-bold border border-slate-200 text-slate-600 hover:bg-white hover:shadow-sm disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  Previous
                </button>
                {Array.from({ length: Math.min(5, users.last_page) }).map(
                  (_, i) => {
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
                  },
                )}
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
    </div>
  );
}
