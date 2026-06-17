"use client";

import { useEffect, useState } from "react";
import { adminService } from "@/services/adminService";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Users,
  FileText,
  CheckCircle,
  TrendingUp,
  ChevronRight,
  Layers,
  FilePlus2,
  ShieldCheck,
  Trophy,
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

interface DashboardUser {
  id: number;
  fullName: string;
  email: string;
  currentRole?: string;
  createdAt?: string;
  profileImage?: string | null;
}

interface DashboardTask {
  id: number;
  title: string;
  price?: number;
  status?: string;
  created_at?: string;
  requester?: {
    id?: number;
    fullName?: string;
    email?: string;
  } | null;
}

interface DashboardAssignment {
  id: number;
  status?: string;
  accepted_price?: number;
  created_at?: string;
  task?: { title?: string } | null;
  performer?: { fullName?: string; email?: string } | null;
}

interface DashboardApplication {
  id: number;
  status?: string;
  offered_price?: number;
  applied_at?: string;
  task?: {
    title?: string;
    requester?: {
      fullName?: string;
      email?: string;
    };
  } | null;
  performer?: {
    fullName?: string;
    email?: string;
  } | null;
}

interface DashboardNotification {
  id: number;
  title: string;
  message: string;
  audience?: string;
  is_read?: boolean;
  task_id?: number | null;
  created_at?: string;
}

interface RegistrationItem {
  name: string;
  role: string;
  time: string;
  avatar: string;
}

interface ActivityItem {
  type: string;
  title: string;
  user: string;
  status: string;
  value?: string;
  timestamp?: string;
}

interface GrowthItem {
  name: string;
  value: number;
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

const COLORS = {
  designer: "#8B5CF6",
  developer: "#3B82F6",
  writer: "#10B981",
};

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [newRegistrations, setNewRegistrations] = useState<RegistrationItem[]>([]);
  const [ongoingActivity, setOngoingActivity] = useState<ActivityItem[]>([]);
  const [userGrowthData, setUserGrowthData] = useState<GrowthItem[]>([]);
  const [activeAssignmentsCount, setActiveAssignmentsCount] = useState(0);
  const [completedAssignmentsCount, setCompletedAssignmentsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeFrame, setTimeFrame] = useState<"Daily" | "Weekly" | "Monthly">(
    "Daily",
  );

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const [statsData, usersData, tasksData, applicationsData, assignmentsData, notificationsData] =
          await Promise.all([
            adminService.getDashboardStats(),
            adminService.getUsers({ page: 1, limit: 5 }),
            adminService.getTasks(),
            adminService.getApplications({ page: 1, limit: 8 }),
            adminService.getAssignments({ page: 1, limit: 8 }),
            adminService.getAdminNotifications(),
          ]);

        const users = unwrapList<DashboardUser>(usersData);
        const tasks = unwrapList<DashboardTask>(tasksData);
        const applications = unwrapList<DashboardApplication>(applicationsData);
        const assignments = unwrapList<DashboardAssignment>(assignmentsData);
        const notifications = unwrapList<DashboardNotification>(notificationsData);

        setStats(statsData);
        setNewRegistrations(buildNewRegistrations(users));
        setActiveAssignmentsCount(
          assignments.filter((assignment) => assignment.status === "IN_PROGRESS").length,
        );
        setCompletedAssignmentsCount(
          assignments.filter((assignment) => assignment.status === "COMPLETED").length,
        );
        setOngoingActivity(
          buildOngoingActivity({
            applications,
            assignments,
            tasks,
            notifications,
          }),
        );
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

  useEffect(() => {
    const fetchGrowth = async () => {
      try {
        const data = await adminService.getUserGrowth(timeFrame);
        setUserGrowthData(data?.data ?? []);
      } catch (err) {
        console.error("Failed to fetch user growth data:", err);
        setUserGrowthData([]);
      }
    };

    fetchGrowth();
  }, [timeFrame]);

