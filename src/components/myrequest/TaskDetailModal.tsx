"use client";

import dynamic from "next/dynamic";
import { useEffect } from "react";

export default function TaskDetailModal({ task, onClose }: any) {
  const TaskMapPreview = dynamic(
    () => import("@/components/map/TaskMapPreview"),
    { ssr: false }
  );

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const formatDate = (date?: string) => {
    if (!date) return "No date";
    const d = new Date(date);
    return isNaN(d.getTime()) ? "Invalid date" : d.toLocaleDateString();
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[9999] bg-black/40 flex items-center justify-center"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="
          bg-white w-[90%] max-w-2xl rounded-2xl p-6
          shadow-xl animate-in fade-in zoom-in duration-200
        "
      >
        {/* CLOSE */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-black"
        >
          ✕
        </button>

        <h2 className="text-xl font-bold mb-3">{task.title}</h2>

        <div className="mb-4 rounded-xl overflow-hidden">
          <TaskMapPreview lat={task.latitude} lng={task.longitude} />
        </div>

        <div className="space-y-2 text-sm text-slate-700">
          <p><strong>Requester:</strong> {task.requesterName}</p>
          <p><strong>Budget:</strong> ${task.price}</p>
          <p><strong>Deadline:</strong> {formatDate(task.deadline)}</p>
          <p><strong>Location:</strong> {task.locationText}</p>

          <p className="pt-2 font-semibold">Description</p>
          <p className="text-slate-600">{task.description}</p>
        </div>

        <button className="mt-6 w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold">
          Apply the Task
        </button>
      </div>
    </div>
  );
}