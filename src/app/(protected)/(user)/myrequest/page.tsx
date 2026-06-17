"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, ClipboardList, Plus, Search } from "lucide-react";
import { useTaskListStore } from "@/store/taskListStore";
import TaskCard from "@/components/myrequest/TaskCard";
import api from "@/lib/axios";

const REQUESTS_PER_PAGE = 6;

export default function MyRequestPage() {
  const router = useRouter();
  const { tasks, setTasks } = useTaskListStore();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredTasks = useMemo(() => {
    let result = tasks;
    const normalizedQuery = query.trim().toLowerCase();

    if (normalizedQuery) {
      result = result.filter((task) => {
        return [
          task.title,
          task.description,
          task.status,
          task.locationText ?? (task as any).location_text,
        ]
          .filter(Boolean)
          .some((value) =>
            String(value).toLowerCase().includes(normalizedQuery)
          );
      });
    }

    if (filter !== "ALL") {
      result = result.filter((task) => {
        return task.status === filter;
      });
    }

    return [...result].sort((a, b) =>
      new Date((b as any).createdAt ?? (b as any).created_at).getTime() -
      new Date((a as any).createdAt ?? (a as any).created_at).getTime(),
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
        const res = await api.get("/tasks/me");
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
    <div className="min-h-screen overflow-y-auto">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:py-10">
        <div className="mb-6 flex flex-col gap-4 rounded-3xl border border-sky-200 bg-white/90 p-6 shadow-[0_18px_45px_rgba(14,165,233,0.12)] sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-sky-600">
              Requests
            </p>
            <h1 className="mt-2 text-3xl font-black text-slate-950">
              My Requests
            </h1>
            <p className="mt-1 text-sm font-medium leading-6 text-slate-500">
              Manage your posted tasks, deadlines, and worker activity. Latest requests appear first.
            </p>
          </div>

          <button
            onClick={() => router.push("/myrequest/create")}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-sky-600 px-5 text-sm font-black text-white shadow-sm shadow-sky-200 transition hover:-translate-y-0.5 hover:bg-cyan-500"
          >
            <Plus size={17} />
            Create Task
          </button>
        </div>

        <div className="mb-5 flex flex-col gap-4 rounded-3xl border border-sky-100 bg-white/80 p-4 shadow-sm lg:flex-row lg:items-center lg:justify-between">

          {/* SEARCH */}
          <div className="relative max-w-md flex-1">
            <Search
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-sky-500"
            />

            <input
              className="
                h-11 w-full rounded-2xl
                border border-sky-200 bg-sky-50/70
                pl-10 pr-4 text-sm font-semibold outline-none
                transition placeholder:text-slate-400
                focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-100
              "
              placeholder="Search requests"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

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
                      ? "bg-sky-600 text-white shadow-md shadow-sky-200"
                      : "bg-white border border-sky-100 text-slate-600 hover:bg-sky-50 hover:text-sky-700"
                  }
                `}
              >
                {item.label}
              </button>
            ))}

          </div>

          {/* COUNT */}
          <div className="rounded-2xl border border-sky-100 bg-white px-4 py-2 text-sm font-black text-sky-700 whitespace-nowrap">
            {filteredTasks.length}{" "}
            {filteredTasks.length === 1 ? "request" : "requests"}
          </div>
        </div>

        {tasks.length === 0 ? (
          <div className="rounded-3xl border-2 border-dashed border-sky-200 bg-white/85 p-10 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-50 text-sky-700">
              <ClipboardList size={24} />
            </div>
            <h2 className="mt-4 text-lg font-black text-slate-950">
              No requests yet
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              You haven’t created any tasks yet.
            </p>

            <button
              onClick={() => router.push("/myrequest/create")}
              className="mt-5 inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-sky-600 px-5 text-sm font-black text-white shadow-sm transition hover:bg-cyan-500"
            >
              <Plus size={17} />
              Create Your First Task
            </button>
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="rounded-3xl border border-sky-100 bg-white/85 p-8 text-center">
            <h2 className="text-base font-black text-slate-950">
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
              <div className="mt-5 flex flex-col gap-3 rounded-3xl border border-sky-100 bg-white/90 p-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-slate-500">
                  Page {currentPage} of {totalPages}
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                    disabled={currentPage === 1}
                    className="inline-flex h-10 items-center gap-2 rounded-xl border border-sky-200 px-3 text-sm font-bold text-sky-700 transition hover:bg-sky-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ChevronLeft size={16} />
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                    disabled={currentPage === totalPages}
                    className="inline-flex h-10 items-center gap-2 rounded-xl border border-sky-200 bg-sky-600 px-3 text-sm font-bold text-white transition hover:bg-cyan-500 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500"
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