  const metrics = [
    {
      label: "Total Users",
      value: stats?.totalUsers ?? 0,
      icon: Users,
      color: "bg-blue-100",
      textColor: "text-blue-600",
      change: "+12%",
      trend: "up",
    },
    {
      label: "Total Tasks",
      value: stats?.totalTasks ?? 0,
      icon: FileText,
      color: "bg-purple-100",
      textColor: "text-purple-600",
      change: "+8%",
      trend: "up",
    },
    {
      label: "Active Assignments",
      value: stats?.activeAssignments ?? activeAssignmentsCount,
      icon: TrendingUp,
      color: "bg-green-100",
      textColor: "text-green-600",
      change: "Steady",
      trend: "steady",
    },
    {
      label: "Completed Tasks",
      value: stats?.completedAssignments ?? completedAssignmentsCount,
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
      case "Application":
        return (
          <div className="p-2.5 rounded-xl bg-cyan-50 text-cyan-600">
            <FileText size={18} />
          </div>
        );
      case "Assignment":
        return (
          <div className="p-2.5 rounded-xl bg-orange-50 text-orange-500">
            <Layers size={18} />
          </div>
        );
      case "New Task":
        return (
          <div className="p-2.5 rounded-xl bg-violet-50 text-violet-500">
            <FilePlus2 size={18} />
          </div>
        );
      case "Verification":
        return (
          <div className="p-2.5 rounded-xl bg-blue-50 text-blue-500">
            <ShieldCheck size={18} />
          </div>
        );
      case "Completed":
        return (
          <div className="p-2.5 rounded-xl bg-slate-100 text-slate-500">
            <Trophy size={18} />
          </div>
        );
      default:
        return (
          <div className="p-2.5 rounded-xl bg-slate-50 text-slate-400">
            <FileText size={18} />
          </div>
        );
    }
  };

  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case "ASSIGNED":
        return "bg-blue-100 text-blue-700";
      case "IN_PROGRESS":
        return "bg-blue-100 text-blue-700";
      case "ACCEPTED":
        return "bg-emerald-100 text-emerald-700";
      case "PENDING":
        return "bg-amber-100 text-amber-700";
      case "REJECTED":
        return "bg-rose-100 text-rose-700";
      case "URGENT":
        return "bg-rose-100 text-rose-700";
      case "ARCHIVED":
        return "bg-slate-100 text-slate-700";
      case "COMPLETED":
        return "bg-emerald-100 text-emerald-700";
      case "VERIFIED":
        return "bg-violet-100 text-violet-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  function formatTimeAgo(dateLike?: string) {
    if (!dateLike) return "just now";

    const date = new Date(dateLike);
    if (Number.isNaN(date.getTime())) return "just now";

    const diffMs = Date.now() - date.getTime();
    const diffMinutes = Math.max(1, Math.round(diffMs / 60000));

    if (diffMinutes < 60) return `${diffMinutes}m ago`;

    const diffHours = Math.round(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours}h ago`;

    const diffDays = Math.round(diffHours / 24);
    return `${diffDays}d ago`;
  }

  function getInitials(name?: string) {
    if (!name) return "NA";
    return name
      .split(" ")
      .filter(Boolean)
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }

  function formatCurrency(amount?: number) {
    if (typeof amount !== "number" || Number.isNaN(amount)) return undefined;
    return `$${amount.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
  }

  function unwrapList<T>(payload: any): T[] {
    if (Array.isArray(payload)) return payload as T[];
    if (Array.isArray(payload?.data)) return payload.data as T[];
    if (Array.isArray(payload?.data?.data)) return payload.data.data as T[];
    return [];
  }

  function buildNewRegistrations(users: DashboardUser[]): RegistrationItem[] {
    return [...users]
      .filter((user) => user.currentRole !== "ADMIN")
      .sort((a, b) => {
        const aTime = new Date(a.createdAt ?? 0).getTime();
        const bTime = new Date(b.createdAt ?? 0).getTime();
        return bTime - aTime;
      })
      .slice(0, 3)
      .map((user) => ({
        name: user.fullName,
        role: user.currentRole === "PERFORMER" ? "Performer" : "Requester",
        time: formatTimeAgo(user.createdAt),
        avatar: getInitials(user.fullName),
      }));
  }

  const topGrowthSegment = userGrowthData.reduce<GrowthItem | null>(
    (best, current) => {
      if (!best) return current;
      return current.value > best.value ? current : best;
    },
    null,
  );

  const maxGrowth = Math.max(...userGrowthData.map((item) => item.value), 1);

