"use client";

import FormSection from "./FormSection";
import { FileText, AlertCircle } from "lucide-react";

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
    <div className="space-y-6">
      {/* Task Overview */}
      <FormSection title="Task Overview" icon={<FileText size={20} />}>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
              Title
            </label>
            <p className="text-gray-900 font-medium">{task.title}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                Category
              </label>
              <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                {task.categoryId ? `Category #${task.categoryId}` : "Not selected"}
              </span>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                Location
              </label>
              <p className="text-gray-900">{task.locationText || "Not specified"}</p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">
              Description
            </label>
            <p className="text-gray-700 leading-relaxed">{task.description}</p>
          </div>
        </div>
      </FormSection>

      {/* Logistics & Budget */}
      <FormSection title="Logistics & Budget">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">
              Start Time
            </label>
            <p className="text-gray-900 font-medium text-sm">
              {formatDate(task.startDate || "")}
            </p>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">
              Deadline
            </label>
            <p className="text-gray-900 font-medium text-sm">
              {formatDate(task.deadline)}
            </p>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">
              Offered Price
            </label>
            <p className="text-blue-600 font-bold text-lg">
              ${Number(task.price || 0).toFixed(2)}
            </p>
          </div>
        </div>
      </FormSection>

      {/* Selection Rules */}
      <FormSection title="Selection Rules">
        <div className="space-y-3">
          {task.autoAccept && (
            <div className="flex items-start gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
              <AlertCircle size={18} className="text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-green-900">Auto-Accept Enabled</p>
                <p className="text-xs text-green-700 mt-1">
                  Will automatically accept bids from workers with {task.minRating}+ rating
                </p>
              </div>
            </div>
          )}

          {task.hiddenBids && (
            <div className="flex items-start gap-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <AlertCircle size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-amber-900">Hidden Bids</p>
                <p className="text-xs text-amber-700 mt-1">
                  Workers won't see other bids or offers
                </p>
              </div>
            </div>
          )}

          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm font-medium text-blue-900">Bidding Model</p>
            <p className="text-xs text-blue-700 mt-1">
              Open bidding - Workers can submit proposals at any time
            </p>
          </div>
        </div>
      </FormSection>
    </div>
  );
}
