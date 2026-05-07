"use client";

import { useEffect, useState } from "react";
import { adminService } from "@/services/adminService";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import {
  Users,
  FileText,
  CheckCircle,
  TrendingUp,
  Filter,
  Calendar,
} from "lucide-react";

interface DashboardStats {
  totalUsers: number;
  totalTasks: number;
  totalAssignments: number;
  totalVerifications: number;
  completedAssignments: number;
  activeAssignments: number;
  pendingVerifications: number;
  approvedVerifications: number;
}

// Sample data for charts
const tasksVelocityData = [
  { day: "MON", created: 4000, goal: 2400 },
  { day: "TUE", created: 3000, goal: 1398 },
  { day: "WED", created: 2000, goal: 9800 },
  { day: "THU", created: 2780, goal: 3908 },
  { day: "FRI", created: 1890, goal: 4800 },
  { day: "SAT", created: 2390, goal: 3800 },
  { day: "SUN", created: 3490, goal: 4300 },
];

const userGrowthData = [
  { name: "Designers", value: 68 },
  { name: "Developers", value: 82 },
  { name: "Writers", value: 45 },
];

const newRegistrations = [
  { name: "Sarah Jenkins", role: "UX Designer", time: "2m ago", avatar: "SJ" },
  {
    name: "Marcus Thorne",
    role: "Fullstack Dev",
    time: "15m ago",
    avatar: "MT",
  },
  {
    name: "Lydia Chen",
    role: "Content Strategist",
    time: "1h ago",
    avatar: "LC",
  },
];

const ongoingActivity = [
  {
    type: "Assignment",
    title: "Logo Redesign for FinTech Startup",
    user: "Sarah Jenkins",
    status: "IN_PROGRESS",
    value: "$1,200",
  },
  {
    type: "New Task",
    title: "Express.js API Optimization",
    user: "TechCorp Solutions",
    status: "PENDING",
    value: "$850",
  },
  {
    type: "Verification",
    title: "Identity Check: Marcus Thorne",
    user: "Manual Review Required",
    status: "URGENT",
  },
  {
    type: "Completed",
    title: "SEO Audit for E-commerce",
    user: "Processed Payment #9021",
    status: "ARCHIVED",
    value: "$450",
  },
];

