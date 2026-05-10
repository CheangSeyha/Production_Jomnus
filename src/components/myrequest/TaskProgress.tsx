import { Check } from "lucide-react";

type Props = {
  status:
    | "POSTED"
    | "ACCEPTED"
    | "IN_PROGRESS"
    | "COMPLETED"
    | string;
};

const steps = [
  { key: "POSTED", label: "Posted" },
  { key: "ACCEPTED", label: "Accepted" },
  { key: "IN_PROGRESS", label: "In Progress" },
  { key: "COMPLETED", label: "Completed" },
];

export default function TaskProgress({ status }: Props) {
  const currentIndex = Math.max(0, steps.findIndex((step) => step.key === status));

  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-5 py-6 shadow-sm">
      <div className="grid grid-cols-4 gap-3">
        {steps.map((step, index) => {
          const complete = index < currentIndex;
          const current = index === currentIndex;
          const active = index <= currentIndex;

          return (
            <div key={step.key} className="min-w-0">
              <div
                className={`h-2 rounded-full ${
                  active ? "bg-blue-600" : "bg-slate-200"
                }`}
              />
              <div className="mt-4 flex flex-col items-center gap-2 sm:flex-row sm:items-center">
                <span
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 text-sm font-bold ${
                    complete
                      ? "border-blue-600 bg-blue-600 text-white"
                      : current
                        ? "border-blue-600 bg-white text-blue-700"
                        : "border-slate-300 bg-white text-slate-400"
                  }`}
                >
                  {complete ? <Check size={18} /> : index + 1}
                </span>
                <span
                  className={`truncate text-sm font-bold ${
                    current
                      ? "text-blue-700"
                      : active
                        ? "text-slate-900"
                        : "text-slate-400"
                  }`}
                >
                  {step.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
