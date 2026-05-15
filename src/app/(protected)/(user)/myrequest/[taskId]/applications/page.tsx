"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  BriefcaseBusiness,
  CalendarClock,
  CheckCircle2,
  ClipboardList,
  MapPin,
  ShieldCheck,
  Users,
  Wallet,
} from "lucide-react";
import api from "@/lib/axios";
import ApplicationOfferCard from "@/components/myrequest/ApplicationOfferCard";
import AssignmentProgressCard from "@/components/myrequest/AssignmentProgressCard";
type Application = {
  id: number;
  status: string;
  offered_price: number;
  performer: {
    fullName: string;
    profileImage?: string;
  };
};

type Proof = {
  id: number;
  assignment_id: number;
  status: string;
  type: string;
  file_url?: string;
  text_content?: string;
  created_at: string;
};

type AssignmentStatus =
  | "ASSIGNED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "VERIFIED"
  | "CANCELLED";

type Assignment = {
  id: number;
  status: AssignmentStatus;
  accepted_price: number;
  performer?: {
    fullName: string;
    profileImage?: string;
  };
  proofs?: Proof[];
};

type Task = {
  id: number;
  title: string;
  description: string;
  status: "POSTED" | "ACCEPTED" | "IN_PROGRESS" | "COMPLETED";
  required_workers: number;
  location_text?: string;
  price: number;
  deadline: string;
};

const statusStyles: Record<string, string> = {
  POSTED: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  ACCEPTED: "bg-blue-50 text-blue-700 ring-blue-200",
  IN_PROGRESS: "bg-amber-50 text-amber-700 ring-amber-200",
  COMPLETED: "bg-slate-900 text-white ring-slate-900",
};

const assignmentStyles: Record<string, string> = {
  ASSIGNED: "bg-blue-50 text-blue-700 ring-blue-200",
  IN_PROGRESS: "bg-amber-50 text-amber-700 ring-amber-200",
  COMPLETED: "bg-violet-50 text-violet-700 ring-violet-200",
  VERIFIED: "bg-emerald-50 text-emerald-700 ring-emerald-200",
};

