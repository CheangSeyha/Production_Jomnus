"use client";

import { useState } from "react";
import axios from "axios";

interface StatsProps {
  data: any;
}

export default function StatsManagement({ data }: StatsProps) {
  const [role, setRole] = useState(data?.currentRole || "REQUESTER");
  const [loading, setLoading] = useState(false);

  // ✅ ONLY CHANGE: move stats into state
  const [requesterStats, setRequesterStats] = useState(
    data?.requesterStats || {
      tasks_posted: 0,
      tasks_verified: 0,
      total_spent: 0,
    }
  );

  const [performerStats, setPerformerStats] = useState(
    data?.performerStats || {
      completed_tasks: 0,
      success_rate: 0,
      response_time: 0,
    }
  );

  const isRequester = role === "REQUESTER";

  // ✅ FIX: update stats after switching role
  const handleSwitchRole = async (newRole: "REQUESTER" | "PERFORMER") => {
    if (newRole === role) return;

    try {
      setLoading(true);

      const res = await axios.patch(
        "http://localhost:3001/api/users/role",
        { role: newRole },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );

      

      setRole(newRole);

      // ✅ update UI instantly (no refresh needed)
      if (res.data?.requesterStats) {
        setRequesterStats(res.data.requesterStats);
      }

      if (res.data?.performerStats) {
        setPerformerStats(res.data.performerStats);
      }
    } catch (error) {
      console.error("Switch role failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const statsToDisplay = isRequester
    ? [
        {
          label: "Tasks Posted",
          value: requesterStats.tasks_posted,
          icon: "📝",
          color: "bg-orange-500",
        },
        {
          label: "Verified Tasks",
          value: requesterStats.tasks_verified,
          icon: "🛡️",
          color: "bg-green-500",
        },
        {
          label: "Total Investment",
          value: `$${requesterStats.total_spent}`,
          icon: "💰",
          color: "bg-blue-500",
        },
      ]
    : [
        {
          label: "Tasks Completed",
          value: performerStats.completed_tasks,
          icon: "✅",
          color: "bg-blue-500",
        },
        {
          label: "Success Rate",
          value: `${performerStats.success_rate}%`,
          icon: "🎯",
          color: "bg-purple-500",
        },
        {
          label: "Response Time",
          value: `${performerStats.response_time}m`,
          icon: "⚡",
          color: "bg-yellow-500",
        },
      ];

  return (
    <div>
      {/* 🔥 Toggle Button */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={() => handleSwitchRole("REQUESTER")}
          disabled={loading}
          className={`px-4 py-2 rounded-xl font-semibold transition ${
            isRequester
              ? "bg-blue-600 text-white"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          {loading && !isRequester ? "Switching..." : "Requester"}
        </button>

        <button
          onClick={() => handleSwitchRole("PERFORMER")}
          disabled={loading}
          className={`px-4 py-2 rounded-xl font-semibold transition ${
            !isRequester
              ? "bg-blue-600 text-white"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          {loading && isRequester ? "Switching..." : "Performer"}
        </button>
      </div>

      {/* 📊 Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {statsToDisplay.map((stat) => (
          <div
            key={stat.label}
            className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm relative overflow-hidden group hover:border-slate-200 transition-all"
          >
            <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${stat.color} opacity-80`}></div>

            <div className="flex justify-between items-start">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                  {stat.label}
                </p>
                <h3 className="text-3xl font-black text-slate-800 tracking-tighter">
                  {stat.value}
                </h3>
              </div>

              <div className="p-2 bg-slate-50 rounded-xl group-hover:scale-110 transition-transform">
                <span className="text-xl">{stat.icon}</span>
              </div>
            </div>

            <div className="mt-6 flex items-center gap-2">
              <input
                type="checkbox"
                className="w-3.5 h-3.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                defaultChecked
              />
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">
                Show on public profile
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}