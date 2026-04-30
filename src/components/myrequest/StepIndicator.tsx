"use client";

type StepIndicatorProps = {
  currentStep: number;
  totalSteps?: number;
};

export default function StepIndicator({
  currentStep,
  totalSteps = 3,
}: StepIndicatorProps) {
  const steps = [
    { number: 1, label: "Task Details" },
    { number: 2, label: "Preferences" },
    { number: 3, label: "Review" },
  ];

  return (
    <div className="mb-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Create New Task</h1>
      <p className="text-gray-600 mb-6">
        Create a new request and let people handle it for you
      </p>

      {/* Progress Bar */}
      <div className="flex items-center gap-2 mb-6">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center">
            {/* Step Circle */}
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm transition-colors ${
                step.number <= currentStep
                  ? "bg-blue-600 text-white"
                  : "bg-gray-300 text-gray-600"
              }`}
            >
              {step.number}
            </div>

            {/* Step Label */}
            <span
              className={`ml-2 text-sm font-medium ${
                step.number === currentStep
                  ? "text-blue-600"
                  : "text-gray-600"
              }`}
            >
              {step.label}
            </span>

            {/* Divider */}
            {index < steps.length - 1 && (
              <div className="flex-1 mx-4 h-1 bg-gray-300 rounded">
                <div
                  className={`h-full bg-blue-600 rounded transition-all ${
                    step.number < currentStep ? "w-full" : "w-0"
                  }`}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      <p className="text-xs text-gray-500">
        STEP {currentStep} OF {totalSteps}
      </p>
    </div>
  );
}