export default function TaskApplicationsPage() {
  const params = useParams();
  const router = useRouter();
  const taskId = params.taskId;

  const [task, setTask] = useState<Task | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [reviewAssignment, setReviewAssignment] = useState<Assignment | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const acceptedCount = useMemo(
    () => applications.filter((app) => app.status === "ACCEPTED").length,
    [applications],
  );
  const pendingCount = useMemo(
    () => applications.filter((app) => app.status === "PENDING").length,
    [applications],
  );
  const rejectedCount = useMemo(
    () => applications.filter((app) => app.status === "REJECTED").length,
    [applications],
  );
  const canCloseApplications =
    Boolean(task) && pendingCount > 0 && acceptedCount >= (task?.required_workers ?? 1);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [taskRes, appRes, assignmentRes] = await Promise.all([
        api.get(`/tasks/${taskId}`),
        api.get(`/applications/task/${taskId}`),
        api.get(`/assignments/task/${taskId}`),
      ]);

      const assignmentData: Assignment[] = assignmentRes.data;
      const assignmentsWithProofs = await Promise.all(
        assignmentData.map(async (assignment) => {
          const proofRes = await api.get(`/proofs/${assignment.id}`);
          return {
            ...assignment,
            proofs: proofRes.data,
          };
        }),
      );

      setTask(taskRes.data);
      setApplications(appRes.data);
      setAssignments(assignmentsWithProofs);
    } catch (err) {
      console.error(err);
    }
  };

  const acceptApplication = async (applicationId: number) => {
    try {
      await api.patch(`/applications/${applicationId}/accept`);
      fetchData();
    } catch (err: any) {
      alert(err?.response?.data?.message || "Failed to accept application");
    }
  };

  const rejectApplication = async (applicationId: number) => {
    try {
      await api.patch(`/applications/${applicationId}/reject`);
      fetchData();
    } catch (err: any) {
      alert(err?.response?.data?.message || "Failed to reject application");
    }
  };

  const rejectRemainingApplications = async () => {
    try {
      await api.patch(`/applications/task/${taskId}/reject-pending`);
      fetchData();
    } catch (err: any) {
      alert(err?.response?.data?.message || "Failed to close applications");
    }
  };

  const approveProof = async (proofId: number, assignment: Assignment) => {
    try {
      await api.patch(`/proofs/${proofId}/approve`);
      await fetchData();
      setReviewAssignment(assignment);
      setRating(5);
      setComment("");
    } catch (err: any) {
      alert(err?.response?.data?.message || "Failed to accept proof");
    }
  };

  const rejectProof = async (proofId: number) => {
    try {
      await api.patch(`/proofs/${proofId}/reject`);
      fetchData();
    } catch (err: any) {
      alert(err?.response?.data?.message || "Failed to reject proof");
    }
  };

  const submitReview = async () => {
    if (!reviewAssignment) return;

    try {
      await api.post("/reviews", {
        assignment_id: reviewAssignment.id,
        rating,
        reliability: rating,
        speed: rating,
        communication: rating,
        accuracy: rating,
        comment,
      });
      setReviewAssignment(null);
      setComment("");
    } catch (err: any) {
      alert(err?.response?.data?.message || "Failed to submit review");
    }
  };

  if (!task) {
    return (
      <div className="min-h-screen bg-slate-50 p-10 text-center text-sm text-slate-500">
        Loading task workspace...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl space-y-5 px-4 py-6 sm:px-6 lg:py-8">
        <button
          onClick={() => router.push("/myrequest")}
          className="inline-flex h-9 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-100"
        >
          <ArrowLeft size={16} />
          My Requests
        </button>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-slate-600">
                <BriefcaseBusiness size={14} />
                Task Workspace
              </span>
              <span
                className={`inline-flex rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ring-1 ${
                  statusStyles[task.status] || statusStyles.POSTED
                }`}
              >
                {task.status.replace("_", " ")}
              </span>
            </div>

            <h1 className="mt-3 text-2xl font-bold leading-tight text-slate-950">
              {task.title || "Untitled task"}
            </h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
              {task.description || "No description provided."}
            </p>
          </div>
        </section>


        <section className="grid gap-3 md:grid-cols-4">
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-slate-400">
              <Wallet size={15} />
              Budget
            </p>
            <p className="mt-2 text-xl font-black text-slate-950">
              ${Number(task.price || 0).toFixed(2)}
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-slate-400">
              <CalendarClock size={15} />
              Deadline
            </p>
            <p className="mt-2 text-sm font-bold text-slate-950">
              {new Date(task.deadline).toLocaleDateString()}
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-slate-400">
              <MapPin size={15} />
              Location
            </p>
            <p className="mt-2 line-clamp-2 text-sm font-bold text-slate-950">
              {task.location_text || "No location"}
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-slate-400">
              <Users size={15} />
              Workers
            </p>
            <p className="mt-2 text-sm font-bold text-slate-950">
              {acceptedCount}/{task.required_workers} accepted
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {Math.max(task.required_workers - acceptedCount, 0)} slot
              {task.required_workers - acceptedCount === 1 ? "" : "s"} open
            </p>
          </div>
        </section>

        <section className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_400px]">
          <div className="space-y-3">
            <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="flex items-center gap-2 text-lg font-bold text-slate-950">
                  <ClipboardList size={19} className="text-blue-600" />
                  Current Offers
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  {pendingCount} pending, {acceptedCount} accepted, {rejectedCount} rejected
                </p>
              </div>

              {canCloseApplications && (
                <button
                  onClick={rejectRemainingApplications}
                  className="h-10 rounded-lg bg-slate-900 px-4 text-sm font-bold text-white transition hover:bg-slate-800"
                >
                  Reject Remaining
                </button>
              )}
            </div>

            {applications.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center">
                <p className="font-bold text-slate-900">No offers yet</p>
                <p className="mt-1 text-sm text-slate-500">
                  New performer applications will appear here.
                </p>
              </div>
            ) : (
              applications.map((app) => (
                <ApplicationOfferCard
                  key={app.id}
                  performerName={app.performer.fullName}
                  performerImage={app.performer.profileImage}
                  offeredPrice={app.offered_price}
                  status={app.status}
                  onAccept={() => acceptApplication(app.id)}
                  onReject={() => rejectApplication(app.id)}
                />
              ))
            )}
          </div>

          <aside className="space-y-3">
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <h2 className="flex items-center gap-2 text-lg font-bold text-slate-950">
                <ShieldCheck size={19} className="text-blue-600" />
                Assigned Workers
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Proof and verification status for accepted performers.
              </p>
            </div>

            {assignments.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center">
                <p className="font-bold text-slate-900">No workers assigned</p>
                <p className="mt-1 text-sm text-slate-500">
                  Accepted performers will appear here.
                </p>
              </div>
            ) : (
              assignments.map((assignment) => (
                <div key={assignment.id} className="space-y-3">

                  <AssignmentProgressCard
                    performerName={
                      assignment.performer?.fullName || "Assigned worker"
                    }
                    performerImage={assignment.performer?.profileImage}
                    status={assignment.status}
                  />

                  <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-bold text-slate-950">
                          Accepted Price
                        </p>

                        <p className="mt-1 text-lg font-black text-slate-950">
                          ${Number(assignment.accepted_price || 0).toFixed(2)}
                        </p>
                      </div>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ring-1 ${
                          assignmentStyles[assignment.status] ||
                          "bg-slate-100 text-slate-500 ring-slate-200"
                        }`}
                      >
                        {assignment.status.replace("_", " ")}
                      </span>
                    </div>

                    {/* PROOFS */}
                    <div className="mt-4 space-y-3">
                      {assignment.proofs?.length ? (
                        assignment.proofs.map((proof) => (
                          <div
                            key={proof.id}
                            className="rounded-lg border border-slate-200 bg-slate-50 p-3"
                          >
                            <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                              Proof #{proof.id}
                            </p>

                            {proof.text_content && (
                              <p className="mt-2 text-sm text-slate-700">
                                {proof.text_content}
                              </p>
                            )}

                            {proof.file_url && (
                              <a
                                href={`http://localhost:3001${proof.file_url}`}
                                target="_blank"
                                className="mt-2 inline-block text-sm font-bold text-blue-600"
                              >
                                View uploaded file
                              </a>
                            )}

                            {proof.status === "PENDING" && (
                              <div className="mt-3 flex gap-2">
                                <button
                                  onClick={() => rejectProof(proof.id)}
                                  className="h-9 flex-1 rounded-lg bg-red-50 text-xs font-bold text-red-600"
                                >
                                  Reject
                                </button>

                                <button
                                  onClick={() =>
                                    approveProof(proof.id, assignment)
                                  }
                                  className="h-9 flex-1 rounded-lg bg-blue-600 text-xs font-bold text-white"
                                >
                                  Accept Proof
                                </button>
                              </div>
                            )}
                          </div>
                        ))
                      ) : (
                        <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
                          No proof submitted yet.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </aside>
        </section>
      </div>

      {reviewAssignment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4 py-8">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="text-xl font-bold text-slate-900">Review Performer</h3>
            <p className="mt-1 text-sm text-slate-500">
              Rate {reviewAssignment.performer?.fullName || "this performer"} for this task.
            </p>

            <label className="mt-5 block text-sm font-semibold text-slate-700">
              Rating
            </label>
            <select
              value={rating}
              onChange={(event) => setRating(Number(event.target.value))}
              className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            >
              {[5, 4, 3, 2, 1].map((value) => (
                <option key={value} value={value}>
                  {value} star{value === 1 ? "" : "s"}
                </option>
              ))}
            </select>

            <label className="mt-4 block text-sm font-semibold text-slate-700">
              Comment
            </label>
            <textarea
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              rows={4}
              className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              placeholder="How was the work?"
            />

            <div className="mt-5 flex justify-end gap-3">
              <button
                onClick={() => setReviewAssignment(null)}
                className="rounded-xl px-4 py-2 text-sm font-bold text-slate-500 hover:bg-slate-100"
              >
                Later
              </button>
              <button
                onClick={submitReview}
                className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700"
              >
                Submit Review
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
