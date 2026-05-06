"use client";

import { useEffect, useState } from "react";
import { adminService } from "@/services/adminService";
import { Layers, Clock, CheckCircle, AlertCircle } from "lucide-react";

interface Assignment {
  id: number;
  taskId?: number;
  performerId?: number;
  status?: string;
  startDate?: string;
  dueDate?: string;
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

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        setLoading(true);
        const data = await adminService.getAssignments({
          page,
          limit: 15,
        });
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
    pending: assignments?.data.filter((a) => a.status === "PENDING").length || 0,
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case "COMPLETED":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "IN_PROGRESS":
        return <Clock className="w-5 h-5 text-blue-600" />;
      case "PENDING":
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      default:
        return <Layers className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "COMPLETED":
        return "bg-green-100 text-green-800";
      case "IN_PROGRESS":
        return "bg-blue-100 text-blue-800";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Assignments Management
        </h1>
        <p className="text-gray-600 mt-2">
          Track all task assignments and their progress
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Assignments</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <Layers className="w-8 h-8 text-gray-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg border border-blue-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">In Progress</p>
              <p className="text-2xl font-bold text-blue-600">{stats.inProgress}</p>
            </div>
            <Clock className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg border border-green-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Completed</p>
              <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg border border-yellow-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
            <AlertCircle className="w-8 h-8 text-yellow-600" />
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {error}
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      )}

      {!loading && (
        <>
          <div className="overflow-x-auto bg-white rounded-lg shadow-sm border border-gray-200">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">
                    Task ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">
                    Performer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">
                    Start Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">
                    Due Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {assignments && assignments.data.length > 0 ? (
                  assignments.data.map((assignment) => (
                    <tr
                      key={assignment.id}
                      className="border-b border-gray-200 hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        #{assignment.id}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {assignment.taskId || "—"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {assignment.performerId || "—"}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(assignment.status)}
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                              assignment.status
                            )}`}
                          >
                            {assignment.status || "UNKNOWN"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {assignment.startDate
                          ? new Date(assignment.startDate).toLocaleDateString()
                          : "—"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {assignment.dueDate
                          ? new Date(assignment.dueDate).toLocaleDateString()
                          : "—"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                      No assignments to display
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {assignments && assignments.total > 0 && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Page {page} of {Math.ceil((assignments.total || 0) / 15)}
              </p>
              <div className="flex space-x-2">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage(page + 1)}
                  disabled={page >= Math.ceil((assignments.total || 0) / 15)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
