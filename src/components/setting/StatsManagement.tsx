// src/components/dashboard/setting/StatsManagement.tsx

interface StatsProps {
  data: any; // The full user object from your backend
}

export default function StatsManagement({ data }: StatsProps) {
  // 1. Identify the role and stats
  const isRequester = data?.currentRole === "REQUESTER";
  const requester = data?.requesterStats || { tasks_posted: 0, tasks_verified: 0, total_spent: 0 };
  const performer = data?.performerStats || { completed_tasks: 0, success_rate: 0, response_time: 0 };

  // 2. Define the display config based on the role
  const statsToDisplay = isRequester 
    ? [
        { label: "Tasks Posted", value: requester.tasks_posted, icon: "📝", color: "bg-orange-500" },
        { label: "Verified Tasks", value: requester.tasks_verified, icon: "🛡️", color: "bg-green-500" },
        { label: "Total Investment", value: `$${requester.total_spent}`, icon: "💰", color: "bg-blue-500" },
      ]
    : [
        { label: "Tasks Completed", value: performer.completed_tasks, icon: "✅", color: "bg-blue-500" },
        { label: "Success Rate", value: `${performer.success_rate}%`, icon: "🎯", color: "bg-purple-500" },
        { label: "Response Time", value: `${performer.response_time}m`, icon: "⚡", color: "bg-yellow-500" },
      ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {statsToDisplay.map((stat) => (
        <div key={stat.label} className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm relative overflow-hidden group hover:border-slate-200 transition-all">
          {/* Vertical accent bar */}
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
  );
}