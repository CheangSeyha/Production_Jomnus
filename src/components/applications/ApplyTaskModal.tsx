"use client";

import { useState } from "react";
import { X, DollarSign, BriefcaseBusiness, Loader2, ShieldCheck, Sparkles} from "lucide-react";
import api from "@/lib/axios";
import { useToast } from "@/components/providers/toast-provider";

type Props = {
  taskId: number;
  taskTitle: string;
  defaultPrice: number;
  onApplied?: () => void;
  onClose: () => void;
};

export default function ApplyTaskModal({
  taskId,
  taskTitle,
  defaultPrice,
  onApplied,
  onClose,
}: Props) {
  const toast = useToast();
  const [offeredPrice, setOfferedPrice] = useState(
    defaultPrice.toString()
  );

  const [loading, setLoading] = useState(false);
  const numericPrice = Number(offeredPrice);
  const isInvalidPrice =
    !offeredPrice.trim() || Number.isNaN(numericPrice) || numericPrice <= 0;

  const handleApply = async () => {
    if (isInvalidPrice) {
      toast.error({
        title: "Invalid offer",
        message: "Please enter a price greater than $0.",
      });
      return;
    }

    try {
      setLoading(true);

      await api.post(
        "/applications",
        {
          taskId,
          offeredPrice: numericPrice,
        }
      );

      toast.success({
        title: "Application submitted",
        message: "The requester can now review your offer.",
      });
      onApplied?.();
      onClose();
    } catch (err: any) {
      console.error(err);

      toast.error({
        title: "Could not apply",
        message:
          err?.response?.data?.message ||
          "Failed to apply task. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="
        fixed inset-0 z-[5000]
        bg-slate-950/55 backdrop-blur-md
        flex items-center justify-center
        p-4
      "
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="
          w-full max-w-md
          rounded-3xl
          bg-white
          border border-sky-100
          shadow-[0_30px_80px_rgba(15,23,42,0.35)]
          overflow-hidden
          animate-in fade-in zoom-in-95
        "
      >
        {/* TOP */}
        <div
          className="
            relative
            bg-gradient-to-br from-sky-600 via-cyan-500 to-emerald-400
            px-6 py-7 text-white overflow-hidden
          "
        >
          <div className="absolute -right-10 -top-12 h-32 w-32 rounded-full bg-white/15" />
          <div className="absolute -bottom-16 left-10 h-36 w-36 rounded-full bg-sky-900/10" />

          <button
            onClick={onClose}
            className="
              absolute right-4 top-4
              rounded-full p-2 z-10
              bg-white/10 hover:bg-white/20
              transition
            "
            aria-label="Close application modal"
          >
            <X size={18} />
          </button>

          <div className="relative flex items-start gap-3 pr-10">
            <div
              className="
                flex h-12 w-12 items-center justify-center
                rounded-2xl bg-white/20
                backdrop-blur
                ring-1 ring-white/30
              "
            >
              <BriefcaseBusiness size={24} />
            </div>

            <div className="min-w-0">
              <p className="mb-1 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-black uppercase tracking-wide text-sky-50">
                <Sparkles size={12} />
                Applying for task
              </p>

              <h2 className="line-clamp-2 text-xl font-black leading-tight">
                {taskTitle}
              </h2>
            </div>
          </div>
        </div>

        {/* BODY */}
        <div className="space-y-5 p-6">
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
              <p className="text-[10px] font-black uppercase tracking-wide text-emerald-600">
                Task budget
              </p>
              <p className="mt-1 text-2xl font-black text-emerald-700">
                ${defaultPrice}
              </p>
            </div>
            <div className="rounded-2xl border border-sky-200 bg-sky-50 p-4">
              <p className="text-[10px] font-black uppercase tracking-wide text-sky-600">
                Your offer
              </p>
              <p className="mt-1 text-2xl font-black text-sky-700">
                {isInvalidPrice ? "--" : `$${numericPrice.toFixed(2)}`}
              </p>
            </div>
          </div>

          {/* PRICE INPUT */}
          <div className="space-y-2">
            <label className="text-sm font-black text-slate-800">
              Offered Price
            </label>

            <div className="relative">
              <DollarSign
                size={18}
                className="
                  absolute left-4 top-1/2
                  -translate-y-1/2
                  text-sky-500
                "
              />

              <input
                type="number"
                min="1"
                step="0.01"
                value={offeredPrice}
                onChange={(e) =>
                  setOfferedPrice(e.target.value)
                }
                className="
                  h-14 w-full rounded-2xl
                  border border-sky-200
                  bg-sky-50/70
                  pl-11 pr-4
                  text-lg font-black text-slate-900
                  outline-none transition
                  placeholder:text-slate-400
                  focus:border-sky-400
                  focus:bg-white
                  focus:ring-4 focus:ring-sky-100
                "
                placeholder="Enter amount"
              />
            </div>

            <p className={`text-xs font-semibold ${isInvalidPrice ? "text-rose-500" : "text-slate-500"}`}>
              {isInvalidPrice
                ? "Enter a price greater than $0."
                : "Suggest a fair price to increase your acceptance chance."}
            </p>
          </div>

          {/* INFO CARD */}
          <div
            className="
              rounded-2xl
              border border-sky-200
              bg-gradient-to-br from-sky-50 to-cyan-50
              p-4
            "
          >
            <div className="flex gap-3">
              <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white text-sky-600 shadow-sm">
                <ShieldCheck size={18} />
              </span>
              <p className="text-sm font-semibold leading-6 text-slate-700">
                Your application will be reviewed by the requester. Once accepted,
                the task will move into progress status.
              </p>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="flex flex-col gap-3 pt-1 sm:flex-row">
            <button
              onClick={onClose}
              className="
                flex-1 h-12 rounded-2xl
                border border-slate-200
                font-black text-slate-700
                hover:bg-slate-50
                transition
              "
            >
              Cancel
            </button>

            <button
              disabled={loading || isInvalidPrice}
              onClick={handleApply}
              className="
                flex-1 h-12 rounded-2xl
                bg-gradient-to-r
                from-sky-600 to-cyan-500
                text-white font-black
                shadow-lg shadow-sky-200
                hover:-translate-y-0.5
                transition-all
                disabled:cursor-not-allowed
                disabled:from-slate-300 disabled:to-slate-300 disabled:text-slate-500
                disabled:shadow-none disabled:hover:translate-y-0
                flex items-center justify-center gap-2
              "
            >
              {loading && (
                <Loader2
                  size={18}
                  className="animate-spin"
                />
              )}

              {loading
                ? "Submitting..."
                : "Submit Application"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
