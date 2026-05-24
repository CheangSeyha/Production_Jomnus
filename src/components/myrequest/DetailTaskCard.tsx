"use client";

import { MapPin, Clock, Info } from "lucide-react";
import { getTaskBadges } from "../../utils/taskBadge";
import { getFakeInterest } from "@/utils/random";
import { Task } from "@/types/task";
import { useRouter } from "next/navigation";

type Props = {
  task: Task;
  onOpen: (task: Task) => void;
	onApply: (task: Task) => void;
};



export default function DetailTaskCard({ task, onOpen, onApply }: Props) {

		const router = useRouter();

		const formatDate = (date?: string) => {
			if (!date) return "No date";
			const d = new Date(date);
			return isNaN(d.getTime()) ? "Invalid date" : d.toLocaleString();
		};
		

		const badges = getTaskBadges(task);
		const interest = getFakeInterest(task.id)

		const handleProfileClick = (e: React.MouseEvent) => {
			e.stopPropagation();

			if (task.requester_id) {
				router.push(`/profile/${task.requester_id}`);
			} else {
				console.error("Missing requester_id", task);
				alert("Cannot open profile: User ID is missing.");
			}
		};
		
    return (
		<div
			onClick={() => onOpen(task)}
			className="
				bg-white rounded-3xl border border-slate-200
				hover:border-blue-300
				shadow-sm hover:shadow-xl
				transition-all duration-300
				overflow-hidden group cursor-pointer
				hover:-translate-y-1
			"
		>

			
      <div className="p-5 space-y-5">
        {/* HEADER */}

				<div className="flex items-start justify-between gap-4">
					<div
						onClick={handleProfileClick}
						className="flex items-center gap-3"
					>
						<div className="relative">
							<img
								src={
									(task as any)?.requester?.profile_image ||
									`https://api.dicebear.com/7.x/avataaars/svg?seed=${
										(task as any)?.requester?.fullName || "unknown"
									}`
								}
								alt={(task as any)?.requester?.fullName || "Unknown"}
								className="w-12 h-12 rounded-2xl object-cover border border-slate-200"
							/>

							<div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full" />
						</div>

						<div>
							<p className="text-sm font-semibold text-slate-900">
								{(task as any)?.requester?.fullName || task.requesterName}
							</p>

							<p className="text-xs text-slate-500">
								{formatDate(task.startDate || task.createdAt)}
							</p>
						</div>
					</div>

					<div className="bg-orange-50 text-orange-600 px-4 py-2 rounded-2xl">
						<p className="text-[10px] uppercase tracking-wide font-semibold">
							Budget
						</p>

						<p className="text-xl font-black">
							${task.price}
						</p>
					</div>
				</div>

				<div className="space-y-2">
					<h2 className="text-2xl font-bold tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
						{task.title}
					</h2>

					<p className="text-sm leading-relaxed text-slate-600 line-clamp-2">
						{task.description}
					</p>
				</div>

        {/* META */}
				<div className="flex flex-wrap items-center gap-3 rounded-2xl bg-slate-50 p-3">
					<div className="flex items-center gap-2 text-sm text-slate-700">
						<MapPin size={15} className="text-blue-500" />

						<span className="truncate max-w-[250px]">
							{task.locationText || "No location"}
						</span>
					</div>

					<div className="h-4 w-px bg-slate-200" />

					<div className="flex items-center gap-2 text-sm text-slate-700">
						<Clock size={14} className="text-slate-400" />

						<span>
							{new Date(task.deadline).toLocaleDateString()}
						</span>
					</div>
				</div>

        {/* ACTION */}
        <div className="flex gap-3 pt-2">
					<button
						disabled={task.hasApplied}
						className="
							cursor-pointer
							flex-1 py-3 rounded-xl
							bg-gradient-to-r from-blue-500 to-indigo-600
							text-white font-semibold
							hover:shadow-lg hover:scale-[1.02]
							transition-all duration-200
							disabled:cursor-not-allowed disabled:from-slate-400 disabled:to-slate-500 disabled:hover:scale-100 disabled:hover:shadow-none
						"
						onClick={() => onApply(task)}
					>
						{task.hasApplied ? "Applied the task" : "Apply the task"}
					</button>

        </div>
      </div>
			
    </div>
  );
}
