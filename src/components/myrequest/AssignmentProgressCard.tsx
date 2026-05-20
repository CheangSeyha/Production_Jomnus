"use client";

import {
  CheckCircle2,
  Clock3,
  LoaderCircle,
  ShieldCheck,
  User2,
  XCircle,
} from "lucide-react";

type Props = {
  performerName: string;
  performerImage?: string;

  status:
    | "ASSIGNED"
    | "IN_PROGRESS"
    | "COMPLETED"
    | "VERIFIED"
    | "CANCELLED"
    | string;

  acceptedPrice: number;

  proofsCount?: number;
};

const statusConfig = {
  ASSIGNED: {
    label: "Assigned",
    color: "bg-slate-100 text-slate-700 border-slate-200",
    icon: Clock3,
  },

  IN_PROGRESS: {
    label: "In Progress",
    color: "bg-blue-50 text-blue-700 border-blue-200",
    icon: LoaderCircle,
  },

  COMPLETED: {
    label: "Waiting Verification",
    color: "bg-amber-50 text-amber-700 border-amber-200",
    icon: CheckCircle2,
  },

  VERIFIED: {
    label: "Verified",
    color: "bg-emerald-50 text-emerald-700 border-emerald-200",
    icon: ShieldCheck,
  },

  CANCELLED: {
    label: "Cancelled",
    color: "bg-red-50 text-red-700 border-red-200",
    icon: XCircle,
  },
};

export default function AssignmentProgressCard({
  performerName,
  performerImage,
  status,
  acceptedPrice,
  proofsCount = 0,
}: Props) {
  const config =
    statusConfig[status as keyof typeof statusConfig] ||
    statusConfig.ASSIGNED;

  const Icon = config.icon;

  return (
    <div
      className="
        rounded-2xl border border-slate-200
        bg-white p-5 shadow-sm
        transition hover:shadow-md
      "
    >
      <div className="flex items-start justify-between gap-4">
        {/* LEFT */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="h-12 w-12 overflow-hidden rounded-full bg-slate-100">
            {performerImage ? (
              <img
                src={performerImage}
                alt={performerName}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <User2 size={20} className="text-slate-400" />
              </div>
            )}
          </div>

          <div className="min-w-0">
            <h3 className="truncate text-sm font-bold text-slate-950">
              {performerName}
            </h3>

            <p className="mt-1 text-xs text-slate-500">
              Accepted Price
            </p>

            <p className="text-sm font-bold text-slate-900">
              ${acceptedPrice.toFixed(2)}
            </p>
          </div>
        </div>

        {/* STATUS */}
        <div
          className={`
            inline-flex items-center gap-2
            rounded-full border px-3 py-1
            text-xs font-bold
            ${config.color}
          `}
        >
          <Icon
            size={14}
            className={
              status === "IN_PROGRESS"
                ? "animate-spin"
                : ""
            }
          />

          {config.label}
        </div>
      </div>

      {/* FOOTER */}
      <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
        <div>
          <p className="text-xs font-semibold uppercase text-slate-400">
            Submitted Proofs
          </p>

          <p className="mt-1 text-lg font-black text-slate-900">
            {proofsCount}
          </p>
        </div>

        <div className="h-2 w-28 overflow-hidden rounded-full bg-slate-100">
          <div
            className={`
              h-full rounded-full transition-all
              ${
                status === "ASSIGNED"
                  ? "w-[20%] bg-slate-400"
                  : status === "IN_PROGRESS"
                  ? "w-[60%] bg-blue-500"
                  : status === "COMPLETED"
                  ? "w-[85%] bg-amber-500"
                  : status === "VERIFIED"
                  ? "w-full bg-emerald-500"
                  : "w-full bg-red-500"
              }
            `}
          />
        </div>
      </div>
    </div>
  );
}