"use client";

import {
  CheckCircle2,
  Clock3,
  FileText,
  ShieldCheck,
  User,
  XCircle,
} from "lucide-react";

type Proof = {
  id: number;
  status: string;
  type: string;
  text_content?: string;
  file_url?: string;
};

type Props = {
  performerName: string;
  performerImage?: string;

  acceptedPrice: number;

  assignmentStatus:
    | "ASSIGNED"
    | "IN_PROGRESS"
    | "COMPLETED"
    | "VERIFIED"
    | "CANCELLED";

  proofs?: Proof[];

  onApproveProof?: (proofId: number) => void;
  onRejectProof?: (proofId: number) => void;
};

const workflow = [
  "ASSIGNED",
  "IN_PROGRESS",
  "COMPLETED",
  "VERIFIED",
];

export default function WorkerTimelineCard({
  performerName,
  performerImage,
  acceptedPrice,
  assignmentStatus,
  proofs = [],
  onApproveProof,
  onRejectProof,
}: Props) {
  const currentStep = workflow.indexOf(
    assignmentStatus
  );

  return (
    <div
      className="
        rounded-3xl
        border border-slate-200
        bg-white
        p-6
        shadow-sm
      "
    >
      {/* HEADER */}
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">

        {/* LEFT */}
        <div className="flex items-center gap-4">

          {/* AVATAR */}
          <div
            className="
              h-16 w-16 overflow-hidden
              rounded-2xl
              bg-slate-100
              shrink-0
            "
          >
            {performerImage ? (
              <img
                src={performerImage}
                alt={performerName}
                className="h-full w-full object-cover"
              />
            ) : (
              <div
                className="
                  flex h-full w-full
                  items-center justify-center
                  text-slate-400
                "
              >
                <User size={28} />
              </div>
            )}
          </div>

          {/* INFO */}
          <div>
            <h2 className="text-lg font-bold text-slate-950">
              {performerName}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Active worker assignment
            </p>

            <p className="mt-3 text-3xl font-black text-slate-950">
              ${acceptedPrice.toFixed(2)}
            </p>
          </div>
        </div>

        {/* STATUS */}
        <div
          className="
            rounded-2xl
            border border-slate-200
            bg-slate-50
            px-4 py-3
          "
        >
          <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
            Current Status
          </p>

          <p className="mt-1 text-sm font-bold text-slate-900">
            {assignmentStatus.replace("_", " ")}
          </p>
        </div>
      </div>

      {/* WORKFLOW */}
      <div className="mt-8 overflow-x-auto">
        <div className="flex min-w-[700px] items-center">

          {workflow.map((step, index) => {
            const active = index <= currentStep;
            const current = index === currentStep;

            return (
              <div
                key={step}
                className="flex flex-1 items-center"
              >
                {/* NODE */}
                <div className="flex flex-col items-center">

                  <div
                    className={`
                      relative flex h-12 w-12
                      items-center justify-center
                      rounded-full border-2
                      transition-all duration-200

                      ${
                        active
                          ? "border-blue-600 bg-blue-600 text-white"
                          : "border-slate-300 bg-white text-slate-400"
                      }

                      ${current ? "scale-110" : ""}
                    `}
                  >
                    {active ? (
                      <CheckCircle2 size={20} />
                    ) : (
                      <Clock3 size={20} />
                    )}

                    {/* ACTIVE PULSE */}
                    {current && (
                      <div
                        className="
                          absolute inset-0
                          animate-ping
                          rounded-full
                          bg-blue-400/20
                        "
                      />
                    )}
                  </div>

                  <p
                    className={`
                      mt-3 text-xs font-bold uppercase
                      tracking-wide whitespace-nowrap

                      ${
                        active
                          ? "text-slate-900"
                          : "text-slate-400"
                      }
                    `}
                  >
                    {step.replace("_", " ")}
                  </p>
                </div>

                {/* LINE */}
                {index !== workflow.length - 1 && (
                  <div
                    className={`
                      h-[2px] flex-1

                      ${
                        active
                          ? "bg-blue-600"
                          : "bg-slate-200"
                      }
                    `}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* PROOFS */}
      <div className="mt-8">

        <div className="flex items-center gap-2">
          <FileText
            size={18}
            className="text-slate-500"
          />

          <h3 className="text-sm font-bold text-slate-900">
            Submitted Proofs
          </h3>
        </div>

        {/* EMPTY */}
        {proofs.length === 0 ? (
          <div
            className="
              mt-4 rounded-2xl
              border border-dashed border-slate-300
              bg-slate-50
              p-6 text-sm text-slate-500
            "
          >
            No proof submitted yet.
          </div>
        ) : (
          <div className="mt-4 space-y-4">

            {proofs.map((proof) => (
              <div
                key={proof.id}
                className="
                  rounded-2xl
                  border border-slate-200
                  bg-slate-50
                  p-5
                "
              >
                {/* TOP */}
                <div className="flex items-center justify-between gap-4">

                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                      Proof Submission
                    </p>

                    <p className="mt-1 text-sm font-semibold text-slate-900">
                      {proof.status}
                    </p>
                  </div>

                  <div
                    className="
                      rounded-full
                      border border-slate-200
                      bg-white
                      px-3 py-1
                      text-xs font-bold
                      text-slate-600
                    "
                  >
                    {proof.type}
                  </div>
                </div>

                {/* TEXT */}
                {proof.text_content && (
                  <div
                    className="
                      mt-4 rounded-xl
                      bg-white p-4
                      text-sm leading-7
                      text-slate-700
                    "
                  >
                    {proof.text_content}
                  </div>
                )}

                {/* FILE */}
                {proof.file_url && (
                  <a
                    href={`${process.env.NEXT_PUBLIC_API_URL?.replace("/api", "")}${proof.file_url}`}
                    target="_blank"
                    className="
                      mt-4 inline-flex
                      rounded-xl
                      bg-slate-900
                      px-4 py-2
                      text-sm font-semibold text-white
                      transition hover:bg-slate-800
                    "
                  >
                    View Attachment
                  </a>
                )}

                {/* ACTIONS */}
                {proof.status === "PENDING" && (
                  <div className="mt-5 flex gap-3">

                    <button
                      onClick={() =>
                        onRejectProof?.(proof.id)
                      }
                      className="
                        flex h-11 flex-1 items-center
                        justify-center gap-2
                        rounded-2xl
                        border border-red-200
                        bg-red-50
                        text-sm font-bold text-red-600
                        transition hover:bg-red-100
                      "
                    >
                      <XCircle size={18} />
                      Reject
                    </button>

                    <button
                      onClick={() =>
                        onApproveProof?.(proof.id)
                      }
                      className="
                        flex h-11 flex-1 items-center
                        justify-center gap-2
                        rounded-2xl
                        bg-blue-600
                        text-sm font-bold text-white
                        transition hover:bg-blue-700
                      "
                    >
                      <ShieldCheck size={18} />
                      Approve Proof
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}