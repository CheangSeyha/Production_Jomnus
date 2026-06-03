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
import { toDateTimeLocalValue, toDateTimeLocalISOString } from "@/utils/dateTime";
import ApplicationOfferCard from "@/components/myrequest/ApplicationOfferCard";
import WorkerTimelineCard from "@/components/myrequest/WorkerTimeLineCard";
import TaskMapPreview from "@/components/map/TaskMapPreview";
import EditTaskModal from "@/components/myrequest/EditTaskModel";
import { useToast } from "@/components/providers/toast-provider";
import { Check, X, Clock3, MessageCircle } from "lucide-react";


type Props = {
  performerName: string;
  performerImage?: string;
  offeredPrice: number;
  status: string;
  taskId: number; // ← add this
  onAccept: () => void;
  onReject: () => void;
};

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

  status:
    | "POSTED"
    | "ACCEPTED"
    | "IN_PROGRESS"
    | "COMPLETED";

  price: number;

  deadline: string;

  startDate?: string;

  requiredWorkers: number;

  categoryId?: number;

  locationText?: string;

  latitude?: number;

  longitude?: number;

  createdAt?: string;
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
  const toast = useToast();
  const taskId = params.taskId;

  const [task, setTask] = useState<Task | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [reviewAssignment, setReviewAssignment] = useState<Assignment | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isUpdatingTask, setIsUpdatingTask] = useState(false);

  const [editForm, setEditForm] = useState<any>({
    title: "",
    description: "",
    price: 0,
    deadline: "",
    locationText: "",
    latitude: undefined,
    longitude: undefined,
    requiredWorkers: 1,
    categoryId: undefined,
  });

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
    Boolean(task) && pendingCount > 0 && acceptedCount >= (task?.requiredWorkers ?? 1);

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

      const formattedTask: Task = {
        id: taskRes.data.id,

        title: taskRes.data.title,

        description: taskRes.data.description,

        status: taskRes.data.status,

        price: taskRes.data.price,

        deadline: taskRes.data.deadline,

        startDate: taskRes.data.start_date,

        categoryId: taskRes.data.category_id || taskRes.data.categories?.[0]?.id,

        locationText:
          taskRes.data.location_text,

        requiredWorkers:
          taskRes.data.required_workers,

        latitude: taskRes.data.latitude,

        longitude: taskRes.data.longitude,

        createdAt:
          taskRes.data.created_at,
      };
      setTask(formattedTask);

      setEditForm({
        title: taskRes.data.title || "",

        description:
          taskRes.data.description || "",

        price: taskRes.data.price || 0,

        startDate: taskRes.data.start_date
          ? toDateTimeLocalValue(taskRes.data.start_date)
          : "",

        deadline: taskRes.data.deadline
          ? toDateTimeLocalValue(taskRes.data.deadline)
          : "",

        locationText:
          taskRes.data.location_text || "",

        latitude:
          taskRes.data.latitude || undefined,

        longitude:
          taskRes.data.longitude || undefined,

        requiredWorkers:
          taskRes.data.required_workers || 1,

        categoryId:
          taskRes.data.category_id || taskRes.data.categories?.[0]?.id || undefined,
      });
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

  const updateTask = async () => {
    try {
      setIsUpdatingTask(true);
      await api.patch(`/tasks/${taskId}`, {
        title: editForm.title,

        description: editForm.description,

        price: Number(editForm.price),

        startDate: editForm.startDate
          ? toDateTimeLocalISOString(editForm.startDate)
          : null,

        deadline: editForm.deadline
          ? toDateTimeLocalISOString(editForm.deadline)
          : undefined,

        locationText: editForm.locationText,

        latitude: editForm.latitude,

        longitude: editForm.longitude,

        requiredWorkers: Number(editForm.requiredWorkers),

        categoryIds: editForm.categoryId ? [Number(editForm.categoryId)] : undefined,
      });

      toast.success({
        title: "Task updated",
        message: "Your changes were saved successfully.",
      });
      setIsEditOpen(false);

      fetchData();
    } catch (err: any) {
      toast.error({
        title: "Could not update task",
        message: err?.response?.data?.message || "Failed to update task.",
      });
    } finally {
      setIsUpdatingTask(false);
    }
  };

  const deleteTask = async () => {
    const confirmed = confirm(
      "Delete this task permanently?"
    );

    if (!confirmed) return;

    try {
      await api.delete(`/tasks/${taskId}`);

      router.push("/myrequest");
    } catch (err: any) {
      alert(
        err?.response?.data?.message ||
        "Failed to delete task",
      );
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

            <div className="mt-5 flex flex-wrap gap-3">
              <button
                onClick={() => {
                  setEditForm({
                    title: task.title || "",

                    description: task.description || "",

                    price: task.price || 0,

                    startDate: task.startDate
                      ? toDateTimeLocalValue(task.startDate)
                      : "",

                    deadline: task.deadline
                      ? toDateTimeLocalValue(task.deadline)
                      : "",

                    locationText: task.locationText || "",

                    latitude: task.latitude || undefined,

                    longitude: task.longitude || undefined,

                    requiredWorkers:
                      task.requiredWorkers || 1,

                    categoryId: task.categoryId || undefined,
                  });

                  setIsEditOpen(true);
                }}
                className="
                  rounded-xl border border-blue-200
                  bg-blue-50 px-4 py-2
                  text-sm font-bold text-blue-700
                  transition hover:bg-blue-100
                "
              >
                Edit Task
              </button>

              <button
                onClick={deleteTask}
                className="
                  rounded-xl border border-red-200
                  bg-red-50 px-4 py-2
                  text-sm font-bold text-red-600
                  transition hover:bg-red-100
                "
              >
                Delete Task
              </button>
            </div>
          </div>
        </section>
        
        {/* MAP PREVIEW */}
        {task.latitude && task.longitude && (
          <section
            className="
              overflow-hidden rounded-3xl
              border border-slate-200
              bg-white
              shadow-sm
            "
          >
            {/* TOP */}
            <div className="border-b border-slate-100 p-5">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
                Task Location
              </p>

              <h2 className="mt-2 text-xl font-bold text-slate-950">
                Meeting Point
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Workers can use this location to navigate to the task area.
              </p>
            </div>

            {/* MAP */}
            <div className="h-auto w-full">
              <TaskMapPreview
                lat={task.latitude}
                lng={task.longitude}
              />
            </div>

            {/* LOCATION */}
            <div className="border-t border-slate-100 p-5">
              <p className="text-sm font-semibold text-slate-700">
                {task.locationText || "No location provided"}
              </p>
            </div>
          </section>
        )}

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
              {new Date(task.deadline).toLocaleString()}
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-slate-400">
              <MapPin size={15} />
              Location
            </p>
            <p className="mt-2 line-clamp-2 text-sm font-bold text-slate-950">
              {task.locationText || "No location"}
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-slate-400">
              <Users size={15} />
              Workers
            </p>
            <p className="mt-2 text-sm font-bold text-slate-950">
              {acceptedCount}/{task.requiredWorkers} accepted
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {Math.max(task.requiredWorkers - acceptedCount, 0)} slot
              {task.requiredWorkers - acceptedCount === 1 ? "" : "s"} open
            </p>
          </div>
        </section>

        <section className="space-y-8"> 

          {/* APPLICATIONS */}
          <div className="space-y-4">

            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-950">
                  Applicants
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Review performer applications
                </p>
              </div>

              {canCloseApplications && (
                <button
                  onClick={rejectRemainingApplications}
                  className="
                    rounded-xl bg-slate-900
                    px-5 py-3
                    text-sm font-semibold text-white
                    transition hover:bg-slate-800
                  "
                >
                  Close Applications
                </button>
              )}
            </div>

            {applications.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center">
                <p className="font-bold text-slate-900">
                  No applications yet
                </p>

                <p className="mt-2 text-sm text-slate-500">
                  Applications will appear here
                </p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {applications.map((app) => (
                    <ApplicationOfferCard
                        key={app.id}
                        performerName={app.performer?.fullName ?? "Unknown"}
                        performerImage={app.performer?.profileImage}
                        offeredPrice={app.offered_price}
                        status={app.status}
                        taskId={task.id}
                        onAccept={() => acceptApplication(app.id)}
                        onReject={() => rejectApplication(app.id)}
                    />
                ))}
              </div>
            )}
          </div>

          {/* ACTIVE WORKERS */}
          <div className="space-y-4">

            <div>
              <h2 className="text-xl font-bold text-slate-950">
                Active Workers
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Track assigned performers and review submissions
              </p>
            </div>

            {assignments.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center">
                <p className="font-bold text-slate-900">
                  No workers assigned
                </p>

                <p className="mt-2 text-sm text-slate-500">
                  Accepted workers will appear here
                </p>
              </div>
            ) : (
              <div className="space-y-5">
                {assignments.map((assignment) => (
                  <WorkerTimelineCard
                    key={assignment.id}
                    performerName={
                      assignment.performer?.fullName || "Worker"
                    }
                    performerImage={
                      assignment.performer?.profileImage
                    }
                    assignmentStatus={assignment.status}
                    acceptedPrice={assignment.accepted_price}
                    proofs={assignment.proofs || []}
                    onApproveProof={(proofId) =>
                      approveProof(proofId, assignment)
                    }
                    onRejectProof={(proofId) =>
                      rejectProof(proofId)
                    }
                  />
                ))}
              </div>
            )}
          </div>

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

      {isEditOpen && (
        <EditTaskModal
          form={editForm}
          setForm={setEditForm}
          onClose={() => setIsEditOpen(false)}
          onSave={updateTask}
          onDelete={deleteTask}
          saving={isUpdatingTask}
          onFormChange={(name: string, value: any) => {
            // Keep live preview in sync while editing
            setTask((prev: any) => {
              if (!prev) return prev;
              return {
                ...prev,
                [name]: value,
              };
            });
          }}
        />
      )}

    </div>
  );
}