  function buildOngoingActivity(params: {
    applications: DashboardApplication[];
    assignments: DashboardAssignment[];
    tasks: DashboardTask[];
    notifications: DashboardNotification[];
  }): ActivityItem[] {
    const applicationItems: ActivityItem[] = (params.applications ?? [])
      .slice()
      .sort((a, b) => new Date(b.applied_at ?? 0).getTime() - new Date(a.applied_at ?? 0).getTime())
      .slice(0, 4)
      .map((app) => ({
        type: "Application",
        title: app.task?.title ? `Application for ${app.task.title}` : `Application #${app.id}`,
        user:
          app.performer?.fullName ||
          app.performer?.email ||
          app.task?.requester?.fullName ||
          "Unknown user",
        status: app.status || "PENDING",
        value: formatCurrency(app.offered_price),
        timestamp: app.applied_at,
      }));

    const assignmentItems: ActivityItem[] = (params.assignments ?? [])
      .slice()
      .sort((a, b) => new Date(b.created_at ?? 0).getTime() - new Date(a.created_at ?? 0).getTime())
      .slice(0, 4)
      .map((assignment) => ({
        type: "Assignment",
        title: assignment.task?.title ? `${assignment.task.title}` : `Assignment #${assignment.id}`,
        user: assignment.performer?.fullName || assignment.performer?.email || "Unknown performer",
        status: assignment.status || "ASSIGNED",
        value: formatCurrency(assignment.accepted_price),
        timestamp: assignment.created_at,
      }));

    const taskItems: ActivityItem[] = (params.tasks ?? [])
      .slice()
      .sort((a, b) => new Date(b.created_at ?? 0).getTime() - new Date(a.created_at ?? 0).getTime())
      .slice(0, 4)
      .map((task) => ({
        type: "New Task",
        title: task.title,
        user: task.requester?.fullName || task.requester?.email || "Task requester",
        status: task.status || "PENDING",
        value: formatCurrency(task.price),
        timestamp: task.created_at,
      }));

    const notificationItems: ActivityItem[] = (params.notifications ?? [])
      .slice()
      .sort((a, b) => new Date(b.created_at ?? 0).getTime() - new Date(a.created_at ?? 0).getTime())
      .slice(0, 4)
      .map((notification) => ({
        type: notification.title.includes("Verification")
          ? "Verification"
          : notification.title.includes("Applicant")
            ? "Application"
            : "Completed",
        title: notification.message.length > 80
          ? `${notification.message.slice(0, 77)}...`
          : notification.message,
        user: notification.audience === "admin" ? "Admin Queue" : "System",
        status: notification.is_read ? "ARCHIVED" : "URGENT",
        timestamp: notification.created_at,
      }));

    return [...taskItems, ...applicationItems, ...assignmentItems, ...notificationItems]
      .sort((a, b) => {
        const aTime = new Date(a.timestamp ?? 0).getTime();
        const bTime = new Date(b.timestamp ?? 0).getTime();
        return bTime - aTime;
      })
      .slice(0, 4);
  }

