"use client";

import { useEffect, useState } from "react";
import { adminService } from "@/services/adminService";
import { FileText } from "lucide-react";

interface Application {
  id: number;
  taskId?: number;
  userId?: number;
  status?: string;
  appliedAt?: string;
}

interface PaginatedApplications {
  data: Application[];
  total: number;
  page: number;
}

export default function AdminApplicationsPage() {
  const [applications, setApplications] = useState<PaginatedApplications | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        const data = await adminService.getApplications({
          page,
          limit: 15,
        });
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
  }, [page]);

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "ACCEPTED":
        return "bg-green-100 text-green-800";
      case "REJECTED":
        return "bg-red-100 text-red-800";
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
          Applications Management
        </h1>
        <p className="text-gray-600 mt-2">
          Monitor all task applications from performers
        </p>
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
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <p className="text-gray-600">
              Total Applications:{" "}
              <span className="font-bold text-gray-900">
                {applications?.total || 0}
              </span>
            </p>
          </div>

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
                    Performer ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">
                    Applied Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {applications && applications.data.length > 0 ? (
                  applications.data.map((app) => (
                    <tr
                      key={app.id}
                      className="border-b border-gray-200 hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        #{app.id}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {app.taskId || "—"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {app.userId || "—"}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                            app.status
                          )}`}
                        >
                          {app.status || "PENDING"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {app.appliedAt
                          ? new Date(app.appliedAt).toLocaleDateString()
                          : "—"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                      <FileText className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                      No applications to display
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {applications && applications.total > 0 && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Page {page} of{" "}
                {Math.ceil((applications.total || 0) / 15)}
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
                  disabled={page >= Math.ceil((applications.total || 0) / 15)}
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