const COLORS = {
  designer: "#8B5CF6",
  developer: "#3B82F6",
  writer: "#10B981",
};

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeFrame, setTimeFrame] = useState<"Daily" | "Weekly" | "Monthly">(
    "Daily",
  );

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await adminService.getDashboardStats();
        setStats(data);
        setError(null);
      } catch (err) {
        setError("Failed to fetch dashboard stats");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const metrics = [
    {
      label: "Total Users",
      value: stats?.totalUsers || 24592,
      icon: Users,
      color: "bg-blue-100",
      textColor: "text-blue-600",
      change: "+12%",
      trend: "up",
    },
    {
      label: "Total Tasks",
      value: stats?.totalTasks || 12840,
      icon: FileText,
      color: "bg-purple-100",
      textColor: "text-purple-600",
      change: "+8%",
      trend: "up",
    },
    {
      label: "Active Assignments",
      value: stats?.activeAssignments || 1204,
      icon: TrendingUp,
      color: "bg-green-100",
      textColor: "text-green-600",
      change: "Steady",
      trend: "steady",
    },
    {
      label: "Completed Tasks",
      value: stats?.completedAssignments || 9412,
      icon: CheckCircle,
      color: "bg-emerald-100",
      textColor: "text-emerald-600",
      change: "+24%",
      trend: "up",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "IN_PROGRESS":
        return "text-blue-600 bg-blue-50";
      case "PENDING":
        return "text-yellow-600 bg-yellow-50";
      case "URGENT":
        return "text-red-600 bg-red-50";
      case "ARCHIVED":
        return "text-gray-600 bg-gray-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "Assignment":
        return "📌";
      case "New Task":
        return "📝";
      case "Verification":
        return "✓";
      case "Completed":
        return "🎉";
      default:
        return "📋";
    }
  };

  return (
    <div className="min-h-screen  bg-gradient-to-br from-slate-50 to-slate-100 p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">
            Dashboard Overview
          </h1>
          <p className="text-gray-600 mt-2">
            Real-time system performance and user engagement metrics for
            TaskExchange.
          </p>
        </div>
        <div className="flex gap-2">
          {(["Daily", "Weekly", "Monthly"] as const).map((frame) => (
            <button
              key={frame}
              onClick={() => setTimeFrame(frame)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                timeFrame === frame
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              {frame}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {error}
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600"></div>
        </div>
      )}

      {!loading && !error && (
        <>
          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {metrics.map((metric, index) => {
              const Icon = metric.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`${metric.color} p-3 rounded-lg`}>
                      <Icon className={`${metric.textColor} w-6 h-6`} />
                    </div>
                    <span
                      className={`text-sm font-bold ${
                        metric.trend === "up"
                          ? "text-green-600"
                          : metric.trend === "down"
                            ? "text-red-600"
                            : "text-gray-600"
                      }`}
                    >
                      {metric.change}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm font-medium">
                    {metric.label}
                  </p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {metric.value.toLocaleString()}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Tasks Velocity Chart */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">
                  Tasks Velocity
                </h2>
                <div className="flex gap-3">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <span className="text-sm text-gray-600">Tasks Created</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                    <span className="text-sm text-gray-600">Average Goal</span>
                  </div>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={tasksVelocityData}>
                  <defs>
                    <linearGradient
                      id="colorCreated"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="day" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="created"
                    stroke="#3B82F6"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorCreated)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* User Growth Chart */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">
                User Growth
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                Comparison of new registrations vs churn rates this week:
              </p>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart
                  data={userGrowthData}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 100 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis type="number" stroke="#9CA3AF" />
                  <YAxis dataKey="name" type="category" stroke="#9CA3AF" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="value" fill="#3B82F6" radius={[0, 8, 8, 0]}>
                    {userGrowthData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          index === 0
                            ? COLORS.designer
                            : index === 1
                              ? COLORS.developer
                              : COLORS.writer
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* New Registrations */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">
                  New Registrations
                </h2>
                <a
                  href="#"
                  className="text-blue-600 text-sm font-medium hover:text-blue-700"
                >
                  View All
                </a>
              </div>
              <div className="space-y-4">
                {newRegistrations.map((user, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xs font-bold">
                      {user.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        {user.name}
                      </p>
                      <p className="text-xs text-gray-600">{user.role}</p>
                    </div>
                    <p className="text-xs text-gray-500 whitespace-nowrap">
                      {user.time}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Ongoing Activity */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">
                Ongoing Activity Feed
              </h2>
              <div className="space-y-3">
                {ongoingActivity.map((activity, index) => (
                  <div
                    key={index}
                    className={`flex items-start gap-4 p-4 rounded-lg border transition-colors ${getStatusColor(
                      activity.status,
                    )}`}
                  >
                    <span className="text-2xl flex-shrink-0">
                      {getActivityIcon(activity.type)}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-medium text-gray-900 text-sm">
                            {activity.title}
                          </p>
                          <p className="text-xs text-gray-600 mt-1">
                            {activity.user}
                          </p>
                        </div>
                        {activity.value && (
                          <span className="text-sm font-semibold text-gray-900 flex-shrink-0">
                            {activity.value}
                          </span>
                        )}
                      </div>
                      <div className="mt-2 inline-block">
                        <span className="text-xs font-medium px-2 py-1 rounded bg-white bg-opacity-50">
                          {activity.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <a
                href="#"
                className="text-blue-600 text-sm font-medium hover:text-blue-700 mt-4 block"
              >
                Download Report →
              </a>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
