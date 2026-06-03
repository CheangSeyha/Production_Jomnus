"use client";

import { CalendarClock, ChevronRight, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";

type Props = {
  id: number;
  title: string;
  description?: string;
  price: number;
  deadline: string;
  status: string;
  location_text?: string;
  locationText?: string;
};

export default function TaskCard({
  id,
  title,
  description,
  price,
  deadline,
  status,
  location_text,
  locationText,
}: Props) {
  const router = useRouter();
  const displayLocation = location_text || locationText;

  const formatDeadline = (date: string) => {
    const d = new Date(date);
    return d.toLocaleDateString();
  };

  const getStatusColor = () => {
    switch (status) {
      case "POSTED":
        return "bg-emerald-50 text-emerald-700 ring-emerald-200";
      case "ACCEPTED":
        return "bg-blue-50 text-blue-700 ring-blue-200";
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
      onClick={() => router.push(`/myrequest/${id}/applications`)}
      className="group relative overflow-hidden rounded-3xl border border-sky-300 bg-white p-5 shadow-[0_8px_28px_rgba(14,165,233,0.08)] transition hover:-translate-y-0.5 hover:border-sky-300 hover:shadow-[0_18px_42px_rgba(14,165,233,0.16)]"
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          router.push(`/myrequest/${id}/applications`);
        }
      }}
    >
      <div className="absolute inset-x-0 top-0 h-1" />

      <div className="mb-3 flex items-start justify-between gap-4 ">
        <div className="min-w-0">
          <h3 className="truncate text-lg font-black text-slate-950 transition group-hover:text-sky-700">
            {title}
          </h3>
          <p className="mt-1 line-clamp-2 text-sm font-medium leading-6 text-slate-500">
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
          {displayLocation && (
            <div className="flex items-center gap-1.5 rounded-xl border border-sky-100 bg-sky-50 px-3 py-1.5 font-semibold text-sky-800">
              <MapPin size={15} />
              <span className="max-w-48 truncate">{displayLocation}</span>
            </div>
          )}

          <div className="flex items-center gap-1.5 rounded-xl border border-indigo-100 bg-indigo-50 px-3 py-1.5 font-semibold text-indigo-700">
            <CalendarClock size={15} />
            {formatDeadline(deadline)}
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 sm:justify-end">
          <div className="text-right">
            <p className="text-xs font-black uppercase text-emerald-600">Budget</p>
            <p className="text-lg font-black text-emerald-700">
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
