"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  LoaderCircle,
  Upload,
  ShieldCheck,
  MessageCircle,
} from "lucide-react";

import api from "@/lib/axios";
import dynamic from "next/dynamic";

type Proof = {
  id: number;
  status: string;
  text_content?: string;
  file_url?: string;
};

type Assignment = {
  id: number;
  status: string;
  accepted_price: number;

  task: {
    id: string,
    title: string;
    description: string;
    deadline: string;
    location_text?: string;
    latitude?: number;
    longitude?: number;

    requester?: {
      id: number;
      fullName: string;
      profileImage?: string;
    };
  };
};

export default function PerformerWorkspacePage() {
  const params = useParams();
  const router = useRouter();

  const assignmentId = params.assignmentId;

  const [assignment, setAssignment] =
    useState<Assignment | null>(null);

  const [proofs, setProofs] = useState<Proof[]>([]);

  const [loading, setLoading] = useState(true);

  const [proofText, setProofText] = useState("");
  
  const [proofType, setProofType] = useState<"TEXT" | "FILE" | "IMAGE" | "RECEIPT">("TEXT");

  const [proofFile, setProofFile] = useState<File | null>(null);

  const [submitting, setSubmitting] = useState(false);

  const SharedTaskMap = dynamic(
      () => import("@/components/map/SharedTaskMap"),
      { ssr: false }
  );

  const startConversation = async () => {
    try {
      const { data } = await api.post("/conversations", { taskId: Number(assignment?.task.id) });
      router.push(`/message?conversationId=${data.id}`);
    } catch (err: any) {
      console.error("Failed to start conversation:", err.response?.data);
    }
  };

  const fetchData = async () => {
    try {
      const [assignmentRes, proofRes] =
        await Promise.all([
          api.get(`/assignments/${assignmentId}`),
          api.get(`/proofs/${assignmentId}`),
        ]);
      console.log(assignment);
      setAssignment(assignmentRes.data);
      setProofs(proofRes.data);
      
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const startWork = async () => {
    try {
      await api.patch(
        `/assignments/${assignmentId}/start`
      );

      fetchData();
    } catch (err: any) {
      alert(
        err?.response?.data?.message ||
          "Failed to start"
      );
    }
  };

  const completeWork = async () => {
    try {
      await api.patch(
        `/assignments/${assignmentId}/complete`
      );

      fetchData();
    } catch (err: any) {
      alert(
        err?.response?.data?.message ||
          "Failed to complete"
      );
    }
  };

  const submitProof = async () => {
    try {
      if (
        proofType === "TEXT" &&
        !proofText.trim()
      ) {
        alert("Please enter proof details");
        return;
      }

      if (
        proofType !== "TEXT" &&
        !proofFile
      ) {
        alert("Please select a file");
        return;
      }

      setSubmitting(true);

      const fd = new FormData();

      fd.append(
        "assignment_id",
        String(assignmentId)
      );

      fd.append("type", proofType);

      if (proofText.trim()) {
        fd.append(
          "text_content",
          proofText.trim()
        );
      }

      if (proofFile) {
        fd.append("file", proofFile);
      }

      await api.post(
        "/proofs/upload",
        fd
      );

      setProofText("");
      setProofFile(null);
      setProofType("TEXT");

      fetchData();
    } catch (err: any) {
      alert(
        err?.response?.data?.message ||
        "Failed to submit proof"
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !assignment) {
    return (
      <div className="p-10 text-center">
        Loading workspace...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-5xl space-y-5 px-4 py-6">

        {/* BACK */}
        <button
          onClick={() => router.push("/mytask")}
          className="
            inline-flex items-center gap-2
            rounded-xl border border-slate-200
            bg-white px-4 py-2
            text-sm font-bold
            hover:bg-slate-50
          "
        >
          <ArrowLeft size={16} />
          Back
        </button>

        {/* HEADER */}
        <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
          <div className="flex items-start justify-between gap-4">

            <div>
              <p className="text-sm font-bold text-blue-600">
                Performer Workspace
              </p>

              <h1 className="mt-2 text-3xl font-black text-slate-950">
                {assignment.task.title}
              </h1>

              <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">
                {assignment.task.description}
              </p>
            </div>

            <div className="rounded-2xl bg-blue-50 px-5 py-4 text-right">
              <p className="text-xs font-bold uppercase text-blue-500">
                Accepted Price
              </p>

              <p className="mt-1 text-2xl font-black text-blue-900">
                ${assignment.accepted_price}
              </p>
            </div>
          </div>
        </div>

        {/* REQUESTER */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
            Task Requester
          </p>

          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              {assignment.task.requester?.profileImage ? (
                <img
                  src={assignment.task.requester.profileImage}
                  alt={assignment.task.requester.fullName}
                  className="h-14 w-14 rounded-2xl object-cover"
                />
              ) : (
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-xl">
                  👤
                </div>
              )}

              <div>
                <p className="text-lg font-black text-slate-900">
                  {assignment.task.requester?.fullName}
                </p>

                <p className="text-sm text-slate-500">
                  Task Creator
                </p>
              </div>
            </div>

            <button
                onClick={startConversation}
                className="flex px-5 h-11 items-center cursor-pointer justify-center gap-2 rounded-2xl border border-sky-200 bg-sky-50 text-sm font-bold text-sky-700 transition hover:bg-sky-100"
            >
              <MessageCircle size={16} /> Message Requester
            </button>
          </div>
        </div>

        {/* STATUS */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm font-bold text-slate-500">
                Assignment Status
              </p>

              <h2 className="mt-2 text-2xl font-black text-slate-950">
                {assignment.status.replace("_", " ")}
              </h2>
            </div>

            <div>
              {assignment.status === "ASSIGNED" && (
                <button
                  onClick={startWork}
                  className="
                    rounded-2xl bg-blue-600
                    px-5 py-3 text-sm
                    font-bold text-white
                    hover:bg-blue-700
                  "
                >
                  Start Working
                </button>
              )}

              {assignment.status === "IN_PROGRESS" && (
                <div
                  className="
                    rounded-2xl
                    bg-amber-50
                    border border-amber-200
                    px-4 py-3
                  "
                >
                  <p className="text-sm font-semibold text-amber-700">
                    Submit proof below when your work is finished.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* MINI PROGRESS */}
          <div className="mt-6 grid grid-cols-4 gap-3">

            {[
              {
                label: "Assigned",
                active: true,
                icon: Clock3,
              },

              {
                label: "In Progress",
                active:
                  assignment.status === "IN_PROGRESS" ||
                  assignment.status === "COMPLETED" ||
                  assignment.status === "VERIFIED",
                icon: LoaderCircle,
              },

              {
                label: "Completed",
                active:
                  assignment.status === "COMPLETED" ||
                  assignment.status === "VERIFIED",
                icon: CheckCircle2,
              },

              {
                label: "Verified",
                active:
                  assignment.status === "VERIFIED",
                icon: ShieldCheck,
              },
            ].map((step, index) => {
              const Icon = step.icon;

              return (
                <div
                  key={index}
                  className="
                    rounded-2xl border
                    p-4 text-center
                  "
                >
                  <div
                    className={`
                      mx-auto flex h-12 w-12
                      items-center justify-center
                      rounded-full
                      ${
                        step.active
                          ? "bg-blue-600 text-white"
                          : "bg-slate-100 text-slate-400"
                      }
                    `}
                  >
                    <Icon size={20} />
                  </div>

                  <p
                    className={`
                      mt-3 text-xs font-bold uppercase
                      ${
                        step.active
                          ? "text-slate-900"
                          : "text-slate-400"
                      }
                    `}
                  >
                    {step.label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* SUBMIT PROOF */}
        {assignment.status === "IN_PROGRESS" && (
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2">
              <Upload size={18} className="text-blue-600" />

              <h2 className="text-lg font-black text-slate-950">
                Submit Proof
              </h2>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">

              {["TEXT", "IMAGE", "FILE", "RECEIPT"].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setProofType(type as any)}
                  className={`
                    rounded-2xl border px-4 py-3
                    text-sm font-bold transition

                    ${
                      proofType === type
                        ? "border-blue-600 bg-blue-600 text-white"
                        : "border-slate-200 bg-white text-slate-700"
                    }
                  `}
                >
                  {type}
                </button>
              ))}
            </div>
            <textarea
              value={proofText}
              onChange={(e) =>
                setProofText(e.target.value)
              }
              rows={5}
              placeholder="Explain your completed work..."
              className="
                mt-5 w-full rounded-2xl
                border border-slate-200
                px-4 py-3 text-sm
                outline-none
                focus:border-blue-500
                focus:ring-4 focus:ring-blue-100
              "
            />
            {/* FILE PICKER */}
            {proofType !== "TEXT" && (
              <div className="mt-4">

                <input
                  type="file"
                  onChange={(e) =>
                    setProofFile(
                      e.target.files?.[0] || null
                    )
                  }
                  className="
                    block w-full rounded-2xl
                    border border-slate-200
                    p-3 text-sm
                  "
                />

                {proofFile && (
                  <p className="mt-2 text-sm text-slate-600">
                    Selected: {proofFile.name}
                  </p>
                )}
              </div>
            )}
            <button
              onClick={submitProof}
              className="
                mt-4 rounded-2xl
                bg-blue-600 px-5 py-3
                text-sm font-bold text-white
                hover:bg-blue-700
              "
            >
              Submit Proof
            </button>
          </div>
        )}
        
        {/* MAP */}
        {assignment.task.latitude &&
        assignment.task.longitude && (
          <div className="h-[700px] overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <SharedTaskMap
              lat={assignment.task.latitude}
              lng={assignment.task.longitude}
            />
          </div>
        )}

        {/* PROOF HISTORY */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

          <h2 className="text-lg font-black text-slate-950">
            Proof History
          </h2>

          <div className="mt-5 space-y-3">

            {proofs.length === 0 && (
              <div className="rounded-2xl bg-slate-50 p-6 text-sm text-slate-500">
                No proof submitted yet.
              </div>
            )}

            {proofs.map((proof) => (
              <div
                key={proof.id}
                className="
                  rounded-2xl border border-slate-200
                  p-4
                "
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-bold text-slate-900">
                    Proof #{proof.id}
                  </p>

                  <span
                    className="
                      rounded-full bg-blue-50
                      px-3 py-1 text-xs
                      font-bold text-blue-700
                    "
                  >
                    {proof.status}
                  </span>
                </div>

                <div className="mt-3 space-y-3">

                  {proof.text_content && (
                    <p className="text-sm text-slate-600">
                      {proof.text_content}
                    </p>
                  )}

                  {proof.file_url && (
                    <a
                      href={`${process.env.NEXT_PUBLIC_API_URL?.replace("/api", "")}${proof.file_url}`}
                      target="_blank"
                      className="
                        inline-flex rounded-xl
                        bg-slate-900 px-4 py-2
                        text-sm font-semibold text-white
                      "
                    >
                      View Attachment
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}