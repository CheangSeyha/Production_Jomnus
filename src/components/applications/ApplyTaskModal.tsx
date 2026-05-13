"use client";

import { useState } from "react";
import {
  X,
  DollarSign,
  BriefcaseBusiness,
  Loader2,
} from "lucide-react";
import api from "@/lib/axios";

type Props = {
  taskId: number;
  taskTitle: string;
  defaultPrice: number;
  onClose: () => void;
};

export default function ApplyTaskModal({
  taskId,
  taskTitle,
  defaultPrice,
  onClose,
}: Props) {
  const [offeredPrice, setOfferedPrice] = useState(
    defaultPrice.toString()
  );

  const [loading, setLoading] = useState(false);

  const handleApply = async () => {
    try {
      setLoading(true);

      await api.post(
        "/applications",
        {
          taskId,
          offeredPrice: Number(offeredPrice),
        }
      );

      alert("Application submitted successfully!");
      onClose();
    } catch (err: any) {
      console.error(err);

      alert(
        err?.response?.data?.message ||
          "Failed to apply task"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="
        fixed inset-0 z-[5000]
        bg-black/50 backdrop-blur-sm
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
          shadow-2xl
          overflow-hidden
          animate-in fade-in zoom-in-95
        "
      >
        {/* TOP */}
        <div
          className="
            relative
            bg-gradient-to-r from-blue-600 to-indigo-600
            px-6 py-7 text-white
          "
        >
          <button
            onClick={onClose}
            className="
              absolute right-4 top-4
              rounded-full p-2
              hover:bg-white/10
              transition
            "
          >
            <X size={18} />
          </button>

          <div className="flex items-center gap-3">
            <div
              className="
                flex h-12 w-12 items-center justify-center
                rounded-2xl bg-white/15
                backdrop-blur
              "
            >
              <BriefcaseBusiness size={24} />
            </div>

            <div>
              <p className="text-sm text-blue-100">
                Applying for task
              </p>

              <h2 className="text-xl font-bold leading-tight">
                {taskTitle}
              </h2>
            </div>
          </div>
        </div>

        {/* BODY */}
        <div className="space-y-6 p-6">
          {/* PRICE INPUT */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">
              Offered Price
            </label>

            <div className="relative">
              <DollarSign
                size={18}
                className="
                  absolute left-4 top-1/2
                  -translate-y-1/2
                  text-slate-400
                "
              />

              <input
                type="number"
                value={offeredPrice}
                onChange={(e) =>
                  setOfferedPrice(e.target.value)
                }
                className="
                  h-14 w-full rounded-2xl
                  border border-slate-200
                  bg-slate-50
                  pl-11 pr-4
                  text-lg font-semibold
                  outline-none transition
                  focus:border-blue-400
                  focus:bg-white
                  focus:ring-4 focus:ring-blue-100
                "
                placeholder="Enter amount"
              />
            </div>

            <p className="text-xs text-slate-400">
              Suggest a fair price to increase your
              acceptance chance.
            </p>
          </div>

          {/* INFO CARD */}
          <div
            className="
              rounded-2xl
              border border-blue-100
              bg-blue-50
              p-4
            "
          >
            <p className="text-sm text-blue-800 leading-6">
              Your application will be reviewed by the
              requester. Once accepted, the task will move
              into progress status.
            </p>
          </div>

          {/* ACTIONS */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={onClose}
              className="
                flex-1 h-12 rounded-2xl
                border border-slate-200
                font-semibold text-slate-700
                hover:bg-slate-50
                transition
              "
            >
              Cancel
            </button>

            <button
              disabled={loading}
              onClick={handleApply}
              className="
                flex-1 h-12 rounded-2xl
                bg-gradient-to-r
                from-blue-600 to-indigo-600
                text-white font-semibold
                shadow-lg shadow-blue-200
                hover:scale-[1.02]
                transition-all
                disabled:opacity-50
                disabled:hover:scale-100
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
