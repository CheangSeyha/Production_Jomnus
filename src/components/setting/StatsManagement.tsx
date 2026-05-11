"use client";

import { useState, useEffect } from "react";
import axios from "axios";

interface StatsProps {
  data: any; // Ideally, replace 'any' with your User model type
}

export default function StatsManagement({ data }: StatsProps) {
  const [role, setRole] = useState(data?.currentRole || "REQUESTER");
  const [loading, setLoading] = useState(false);

  const [requesterStats, setRequesterStats] = useState({
    tasks_posted: 0,
    tasks_verified: 0,
    total_spent: 0,
  });

  const [performerStats, setPerformerStats] = useState({
    completed_tasks: 0,
    success_rate: 0,
    response_time: 0,
  });

  // Sync state if 'data' prop updates from the parent
  useEffect(() => {
    if (data) {
      setRole(data.currentRole || "REQUESTER");
      if (data.requesterStats) setRequesterStats(data.requesterStats);
      if (data.performerStats) setPerformerStats(data.performerStats);
    }
  }, [data]);

  const isRequester = role === "REQUESTER";

  // const handleSwitchRole = async (newRole: "REQUESTER" | "PERFORMER") => {
  //   if (newRole === role) return;

  //   try {
  //     setLoading(true);
  //     const token = localStorage.getItem("access_token");

  //     const res = await axios.patch(
  //       "http://localhost:3001/api/users/switch-role",
  //       { role: newRole },
  //       { headers: { Authorization: `Bearer ${token}` } }
  //     );

  //     // Backend should return the updated user object or the stats
  //     setRole(newRole);
      
  //     if (res.data?.requesterStats) setRequesterStats(res.data.requesterStats);
  //     if (res.data?.performerStats) setPerformerStats(res.data.performerStats);
      
  //   } catch (error) {
  //     console.error("Switch role failed:", error);
  //     alert("Could not switch role. Please try again.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };


  const handleSwitchRole = async (newRole: "REQUESTER" | "PERFORMER") => {
  if (newRole === role) return;

  try {
    setLoading(true);
    const token = localStorage.getItem("access_token");

    const res = await axios.patch(
      "http://localhost:3001/api/users/me/switch-role", // Ensure URL matches your backend route
      { role: newRole },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    // 1. Destructure the data coming from the backend
    const { user, access_token, requesterStats, performerStats } = res.data;

    // 2. IMPORTANT: Save the new token (it contains the new role claim)
    if (access_token) {
      localStorage.setItem("access_token", access_token);
    }

    // 3. Update the UI state
    setRole(newRole);
    
    // 4. Update stats based on what the backend returned
    if (requesterStats) setRequesterStats(requesterStats);
    if (performerStats) setPerformerStats(performerStats);
    
    // Optional: If you have a global user context/store, update it here:
    // updateUser(user); 

  } catch (error: any) {
    console.error("Switch role failed:", error);
    // Display the specific error from the backend (e.g., "Identity verification required")
    alert(error.response?.data?.message || "Could not switch role.");
  } finally {
    setLoading(false);
  }
};


  const statsToDisplay = isRequester
    ? [
        {
          label: "Tasks Posted",
          value: requesterStats.tasks_posted ?? 0, // Fallback to 0 if null
          icon: "📝",
          color: "bg-orange-500",
        },
        {
          label: "Verified Tasks",
          value: requesterStats.tasks_verified ?? 0,
          icon: "🛡️",
          color: "bg-green-500",
        },
        {
          label: "Total Investment",
          value: `$${(requesterStats.total_spent ?? 0).toLocaleString()}`, // Format currency
          icon: "💰",
          color: "bg-blue-500",
        },
      ]
    : [
        {
          label: "Tasks Completed",
          value: performerStats.completed_tasks ?? 0,
          icon: "✅",
          color: "bg-blue-500",
        },
        {
          label: "Success Rate",
          value: `${performerStats.success_rate ?? 0}%`,
          icon: "🎯",
          color: "bg-purple-500",
        },
        {
          label: "Response Time",
          value: `${performerStats.response_time ?? 0}m`,
          icon: "⚡",
          color: "bg-yellow-500",
        },
      ];

  return (
    <div>
      <div className="flex gap-3 mb-6">
        <button
          onClick={() => handleSwitchRole("REQUESTER")}
          disabled={loading}
          className={`px-4 py-2 rounded-xl font-semibold transition flex items-center gap-2 ${
            isRequester ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          {loading && !isRequester && <span className="animate-spin text-xs">🌀</span>}
          Requester
        </button>

        <button
          onClick={() => handleSwitchRole("PERFORMER")}
          disabled={loading}
          className={`px-4 py-2 rounded-xl font-semibold transition flex items-center gap-2 ${
            !isRequester ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          {loading && isRequester && <span className="animate-spin text-xs">🌀</span>}
          Performer
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {statsToDisplay.map((stat) => (
          <div key={stat.label} className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm relative overflow-hidden group hover:border-slate-200 transition-all">
            <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${stat.color} opacity-80`}></div>
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                <h3 className="text-3xl font-black text-slate-800 tracking-tighter">{stat.value}</h3>
              </div>
              <div className="p-2 bg-slate-50 rounded-xl group-hover:scale-110 transition-transform">
                <span className="text-xl">{stat.icon}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}