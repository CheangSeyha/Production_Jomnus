"use client";

import FormSection from "./FormSection";
import { AlertCircle, CalendarClock, DollarSign, FileText, MapPin, Tag } from "lucide-react";

type TaskOverviewProps = {
  task: {
    title: string;
    description: string;
    price: number;
    deadline: string;
    startDate?: string;
    locationText?: string;
    categoryId?: number;

    autoAccept?: boolean;
    minRating?: string;
    hiddenBids?: boolean;
  };
};

export default function TaskOverview({ task }: TaskOverviewProps) {
  const formatDate = (dateString: string) => {
    if (!dateString) return "Not set";
    try {
      return new Date(dateString).toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="space-y-5">
      <FormSection
        title="Task Overview"
        description="Review the core details before posting."
        icon={<FileText size={18} />}
      >
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase text-slate-500">
              Title
            </label>
            <p className="text-base font-semibold text-slate-950">
              {task.title || "Not provided"}
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg bg-slate-50 p-4">
              <label className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase text-slate-500">
                <Tag size={14} />
                Category
              </label>
              <span className="inline-block rounded-full bg-sky-50 px-3 py-1 text-sm font-semibold text-sky-700 ring-1 ring-sky-200">
                {task.categoryId ? `Category #${task.categoryId}` : "Not selected"}
              </span>
            </div>
            <div className="rounded-lg bg-slate-50 p-4">
              <label className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase text-slate-500">
                <MapPin size={14} />
                Location
              </label>
              <p className="text-sm font-medium text-slate-950">
                {task.locationText || "Not specified"}
              </p>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-xs font-semibold uppercase text-slate-500">
              Description
            </label>
            <p className="leading-7 text-slate-700">
              {task.description || "Not provided"}
            </p>
          </div>
        </div>
      </FormSection>

      <FormSection
        title="Logistics & Budget"
        description="Confirm the timing and payment details."
        icon={<CalendarClock size={18} />}
      >
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-lg bg-slate-50 p-4">
            <label className="mb-2 block text-xs font-semibold uppercase text-slate-500">
              Start Time
            </label>
            <p className="text-sm font-medium leading-6 text-slate-950">
              {formatDate(task.startDate || "")}
            </p>
          </div>
          <div className="rounded-lg bg-slate-50 p-4">
            <label className="mb-2 block text-xs font-semibold uppercase text-slate-500">
              Deadline
            </label>
            <p className="text-sm font-medium leading-6 text-slate-950">
              {formatDate(task.deadline)}
            </p>
          </div>
          <div className="rounded-lg bg-slate-50 p-4">
            <label className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase text-slate-500">
              <DollarSign size={14} />
              Offered Price
            </label>
            <p className="text-xl font-bold text-slate-950">
              ${Number(task.price || 0).toFixed(2)}
            </p>
          </div>
        </div>
      </FormSection>

      <FormSection
        title="Selection Rules"
        description="These rules will guide how workers apply."
        icon={<AlertCircle size={18} />}
      >
        <div className="space-y-3">
          {task.autoAccept && (
            <div className="flex items-start gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-4">
              <AlertCircle size={18} className="mt-0.5 flex-shrink-0 text-emerald-700" />
              <div>
                <p className="text-sm font-semibold text-emerald-950">Auto-Accept Enabled</p>
                <p className="mt-1 text-sm leading-6 text-emerald-800">
                  Will automatically accept bids from workers with {task.minRating}+ rating
                </p>
              </div>
            </div>
          )}

          {task.hiddenBids && (
            <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4">
              <AlertCircle size={18} className="mt-0.5 flex-shrink-0 text-amber-700" />
              <div>
                <p className="text-sm font-semibold text-amber-950">Hidden Bids</p>
                <p className="mt-1 text-sm leading-6 text-amber-800">
                  Workers won't see other bids or offers
                </p>
              </div>
            </div>
          )}

          <div className="rounded-lg border border-sky-200 bg-sky-50 p-4">
            <p className="text-sm font-semibold text-sky-950">Bidding Model</p>
            <p className="mt-1 text-sm leading-6 text-sky-800">
              Open bidding - Workers can submit proposals at any time
            </p>
          </div>
        </div>
      </FormSection>
    </div>
  );
}
