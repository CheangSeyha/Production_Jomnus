"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import {
  Clock,
  MapPin,
  ChevronRight,
  Briefcase,
  CheckCircle2,
  XCircle,
  Loader2,
} from "lucide-react";

type Application = {
  id: number;
  status: string;
  offered_price: number;
  applied_at: string;

  task: {
    id: number;
    title: string;
    description: string;
    location_text?: string;
    deadline: string;
    price: number;
    status: string;

    requester: {
      fullName: string;
      profileImage?: string;
    };
  };
};

export default function MyTasksPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMyApplications = async () => {
    try {
      const res = await axios.get(
        "http://localhost:3001/api/applications/me",
        {
          withCredentials: true,
        }
      );

      setApplications(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyApplications();
  }, []);

  const getStatusUI = (status: string) => {
    switch (status) {
      case "ACCEPTED":
        return {
          icon: <CheckCircle2 size={14} />,
          className: "bg-green-100 text-green-700",
          label: "Accepted",
        };

      case "REJECTED":
        return {
          icon: <XCircle size={14} />,
          className: "bg-red-100 text-red-700",
          label: "Rejected",
        };

      default:
        return {
          icon: <Loader2 size={14} />,
          className: "bg-yellow-100 text-yellow-700",
          label: "Pending",
        };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin mx-auto mb-3" size={40} />
          <p className="text-slate-500">Loading your tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl px-6 py-10">

        {/* HEADER */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-1 text-sm font-medium text-blue-700">
            <Briefcase size={15} />
            Performer Workspace
          </div>

          <h1 className="mt-4 text-4xl font-black tracking-tight text-slate-900">
            My Tasks
          </h1>

          <p className="mt-3 text-slate-500 text-lg">
            Track all tasks you applied for and manage your work progress.
          </p>
        </div>

        {/* EMPTY */}
        {applications.length === 0 && (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-14 text-center">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-slate-100">
              <Briefcase size={34} className="text-slate-500" />
            </div>

            <h2 className="text-2xl font-bold text-slate-800">
              No Applications Yet
            </h2>

            <p className="mt-3 text-slate-500">
              You haven't applied to any tasks yet.
            </p>

            <Link
              href="/dashboard"
              className="
                mt-6 inline-flex items-center gap-2
                rounded-xl bg-blue-600 px-5 py-3
                font-semibold text-white
                transition hover:bg-blue-700
              "
            >
              Browse Tasks
              <ChevronRight size={18} />
            </Link>
          </div>
        )}

        {/* TASK LIST */}
        <div className="space-y-5">

          {applications.map((application) => {
            const statusUI = getStatusUI(application.status);

            return (
              <Link
                key={application.id}
                href={`/mytask/${application.task.id}`}
              >
                <div
                  className="
                    group rounded-3xl border border-slate-200
                    bg-white p-6 shadow-sm
                    transition-all duration-300
                    hover:-translate-y-1 hover:shadow-xl
                    cursor-pointer
                  "
                >
                  <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">

                    {/* LEFT */}
                    <div className="flex-1">

                      {/* REQUESTER */}
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 overflow-hidden rounded-full bg-slate-200">
                          <img
                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${application.task.requester.fullName}`}
                            alt=""
                          />
                        </div>

                        <div>
                          <p className="font-semibold text-slate-800">
                            {application.task.requester.fullName}
                          </p>

                          <p className="text-xs text-slate-400">
                            Applied on{" "}
                            {new Date(
                              application.applied_at
                            ).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      {/* TITLE */}
                      <h2
                        className="
                          mt-5 text-2xl font-bold text-slate-900
                          transition group-hover:text-blue-600
                        "
                      >
                        {application.task.title}
                      </h2>

                      {/* DESCRIPTION */}
                      <p className="mt-3 line-clamp-2 text-slate-600">
                        {application.task.description}
                      </p>

                      {/* META */}
                      <div className="mt-5 flex flex-wrap gap-3">

                        <div
                          className="
                            flex items-center gap-2 rounded-full
                            bg-slate-100 px-3 py-1.5
                            text-sm text-slate-600
                          "
                        >
                          <MapPin size={14} />
                          <span className="max-w-[250px] truncate">
                            {application.task.location_text ||
                              "No location"}
                          </span>
                        </div>

                        <div
                          className="
                            flex items-center gap-2 rounded-full
                            bg-slate-100 px-3 py-1.5
                            text-sm text-slate-600
                          "
                        >
                          <Clock size={14} />
                          {new Date(
                            application.task.deadline
                          ).toLocaleDateString()}
                        </div>
                      </div>
                    </div>

                    {/* RIGHT */}
                    <div className="min-w-[220px]">

                      {/* PRICE */}
                      <div className="text-right">
                        <p className="text-xs uppercase tracking-wide text-slate-400">
                          Offered Price
                        </p>

                        <p className="mt-1 text-4xl font-black text-orange-600">
                          ${application.offered_price}
                        </p>
                      </div>

                      {/* STATUS */}
                      <div className="mt-6 flex justify-end">
                        <div
                          className={`
                            inline-flex items-center gap-2
                            rounded-full px-4 py-2
                            text-sm font-semibold
                            ${statusUI.className}
                          `}
                        >
                          {statusUI.icon}
                          {statusUI.label}
                        </div>
                      </div>

                      {/* CTA */}
                      <div className="mt-6 flex justify-end">
                        <div
                          className="
                            inline-flex items-center gap-2
                            text-sm font-semibold text-blue-600
                            transition group-hover:translate-x-1
                          "
                        >
                          View Details
                          <ChevronRight size={16} />
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}