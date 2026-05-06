"use client";

import { MapPin, Clock, Info } from "lucide-react";
import dynamic from "next/dynamic";
import { getTaskBadges } from "../../utils/taskBadge";
import { getFakeInterest } from "@/utils/random";
import { Task } from "@/types/task";
type Props = {
  task: Task;
  onOpen: (task: Task) => void;
};

export default function DetailTaskCard({ task, onOpen }: Props) {

		const formatDate = (date?: string) => {
			if (!date) return "No date";
			const d = new Date(date);
			return isNaN(d.getTime()) ? "Invalid date" : d.toLocaleDateString();
		};
		

		const TaskMapPreview = dynamic(
			() => import("@/components/map/TaskMapPreview"),
			{ ssr: false }
		);

		const badges = getTaskBadges(task);
		const interest = getFakeInterest(task.id)

    return (
    <div
      className="
        bg-white rounded-3xl border border-slate-200
        shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300
        overflow-hidden group
      "
    >
			<div className="relative">
				{/* MAP */}
				<TaskMapPreview
					lat={task.latitude}
					lng={task.longitude}
				/>				
		
				<div className="text-red-500 absolute bottom-3 left-3 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-medium shadow z-[1000]">
					📍 View location
				</div>
			</div>

      <div className="p-6 space-y-8">
        {/* HEADER */}
        <div className="flex justify-between items-start">
          <div className="flex items-start gap-3">
            <div className="w-11 h-11 rounded-full bg-slate-200 overflow-hidden">
              <img
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${task.requesterName}`}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <p className="text-[20px] font-semibold text-orange-700">
                {task.requesterName}
              </p>

              <p className="text-[12px] font-semibold text-slate-800">
								{formatDate(task.createdAt)}
								 <span className="px-1.5"> - </span>
								{formatDate(task.deadline)}
              </p>
							<div className="flex flex-row gap-1.5 flex-wrap">
								{badges.map((badge, i) => (
									<span
										key={i}
										className={`px-3 py-1 text-xs font-semibold rounded-md ${badge.color}`}
									>
										{badge.label}
									</span>
								))}
							</div>

            </div>
          </div>

					<div className="text-right">
						<p className="text-xs text-slate-400 uppercase tracking-wide">
							Budget
						</p>

						<p className="text-2xl font-extrabold text-orange-800">
							${task.price}
						</p>

						<div className="text-xs text-blue-700">
						👀 {interest} people interested
						</div>
					</div>
        </div>

        {/* TITLE */}
				<h2 className="text-xl font-bold text-slate-900 leading-tight group-hover:text-blue-600">
					{task.title}
				</h2>

        {/* DESCRIPTION */}
        <p className="text-sm text-slate-600 line-clamp-2">
          {task.description}
        </p>

        {/* META */}
        <div className="flex flex-wrap gap-2">
				<div className="flex items-center gap-2 text-sm text-slate-600">
					<MapPin size={14} className="text-blue-500" />
					<span className="truncate max-w-[300px]">
						{task.locationText || "No location"}
					</span>
				</div>

          <div className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 rounded-full text-xs text-slate-600">
            <Clock size={12} />
            {new Date(task.deadline).toLocaleDateString()}
          </div>
        </div>

        {/* ACTION */}
        <div className="flex gap-3 pt-2">
					<button
						className="
							cursor-pointer
							flex-1 py-3 rounded-xl
							bg-gradient-to-r from-blue-500 to-indigo-600
							text-white font-semibold
							hover:shadow-lg hover:scale-[1.02]
							transition-all duration-200
						"
					>
						Accept Task
					</button>

          <button 
						onClick={() => onOpen(task)}
						className="cursor-pointer px-4 rounded-xl border border-slate-200 hover:bg-slate-50">
            <Info size={18} />
          </button>


        </div>
      </div>
    </div>
  );
}