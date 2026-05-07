"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {
  Clock3,
  MapPin,
  CheckCircle2,
  Briefcase,
} from "lucide-react";

type Application = {
  id: number;
  status: string;
  offered_price: number;

  performer: {
    id: number;
    fullName: string;
    email: string;
  };
};

type Task = {
  id: number;
  title: string;
  description: string;
  location_text: string;
  deadline: string;
  price: number;
  required_workers: number;
  status: string;
};

export default function TaskApplicationsPage({
  params,
}: {
  params: { taskId: string };
}) {
  const [task, setTask] = useState<Task | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [taskRes, appRes] = await Promise.all([
        axios.get(
          `http://localhost:3001/api/tasks/${params.taskId}`,
          { withCredentials: true }
        ),

        axios.get(
          `http://localhost:3001/api/applications/task/${params.taskId}`,
          { withCredentials: true }
        ),
      ]);

      setTask(taskRes.data);
      setApplications(appRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const acceptApplication = async (id: number) => {
    try {
      await axios.patch(
        `http://localhost:3001/api/applications/${id}/accept`,
        {},
        { withCredentials: true }
      );

      fetchData();
    } catch (err) {
      console.error(err);
      alert("Failed to accept");
    }
  };

  const rejectApplication = async (id: number) => {
    try {
      await axios.patch(
        `http://localhost:3001/api/applications/${id}/reject`,
        {},
        { withCredentials: true }
      );

      fetchData();
    } catch (err) {
      console.error(err);
      alert("Failed to reject");
    }
  };

  if (loading) {
    return (
      <div className="p-10 text-center text-slate-500">
        Loading workspace...
      </div>
    );
  }

  if (!task) {
    return (
      <div className="p-10 text-center text-red-500">
        Task not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-7xl space-y-6">

        {/* HEADER */}
        <div className="rounded-3xl bg-white border border-slate-200 p-8 shadow-sm">

          <div className="flex items-center justify-between flex-wrap gap-5">

            <div>
              <p className="text-sm text-blue-600 font-semibold uppercase tracking-wider">
                Request Workspace
              </p>

              <h1 className="mt-2 text-4xl font-black text-slate-900">
                {task.title}
              </h1>

              <p className="mt-3 text-slate-500 max-w-3xl">
                Manage applications, monitor progress, and control
                your task workflow.
              </p>
            </div>

            <div className="rounded-2xl bg-blue-50 px-6 py-5 border border-blue-100">
              <p className="text-xs uppercase tracking-wider text-slate-400">
                Budget
              </p>

              <h2 className="text-4xl font-black text-blue-700">
                ${task.price}
              </h2>
            </div>
          </div>
        </div>

        {/* PROGRESS */}
        <div className="rounded-3xl bg-white border border-slate-200 p-6 shadow-sm">

          <div className="flex items-center justify-between flex-wrap gap-5">

            <div className="flex items-center gap-4">

              <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center">
                <Briefcase size={22} />
              </div>

              <div>
                <p className="font-bold text-slate-900">
                  Current Status
                </p>

                <p className="text-sm text-slate-500">
                  {task.status}
                </p>
              </div>
            </div>

            <div className="flex gap-3 flex-wrap">

              <div className="px-4 py-2 rounded-xl bg-slate-100 text-sm text-slate-700 flex items-center gap-2">
                <Clock3 size={15} />
                {new Date(task.deadline).toLocaleDateString()}
              </div>

              <div className="px-4 py-2 rounded-xl bg-slate-100 text-sm text-slate-700 flex items-center gap-2">
                <MapPin size={15} />
                {task.location_text || "No location"}
              </div>

              <div className="px-4 py-2 rounded-xl bg-green-100 text-green-700 text-sm font-semibold">
                {task.required_workers} Workers Needed
              </div>

            </div>
          </div>
        </div>

        {/* DESCRIPTION */}
        <div className="rounded-3xl bg-white border border-slate-200 p-8 shadow-sm">

          <h2 className="text-2xl font-black text-slate-900">
            Task Description
          </h2>

          <p className="mt-5 leading-8 text-slate-600">
            {task.description}
          </p>
        </div>

        {/* APPLICATIONS */}
        <div className="rounded-3xl bg-white border border-slate-200 p-8 shadow-sm">

          <div className="flex items-center justify-between mb-8">

            <div>
              <h2 className="text-2xl font-black text-slate-900">
                Applications
              </h2>

              <p className="text-slate-500 mt-1">
                Review performers and choose workers.
              </p>
            </div>

            <div className="px-4 py-2 rounded-xl bg-blue-50 text-blue-700 font-semibold">
              {applications.length} Applicants
            </div>
          </div>

          <div className="space-y-5">

            {applications.map((app) => (
              <div
                key={app.id}
                className="border border-slate-200 rounded-2xl p-6 hover:shadow-md transition-all"
              >

                <div className="flex items-center justify-between flex-wrap gap-5">

                  <div className="flex items-center gap-4">

                    <div className="w-14 h-14 rounded-full bg-slate-200 overflow-hidden">
                      <img
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${app.performer.fullName}`}
                      />
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-slate-900">
                        {app.performer.fullName}
                      </h3>

                      <p className="text-sm text-slate-500">
                        {app.performer.email}
                      </p>

                      <div className="mt-2">
                        <span
                          className={`
                            px-3 py-1 rounded-full text-xs font-semibold
                            ${
                              app.status === "ACCEPTED"
                                ? "bg-green-100 text-green-700"
                                : app.status === "REJECTED"
                                ? "bg-red-100 text-red-700"
                                : "bg-yellow-100 text-yellow-700"
                            }
                          `}
                        >
                          {app.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">

                    <p className="text-xs uppercase tracking-wider text-slate-400">
                      Offered Price
                    </p>

                    <h2 className="text-4xl font-black text-orange-600">
                      ${app.offered_price}
                    </h2>
                  </div>
                </div>

                {/* ACTIONS */}
                {app.status === "PENDING" && (
                  <div className="flex justify-end gap-3 mt-6">

                    <button
                      onClick={() => rejectApplication(app.id)}
                      className="
                        px-5 py-2.5 rounded-xl
                        bg-red-100 text-red-700 font-semibold
                        hover:bg-red-200 transition
                      "
                    >
                      Reject
                    </button>

                    <button
                      onClick={() => acceptApplication(app.id)}
                      className="
                        px-5 py-2.5 rounded-xl
                        bg-blue-600 text-white font-semibold
                        hover:bg-blue-700 transition
                      "
                    >
                      Accept
                    </button>

                  </div>
                )}

                {app.status === "ACCEPTED" && (
                  <div className="mt-6 flex items-center gap-2 text-green-600 font-semibold">
                    <CheckCircle2 size={18} />
                    Performer Accepted
                  </div>
                )}

              </div>
            ))}

          </div>
        </div>
      </div>
    </div>
  );
}