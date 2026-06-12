"use client";
 
import { MapPin, Clock, ArrowUpRight, CheckCircle2 } from "lucide-react";
import { getTaskBadges } from "../../utils/taskBadge";
import { getFakeInterest } from "@/utils/random";
import { Task } from "@/types/task";
import { useRouter } from "next/navigation";
 
type Props = {
  task: Task;
  onOpen: (task: Task) => void;
  onApply: (task: Task) => void;
  isSelected?: boolean;
};
 
export default function DetailTaskCard({ task, onOpen, onApply, isSelected = false }: Props) {
  const router = useRouter();
  const formatDate = (date?: string) => {
    if (!date) return "No date";
    const d = new Date(date);
    return isNaN(d.getTime())
      ? "Invalid date"
      : d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };
 
  const handleProfileClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (task.requester_id) {
      router.push(`/profile/${task.requester_id}`);
    } else {
      console.error("Missing requester_id", task);
      alert("Cannot open profile: User ID is missing.");
    }
  };
 
  const deadlineDate = new Date(task.deadline);
  const daysLeft = Math.ceil(
    (deadlineDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );
  const isUrgent = daysLeft <= 3 && daysLeft >= 0;
 
  return (
    <article
      onClick={() => onOpen(task)}
      className={`group relative cursor-pointer overflow-hidden rounded-2xl border transition-all duration-300 hover:-translate-y-0.5 ${
        isSelected
          ? "border-sky-400 bg-sky-50 shadow-[0_18px_44px_rgba(14,165,233,0.24)] ring-2 ring-sky-300/70"
          : "border-sky-100 bg-white shadow-[0_8px_28px_rgba(14,165,233,0.08)] hover:border-sky-300 hover:shadow-[0_18px_40px_rgba(14,165,233,0.18)]"
      }`}
    >
			
 
      <div className="p-6 space-y-5">
 
        <div className="flex items-start justify-between gap-4">
 
          <button
            onClick={handleProfileClick}
            className="flex items-center gap-3 group/profile min-w-0"
          >


            <div className="relative shrink-0">
              {task.requester?.profileImage ? (
                  <img
                      src={task.requester.profileImage}
                      alt={task.requester.fullName || "Unknown"}
                      className="w-10 h-10 rounded-xl object-cover ring-2 ring-sky-100"
                  />
              ) : (
                  <div className="w-10 h-10 rounded-xl bg-sky-100 border border-sky-200 ring-2 ring-sky-100 flex items-center justify-center text-sky-700 text-sm font-bold">
                    {(task.requester?.fullName || task.requesterName || "?")
                        .charAt(0)
                        .toUpperCase()}
                  </div>
              )}
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 border-2 border-white rounded-full" />
            </div>
            <div className="text-left min-w-0">
              <div className="flex flex-row gap-3">
                <p className="text-sm font-semibold text-slate-800 transition-colors truncate group-hover/profile:text-sky-700">
                  {(task as any)?.requester?.fullName || task.requesterName}
                </p>
                {task.requester?.isIdentityVerified && (
                  <span className="text-green-500 shrink-0" title="Verified">
                    <CheckCircle2 className="w-4 h-4" />
                  </span>
                )}                
              </div>

              <p className="text-xs text-slate-500">
                {formatDate(task.startDate || task.createdAt)}
              </p>
            </div>
          </button>
 
          {/* Budget badge */}
          <div className="shrink-0 rounded-2xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-right">
            <p className="mb-0.5 text-[10px] font-bold uppercase tracking-widest text-emerald-600">Budget</p>
            <p className="text-2xl font-black text-emerald-700 leading-none">
              ${task.price}
            </p>
          </div>
        </div>
 
        {/* TITLE + DESCRIPTION */}
        <div className="space-y-1.5">
          <h2 className="text-lg font-bold text-slate-950 leading-snug transition-colors line-clamp-2 group-hover:text-sky-700">
            {task.title}
          </h2>
          <p className="text-sm text-slate-500 leading-relaxed line-clamp-2">
            {task.description}
          </p>
        </div>
 
        {/* META ROW */}
        <div className="flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-lg border border-sky-200 bg-sky-50 px-3 py-1.5 text-xs font-semibold text-sky-800">
            <MapPin size={12} className="text-sky-500 shrink-0" />
            <span className="truncate max-w-[180px]">{task.locationText || "No location"}</span>
          </span>
 
          <span className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium border ${
            isUrgent
              ? "bg-rose-50 border-rose-200 text-rose-700"
              : "bg-indigo-50 border-indigo-200 text-indigo-700"
          }`}>
            <Clock size={12} className={isUrgent ? "text-rose-500" : "text-indigo-500"} />
            {isUrgent
              ? `${daysLeft}d left!`
              : `Due ${deadlineDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`}
          </span>
        </div>
 
        {/* ACTION */}
        <div className="pt-1">
          {task.hasApplied ? (
            <div className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-semibold">
              <CheckCircle2 size={15} />
              Applied
            </div>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onApply(task);
              }}
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-sky-600 hover:bg-cyan-500 text-white text-sm font-semibold transition-colors duration-200 group/btn shadow-sm shadow-sky-200"
            >
              Apply for Task
              <ArrowUpRight
                size={15}
                className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform duration-200"
              />
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
