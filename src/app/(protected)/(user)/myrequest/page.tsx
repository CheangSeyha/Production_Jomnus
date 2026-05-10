"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { ChevronLeft, ChevronRight, ClipboardList, Plus, Search } from "lucide-react";
import { useTaskListStore } from "@/store/taskListStore";
import TaskCard from "@/components/myrequest/TaskCard";

const REQUESTS_PER_PAGE = 6;

export default function MyRequestPage() {
  const router = useRouter();
  const { tasks, setTasks } = useTaskListStore();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredTasks = useMemo(() => {
    let result = tasks;

    // SEARCH
    const normalizedQuery = query.trim().toLowerCase();

    if (normalizedQuery) {
      result = result.filter((task) => {
        return [
          task.title,
          task.description,
          task.status,
          task.location_text,
        ]
          .filter(Boolean)
          .some((value) =>
            String(value).toLowerCase().includes(normalizedQuery)
          );
      });
    }

    // FILTER
    if (filter !== "ALL") {
      result = result.filter((task) => {
        return task.status === filter;
      });
    }

    return [...result].sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    );
  }, [query, tasks, filter]);

  const totalPages = Math.max(1, Math.ceil(filteredTasks.length / REQUESTS_PER_PAGE));
  const paginatedTasks = filteredTasks.slice(
    (currentPage - 1) * REQUESTS_PER_PAGE,
    currentPage * REQUESTS_PER_PAGE,
  );


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

  useEffect(() => {
    setCurrentPage(1);
  }, [query, filter]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);



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
              Manage your posted tasks, deadlines, and worker activity. Latest requests appear first.
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

        <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

          {/* SEARCH */}
          <div className="relative max-w-md flex-1">
            <Search
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              className="
                h-11 w-full rounded-xl
                border border-slate-200 bg-white
                pl-10 pr-4 text-sm outline-none
                transition placeholder:text-slate-400
                focus:border-sky-500 focus:ring-4 focus:ring-sky-100
              "
              placeholder="Search requests"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          {/* TOGGLES */}
          <div className="flex flex-wrap gap-2">

            {[
              { label: "All Tasks", value: "ALL" },
              { label: "Posted", value: "POSTED" },
              { label: "Accepted", value: "ACCEPTED" },
              { label: "In Progress", value: "IN_PROGRESS" },
              { label: "Completed", value: "COMPLETED" },
              { label: "Cancelled", value: "CANCELLED" },
            ].map((item) => (
              <button
                key={item.value}
                onClick={() => setFilter(item.value)}
                className={`
                  px-4 py-2 rounded-xl text-sm font-semibold
                  transition-all duration-200

                  ${
                    filter === item.value
                      ? "bg-blue-600 text-white shadow-md"
                      : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"
                  }
                `}
              >
                {item.label}
              </button>
            ))}

          </div>

          {/* COUNT */}
          <div className="text-sm text-slate-500 whitespace-nowrap">
            {filteredTasks.length}{" "}
            {filteredTasks.length === 1 ? "request" : "requests"}
          </div>
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
          <>
            <div className="grid gap-4">
              {paginatedTasks.map((task) => (
                <TaskCard key={task.id} {...task} />
              ))}
            </div>

            {filteredTasks.length > REQUESTS_PER_PAGE && (
              <div className="mt-5 flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-slate-500">
                  Page {currentPage} of {totalPages}
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                    disabled={currentPage === 1}
                    className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-200 px-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ChevronLeft size={16} />
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                    disabled={currentPage === totalPages}
                    className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-200 px-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Next
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
