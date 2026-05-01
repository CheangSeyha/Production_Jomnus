"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { ClipboardList, Plus, Search } from "lucide-react";
import { useTaskListStore } from "@/store/taskListStore";
import TaskCard from "@/components/myrequest/TaskCard";

export default function MyRequestPage() {
  const router = useRouter();
  const { tasks, setTasks } = useTaskListStore();
  const [query, setQuery] = useState("");

  const filteredTasks = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) return tasks;

    return tasks.filter((task) => {
      return [task.title, task.description, task.status, task.location_text]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(normalizedQuery));
    });
  }, [query, tasks]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await axios.get(
          "http://localhost:3001/api/tasks/me",
          { withCredentials: true }
        );
        setTasks(res.data);
      } catch (err) {
        console.error("Failed to fetch tasks", err);
      }
    };

    fetchTasks();
  }, []);

  return (
    <div className="min-h-screen overflow-y-auto bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:py-10">
        <div className="mb-6 flex flex-col gap-4 rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-700">
              Requests
            </p>
            <h1 className="mt-2 text-2xl font-bold text-slate-950">
              My Requests
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Manage your posted tasks, deadlines, and worker activity.
            </p>
          </div>

          <button
            onClick={() => router.push("/myrequest/create")}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-sky-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700"
          >
            <Plus size={17} />
            Create Task
          </button>
        </div>

        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative max-w-md flex-1">
            <Search
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              className="h-11 w-full rounded-lg border border-slate-200 bg-white pl-10 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
              placeholder="Search requests"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <p className="text-sm text-slate-500">
            {filteredTasks.length} {filteredTasks.length === 1 ? "request" : "requests"}
          </p>
        </div>

        {tasks.length === 0 ? (
          <div className="rounded-lg border border-dashed border-slate-300 bg-white p-10 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-sky-50 text-sky-700">
              <ClipboardList size={24} />
            </div>
            <h2 className="mt-4 text-lg font-semibold text-slate-950">
              No requests yet
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              You haven’t created any tasks yet.
            </p>

            <button
              onClick={() => router.push("/myrequest/create")}
              className="mt-5 inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-sky-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700"
            >
              <Plus size={17} />
              Create Your First Task
            </button>
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="rounded-lg border border-slate-200 bg-white p-8 text-center">
            <h2 className="text-base font-semibold text-slate-950">
              No matching requests
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Try a different title, status, or location.
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredTasks.map((task) => (
              <TaskCard key={task.id} {...task} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
