"use client";

import { useState, useEffect, useCallback } from "react";
import api from "@/lib/axios";
import { CheckCircle2, ClipboardList, DollarSign, ShieldCheck, Star, Zap } from "lucide-react";

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

  // ✅ FIX: Create a single load handler to pull all data points together
  const loadAllMetrics = useCallback(async () => {
    if (!profileId) return;
    
    try {
      // ✅ Refresh stats first before fetching
    await api.post('/stats/refresh');

      const [reqRes, perfRes] = await Promise.allSettled([
        api.get(`/stats/requester/${profileId}`),
        api.get(`/stats/performer/${profileId}`)
      ]);

      if (reqRes.status === "fulfilled") {
        setRequesterStats(reqRes.value.data);
      }
      if (perfRes.status === "fulfilled") {
        setPerformerStats(perfRes.value.data);
      }
    } catch (error) {
      console.error("Error loading metrics:", error);
    }
  }, [profileId]);

  // ✅ Fetch everything on mount instantly
  useEffect(() => {
    loadAllMetrics();
  }, [loadAllMetrics]);

  const isRequester = role === "REQUESTER";

  const handleSwitchRole = async (newRole: "REQUESTER" | "PERFORMER") => {
    if (newRole === role) return;

    try {
      setLoading(true);
      const res = await api.patch("/users/me/switch-role", { role: newRole });
      const { access_token } = res.data;

      if (access_token) {
        localStorage.setItem("access_token", access_token);
      }

      setRole(newRole);
      
      // ✅ Refresh the local values from the source after a successful role switch
      await loadAllMetrics();

    } catch (error: any) {
      console.error("Switch role failed:", error);
      alert(error.response?.data?.message || "Could not switch role.");
    } finally {
      setLoading(false);
    }
  };

  const statsToDisplay = isRequester
    ? [
        {
          label: "Tasks Posted",
          value: requester_stats?.tasks_posted ?? 0,
          icon: ClipboardList,
          color: "bg-orange-300",
        },
        {
          label: "Verified Tasks",
          value: requester_stats?.tasks_verified ?? 0,
          icon: ShieldCheck,
          color: "bg-green-300",
        },
        {
          label: "Total Investment",
          value: `$${(requester_stats?.total_spent ?? 0).toLocaleString()}`,
          icon: DollarSign,
          color: "bg-blue-300",
        },
      ]
    : [
        {
          label: "Tasks Completed",
          value: performer_stats?.completed_tasks ?? 0,
          icon: CheckCircle2,
          color: "bg-blue-300",
        },
        {
          label: "Average Rating",
          value: `${performer_stats?.avg_rating ?? 0}`,
          icon: Star,
          color: "bg-purple-300",
        },
        {
          label: "Response Time",
          value: `${performer_stats?.response_time ?? 0}m`,
          icon: Zap,
          color: "bg-yellow-300",
        },
      ];

  return (
    <div className="space-y-8">
      {/* Role Switch */}
      <div className="flex gap-4">
        <button
          onClick={() => handleSwitchRole("REQUESTER")}
          disabled={loading}
          className={`px-6 py-2.5 rounded-full font-semibold flex items-center gap-2 transition-all ${
            isRequester
              ? "bg-blue-600 text-white shadow-md shadow-blue-200"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          {loading && !isRequester && <span className="animate-spin text-xs">🌀</span>}
          Requester
        </button>

        <button
          onClick={() => handleSwitchRole("PERFORMER")}
          disabled={loading}
          className={`px-6 py-2.5 rounded-full font-semibold flex items-center gap-2 transition-all ${
            !isRequester
              ? "bg-blue-600 text-white shadow-md shadow-blue-200"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          {loading && isRequester && <span className="animate-spin text-xs">🌀</span>}
          Performer
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {statsToDisplay.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-white border border-slate-100 p-8 rounded-3xl shadow-sm relative overflow-hidden group hover:shadow-lg hover:border-slate-200 transition-all"
            >
              <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${stat.color} opacity-80`} />
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                    {stat.label}
                  </p>
                  <h3 className="text-5xl font-extrabold text-slate-900 tracking-tight">
                    {stat.value}
                  </h3>
                </div>
                <div className="p-3 rounded-xl group-hover:scale-110 transition-transform">
                  {Icon && <Icon className="w-9 h-9 text-slate-700" />}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}