"use client";

import { CheckCircle, Star, User, X } from "lucide-react";

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
    <div
      className={`rounded-lg border p-4 shadow-sm transition ${
        isSelected
          ? "border-sky-300 bg-sky-50"
          : "border-slate-200 bg-white hover:border-sky-200 hover:shadow-md"
      }`}
    >
      <div className="mb-4 flex items-start justify-between gap-4">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sky-600 text-white">
            {workerImage ? (
              <img
                src={workerImage}
                alt={workerName}
                className="h-full w-full rounded-full object-cover"
              />
            ) : (
              <User size={20} />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate font-semibold text-slate-950">{workerName}</p>
            <div className="mt-1 flex items-center gap-1">
              <Star size={14} className="fill-amber-400 text-amber-400" />
              <span className="text-sm text-slate-500">{rating.toFixed(1)} rating</span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs font-semibold uppercase text-slate-400">Offer</p>
          <p className="text-lg font-bold text-slate-950">${price.toFixed(2)}</p>
        </div>
      </div>

      <div className="mb-4">
        <p className="line-clamp-3 text-sm leading-6 text-slate-600">{message}</p>
      </div>

      <div className="flex gap-2">
        <button
          onClick={onAccept}
          className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-lg bg-sky-600 px-3 text-sm font-semibold text-white transition hover:bg-sky-700"
        >
          <CheckCircle size={16} />
          Accept
        </button>
        <button
          onClick={onDecline}
          className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
        >
          <X size={16} />
          Decline
        </button>
      </div>
    </div>
  );
}
