"use client";

import { useEffect, useState } from "react";
import { adminService } from "@/services/adminService";
import { Trash2, FileText, Search } from "lucide-react";

interface Task {
  id: number;
  title: string;
  description?: string;
  budget?: number;
  status?: string;
  createdAt?: string;
  requester?: { fullName: string; email: string };
}

export default function AdminTasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteLoading, setDeleteLoading] = useState<number | null>(null);

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

  const filteredTasks = tasks.filter(
    (task) =>
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tasks Management</h1>
          <p className="text-gray-600 mt-2">
            Monitor and manage all system tasks
          </p>
        </div>
        <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg border border-gray-200">
          <FileText className="w-5 h-5 text-gray-500" />
          <span className="font-semibold text-gray-900">{tasks.length}</span>
          <span className="text-gray-600">total tasks</span>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search by title or description..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
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
        <div className="grid gap-4">
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task) => (
              <div
                key={task.id}
                className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {task.title}
                    </h3>
                    <p className="text-gray-600 text-sm mt-1">
                      {task.description ||
                        "No description provided"}
                    </p>
                    <div className="flex items-center space-x-4 mt-3 text-xs text-gray-500">
                      {task.budget && (
                        <span>💰 Budget: ${task.budget}</span>
                      )}
                      {task.status && (
                        <span>
                          Status:{" "}
                          <span
                            className={`font-semibold ${
                              task.status === "COMPLETED"
                                ? "text-green-600"
                                : "text-blue-600"
                            }`}
                          >
                            {task.status}
                          </span>
                        </span>
                      )}
                      {task.createdAt && (
                        <span>
                          📅{" "}
                          {new Date(
                            task.createdAt
                          ).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(task.id)}
                    disabled={deleteLoading === task.id}
                    className="ml-4 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                  >
                    {deleteLoading === task.id ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b border-red-600"></div>
                    ) : (
                      <Trash2 className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">
                {searchTerm
                  ? "No tasks found matching your search"
                  : "No tasks to display"}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
