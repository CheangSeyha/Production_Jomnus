"use client";

import { User, Star, MessageCircle, CheckCircle } from "lucide-react";

type OfferProps = {
  id: string;
  workerName: string;
  workerImage?: string;
  rating: number;
  price: number;
  message: string;
  isSelected?: boolean;
  onAccept?: () => void;
  onDecline?: () => void;
};

export default function OfferCard({
  id,
  workerName,
  workerImage,
  rating,
  price,
  message,
  isSelected = false,
  onAccept,
  onDecline,
}: OfferProps) {
  return (
    <div className={`border rounded-lg p-4 transition-all ${
      isSelected ? "border-blue-500 bg-blue-50" : "border-gray-200 bg-white hover:shadow-md"
    }`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3 flex-1">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white">
            {workerImage ? (
              <img src={workerImage} alt={workerName} className="w-full h-full rounded-full object-cover" />
            ) : (
              <User size={20} />
            )}
          </div>
          <div className="flex-1">
            <p className="font-medium text-gray-900">{workerName}</p>
            <div className="flex items-center gap-1">
              <Star size={14} className="text-yellow-400 fill-yellow-400" />
              <span className="text-sm text-gray-600">{rating.toFixed(1)} rating</span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <p className="font-bold text-lg text-gray-900">${price.toFixed(2)}</p>
        </div>
      </div>

      {/* Message */}
      <div className="mb-4">
        <p className="text-sm text-gray-600 line-clamp-3 italic">{message}</p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          onClick={onAccept}
          className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-1"
        >
          <CheckCircle size={16} />
          Accept
        </button>
        <button
          onClick={onDecline}
          className="flex-1 px-3 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
        >
          Decline
        </button>
      </div>
    </div>
  );
}
