"use client";

import { Clock, MapPin, DollarSign, MessageSquare, CheckCircle, AlertCircle } from "lucide-react";

type TaskCardProps = {
  id: string;
  title: string;
  category: string;
  location: string;
  description: string;
  price: number;
  deadline: string;
  status: "DRAFT" | "POSTED" | "IN_PROGRESS" | "COMPLETED";
  offersCount?: number;
  questionsCount?: number;
  isSelected?: boolean;
  onClick?: () => void;
};

export default function TaskCard({
  id,
  title,
  category,
  location,
  description,
  price,
  deadline,
  status,
  offersCount = 0,
  questionsCount = 0,
  isSelected = false,
  onClick,
}: TaskCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "DRAFT":
        return "bg-gray-100 text-gray-700";
      case "POSTED":
        return "bg-green-100 text-green-700";
      case "IN_PROGRESS":
        return "bg-blue-100 text-blue-700";
      case "COMPLETED":
        return "bg-emerald-100 text-emerald-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "DRAFT":
        return "Draft";
      case "POSTED":
        return "Open";
      case "IN_PROGRESS":
        return "In Progress";
      case "COMPLETED":
        return "Completed";
      default:
        return status;
    }
  };

  const formatDeadline = (dateString: string) => {
    if (!dateString) return "No deadline";
    const date = new Date(dateString);
    const now = new Date();
    const daysLeft = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    if (daysLeft < 0) return "Overdue";
    if (daysLeft === 0) return "Today";
    if (daysLeft === 1) return "Tomorrow";
    return `${daysLeft} days left`;
  };

  return (
    <div
      onClick={onClick}
      className={`border rounded-lg p-4 cursor-pointer transition-all ${
        isSelected
          ? "border-blue-500 bg-blue-50 shadow-md"
          : "border-gray-200 bg-white hover:shadow-md hover:border-gray-300"
      }`}
    >
      {/* Header with Status */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 truncate">{title}</h3>
          <div className="flex items-center gap-2 mt-1">
            <span className={`text-xs font-medium px-2 py-1 rounded-full ${getStatusColor(status)}`}>
              {getStatusLabel(status)}
            </span>
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
              {category}
            </span>
          </div>
        </div>
        <div className="text-right flex-shrink-0 ml-2">
          <p className="font-bold text-blue-600 text-lg">${price.toFixed(2)}</p>
        </div>
      </div>

      {/* Location and description */}
      <p className="text-sm text-gray-600 mb-2 line-clamp-2">{description}</p>

      {/* Meta info */}
      <div className="flex flex-wrap gap-3 text-xs text-gray-600 mb-3">
        <div className="flex items-center gap-1">
          <MapPin size={14} />
          <span>{location}</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock size={14} />
          <span>{formatDeadline(deadline)}</span>
        </div>
      </div>

      {/* Footer with counts */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <div className="flex gap-4 text-sm text-gray-600">
          {offersCount > 0 && (
            <div className="flex items-center gap-1">
              <CheckCircle size={16} className="text-blue-500" />
              <span>{offersCount} offer{offersCount !== 1 ? "s" : ""}</span>
            </div>
          )}
          {questionsCount > 0 && (
            <div className="flex items-center gap-1">
              <MessageSquare size={16} className="text-amber-500" />
              <span>{questionsCount} question{questionsCount !== 1 ? "s" : ""}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
