"use client";

import { Check, X, Clock3, MessageCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";

type Props = {
  performerName: string;
  performerImage?: string;
  offeredPrice: number;
  status: string;
  taskId: number; // ← add this prop
  onAccept: () => void;
  onReject: () => void;
};

const statusStyles: Record<string, string> = {
  PENDING:   "bg-amber-50 text-amber-700 border-amber-200",
  ACCEPTED:  "bg-emerald-50 text-emerald-700 border-emerald-200",
  REJECTED:  "bg-red-50 text-red-700 border-red-200",
  CANCELLED: "bg-slate-100 text-slate-500 border-slate-200",
};

export default function ApplicationOfferCard({performerName, performerImage, offeredPrice, status, taskId, onAccept, onReject}: Props) {
  const router = useRouter();
  const isPending = status === "PENDING";
  const isAccepted = status === "ACCEPTED";

  const startConversation = async () => {
    try {
      const { data } = await api.post("/conversations", { taskId: Number(taskId) });
      router.push(`/message?conversationId=${data.id}`);
    } catch (err: any) {
      console.error("Failed to start conversation:", err.response?.data);
    }
  };

  return (
      <div className="group rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-slate-300 hover:shadow-lg">

        {/* TOP */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            {/* AVATAR */}
            <div className="h-14 w-14 overflow-hidden rounded-2xl bg-slate-100 shrink-0">
              {performerImage ? (
                  <img
                      src={performerImage}
                      alt={performerName}
                      className="h-full w-full object-cover"
                  />
              ) : (
                  <div className="h-full w-full flex items-center justify-center bg-sky-100 text-sky-700 text-xl font-bold">
                    {performerName?.charAt(0).toUpperCase() ?? "?"}
                  </div>
              )}
            </div>

            {/* INFO */}
            <div className="min-w-0">
              <h3 className="truncate text-base font-bold text-slate-950">
                {performerName}
              </h3>
              <p className="mt-1 text-sm text-slate-500">Applied for your task</p>
            </div>
          </div>

          {/* STATUS */}
          <div className={`rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-wide ${statusStyles[status]}`}>
            {status}
          </div>
        </div>

        {/* PRICE */}
        <div className="mt-6">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
            Offered Price
          </p>
          <p className="mt-1 text-3xl font-black text-slate-950">
            ${Number(offeredPrice || 0).toFixed(2)}
          </p>
        </div>

        {/* FOOTER */}
        <div className="mt-6 flex flex-col gap-2">
          {isPending ? (
              <div className="grid grid-cols-2 gap-3">
                <button
                    onClick={onReject}
                    className="flex h-11 items-center justify-center gap-2 rounded-2xl border border-red-200 bg-red-50 text-sm font-bold text-red-600 transition hover:bg-red-100"
                >
                  <X size={16} /> Reject
                </button>
                <button
                    onClick={onAccept}
                    className="flex h-11 items-center justify-center gap-2 rounded-2xl bg-blue-600 text-sm font-bold text-white transition hover:bg-blue-700"
                >
                  <Check size={16} /> Accept
                </button>
              </div>
          ) : isAccepted ? (
              <>
                <div className="flex h-11 items-center justify-center gap-2 rounded-2xl bg-slate-100 text-sm font-semibold text-slate-500">
                  <Clock3 size={16} /> Decision Recorded
                </div>
                <button
                    onClick={startConversation}
                    className="flex h-11 items-center justify-center gap-2 rounded-2xl border border-sky-200 bg-sky-50 text-sm font-bold text-sky-700 transition hover:bg-sky-100"
                >
                  <MessageCircle size={16} /> Message Performer
                </button>
              </>
          ) : (
              <div className="flex h-11 items-center justify-center gap-2 rounded-2xl bg-slate-100 text-sm font-semibold text-slate-500">
                <Clock3 size={16} /> Decision Recorded
              </div>
          )}
        </div>
      </div>
  );
}