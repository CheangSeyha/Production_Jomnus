"use client";

import { useState, useEffect, useCallback } from "react";
import api from "@/lib/axios";
import { ClipboardList, ShieldCheck, DollarSign, CheckCircle2, Star, Zap } from "lucide-react";

interface StatsProps {
  data: any;
}

export default function StatsManagement({ data }: StatsProps) {
  const [role, setRole] = useState(data?.currentRole || "REQUESTER");
  const [loading, setLoading] = useState(false);
  const profileId = data?.id;

  const [requester_stats, setRequesterStats] = useState({
    tasks_posted: 0,
    tasks_verified: 0,
    total_spent: 0,
  });

  const [performer_stats, setPerformerStats] = useState({
    completed_tasks: 0,
    avg_rating: 0,
    response_time: 0,
  });

  const loadAllMetrics = useCallback(async () => {
    if (!profileId) return;
    try {
      await api.post("/stats/refresh");
      const [reqRes, perfRes] = await Promise.allSettled([
        api.get(`/stats/requester/${profileId}`),
        api.get(`/stats/performer/${profileId}`),
      ]);
      if (reqRes.status === "fulfilled") setRequesterStats(reqRes.value.data);
      if (perfRes.status === "fulfilled") setPerformerStats(perfRes.value.data);
    } catch (error) {
      console.error("Error loading metrics:", error);
    }
  }, [profileId]);

  useEffect(() => {
    loadAllMetrics();
  }, [loadAllMetrics]);

  const handleSwitchRole = async (newRole: "REQUESTER" | "PERFORMER") => {
    if (newRole === role) return;
    try {
      setLoading(true);
      const res = await api.patch("/users/me/switch-role", { role: newRole });
      const { access_token } = res.data;
      if (access_token) localStorage.setItem("access_token", access_token);
      setRole(newRole);
      await loadAllMetrics();
    } catch (error: any) {
      console.error("Switch role failed:", error);
      alert(error.response?.data?.message || "Could not switch role.");
    } finally {
      setLoading(false);
    }
  };

  const isRequester = role === "REQUESTER";

  const requesterCards = [
    {
      label: "Tasks posted",
      value: requester_stats?.tasks_posted ?? 0,
      sub: "Total tasks created",
      icon: ClipboardList,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
      trend: "+3 this month",
      trendColor: "bg-emerald-50 text-emerald-700",
    },
    {
      label: "Verified tasks",
      value: requester_stats?.tasks_verified ?? 0,
      sub: "Successfully completed",
      icon: ShieldCheck,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
      trend: "All time",
      trendColor: "bg-slate-100 text-slate-500",
    },
    {
      label: "Total invested",
      value: `$${(requester_stats?.total_spent ?? 0).toLocaleString()}`,
      sub: "Across all tasks",
      icon: DollarSign,
      iconBg: "bg-amber-50",
      iconColor: "text-amber-600",
      trend: "All time",
      trendColor: "bg-slate-100 text-slate-500",
    },
  ];

  const performerCards = [
    {
      label: "Tasks completed",
      value: performer_stats?.completed_tasks ?? 0,
      sub: "Verified by requesters",
      icon: CheckCircle2,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
      trend: "All time",
      trendColor: "bg-slate-100 text-slate-500",
    },
    {
      label: "Average rating",
      value: Number(performer_stats?.avg_rating ?? 0).toFixed(1),
      sub: `From ${performer_stats?.completed_tasks ?? 0} reviews`,
      icon: Star,
      iconBg: "bg-amber-50",
      iconColor: "text-amber-600",
      trend: "Top performer",
      trendColor: "bg-emerald-50 text-emerald-700",
    },
    {
      label: "Response time",
      value: `${performer_stats?.response_time ?? 0}m`,
      sub: "Minutes to respond",
      icon: Zap,
      iconBg: "bg-violet-50",
      iconColor: "text-violet-600",
      trend: "Avg response",
      trendColor: "bg-slate-100 text-slate-500",
    },
  ];

  const cards = isRequester ? requesterCards : performerCards;

  return (
    <div className="space-y-6">

      {/* Role tabs */}
      <div className="flex gap-2">
        {(["REQUESTER", "PERFORMER"] as const).map((r) => (
          <button
            key={r}
            onClick={() => handleSwitchRole(r)}
            disabled={loading}
            className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
              role === r
                ? "bg-blue-600 text-white"
                : "bg-slate-100 text-slate-500 hover:bg-slate-200"
            }`}
          >
            {loading && role !== r && (
              <span className="inline-block w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
            )}
            {r.charAt(0) + r.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {cards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-white border border-sky-200 bg-border-blue-100 rounded-2xl p-5 flex flex-col gap-3"
            >
              <div className="flex items-center justify-between">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${stat.iconBg}`}>
                  <Icon className={`w-7 h-7 ${stat.iconColor}`} />
                </div>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${stat.trendColor}`}>
                  {stat.trend}
                </span>
              </div>
              <div>
                <p className="text-1xl font-medium text-slate-400 mb-1">{stat.label}</p>
                <p className="text-4xl font-black text-slate-900 leading-none">{stat.value}</p>
                <p className="text-xs text-slate-400 mt-1">{stat.sub}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}