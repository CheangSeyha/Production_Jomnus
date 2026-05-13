"use client";

type StepIndicatorProps = {
  currentStep: number;
  totalSteps?: number;
};

export default function StepIndicator({
  currentStep,
  totalSteps = 2,
}: StepIndicatorProps) {
  const steps = [
    { number: 1, label: "Task Details" },
    { number: 2, label: "Review" },
  ];

  return (
    <div className="mb-7">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-700">
        Step {currentStep} of {totalSteps}
      </p>
      <h1 className="mt-2 text-2xl font-bold text-slate-950">Create New Task</h1>
      <p className="mt-2 text-sm leading-6 text-slate-500">
        Create a clear request so workers can understand the job quickly.
      </p>

      <div className="mt-6 grid grid-cols-2 gap-3">
        {steps.map((step) => (
          <div key={step.number} className="min-w-0">
            <div
              className={`h-1.5 rounded-full transition-colors ${
                step.number <= currentStep
                  ? "bg-sky-600"
                  : "bg-slate-200"
              }`}
            />
            <div className="mt-3 flex items-center gap-2">
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                  step.number <= currentStep
                    ? "bg-sky-600 text-white"
                    : "bg-slate-100 text-slate-500"
                }`}
              >
                {step.number}
              </span>
              <span
                className={`truncate text-sm font-medium ${
                step.number === currentStep
                  ? "text-slate-950"
                  : "text-slate-500"
              }`}
              >
                {step.label}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
