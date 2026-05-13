"use client";

import { Check, MessageCircle, X } from "lucide-react";

type Props = {
  performerName: string;
  performerImage?: string;
  offeredPrice: number;
  status: string;
  onAccept: () => void;
  onReject: () => void;
};

const statusStyles: Record<string, string> = {
  PENDING: "bg-amber-50 text-amber-700 ring-amber-200",
  ACCEPTED: "bg-blue-50 text-blue-700 ring-blue-200",
  REJECTED: "bg-slate-100 text-slate-500 ring-slate-200",
  CANCELLED: "bg-slate-100 text-slate-500 ring-slate-200",
};

export default function ApplicationOfferCard({
  performerName,
  performerImage,
  offeredPrice,
  status,
  onAccept,
  onReject,
}: Props) {
  const normalizedStatus = status || "PENDING";
  const isPending = normalizedStatus === "PENDING";

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-slate-300">
      <div className="flex items-start gap-4">
        <img
          src={
            performerImage ||
            `https://api.dicebear.com/7.x/avataaars/svg?seed=${performerName}`
          }
          alt={performerName}
          className="h-11 w-11 shrink-0 rounded-full bg-slate-100"
        />

        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <h3 className="truncate text-sm font-bold text-slate-950">
                {performerName}
              </h3>
              <span
                className={`mt-1 inline-flex rounded-full px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide ring-1 ${
                  statusStyles[normalizedStatus] || statusStyles.PENDING
                }`}
              >
                {normalizedStatus.replace("_", " ")}
              </span>
            </div>

            <div className="shrink-0 sm:text-right">
              <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
                Offer
              </p>
              <p className="text-xl font-black text-slate-950">
                ${Number(offeredPrice || 0).toFixed(2)}
              </p>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <button className="inline-flex h-9 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700 transition hover:bg-slate-50">
              <MessageCircle size={15} />
              Message
            </button>

            {isPending ? (
              <>
                <button
                  onClick={onReject}
                  className="inline-flex h-9 items-center gap-2 rounded-lg bg-red-50 px-3 text-xs font-bold text-red-600 transition hover:bg-red-100"
                >
                  <X size={15} />
                  Reject
                </button>

                <button
                  onClick={onAccept}
                  className="inline-flex h-9 items-center gap-2 rounded-lg bg-blue-600 px-3 text-xs font-bold text-white transition hover:bg-blue-700"
                >
                  <Check size={15} />
                  Accept
                </button>
              </>
            ) : (
              <p className="text-xs font-medium text-slate-400">
                Decision recorded
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
