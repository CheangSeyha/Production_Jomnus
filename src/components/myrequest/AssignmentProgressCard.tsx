"use client";

import { Check } from "lucide-react";

type Props = {
  performerName: string;
  performerImage?: string;
  status:
    | "ASSIGNED"
    | "IN_PROGRESS"
    | "COMPLETED"
    | "VERIFIED"
    | "CANCELLED";
};

const steps = [
  "ASSIGNED",
  "IN_PROGRESS",
  "COMPLETED",
  "VERIFIED",
];

export default function AssignmentProgressCard({
  performerName,
  performerImage,
  status,
}: Props) {
  const currentIndex = steps.indexOf(status);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      {/* TOP */}
      <div className="flex items-center gap-3">
        <img
          src={
            performerImage ||
            `https://api.dicebear.com/7.x/avataaars/svg?seed=${performerName}`
          }
          alt={performerName}
          className="h-12 w-12 rounded-full bg-slate-100"
        />

        <div>
          <h3 className="text-sm font-bold text-slate-950">
            {performerName}
          </h3>

          <p className="text-xs text-slate-500">
            Worker Progress
          </p>
        </div>
      </div>

      {/* PROGRESS */}
      <div className="mt-6 grid grid-cols-4 gap-2">
        {steps.map((step, index) => {
          const completed = index < currentIndex;
          const current = index === currentIndex;
          const active = index <= currentIndex;

          return (
            <div key={step}>
              <div
                className={`h-2 rounded-full ${
                  active ? "bg-blue-600" : "bg-slate-200"
                }`}
              />

              <div className="mt-3 flex flex-col items-center gap-2">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-full border-2 text-xs font-bold ${
                    completed
                      ? "border-blue-600 bg-blue-600 text-white"
                      : current
                        ? "border-blue-600 bg-white text-blue-600"
                        : "border-slate-300 bg-white text-slate-400"
                  }`}
                >
                  {completed ? <Check size={16} /> : index + 1}
                </div>

                <p
                  className={`text-center text-[11px] font-bold ${
                    active
                      ? "text-slate-900"
                      : "text-slate-400"
                  }`}
                >
                  {step.replace("_", " ")}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}