"use client";

import { CheckCircle2, MapPin, Calendar, DollarSign, Star } from "lucide-react";

interface WorkItem {
  id: number;
  title: string;
  description: string;
  tag: string;
  price?: number;
  completedAt?: string;
  requesterName?: string;
   rating?: number | null;     // ← add
  comment?: string | null;    // ← add
}

interface WorkHistoryProps {
  data: WorkItem[];
  setData: React.Dispatch<React.SetStateAction<WorkItem[]>>;
}

const tagColors = [
  "bg-sky-50 text-sky-700 border-sky-200",
  "bg-violet-50 text-violet-700 border-violet-200",
  "bg-emerald-50 text-emerald-700 border-emerald-200",
  "bg-amber-50 text-amber-700 border-amber-200",
  "bg-rose-50 text-rose-700 border-rose-200",
];

export default function WorkHistory({ data }: WorkHistoryProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-slate-200 rounded-[2rem] bg-slate-50/50">
        <CheckCircle2 className="w-8 h-8 text-slate-300 mb-3" />
        <p className="text-slate-500 font-medium">No completed tasks yet</p>
        <p className="text-slate-400 text-xs mt-1">Complete tasks to build your work history.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {data.map((item, index) => {
        const tagColor = tagColors[index % tagColors.length];

        return (
          <div
            key={item.id}
            className="group flex flex-col sm:flex-row items-stretch bg-white rounded-2xl border border-slate-100 hover:border-sky-200 hover:shadow-md transition-all duration-200"
          >
            {/* Left accent bar */}
            <div className="w-full sm:w-1 rounded-t-2xl sm:rounded-l-2xl sm:rounded-tr-none sm:min-h-0" />

            {/* Content */}
            <div className="flex-1 px-6 py-5 flex flex-col sm:flex-row sm:items-center gap-4">

              {/* Main info */}
              <div className="flex-1 min-w-0 space-y-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full border ${tagColor}`}>
                    {item.tag}
                  </span>
                  <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                    <CheckCircle2 className="w-3 h-3" /> Completed
                  </span>
                </div>

                <h4 className="text-base "></h4>
                <h4 className="text-base font-bold text-slate-900 truncate group-hover:text-sky-700 transition-colors">
                  {item.title}
                </h4>

                <p className="text-sm text-slate-500 line-clamp-1">
                  {item.description || "No description provided."}
                </p>

                {item.requesterName && (
                  <p className="text-xs text-slate-400">
                    Client: <span className="font-semibold text-slate-600">{item.requesterName}</span>
                  </p>
                )}
              </div>

              {/* Right meta */}
              <div className="flex sm:flex-col items-center sm:items-end gap-4 sm:gap-2 shrink-0">
                {item.price && (
                  <div className="flex items-center gap-1">
                    <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="text-lg font-black text-emerald-600">
                      {Number(item.price).toFixed(2)}
                    </span>
                  </div>
                )}

                {/* Rating stars */}

                {item.rating != null && (
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-3.5 h-3.5"
                        fill={i < Math.round(item.rating!) ? "#f59e0b" : "none"}
                        stroke={i < Math.round(item.rating!) ? "#f59e0b" : "#cbd5e1"}
                      />
                    ))}
                    <span className="text-xs font-bold text-amber-600 ml-1">
                      {Number(item.rating).toFixed(1)}
                    </span>
                  </div>
                )}


                {item.completedAt && (
                  <div className="flex items-center gap-1 text-xs text-slate-400">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(item.completedAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </div>
                )}
              </div>

              {/* Review comment */}

              {item.comment && (
                <div className="mt-3 pt-3 border-t border-slate-100">
                  <p className="text-xs text-slate-400 italic">
                    "{item.comment}"
                  </p>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}