"use client";

import { CalendarClock, ChevronRight, MapPin } from "lucide-react";

type Props = {
  id: number;
  title: string;
  description?: string;
  price: number;
  deadline: string;
  status: string;
  location_text?: string;
};

export default function TaskCard({
  title,
  description,
  price,
  deadline,
  status,
  location_text,
}: Props) {
  const formatDeadline = (date: string) => {
    const d = new Date(date);
    return d.toLocaleDateString();
  };

  const getStatusColor = () => {
    switch (status) {
      case "POSTED":
        return "bg-emerald-50 text-emerald-700 ring-emerald-200";
      case "DRAFT":
        return "bg-slate-100 text-slate-700 ring-slate-200";
      case "IN_PROGRESS":
        return "bg-sky-50 text-sky-700 ring-sky-200";
      case "COMPLETED":
        return "bg-amber-50 text-amber-700 ring-amber-200";
      default:
        return "bg-slate-100 text-slate-700 ring-slate-200";
    }
  };

  return (
    <div
      className="group relative overflow-hidden rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:border-sky-200 hover:shadow-md"
    >
      <div className="absolute inset-y-0 left-0 w-1 bg-sky-600" />

      <div className="mb-3 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="truncate text-lg font-semibold text-slate-950 transition group-hover:text-sky-700">
            {title}
          </h3>
          <p className="mt-1 line-clamp-2 text-sm leading-6 text-slate-500">
            {description || "No description provided"}
          </p>
        </div>
        <span
          className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ring-1 ${getStatusColor()}`}
        >
          {status.replaceAll("_", " ")}
        </span>
      </div>

      <div className="flex flex-col gap-4 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
          {location_text && (
            <div className="flex items-center gap-1">
              <MapPin size={15} />
              <span className="max-w-48 truncate">{location_text}</span>
            </div>
          )}

          <div className="flex items-center gap-1">
            <CalendarClock size={15} />
            {formatDeadline(deadline)}
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 sm:justify-end">
          <div className="text-right">
            <p className="text-xs font-semibold uppercase text-slate-400">Budget</p>
            <p className="text-lg font-bold text-slate-950">
              ${Number(price || 0).toFixed(2)}
            </p>
          </div>
          <ChevronRight
            size={19}
            className="text-slate-300 transition group-hover:text-sky-600"
          />
        </div>
      </div>
    </div>
  );
}