  return (
    <div className="min-h-screen p-4 space-y-8 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Dashboard Overview
          </h1>
          <p className="max-w-xl text-slate-500 text-sm font-medium leading-relaxed">
            Real-time system performance and user engagement metrics for
            TaskExchange.
          </p>
        </div>
        <div className="flex bg-white p-1 rounded-xl shadow-sm border border-slate-200 w-fit">
          {(["Daily", "Weekly", "Monthly"] as const).map((frame) => (
            <button
              key={frame}
              onClick={() => setTimeFrame(frame)}
              className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                timeFrame === frame
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {metrics.map((metric, index) => {
              const Icon = metric.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all relative overflow-hidden group"
                >
                  <div className="flex items-start justify-between relative z-10">
                    <div className="p-3 rounded-2xl bg-blue-50 text-blue-600 border border-blue-100/50">
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>

                  <div className="mt-8 space-y-1 relative z-10">
                    <p className="text-slate-500 text-sm font-semibold tracking-tight">
                      {metric.label}
                    </p>
                    <p className="text-4xl font-extrabold text-slate-900 tracking-tighter">
                      {metric.value.toLocaleString()}
                    </p>
                  </div>

                  {/* Circle Overlay Decoration */}
                  <div className="absolute -top-6 -right-6 w-36 h-36 bg-blue-100/50 rounded-full flex items-center justify-center pt-6 pr-6 transition-transform group-hover:scale-110">
                    <span
                      className={`text-[13px] font-bold tracking-tight ${
                        metric.trend === "up" ? "text-blue-600" : "text-slate-600"
                      }`}
                    >
                      {metric.change}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Tasks Velocity Chart */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/60 shadow-sm p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <h2 className="text-lg font-bold text-slate-900">
                  Tasks Velocity
                </h2>
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-blue-600"></div>
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Tasks Created
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-300"></div>
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Average Goal
                    </span>
                  </div>
                </div>
              </div>
              <div className="h-3/4 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={tasksVelocityData}>
                    <defs>
                      <linearGradient id="colorCreated" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1} />
                        <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid vertical={false} stroke="#f1f5f9" strokeDasharray="0" />
                    <XAxis
                      dataKey="day"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: 600 }}
                      dy={10}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: 600 }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#fff",
                        border: "1px solid #e2e8f0",
                        borderRadius: "12px",
                        boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                        fontSize: "12px",
                        fontWeight: 600,
                      }}
                    />
                    <Area
                      type="step"
                      dataKey="created"
                      stroke="#2563eb"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorCreated)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* User Growth Chart */}
            <div className="bg-[#0052CC] rounded-[2rem] shadow-xl p-8 sm:p-10 text-white flex flex-col">
              <h2 className="text-xl font-bold tracking-tight">User Growth</h2>
              <p className="text-blue-100 text-sm mt-2 mb-10 opacity-70">
                Current distribution of platform users by role.
              </p>

              <div className="space-y-8 flex-1">
                {userGrowthData.map((item) => (
                  <div key={item.name} className="space-y-3">
                    <div className="flex justify-between text-[11px] font-bold uppercase tracking-[0.1em] opacity-90">
                      <span>{item.name}</span>
                      <span>{item.value} new users</span>
                    </div>
                    <div className="h-2.5 bg-blue-800/40 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.4)]"
                        style={{ width: `${(item.value / maxGrowth) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-10 p-5 bg-white/10 rounded-2xl border border-white/10 backdrop-blur-sm">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-200">
                  Key Insight
                </p>
                <p className="text-sm mt-3 font-medium leading-relaxed italic opacity-90">
                  {topGrowthSegment
                    ? `${topGrowthSegment.name} are currently leading at ${topGrowthSegment.value}%.`
                    : "No user growth data is available yet."}
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* New Registrations */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-900">
                  New Registrations
                </h2>
                <a
                  href="#"
                  className="text-blue-600 text-xs font-bold uppercase tracking-wider hover:text-blue-700"
                >
                  View All
                </a>
              </div>
              <div className="space-y-4">
                {newRegistrations.map((user, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-md transition-all cursor-pointer group"
                  >
                    <div className="relative">
                      <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-slate-100">
                        <img
                          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
                          alt={user.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-900 truncate">
                        {user.name}
                      </p>
                      <p className="text-[11px] text-slate-500 font-medium uppercase tracking-wider">
                        {user.role} • {user.time}
                      </p>
                    </div>
                    <ChevronRight size={18} className="text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                ))}
              </div>
            </div>

            {/* Ongoing Activity */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-900">
                  Ongoing Activity Feed
                </h2>
                <a
                  href="#"
                  className="text-blue-600 text-xs font-bold uppercase tracking-wider hover:text-blue-700"
                >
                  Download Report
                </a>
              </div>
              <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50/80 border-b border-slate-200/60">
                        <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                          Context
                        </th>
                        <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                          Action / Task
                        </th>
                        <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                          Status
                        </th>
                        <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                          Value
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {ongoingActivity.map((activity, index) => (
                        <tr
                          key={index}
                          className="hover:bg-slate-50/40 transition-colors group border-b border-slate-50 last:border-0"
                        >
                          <td className="px-6 py-6">
                            <div className="flex items-center gap-4">
                              {getActivityIcon(activity.type)}
                              <span className="text-sm font-bold text-slate-700">
                                {activity.type}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-6">
                            <div className="max-w-xs">
                              <p className="text-sm font-extrabold text-slate-900 line-clamp-1 tracking-tight">
                                {activity.title}
                              </p>
                              <p className="text-xs text-slate-500 mt-1 font-medium">
                                {activity.user}
                              </p>
                            </div>
                          </td>
                          <td className="px-6 py-6">
                            <span
                              className={`px-3 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest ${getStatusBadgeStyle(
                                activity.status,
                              )}`}
                            >
                              {activity.status.replace("_", " ")}
                            </span>
                          </td>
                          <td className="px-6 py-6">
                            <span className="text-base font-extrabold text-slate-900 tabular-nums">
                              {activity.value || "--"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
